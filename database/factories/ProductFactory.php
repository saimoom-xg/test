<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $name = ucfirst($this->faker->unique()->words(3, true));

        return [
            'name' => $name,
            'slug' => Str::slug($name).'-'.$this->faker->unique()->numberBetween(1, 99999),
            'short_description' => $this->faker->sentence(),
            'description' => $this->faker->paragraphs(3, true),
            'sku' => strtoupper(Str::random(10)),
            'barcode' => $this->faker->unique()->ean13(),
            'price' => $this->faker->randomFloat(2, 5, 500),
            'cost_price' => $this->faker->randomFloat(2, 1, 200),
            'sale_price' => null,
            'tax_class' => 'standard',
            'track_inventory' => true,
            'stock_quantity' => $this->faker->numberBetween(0, 200),
            'reserved_quantity' => 0,
            'low_stock_threshold' => 5,
            'manage_stock' => true,
            'stock_status' => 'in_stock',
            'is_active' => true,
            'is_featured' => false,
            'status' => 'published',
        ];
    }

    public function lowStock(): static
    {
        return $this->state(fn (): array => [
            'stock_quantity' => 2,
            'low_stock_threshold' => 5,
        ]);
    }

    public function outOfStock(): static
    {
        return $this->state(fn (): array => [
            'stock_quantity' => 0,
            'stock_status' => 'out_of_stock',
        ]);
    }
}
