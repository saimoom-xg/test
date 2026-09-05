<?php

use App\Models\Product;
use App\Models\User;
use App\Models\Wishlist;
use Inertia\Testing\AssertableInertia as Assert;

test('authenticated user can render wishlist page with user/wishlist inertia component', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['is_active' => true]);

    $response = $this->actingAs($user)
        ->get(route('user.wishlist'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('user/wishlist')
        ->has('products')
        ->has('wishlist.count')
        ->has('wishlist.productIds')
    );
});

test('unauthenticated user is redirected to login when accessing user wishlist', function () {
    $response = $this->get(route('user.wishlist'));

    $response->assertRedirect(route('login'));
});

test('authenticated user can toggle item into and out of wishlist', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['is_active' => true]);

    // Add to wishlist
    $response = $this->actingAs($user)
        ->post(route('user.wishlist.toggle'), [
            'product_id' => $product->id,
        ]);

    $response->assertRedirect();
    expect(Wishlist::where('product_id', $product->id)->count())->toBe(1);

    // Toggle again to remove
    $response = $this->actingAs($user)
        ->post(route('user.wishlist.toggle'), [
            'product_id' => $product->id,
        ]);

    $response->assertRedirect();
    expect(Wishlist::where('product_id', $product->id)->count())->toBe(0);
});

test('can remove item from wishlist via delete route', function () {
    $user = User::factory()->create();
    $product = Product::factory()->create(['is_active' => true]);

    $this->actingAs($user)
        ->post(route('user.wishlist.toggle'), ['product_id' => $product->id]);

    expect(Wishlist::where('product_id', $product->id)->count())->toBe(1);

    $response = $this->actingAs($user)
        ->delete(route('user.wishlist.destroy', $product->id));

    $response->assertRedirect();
    expect(Wishlist::where('product_id', $product->id)->count())->toBe(0);
});

test('can clear all wishlist items', function () {
    $user = User::factory()->create();
    $p1 = Product::factory()->create(['is_active' => true]);
    $p2 = Product::factory()->create(['is_active' => true]);

    $this->actingAs($user)->post(route('user.wishlist.toggle'), ['product_id' => $p1->id]);
    $this->actingAs($user)->post(route('user.wishlist.toggle'), ['product_id' => $p2->id]);

    $response = $this->actingAs($user)->delete(route('user.wishlist.clear'));

    $response->assertRedirect();
});
