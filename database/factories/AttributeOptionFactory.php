<?php

namespace Database\Factories;

use App\Models\Attribute;
use App\Models\AttributeOption;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AttributeOption>
 */
class AttributeOptionFactory extends Factory
{
    protected $model = AttributeOption::class;

    public function definition(): array
    {
        return [
            'attribute_id' => Attribute::factory(),
            'value' => ucfirst($this->faker->unique()->word()),
            'slug' => $this->faker->unique()->slug(),
            'sort_order' => 0,
        ];
    }
}
