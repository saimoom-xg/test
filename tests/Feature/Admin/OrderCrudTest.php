<?php

use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatus;
use App\Models\Product;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    // $this->user->assignRole('admin');
    $this->user->syncRoles(['admin']);
});

test('orders index renders', function () {
    Order::factory()->count(3)->create();

    $this->actingAs($this->user)
        ->get(route('admin.orders.index'))
        ->assertOk();
});

test('order can have its status updated', function () {
    $order = Order::factory()->create();
    $newStatus = OrderStatus::factory()->create(['code' => 'processing', 'name' => 'Processing']);

    $this->actingAs($this->user)
        ->post(route('admin.orders.status', $order), [
            'order_status_id' => $newStatus->id,
            'comment' => 'Test',
        ])
        ->assertRedirect(route('admin.orders.show', $order));

    expect($order->fresh()->order_status_id)->toBe($newStatus->id);
    $this->assertDatabaseHas('order_status_histories', [
        'order_id' => $order->id,
        'to_status' => 'processing',
    ]);
});

test('customers index renders', function () {
    Customer::factory()->count(3)->create();

    $this->actingAs($this->user)
        ->get(route('admin.customers.index'))
        ->assertOk();
});

test('order can be created via API with items', function () {
    $product = Product::factory()->create(['price' => 50]);
    $status = OrderStatus::factory()->create();

    $payload = [
        'order_status_id' => $status->id,
        'customer_email' => 'test@example.com',
        'subtotal' => 50,
        'grand_total' => 50,
        'currency_code' => 'USD',
        'items' => [
            [
                'product_id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'quantity' => 1,
                'unit_price' => 50,
            ],
        ],
    ];

    $this->actingAs($this->user)
        ->postJson('/api/v1/orders', $payload)
        ->assertStatus(201);

    $this->assertDatabaseCount('orders', 1);
    $this->assertDatabaseCount('order_items', 1);
});

test('order items are correctly totalled', function () {
    $product = Product::factory()->create(['price' => 10]);
    $status = OrderStatus::factory()->create();

    $order = Order::factory()->create(['order_status_id' => $status->id]);
    OrderItem::factory()->create([
        'order_id' => $order->id,
        'product_id' => $product->id,
        'quantity' => 3,
        'unit_price' => 10,
        'subtotal' => 30,
        'total' => 30,
    ]);

    expect($order->items()->count())->toBe(1);
    expect((float) $order->items()->first()->total)->toBe(30.0);
});
