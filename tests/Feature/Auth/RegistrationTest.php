<?php

use App\Models\AdminOtp;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

test('otp auto-registers new user on first login', function () {
    expect(User::query()->where('email', 'newuser@example.com')->exists())->toBeFalse();

    $this->post('/login/otp/request', [
        'identifier' => 'newuser@example.com',
        'channel' => 'email',
    ])->assertRedirect();

    $otp = AdminOtp::query()
        ->where('identifier', 'newuser@example.com')
        ->latest('id')
        ->firstOrFail();

    $knownCode = '111111';
    $otp->update(['code_hash' => Hash::make($knownCode)]);

    $this->post('/login/otp/verify', [
        'identifier' => 'newuser@example.com',
        'channel' => 'email',
        'code' => $knownCode,
    ])->assertRedirect();

    $this->assertAuthenticated();

    $user = User::query()->where('email', 'newuser@example.com')->firstOrFail();
    expect($user->email_verified_at)->not->toBeNull();

    $this->assertDatabaseHas('customers', ['user_id' => $user->id]);
});

test('otp auto-registers new phone user on first login', function () {
    $this->post('/login/otp/request', [
        'identifier' => '+15105551234',
        'channel' => 'phone',
    ])->assertRedirect();

    $otp = AdminOtp::query()
        ->where('identifier', '+15105551234')
        ->latest('id')
        ->firstOrFail();

    $knownCode = '222222';
    $otp->update(['code_hash' => Hash::make($knownCode)]);

    $this->post('/login/otp/verify', [
        'identifier' => '+15105551234',
        'channel' => 'phone',
        'code' => $knownCode,
    ])->assertRedirect();

    $this->assertAuthenticated();

    $user = User::query()->where('phone', '+15105551234')->firstOrFail();
    expect($user->phone_country)->toBe('US');

    $this->assertDatabaseHas('customers', ['user_id' => $user->id]);
});
