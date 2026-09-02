<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<ProductVariant>
 */
class ProductVariantFactory extends Factory
{
    protected $model = ProductVariant::class;

    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'sku' => strtoupper(Str::random(10)),
            'barcode' => $this->faker->unique()->ean13(),
            'name' => $this->faker->words(2, true),
            'price' => $this->faker->randomFloat(2, 5, 500),
            'sale_price' => null,
            'stock_quantity' => $this->faker->numberBetween(0, 100),
            'reserved_quantity' => 0,
            'is_active' => true,
            'sort_order' => 0,
        ];
    }
}
