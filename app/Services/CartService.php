<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Customer;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

class CartService
{
    public function getOrCreateCart(?string $sessionId, ?int $customerId = null): Cart
    {
        if ($customerId !== null) {
            $cart = Cart::query()
                ->where('customer_id', $customerId)
                ->where('status', 'active')
                ->latest('id')
                ->first();

            if ($cart) {
                return $cart;
            }
        }

        if ($sessionId) {
            $cart = Cart::query()
                ->where('session_id', $sessionId)
                ->where('status', 'active')
                ->latest('id')
                ->first();

            if ($cart) {
                if ($customerId !== null) {
                    $cart->update(['customer_id' => $customerId]);
                }

                return $cart;
            }
        }

        return Cart::create([
            'session_id' => $sessionId ?? (string) Str::uuid(),
            'customer_id' => $this->resolveCustomerId($customerId),
            'currency_code' => config('app.currency', 'USD'),
            'status' => 'active',
            'expires_at' => Carbon::now()->addDays(30),
        ]);
    }

    private function resolveCustomerId(?int $id): ?int
    {
        if ($id === null) {
            return null;
        }

        if (Customer::query()->whereKey($id)->exists()) {
            return $id;
        }

        $user = User::query()->find($id);

        if (! $user) {
            return null;
        }

        return Customer::query()->firstOrCreate(
            ['user_id' => $user->id],
            ['first_name' => $user->name, 'is_guest' => false]
        )->id;
    }

    public function addItem(Cart $cart, Product $product, ?ProductVariant $variant, int $quantity, array $options = []): CartItem
    {
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
            } else {
                $item->update(['cart_id' => $customerCart->id]);
            }
        }

        $guestCart->update(['status' => 'merged']);
        $guestCart->delete();

        return $customerCart->fresh('items');
    }
}
