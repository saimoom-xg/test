<?php

namespace Database\Factories;

use App\Models\InventoryMovement;
use App\Models\Product;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<InventoryMovement>
 */
class InventoryMovementFactory extends Factory
{
    protected $model = InventoryMovement::class;

    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'variant_id' => null,
            'warehouse_id' => Warehouse::factory(),
            'type' => $this->faker->randomElement(['adjustment', 'purchase', 'transfer']),
            'quantity' => $this->faker->numberBetween(-50, 50),
            'before_quantity' => $this->faker->numberBetween(0, 100),
            'after_quantity' => $this->faker->numberBetween(0, 100),
            'reason' => $this->faker->sentence(),
        ];
    }
}
