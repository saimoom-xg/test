<?php

use App\Models\Currency;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\PaymentMethod;
use App\Models\Product;
use App\Services\CartService;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->cartService = app(CartService::class);
    $this->sessionId = 'test-session-checkout-123';

    // Ensure status and payment methods exist
    OrderStatus::firstOrCreate(
        ['code' => 'pending'],
        ['name' => 'Pending', 'is_default' => true, 'is_active' => true, 'sort_order' => 1]
    );

    PaymentMethod::firstOrCreate(
        ['code' => 'cod'],
        ['name' => 'Cash on Delivery', 'driver' => 'cod', 'is_active' => true]
    );

    PaymentMethod::firstOrCreate(
        ['code' => 'card'],
        ['name' => 'Credit/Debit Card', 'driver' => 'stripe', 'is_active' => true]
    );

    Currency::firstOrCreate(
        ['code' => 'USD'],
        ['name' => 'US Dollar', 'symbol' => '$', 'is_default' => true, 'is_active' => true]
    );
});

test('empty cart redirects to cart page when accessing checkout', function () {
    $response = $this->withUnencryptedCookie('cart_session_id', $this->sessionId)
        ->get(route('checkout'));

    $response->assertRedirect(route('cart'));
    $response->assertSessionHas('info');
});

test('can render express checkout page when cart has items', function () {
    $cart = $this->cartService->getOrCreateCart($this->sessionId);
    $product = Product::factory()->create([
        'name' => 'Dark Chocolate Truffles',
        'price' => 38.00,
        'status' => 'published',
        'is_active' => true,
    ]);

    $this->cartService->addItem($cart, $product, null, 2);

    $response = $this->withUnencryptedCookie('cart_session_id', $this->sessionId)
        ->get(route('checkout'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Checkout')
        ->where('cart.item_count', 2)
        ->where('cart.subtotal', 76)
        ->has('cart.items.0.product')
        ->has('customer')
    );
});

test('requires minimal fields to place an order', function () {
    $cart = $this->cartService->getOrCreateCart($this->sessionId);
    $product = Product::factory()->create(['price' => 20]);
    $this->cartService->addItem($cart, $product, null, 1);

    $response = $this->withUnencryptedCookie('cart_session_id', $this->sessionId)
        ->post(route('checkout.store'), []);

    $response->assertSessionHasErrors(['name', 'email', 'phone', 'address', 'payment_method']);
});

test('can place an order with minimal inputs and clear cart', function () {
    $cart = $this->cartService->getOrCreateCart($this->sessionId);
    $product = Product::factory()->create([
        'name' => 'Artisanal Praline Box',
        'price' => 45.00,
    ]);
    $this->cartService->addItem($cart, $product, null, 2);

    $payload = [
        'name' => 'Eleanor Vance',
        'email' => 'eleanor@example.com',
        'phone' => '+15551234567',
        'address' => '742 Evergreen Terrace, Springfield, OR 97477',
        'notes' => 'Please leave with reception',
        'payment_method' => 'cod',
    ];

    $response = $this->withUnencryptedCookie('cart_session_id', $this->sessionId)
        ->post(route('checkout.store'), $payload);

    $response->assertSessionHasNoErrors();
    $order = Order::latest('id')->first();
    expect($order)->not->toBeNull();
    expect($order->customer_first_name)->toBe('Eleanor');
    expect($order->customer_last_name)->toBe('Vance');
    expect($order->customer_email)->toBe('eleanor@example.com');
    expect((float) $order->grand_total)->toBe(90.0);
    expect($order->shipping_address_snapshot['address'])->toBe('742 Evergreen Terrace, Springfield, OR 97477');
    expect($order->items)->toHaveCount(1);
    expect($order->items->first()->name)->toBe('Artisanal Praline Box');

    // Cart should now be empty
    expect($this->cartService->itemCount($cart->fresh()))->toBe(0);

    $response->assertRedirect(route('checkout.success', ['orderNumber' => $order->number]));
});

test('can view checkout success page with order details', function () {
    $cart = $this->cartService->getOrCreateCart($this->sessionId);
    $product = Product::factory()->create([
        'name' => 'Gold Hazelnut Bar',
        'price' => 15.00,
    ]);
    $this->cartService->addItem($cart, $product, null, 1);

    $this->withUnencryptedCookie('cart_session_id', $this->sessionId)
        ->post(route('checkout.store'), [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '1234567890',
            'address' => '123 Baker Street, London',
            'payment_method' => 'card',
        ]);

    $order = Order::latest('id')->first();

    $response = $this->get(route('checkout.success', ['orderNumber' => $order->number]));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('CheckoutSuccess')
        ->where('order.number', $order->number)
        ->where('order.customer_name', 'John Doe')
        ->where('order.grand_total', 15)
        ->has('order.items', 1)
    );
});
