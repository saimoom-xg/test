<?php

use App\Models\AdminOtp;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

test('otp can be resent after cooldown', function () {
    $user = User::factory()->create(['email' => 'resend@example.com']);

    $this->postJson('/api/v1/auth/otp/request', [
        'identifier' => 'resend@example.com',
        'channel' => 'email',
    ])->assertOk();

    $otp = AdminOtp::query()
        ->where('identifier', 'resend@example.com')
        ->latest('id')
        ->firstOrFail();

    DB::table('admin_otps')->where('id', $otp->id)->update([
        'created_at' => now()->subMinutes(2),
    ]);

    $this->postJson('/api/v1/auth/otp/request', [
        'identifier' => 'resend@example.com',
        'channel' => 'email',
    ])->assertOk();
});

test('otp resend is blocked during cooldown', function () {
    $this->postJson('/api/v1/auth/otp/request', [
        'identifier' => 'cooldown-resend@example.com',
        'channel' => 'email',
    ])->assertOk();

    $this->postJson('/api/v1/auth/otp/request', [
        'identifier' => 'cooldown-resend@example.com',
        'channel' => 'email',
    ])->assertStatus(429);
});

test('otp is invalidated after max attempts', function () {
    $this->postJson('/api/v1/auth/otp/request', [
        'identifier' => 'exhausted@example.com',
        'channel' => 'email',
    ])->assertOk();

    $otp = AdminOtp::query()
        ->where('identifier', 'exhausted@example.com')
        ->latest('id')
        ->firstOrFail();

    $otp->update([
        'code_hash' => Hash::make('000000'),
        'attempts' => 4,
        'max_attempts' => 5,
    ]);

    $this->postJson('/api/v1/auth/otp/verify', [
        'identifier' => 'exhausted@example.com',
        'channel' => 'email',
        'code' => '111111',
    ])->assertStatus(422);

    $this->postJson('/api/v1/auth/otp/verify', [
        'identifier' => 'exhausted@example.com',
        'channel' => 'email',
        'code' => '111111',
    ])->assertStatus(422);
});
