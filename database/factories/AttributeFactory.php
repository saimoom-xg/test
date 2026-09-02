<?php

namespace Database\Factories;

use App\Models\Attribute;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Attribute>
 */
class AttributeFactory extends Factory
{
    protected $model = Attribute::class;

    public function definition(): array
    {
        $name = ucfirst($this->faker->unique()->word());

        return [
            'code' => Str::slug($name),
            'name' => $name,
            'type' => 'select',
            'is_filterable' => true,
            'is_required' => false,
            'sort_order' => 0,
        ];
    }
}
