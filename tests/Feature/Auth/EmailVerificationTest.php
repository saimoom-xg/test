<?php

use App\Models\AdminOtp;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('otp login screen can be rendered', function () {
    $response = $this->get(route('login'));
    $response->assertOk();
});

test('users with OTP are logged in after verifying valid code', function () {
    $user = User::factory()->create(['email' => 'verification@example.com']);

    $this->post('/login/otp/request', [
        'identifier' => 'verification@example.com',
        'channel' => 'email',
    ])->assertRedirect();

    $otp = AdminOtp::query()
        ->where('identifier', 'verification@example.com')
        ->latest('id')
        ->firstOrFail();

    $knownCode = '123456';
    $otp->update(['code_hash' => Hash::make($knownCode)]);

    $this->post('/login/otp/verify', [
        'identifier' => 'verification@example.com',
        'channel' => 'email',
        'code' => $knownCode,
    ])->assertRedirect();

    $this->assertAuthenticatedAs($user);
});

test('verified user is redirected to dashboard after OTP login', function () {
    $user = User::factory()->create(['email' => 'redirect@example.com', 'email_verified_at' => now()]);

    $this->post('/login/otp/request', [
        'identifier' => 'redirect@example.com',
        'channel' => 'email',
    ])->assertRedirect();

    $otp = AdminOtp::query()
        ->where('identifier', 'redirect@example.com')
        ->latest('id')
        ->firstOrFail();

    $knownCode = '654321';
    $otp->update(['code_hash' => Hash::make($knownCode)]);

    $this->post('/login/otp/verify', [
        'identifier' => 'redirect@example.com',
        'channel' => 'email',
        'code' => $knownCode,
    ])->assertRedirect();

    $this->assertAuthenticatedAs($user);
});

test('users can log out', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('logout'));
    $response->assertRedirect('/');

    $this->assertGuest();
});
