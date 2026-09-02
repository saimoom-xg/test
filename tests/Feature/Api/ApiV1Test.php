<?php

use App\Models\Brand;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Product;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('otp can be requested', function () {
    $response = $this->postJson('/api/v1/auth/otp/request', [
        'identifier' => 'admin@example.com',
        'channel' => 'email',
    ]);

    $response->assertOk();
    $response->assertJsonStructure(['message', 'data' => ['identifier', 'channel', 'expires_at']]);
});

test('invalid channel returns validation error', function () {
    $this->postJson('/api/v1/auth/otp/request', [
        'identifier' => 'admin@example.com',
        'channel' => 'invalid',
    ])->assertStatus(422);
});

test('products api requires authentication', function () {
    $this->getJson('/api/v1/products')->assertStatus(401);
});

test('products api lists products for authenticated user', function () {
    Product::factory()->count(3)->create();

    $response = $this->actingAs($this->user)->getJson('/api/v1/products');

    $response->assertOk();
    $response->assertJsonStructure(['data' => [['id', 'name', 'sku', 'price']]]);
});

test('product api can create product', function () {
    $brand = Brand::factory()->create();

    $payload = [
        'name' => 'API Product',
        'sku' => 'API-001',
        'price' => 99.99,
        'brand_id' => $brand->id,
        'is_active' => true,
    ];

    $response = $this->actingAs($this->user)->postJson('/api/v1/products', $payload);

    $response->assertStatus(201);
    $response->assertJsonPath('data.name', 'API Product');
    $this->assertDatabaseHas('products', ['sku' => 'API-001']);
});

test('product api can update product', function () {
    $product = Product::factory()->create(['price' => 50]);

    $this->actingAs($this->user)
        ->putJson("/api/v1/products/{$product->id}", [
            'name' => $product->name,
            'sku' => $product->sku,
            'price' => 75,
            'is_active' => true,
        ])
        ->assertOk();

    expect((float) $product->fresh()->price)->toBe(75.0);
});

test('product api can delete product', function () {
    $product = Product::factory()->create();

    $this->actingAs($this->user)
        ->deleteJson("/api/v1/products/{$product->id}")
        ->assertOk();

    expect($product->fresh()->trashed())->toBeTrue();
});

test('customer api can list customers', function () {
    Customer::factory()->count(2)->create();

    $this->actingAs($this->user)
        ->getJson('/api/v1/customers')
        ->assertOk();
});

test('dashboard stats endpoint works', function () {
    $this->actingAs($this->user)
        ->getJson('/api/v1/dashboard/stats')
        ->assertOk()
        ->assertJsonStructure([
            'data' => ['orders', 'revenue', 'products'],
        ]);
});

test('category api list', function () {
    Category::factory()->count(3)->create();

    $this->actingAs($this->user)
        ->getJson('/api/v1/categories')
        ->assertOk();
});
