<?php

namespace Database\Seeders;

use App\Models\Coupon;
use Illuminate\Database\Seeder;

class CouponSeeder extends Seeder
{
    public function run(): void
    {
        $coupons = [
            [
                'code' => 'CHOCO10',
                'type' => 'percentage',
                'value' => 10,
                'min_order_amount' => 0,
                'max_discount' => null,
                'starts_at' => now()->subDay(),
                'ends_at' => now()->addMonths(6),
                'usage_limit' => 1000,
                'is_active' => true,
            ],
            [
                'code' => 'SWEET20',
                'type' => 'percentage',
                'value' => 20,
                'min_order_amount' => 40,
                'max_discount' => 25,
                'starts_at' => now()->subDay(),
                'ends_at' => now()->addMonths(6),
                'usage_limit' => 500,
                'is_active' => true,
            ],
            [
                'code' => 'FLAT5',
                'type' => 'fixed',
                'value' => 5,
                'min_order_amount' => 20,
                'max_discount' => null,
                'starts_at' => now()->subDay(),
                'ends_at' => now()->addMonths(6),
                'usage_limit' => 500,
                'is_active' => true,
            ],
        ];

        foreach ($coupons as $data) {
            Coupon::updateOrCreate(
                ['code' => $data['code']],
                $data
            );
        }
    }
}
