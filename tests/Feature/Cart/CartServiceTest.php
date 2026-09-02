<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use App\Services\CartService;

beforeEach(function () {
    $this->service = app(CartService::class);
});

test('can get or create a guest cart with session id', function () {
    $cart = $this->service->getOrCreateCart('session-123');

    expect($cart)->toBeInstanceOf(Cart::class);
    expect($cart->session_id)->toBe('session-123');
    expect($cart->status)->toBe('active');
});

test('can add item to cart', function () {
    $cart = $this->service->getOrCreateCart('session-1');
    $product = Product::factory()->create(['price' => 50]);

    $item = $this->service->addItem($cart, $product, null, 2);

    expect($item->quantity)->toBe(2);
    expect((float) $item->unit_price)->toBe(50.0);
    expect((float) $item->subtotal)->toBe(100.0);
});

test('can update cart item quantity', function () {
    $cart = $this->service->getOrCreateCart('session-1');
    $product = Product::factory()->create();

    $item = $this->service->addItem($cart, $product, null, 1);
    $this->service->updateQuantity($cart, $item->id, 5);

    expect($item->fresh()->quantity)->toBe(5);
});

test('updating quantity to zero removes the item', function () {
    $cart = $this->service->getOrCreateCart('session-1');
    $product = Product::factory()->create();

    $item = $this->service->addItem($cart, $product, null, 1);
    $this->service->updateQuantity($cart, $item->id, 0);

    $this->assertDatabaseMissing('cart_items', ['id' => $item->id]);
});

test('can merge guest cart into customer cart', function () {
    $customer = User::factory()->create();
    $guestCart = $this->service->getOrCreateCart('session-1');
    $product = Product::factory()->create();
    $this->service->addItem($guestCart, $product, null, 2);

    $customerCart = $this->service->getOrCreateCart(null, $customer->id);

    $merged = $this->service->mergeGuestCartInto($guestCart, $customerCart);

    expect((int) $merged->items()->sum('quantity'))->toBe(2);
});

test('cart api endpoints work for guest', function () {
    $product = Product::factory()->create();

    $response = $this->withSession([])->postJson('/api/v1/cart/items', [
        'product_id' => $product->id,
        'quantity' => 3,
    ]);

    $response->assertOk();
    expect(CartItem::query()->count())->toBeGreaterThan(0);
});

test('cart api show returns current cart', function () {
    $this->withSession([])->getJson('/api/v1/cart')->assertOk();
});
