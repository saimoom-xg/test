<?php

namespace Database\Factories;

use App\Models\InventoryLevel;
use App\Models\Product;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<InventoryLevel>
 */
class InventoryLevelFactory extends Factory
{
    protected $model = InventoryLevel::class;

    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'variant_id' => null,
            'warehouse_id' => Warehouse::factory(),
            'quantity' => $this->faker->numberBetween(0, 200),
            'reserved_quantity' => 0,
            'low_stock_threshold' => 5,
        ];
    }
}
