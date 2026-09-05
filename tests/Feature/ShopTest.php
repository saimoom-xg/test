<?php

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Inertia\Testing\AssertableInertia as Assert;

test('can render shop catalog page with inertia component and default props', function () {
    $product = Product::factory()->create([
        'name' => 'Premium Headphones',
        'status' => 'published',
        'is_active' => true,
    ]);

    $response = $this->get(route('shop'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Shop')
        ->has('products.data')
        ->has('categories')
        ->has('brands')
        ->has('priceRange')
        ->has('filters')
        ->where('filters.sort', 'featured')
    );
});

test('can filter products by search query', function () {
    Product::factory()->create([
        'name' => 'Unique Wireless Mouse',
        'status' => 'published',
        'is_active' => true,
    ]);
    Product::factory()->create([
        'name' => 'Mechanical Keyboard',
        'status' => 'published',
        'is_active' => true,
    ]);

    $response = $this->get(route('shop', ['search' => 'Wireless Mouse']));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Shop')
        ->where('products.total', 1)
        ->where('products.data.0.name', 'Unique Wireless Mouse')
    );
});

test('can filter products by category slug', function () {
    $category = Category::factory()->create(['name' => 'Footwear', 'slug' => 'footwear', 'is_active' => true]);
    $shoes = Product::factory()->create(['name' => 'Running Shoes', 'status' => 'published', 'is_active' => true]);
    $shoes->categories()->attach($category);

    $hat = Product::factory()->create(['name' => 'Winter Hat', 'status' => 'published', 'is_active' => true]);

    $response = $this->get(route('shop', ['category' => 'footwear']));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Shop')
        ->where('products.total', 1)
        ->where('products.data.0.name', 'Running Shoes')
    );
});

test('can filter products by brand slug', function () {
    $brand = Brand::factory()->create(['name' => 'Nike', 'slug' => 'nike', 'is_active' => true]);
    $nikeShoe = Product::factory()->create(['name' => 'Air Max', 'brand_id' => $brand->id, 'status' => 'published', 'is_active' => true]);
    $other = Product::factory()->create(['name' => 'Generic Shoe', 'brand_id' => null, 'status' => 'published', 'is_active' => true]);

    $response = $this->get(route('shop', ['brand' => 'nike']));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Shop')
        ->where('products.total', 1)
        ->where('products.data.0.name', 'Air Max')
    );
});

test('can filter products by price range', function () {
    Product::factory()->create(['name' => 'Cheap Item', 'price' => 15.00, 'sale_price' => null, 'status' => 'published', 'is_active' => true]);
    Product::factory()->create(['name' => 'Mid Item', 'price' => 50.00, 'sale_price' => null, 'status' => 'published', 'is_active' => true]);
    Product::factory()->create(['name' => 'Expensive Item', 'price' => 200.00, 'sale_price' => null, 'status' => 'published', 'is_active' => true]);

    $response = $this->get(route('shop', ['min_price' => '20', 'max_price' => '100']));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Shop')
        ->where('products.total', 1)
        ->where('products.data.0.name', 'Mid Item')
    );
});

test('can filter products by in_stock status', function () {
    Product::factory()->create([
        'name' => 'Available Item',
        'stock_quantity' => 10,
        'stock_status' => 'in_stock',
        'status' => 'published',
        'is_active' => true,
    ]);
    Product::factory()->create([
        'name' => 'Sold Out Item',
        'stock_quantity' => 0,
        'stock_status' => 'out_of_stock',
        'status' => 'published',
        'is_active' => true,
    ]);

    $response = $this->get(route('shop', ['in_stock' => '1']));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Shop')
        ->where('products.total', 1)
        ->where('products.data.0.name', 'Available Item')
    );
});

test('can sort products by price ascending', function () {
    Product::factory()->create(['name' => 'Expensive Item', 'price' => 100.00, 'sale_price' => null, 'status' => 'published', 'is_active' => true]);
    Product::factory()->create(['name' => 'Cheap Item', 'price' => 10.00, 'sale_price' => null, 'status' => 'published', 'is_active' => true]);

    $response = $this->get(route('shop', ['sort' => 'price_asc']));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('Shop')
        ->where('products.data.0.name', 'Cheap Item')
        ->where('products.data.1.name', 'Expensive Item')
    );
});
