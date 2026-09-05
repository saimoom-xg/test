<?php

namespace App\Services;

use App\Models\Customer;
use App\Models\Product;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class WishlistService
{
    public function resolveCustomerId(?string $sessionId, User|int|null $userOrId = null): int
    {
        if ($userOrId) {
            $user = $userOrId instanceof User ? $userOrId : User::find($userOrId);
            if ($user) {
                $customer = Customer::firstOrCreate(
                    ['user_id' => $user->id],
                    [
                        'first_name' => $user->name,
                        'email' => $user->email,
                        'phone' => $user->phone,
                        'phone_country' => $user->phone_country,
                        'is_guest' => false,
                    ]
                );

                // If guest had wishlist items before login, merge them
                if ($sessionId) {
                    $this->mergeGuestWishlistIntoCustomer($sessionId, $customer->id);
                }

                return $customer->id;
            }
        }

        // Guest user fallback identified by cart_session_id
        $guestSessionId = $sessionId ?? (string) Str::uuid();

        return Customer::firstOrCreate(
            ['notes' => 'session:'.$guestSessionId, 'is_guest' => true],
            [
                'first_name' => 'Guest',
                'is_guest' => true,
            ]
        )->id;
    }

    public function mergeGuestWishlistIntoCustomer(string $sessionId, int $customerId): void
    {
        $guestCustomer = Customer::where('notes', 'session:'.$sessionId)->where('is_guest', true)->first();
        if (! $guestCustomer || $guestCustomer->id === $customerId) {
            return;
        }

        $guestItems = Wishlist::where('customer_id', $guestCustomer->id)->get();
        foreach ($guestItems as $item) {
            Wishlist::firstOrCreate([
                'customer_id' => $customerId,
                'product_id' => $item->product_id,
            ]);
            $item->delete();
        }
    }

    /**
     * @return array<int>
     */
    public function getWishlistProductIds(?string $sessionId, User|int|null $userOrId = null): array
    {
        $customerId = $this->resolveCustomerId($sessionId, $userOrId);

        return Wishlist::where('customer_id', $customerId)
            ->pluck('product_id')
            ->map(fn ($id): int => (int) $id)
            ->all();
    }

    public function count(?string $sessionId, User|int|null $userOrId = null): int
    {
        $customerId = $this->resolveCustomerId($sessionId, $userOrId);

        return Wishlist::where('customer_id', $customerId)->count();
    }

    /**
     * @return Collection<int, Product>
     */
    public function getWishlistProducts(?string $sessionId, User|int|null $userOrId = null): Collection
    {
        $customerId = $this->resolveCustomerId($sessionId, $userOrId);
        $productIds = Wishlist::where('customer_id', $customerId)->pluck('product_id');

        return Product::query()
            ->whereIn('id', $productIds)
            ->where('is_active', true)
            ->with(['brand', 'categories', 'images'])
            ->latest('id')
            ->get();
    }

    /**
     * Toggle product in wishlist.
     * Returns true if added, false if removed.
     */
    public function toggle(?string $sessionId, User|int|null $userOrId, int $productId): bool
    {
        $customerId = $this->resolveCustomerId($sessionId, $userOrId);

        $existing = Wishlist::where('customer_id', $customerId)
            ->where('product_id', $productId)
            ->first();

        if ($existing) {
            $existing->delete();

            return false;
        }

        Wishlist::create([
            'customer_id' => $customerId,
            'product_id' => $productId,
        ]);

        return true;
    }

    public function remove(?string $sessionId, User|int|null $userOrId, int $productId): void
    {
        $customerId = $this->resolveCustomerId($sessionId, $userOrId);

        Wishlist::where('customer_id', $customerId)
            ->where('product_id', $productId)
            ->delete();
    }

    public function clear(?string $sessionId, User|int|null $userOrId): void
    {
        $customerId = $this->resolveCustomerId($sessionId, $userOrId);

        Wishlist::where('customer_id', $customerId)->delete();
    }
}
