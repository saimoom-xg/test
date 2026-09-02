<?php

namespace Database\Factories;

use App\Models\AdminOtp;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AdminOtp>
 */
class AdminOtpFactory extends Factory
{
    protected $model = AdminOtp::class;

    public function definition(): array
    {
        return [
            'identifier' => $this->faker->safeEmail(),
            'channel' => 'email',
            'code_hash' => bcrypt('123456'),
            'expires_at' => now()->addMinutes(10),
            'max_attempts' => 5,
        ];
    }
}
