<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;
use Propaganistas\LaravelPhone\PhoneNumber;

/**
 * @extends Factory<Customer>
 */
class CustomerFactory extends Factory
{
    protected $model = Customer::class;

    public function definition(): array
    {
        $phone = (new PhoneNumber($this->faker->e164PhoneNumber(), 'US'))->formatE164();

        return [
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail(),
            'phone' => $phone,
            'phone_country' => 'US',
            'is_guest' => false,
            'is_active' => true,
            'accepts_marketing' => $this->faker->boolean(),
            'default_currency' => 'USD',
            'default_locale' => 'en',
        ];
    }

    public function guest(): static
    {
        return $this->state(fn (): array => ['is_guest' => true]);
    }
}
