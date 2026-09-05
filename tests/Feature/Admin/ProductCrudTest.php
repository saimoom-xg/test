<?php

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;

beforeEach(function () {
    $this->user = User::factory()->create();
    // $this->user->assignRole('admin');
    $this->user->syncRoles(['admin']);
});

test('admin dashboard requires authentication', function () {
    $this->get(route('admin.dashboard'))->assertRedirect(route('login'));
});

test('products index lists products with images relation', function () {
    Product::factory()->count(3)->create();

    $this->actingAs($this->user)
        ->get(route('admin.products.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/products/index')
            ->has('products.data.0.images')
        );
});

test('product create page shows form', function () {
    $this->actingAs($this->user)
        ->get(route('admin.products.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('admin/products/form'));
});

test('product can be created', function () {
    $brand = Brand::factory()->create();
    $category = Category::factory()->create();

    $this->actingAs($this->user)
        ->post(route('admin.products.store'), [
            'name' => 'Test Product',
            'sku' => 'TEST-SKU',
            'price' => 19.99,
            'category_ids' => [$category->id],
            'is_active' => true,
        ])
        ->assertRedirect(route('admin.products.index'));

    $this->assertDatabaseHas('products', ['sku' => 'TEST-SKU', 'name' => 'Test Product']);
    $this->assertDatabaseHas('category_product', [
        'category_id' => $category->id,
    ]);
});

test('product can be updated', function () {
    $product = Product::factory()->create(['price' => 10]);

    $this->actingAs($this->user)
        ->put(route('admin.products.update', $product), [
            'name' => $product->name,
            'sku' => $product->sku,
            'price' => 25.50,
            'is_active' => true,
        ])
        ->assertRedirect(route('admin.products.index'));

    expect((float) $product->fresh()->price)->toBe(25.50);
});

test('product can be deleted', function () {
    $product = Product::factory()->create();

    $this->actingAs($this->user)
        ->delete(route('admin.products.destroy', $product))
        ->assertRedirect(route('admin.products.index'));

    expect($product->fresh()->trashed())->toBeTrue();
});

test('categories index renders', function () {
    Category::factory()->count(2)->create();

    $this->actingAs($this->user)
        ->get(route('admin.categories.index'))
        ->assertOk();
});

test('brands index renders', function () {
    Brand::factory()->count(2)->create();

    $this->actingAs($this->user)
        ->get(route('admin.brands.index'))
        ->assertOk();
});
