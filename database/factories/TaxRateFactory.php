<?php

namespace Database\Factories;

use App\Models\TaxRate;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TaxRate>
 */
class TaxRateFactory extends Factory
{
    protected $model = TaxRate::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->words(2, true).' Tax',
            'rate' => $this->faker->randomFloat(2, 0, 25),
            'country_code' => 'US',
            'is_inclusive' => false,
            'is_active' => true,
        ];
    }
}
