<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Coupon;
use App\Models\Customer;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class CartService
{
    /**
     * Get or create an active cart for a session and/or user.
     */
    public function getOrCreateCart(?string $sessionId, User|int|null $userOrId = null): Cart
    {
        $resolvedCustomerId = $this->resolveCustomerId($userOrId);

        // If authenticated user/customer
        if ($resolvedCustomerId !== null) {
            $customerCart = Cart::query()
                ->where('customer_id', $resolvedCustomerId)
                ->where('status', 'active')
                ->latest('id')
                ->first();

            $guestCart = $sessionId ? Cart::query()
                ->where('session_id', $sessionId)
                ->where('status', 'active')
                ->where(function ($q) use ($resolvedCustomerId) {
                    $q->whereNull('customer_id')->orWhere('customer_id', '!=', $resolvedCustomerId);
                })
                ->latest('id')
                ->first() : null;

            if ($customerCart && $guestCart && $customerCart->id !== $guestCart->id) {
                $customerCart = $this->mergeGuestCartInto($guestCart, $customerCart);
            } elseif (! $customerCart && $guestCart) {
                $guestCart->update(['customer_id' => $resolvedCustomerId]);
                $customerCart = $guestCart;
            }

            if ($customerCart) {
                if ($sessionId && $customerCart->session_id !== $sessionId) {
                    $customerCart->update(['session_id' => $sessionId]);
                }

                return $customerCart;
            }

            return Cart::create([
                'session_id' => $sessionId ?? (string) Str::uuid(),
                'customer_id' => $resolvedCustomerId,
                'currency_code' => config('app.currency', 'USD'),
                'status' => 'active',
                'expires_at' => Carbon::now()->addDays(30),
            ]);
        }

        // Guest user (without auth)
        if ($sessionId) {
            $cart = Cart::query()
                ->where('session_id', $sessionId)
                ->where('status', 'active')
                ->latest('id')
                ->first();

            if ($cart) {
                return $cart;
            }
        }

        return Cart::create([
            'session_id' => $sessionId ?? (string) Str::uuid(),
            'customer_id' => null,
            'currency_code' => config('app.currency', 'USD'),
            'status' => 'active',
            'expires_at' => Carbon::now()->addDays(30),
        ]);
    }

    public function resolveCustomerId(User|int|null $userOrId): ?int
    {
        if ($userOrId === null) {
            return null;
        }

        if ($userOrId instanceof User) {
            return Customer::query()->firstOrCreate(
                ['user_id' => $userOrId->id],
                [
                    'first_name' => $userOrId->name,
                    'email' => $userOrId->email,
                    'phone' => $userOrId->phone,
                    'phone_country' => $userOrId->phone_country,
                    'is_guest' => false,
                ]
            )->id;
        }

        $user = User::query()->find($userOrId);
        if ($user) {
            return Customer::query()->firstOrCreate(
                ['user_id' => $user->id],
                [
                    'first_name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'phone_country' => $user->phone_country,
                    'is_guest' => false,
                ]
            )->id;
        }

        if (Customer::query()->whereKey($userOrId)->exists()) {
            return $userOrId;
        }

        return null;
    }

    public function addItem(Cart $cart, Product $product, ?ProductVariant $variant, int $quantity = 1, array $options = []): CartItem
    {
        $quantity = max(1, $quantity);
        $unitPrice = $product->current_price;

        if ($variant && $variant->price !== null) {
            $unitPrice = (float) $variant->price;
        }

        $existing = $cart->items()
            ->where('product_id', $product->id)
            ->where('variant_id', $variant?->id)
            ->first();

        if ($existing) {
            $existing->update([
                'quantity' => $existing->quantity + $quantity,
                'unit_price' => $unitPrice,
                'options' => $options ?: $existing->options,
            ]);

            return $existing;
        }

        return $cart->items()->create([
            'product_id' => $product->id,
            'variant_id' => $variant?->id,
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'options' => $options ?: null,
        ]);
    }

    public function updateQuantity(Cart $cart, int $cartItemId, int $quantity): bool
    {
        $item = $cart->items()->find($cartItemId);

        if (! $item) {
            return false;
        }

        if ($quantity <= 0) {
            return $this->removeItem($cart, $cartItemId);
        }

        $item->update(['quantity' => $quantity]);

        return true;
    }

    public function removeItem(Cart $cart, int $cartItemId): bool
    {
        return (bool) $cart->items()->whereKey($cartItemId)->delete();
    }

    public function clear(Cart $cart): void
    {
        $cart->items()->delete();
    }

    public function subtotal(Cart $cart): float
    {
        return (float) $cart->items()->get()->sum(fn (CartItem $item): float => $item->unit_price * $item->quantity);
    }

    public function itemCount(Cart $cart): int
    {
        return (int) $cart->items()->sum('quantity');
    }

    public function mergeGuestCartInto(Cart $guestCart, Cart $customerCart): Cart
    {
        foreach ($guestCart->items()->get() as $item) {
            $existing = $customerCart->items()
                ->where('product_id', $item->product_id)
                ->where('variant_id', $item->variant_id)
                ->first();

            if ($existing) {
                $existing->update(['quantity' => $existing->quantity + $item->quantity]);
                $item->delete();
            } else {
                $item->update(['cart_id' => $customerCart->id]);
            }
        }

        if ($guestCart->session_id) {
            $customerCart->update(['session_id' => $guestCart->session_id]);
        }

        $guestCart->update(['status' => 'merged']);
        $guestCart->delete();

        return $customerCart->fresh('items');
    }

    /**
     * Validate a coupon against a subtotal.
     *
     * @return array{valid: bool, message?: string, coupon?: Coupon, discount_amount: float}
     */
    public function validateCoupon(string $code, float $subtotal): array
    {
        $code = trim($code);
        if ($code === '') {
            return [
                'valid' => false,
                'message' => __('Please enter a coupon code.'),
                'discount_amount' => 0.0,
            ];
        }

        $coupon = Coupon::query()
            ->whereRaw('LOWER(code) = ?', [strtolower($code)])
            ->first();

        if (! $coupon) {
            return [
                'valid' => false,
                'message' => __('Invalid coupon code.'),
                'discount_amount' => 0.0,
            ];
        }

        if (! $coupon->is_active) {
            return [
                'valid' => false,
                'message' => __('This coupon is no longer active.'),
                'discount_amount' => 0.0,
            ];
        }

        $now = Carbon::now();
        if ($coupon->starts_at && $now->lt($coupon->starts_at)) {
            return [
                'valid' => false,
                'message' => __('This coupon is not active yet.'),
                'discount_amount' => 0.0,
            ];
        }

        if ($coupon->ends_at && $now->gt($coupon->ends_at)) {
            return [
                'valid' => false,
                'message' => __('This coupon has expired.'),
                'discount_amount' => 0.0,
            ];
        }

        if ($coupon->usage_limit !== null && $coupon->usage_count >= $coupon->usage_limit) {
            return [
                'valid' => false,
                'message' => __('This coupon usage limit has been reached.'),
                'discount_amount' => 0.0,
            ];
        }

        if ($coupon->min_order_amount !== null && $subtotal < (float) $coupon->min_order_amount) {
            return [
                'valid' => false,
                'message' => __('Minimum order amount of $:min is required for this coupon.', [
                    'min' => number_format((float) $coupon->min_order_amount, 2),
                ]),
                'discount_amount' => 0.0,
            ];
        }

        $discount = 0.0;
        if ($coupon->type === 'percentage') {
            $discount = round(($subtotal * (float) $coupon->value) / 100, 2);
            if ($coupon->max_discount !== null) {
                $discount = min($discount, (float) $coupon->max_discount);
            }
        } else {
            $discount = (float) $coupon->value;
        }

        $discount = min($discount, $subtotal);

        return [
            'valid' => true,
            'coupon' => $coupon,
            'discount_amount' => $discount,
        ];
    }

    /**
     * Get applied coupon data or null if invalid.
     *
     * @return array{coupon: Coupon|null, discount_amount: float, code: string|null, description?: string, error?: string}
     */
    public function getAppliedCouponData(?string $code, float $subtotal): array
    {
        if (! $code) {
            return [
                'coupon' => null,
                'discount_amount' => 0.0,
                'code' => null,
            ];
        }

        $result = $this->validateCoupon($code, $subtotal);
        if (! $result['valid']) {
            return [
                'coupon' => null,
                'discount_amount' => 0.0,
                'code' => $code,
                'error' => $result['message'] ?? null,
            ];
        }

        /** @var Coupon $coupon */
        $coupon = $result['coupon'];

        $description = $coupon->type === 'percentage'
            ? "{$coupon->value}% off".($coupon->max_discount ? " (up to \${$coupon->max_discount})" : '')
            : "\${$coupon->value} off";

        return [
            'coupon' => $coupon,
            'discount_amount' => $result['discount_amount'],
            'code' => $coupon->code,
            'description' => $description,
        ];
    }
}
