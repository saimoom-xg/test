<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Services\CartService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function __construct(private readonly CartService $cartService) {}

    public function __invoke(Request $request): Response
    {
        return $this->index($request);
    }

    public function index(Request $request): Response
    {
        $sessionId = $this->resolveSessionId($request);
        $cart = $this->cartService->getOrCreateCart($sessionId, $request->user());

        $cart->load(['items.product.images', 'items.product.brand']);
        $subtotal = $this->cartService->subtotal($cart);
        $itemCount = $this->cartService->itemCount($cart);

        $appliedCode = session('applied_coupon_code');
        $couponData = $this->cartService->getAppliedCouponData($appliedCode, $subtotal);

        if ($appliedCode && empty($couponData['coupon'])) {
            session()->forget('applied_coupon_code');
        }

        $appliedCoupon = $couponData['coupon'] ?? null;
        $discountAmount = $couponData['discount_amount'] ?? 0.0;
        $total = max(0, $subtotal - $discountAmount);

        return Inertia::render('Cart', [
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
                        'price' => (float) $item->product->price,
                        'sale_price' => $item->product->sale_price !== null ? (float) $item->product->sale_price : null,
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
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['nullable', 'integer', 'min:1'],
            'variant_id' => ['nullable', 'integer', 'exists:product_variants,id'],
            'options' => ['nullable', 'array'],
        ]);

        $sessionId = $this->resolveSessionId($request);
        $cart = $this->cartService->getOrCreateCart($sessionId, $request->user());

        $product = Product::query()->findOrFail($validated['product_id']);
        $variant = ! empty($validated['variant_id'])
            ? ProductVariant::query()->findOrFail($validated['variant_id'])
            : null;

        $quantity = (int) ($validated['quantity'] ?? 1);
        $options = $validated['options'] ?? [];

        $this->cartService->addItem($cart, $product, $variant, $quantity, $options);

        Cookie::queue('cart_session_id', $cart->session_id, 60 * 24 * 30);

        return back()->with('success', __('Item added to cart.'));
    }

    public function update(Request $request, int $item): RedirectResponse
    {
        $validated = $request->validate([
            'quantity' => ['required', 'integer', 'min:0'],
        ]);

        $sessionId = $this->resolveSessionId($request);
        $cart = $this->cartService->getOrCreateCart($sessionId, $request->user());

        $this->cartService->updateQuantity($cart, $item, (int) $validated['quantity']);

        return back()->with('success', __('Cart updated.'));
    }

    public function destroy(Request $request, int $item): RedirectResponse
    {
        $sessionId = $this->resolveSessionId($request);
        $cart = $this->cartService->getOrCreateCart($sessionId, $request->user());

        $this->cartService->removeItem($cart, $item);

        return back()->with('success', __('Item removed from cart.'));
    }

    public function clear(Request $request): RedirectResponse
    {
        $sessionId = $this->resolveSessionId($request);
        $cart = $this->cartService->getOrCreateCart($sessionId, $request->user());

        $this->cartService->clear($cart);
        session()->forget('applied_coupon_code');

        return back()->with('success', __('Cart cleared.'));
    }

    public function applyCoupon(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'code' => ['required', 'string', 'max:50'],
        ]);

        $sessionId = $this->resolveSessionId($request);
        $cart = $this->cartService->getOrCreateCart($sessionId, $request->user());

        if ($this->cartService->itemCount($cart) === 0) {
            return back()->with('error', __('Your cart is empty.'));
        }

        $subtotal = $this->cartService->subtotal($cart);
        $result = $this->cartService->validateCoupon($validated['code'], $subtotal);

        if (! $result['valid']) {
            return back()->with('error', $result['message']);
        }

        session(['applied_coupon_code' => $result['coupon']->code]);

        return back()->with('success', __('Coupon ":code" applied successfully!', ['code' => $result['coupon']->code]));
    }

    public function removeCoupon(Request $request): RedirectResponse
    {
        session()->forget('applied_coupon_code');

        return back()->with('success', __('Coupon removed.'));
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
