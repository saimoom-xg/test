<?php

namespace Database\Factories;

use App\Models\Country;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Country>
 */
class CountryFactory extends Factory
{
    protected $model = Country::class;

    public function definition(): array
    {
        $name = $this->faker->unique()->country();

        return [
            'iso2' => $this->faker->unique()->countryISO2Alpha2(),
            'iso3' => $this->faker->unique()->countryISO3(),
            'name' => $name,
            'phone_code' => '+1',
            'currency_code' => 'USD',
            'is_active' => true,
        ];
    }
}
