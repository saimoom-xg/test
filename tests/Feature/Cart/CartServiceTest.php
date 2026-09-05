<?php

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Customer;
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
    $response->assertCookie('cart_session_id');
    expect(CartItem::query()->count())->toBeGreaterThan(0);
});

test('customer carts use the customer record and remain addressable by user', function () {
    $user = User::factory()->create();

    $cart = $this->service->getOrCreateCart(null, $user->id);
    $customer = Customer::query()->where('user_id', $user->id)->firstOrFail();

    expect($cart->customer_id)->toBe($customer->id);
    expect($this->service->getOrCreateCart(null, $user->id)->id)->toBe($cart->id);
});

test('cart api show returns current cart', function () {
    $this->withSession([])->getJson('/api/v1/cart')->assertOk();
});

test('cart count is maintained when guest logs in and after logout', function () {
    $session = 'test-browser-session-999';
    $product1 = Product::factory()->create(['price' => 30]);
    $product2 = Product::factory()->create(['price' => 45]);

    // 1. Guest adds item
    $guestCart = $this->service->getOrCreateCart($session);
    $this->service->addItem($guestCart, $product1, null, 2);

    expect($this->service->itemCount($guestCart))->toBe(2);

    // 2. User logs in
    $user = User::factory()->create();
    $authCart = $this->service->getOrCreateCart($session, $user);

    expect($authCart->customer_id)->not->toBeNull();
    expect($this->service->itemCount($authCart))->toBe(2);
    expect($authCart->session_id)->toBe($session);

    // 3. User adds another item while logged in
    $this->service->addItem($authCart, $product2, null, 1);
    expect($this->service->itemCount($authCart))->toBe(3);

    // 4. User logs out (now browsing as guest with same session id)
    $logoutCart = $this->service->getOrCreateCart($session, null);
    expect($this->service->itemCount($logoutCart))->toBe(3);
    expect($logoutCart->id)->toBe($authCart->id);
});

test('web cart endpoints work properly for guests and users', function () {
    $product = Product::factory()->create(['price' => 20]);

    // Index works
    $this->get('/cart')->assertOk();

    // Store works
    $response = $this->post('/cart/items', [
        'product_id' => $product->id,
        'quantity' => 2,
    ]);
    $response->assertRedirect();
    $sessionId = $response->getCookie('cart_session_id', false)?->getValue();
    expect($sessionId)->not->toBeNull();

    $cartItem = CartItem::query()->where('product_id', $product->id)->firstOrFail();
    expect($cartItem->quantity)->toBe(2);

    // Update quantity works with same session
    $this->withUnencryptedCookie('cart_session_id', $sessionId)
        ->patch("/cart/items/{$cartItem->id}", [
            'quantity' => 5,
        ])->assertRedirect();
    expect($cartItem->fresh()->quantity)->toBe(5);

    // Delete item works
    $this->withUnencryptedCookie('cart_session_id', $sessionId)
        ->delete("/cart/items/{$cartItem->id}")->assertRedirect();
    expect(CartItem::query()->where('id', $cartItem->id)->exists())->toBeFalse();

    // Add again and clear
    $this->withUnencryptedCookie('cart_session_id', $sessionId)
        ->post('/cart/items', ['product_id' => $product->id, 'quantity' => 1]);
    expect(CartItem::query()->count())->toBeGreaterThan(0);

    $this->withUnencryptedCookie('cart_session_id', $sessionId)
        ->delete('/cart')->assertRedirect();
    expect(CartItem::query()->count())->toBe(0);
});
