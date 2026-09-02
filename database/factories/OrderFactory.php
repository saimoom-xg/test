<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Order>
 */
class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        return [
            'number' => 'ORD-'.strtoupper($this->faker->unique()->bothify('######')),
            'customer_id' => Customer::factory(),
            'order_status_id' => OrderStatus::factory(),
            'customer_email' => $this->faker->safeEmail(),
            'customer_phone' => $this->faker->e164PhoneNumber(),
            'subtotal' => 100,
            'discount_total' => 0,
            'shipping_total' => 10,
            'tax_total' => 8,
            'grand_total' => 118,
            'payment_status' => 'pending',
            'shipping_status' => 'pending',
            'is_guest' => false,
            'currency_code' => 'USD',
            'exchange_rate' => 1,
            'placed_at' => now(),
        ];
    }
}
