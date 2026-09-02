<?php

namespace Database\Factories;

use App\Models\OrderStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrderStatus>
 */
class OrderStatusFactory extends Factory
{
    protected $model = OrderStatus::class;

    public function definition(): array
    {
        return [
            'code' => $this->faker->unique()->slug(2),
            'name' => ucfirst($this->faker->unique()->word()),
            'color' => $this->faker->randomElement(['gray', 'blue', 'green', 'red', 'yellow']),
            'is_default' => false,
            'is_active' => true,
            'sort_order' => 0,
        ];
    }
}
