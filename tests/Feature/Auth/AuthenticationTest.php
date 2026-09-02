<?php

use App\Models\AdminOtp;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Laravel\Fortify\TwoFactorAuthenticateSession;

beforeEach(function () {
    $this->withoutMiddleware(TwoFactorAuthenticateSession::class);
});

test('login screen can be rendered', function () {
    $response = $this->get(route('login'));
    $response->assertOk();
});

test('users are redirected to login from protected page', function () {
    $response = $this->get('/admin/dashboard');
    $response->assertRedirect(route('login'));
});

test('users with OTP are logged in after verifying valid code', function () {
    $user = User::factory()->create(['email' => 'otp-login@example.com']);

    $this->post('/login/otp/request', [
        'identifier' => 'otp-login@example.com',
        'channel' => 'email',
    ])->assertRedirect();

    $otp = AdminOtp::query()
        ->where('identifier', 'otp-login@example.com')
        ->latest('id')
        ->firstOrFail();

    $knownCode = '123456';
    $otp->update(['code_hash' => Hash::make($knownCode)]);

    $this->post('/login/otp/verify', [
        'identifier' => 'otp-login@example.com',
        'channel' => 'email',
        'code' => $knownCode,
    ])->assertRedirect();

    $this->assertAuthenticatedAs($user);
});

test('users can log out via web', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->post(route('logout'));
    $response->assertRedirect('/');

    $this->assertGuest();
});
