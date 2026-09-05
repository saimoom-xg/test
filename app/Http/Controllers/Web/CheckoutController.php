<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\CouponUsage;
use App\Models\Currency;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatus;
use App\Models\OrderStatusHistory;
use App\Models\PaymentMethod;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function __construct(private readonly CartService $cartService) {}

    public function index(Request $request): Response|RedirectResponse
    {
        $sessionId = $this->resolveSessionId($request);
        $cart = $this->cartService->getOrCreateCart($sessionId, $request->user());
        $itemCount = $this->cartService->itemCount($cart);

        if ($itemCount === 0) {
            return redirect()->route('cart')->with('info', __('Your cart is empty. Please add items before checking out.'));
        }

        $cart->load(['items.product.images', 'items.product.brand']);
        $user = $request->user();

        $subtotal = $this->cartService->subtotal($cart);
        $appliedCode = session('applied_coupon_code');
        $couponData = $this->cartService->getAppliedCouponData($appliedCode, $subtotal);

        if ($appliedCode && empty($couponData['coupon'])) {
            session()->forget('applied_coupon_code');
        }

        $appliedCoupon = $couponData['coupon'] ?? null;
        $discountAmount = $couponData['discount_amount'] ?? 0.0;
        $total = max(0, $subtotal - $discountAmount);

        return Inertia::render('Checkout', [
            'title' => 'Express Checkout',
            'subtitle' => 'Quick & seamless order placement with minimal steps',
            'customer' => [
                'name' => $user?->name ?? '',
                'email' => $user?->email ?? '',
                'phone' => $user?->phone ?? '',
            ],
            'cart' => [
                'item_count' => $itemCount,
                'subtotal' => $subtotal,
                'discount_amount' => $discountAmount,
                'total' => $total,
                'coupon' => $appliedCoupon ? [
                    'code' => $appliedCoupon->code,
                    'type' => $appliedCoupon->type,
                    'value' => (float) $appliedCoupon->value,
                    'discount_amount' => $discountAmount,
                    'description' => $couponData['description'] ?? '',
                ] : null,
                'items' => $cart->items->map(fn ($item): array => [
                    'id' => $item->id,
                    'quantity' => $item->quantity,
                    'unit_price' => (float) $item->unit_price,
                    'subtotal' => (float) ($item->unit_price * $item->quantity),
                    'options' => $item->options,
                    'product' => [
                        'id' => $item->product->id,
                        'name' => $item->product->name,
                        'slug' => $item->product->slug,
                        'brand' => $item->product->brand?->name,
                        'image' => $item->product->images->first()?->path,
                    ],
                ])->values(),
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'address' => ['required', 'string', 'max:500'],
            'notes' => ['nullable', 'string', 'max:500'],
            'payment_method' => ['required', 'string', 'in:cod,card'],
        ]);

        $sessionId = $this->resolveSessionId($request);
        $cart = $this->cartService->getOrCreateCart($sessionId, $request->user());

        if ($this->cartService->itemCount($cart) === 0) {
            return redirect()->route('cart')->with('error', __('Your cart is empty.'));
        }

        $cart->load(['items.product']);
        $subtotal = $this->cartService->subtotal($cart);

        // Split name into first and last name
        $nameParts = preg_split('/\s+/', trim($validated['name']), 2);
        $firstName = $nameParts[0] ?? 'Guest';
        $lastName = $nameParts[1] ?? '';

        $appliedCode = session('applied_coupon_code');
        $coupon = null;
        $discountTotal = 0.0;

        if ($appliedCode) {
            $couponResult = $this->cartService->validateCoupon($appliedCode, $subtotal);
            if ($couponResult['valid']) {
                $coupon = $couponResult['coupon'];
                $discountTotal = (float) $couponResult['discount_amount'];
            } else {
                session()->forget('applied_coupon_code');
            }
        }

        $grandTotal = max(0, $subtotal - $discountTotal);

        $order = DB::transaction(function () use ($cart, $validated, $request, $subtotal, $discountTotal, $grandTotal, $coupon, $firstName, $lastName): Order {
            $paymentMethod = PaymentMethod::where('code', $validated['payment_method'])->first();
            $defaultStatusId = OrderStatus::where('is_default', true)->value('id') ?? OrderStatus::first()?->id;
            $currency = Currency::where('code', 'USD')->first() ?? Currency::first();

            // Resolve or create customer record for FK integrity in orders and coupon_usages
            $customer = $request->user()?->customer;
            if (! $customer && ! empty($validated['email'])) {
                $customer = Customer::firstOrCreate(
                    ['email' => $validated['email']],
                    [
                        'first_name' => $firstName,
                        'last_name' => $lastName,
                        'phone' => $validated['phone'],
                        'is_guest' => ! $request->user(),
                    ]
                );
            }

            $order = Order::create([
                'customer_id' => $customer?->id,
                'order_status_id' => $defaultStatusId,
                'payment_method_id' => $paymentMethod?->id,
                'currency_id' => $currency?->id,
                'currency_code' => $currency?->code ?? 'USD',
                'customer_first_name' => $firstName,
                'customer_last_name' => $lastName,
                'customer_email' => $validated['email'],
                'customer_phone' => $validated['phone'],
                'subtotal' => $subtotal,
                'discount_total' => $discountTotal,
                'shipping_total' => 0,
                'tax_total' => 0,
                'grand_total' => $grandTotal,
                'payment_status' => $validated['payment_method'] === 'card' ? 'paid' : 'pending',
                'shipping_status' => 'pending',
                'is_guest' => ! $request->user(),
                'notes' => $validated['notes'] ?? null,
                'shipping_address_snapshot' => [
                    'name' => $validated['name'],
                    'phone' => $validated['phone'],
                    'address' => $validated['address'],
                    'notes' => $validated['notes'] ?? null,
                ],
                'placed_at' => now(),
            ]);

            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'variant_id' => $item->variant_id,
                    'name' => $item->product->name,
                    'sku' => $item->product->sku ?? null,
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'subtotal' => $item->unit_price * $item->quantity,
                    'tax_total' => 0,
                    'discount_total' => 0,
                    'total' => $item->unit_price * $item->quantity,
                    'options' => $item->options,
                ]);
            }

            if ($coupon && $discountTotal > 0 && $customer) {
                $coupon->increment('usage_count');
                CouponUsage::create([
                    'coupon_id' => $coupon->id,
                    'customer_id' => $customer->id,
                    'order_id' => $order->id,
                    'discount_amount' => $discountTotal,
                ]);
            }

            OrderStatusHistory::create([
                'order_id' => $order->id,
                'order_status_id' => $order->order_status_id,
                'from_status' => null,
                'to_status' => 'pending',
                'user_id' => $request->user()?->id,
            ]);

            session()->forget('applied_coupon_code');
            $this->cartService->clear($cart);

            return $order;
        });

        return redirect()->route('checkout.success', ['orderNumber' => $order->number])
            ->with('success', __('Order placed successfully!'));
    }

    public function success(string $orderNumber): Response
    {
        $order = Order::with(['items.product.images', 'paymentMethod'])
            ->where('number', $orderNumber)
            ->firstOrFail();

        return Inertia::render('CheckoutSuccess', [
            'title' => 'Order Confirmed',
            'subtitle' => 'Thank you for your purchase',
            'order' => [
                'number' => $order->number,
                'customer_name' => trim($order->customer_first_name.' '.$order->customer_last_name),
                'customer_email' => $order->customer_email,
                'customer_phone' => $order->customer_phone,
                'subtotal' => (float) $order->subtotal,
                'discount_total' => (float) $order->discount_total,
                'shipping_total' => (float) $order->shipping_total,
                'grand_total' => (float) $order->grand_total,
                'payment_method' => $order->paymentMethod?->name ?? 'Cash on Delivery',
                'payment_status' => $order->payment_status,
                'shipping_status' => $order->shipping_status,
                'shipping_address' => $order->shipping_address_snapshot,
                'notes' => $order->notes,
                'placed_at' => $order->placed_at?->format('M d, Y h:i A') ?? $order->created_at->format('M d, Y h:i A'),
                'items' => $order->items->map(fn ($item): array => [
                    'id' => $item->id,
                    'name' => $item->name,
                    'quantity' => $item->quantity,
                    'unit_price' => (float) $item->unit_price,
                    'total' => (float) $item->total,
                    'image' => $item->product?->images->first()?->path,
                ])->values(),
            ],
        ]);
    }

    private function resolveSessionId(Request $request): string
    {
        $sessionId = $request->cookie('cart_session_id');
        if (! $sessionId) {
            $sessionId = (string) Str::uuid();
            Cookie::queue('cart_session_id', $sessionId, 60 * 24 * 30);
        }

        return $sessionId;
    }
}
