<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OrderItem>
 */
class OrderItemFactory extends Factory
{
    protected $model = OrderItem::class;

    public function definition(): array
    {
        $qty = $this->faker->numberBetween(1, 5);
        $price = $this->faker->randomFloat(2, 5, 200);
        $subtotal = $price * $qty;

        return [
            'order_id' => Order::factory(),
            'product_id' => Product::factory(),
            'variant_id' => null,
            'name' => $this->faker->words(3, true),
            'sku' => strtoupper($this->faker->bothify('SKU-#####')),
            'quantity' => $qty,
            'unit_price' => $price,
            'subtotal' => $subtotal,
            'tax_total' => 0,
            'discount_total' => 0,
            'total' => $subtotal,
        ];
    }
}
