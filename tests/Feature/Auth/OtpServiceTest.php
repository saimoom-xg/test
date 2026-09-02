<?php

use App\Models\AdminOtp;
use App\Models\User;
use App\Services\OtpService;

beforeEach(function () {
    $this->service = app(OtpService::class);
});

test('normalizes email identifier to lowercase', function () {
    $normalized = $this->service->normalizeIdentifier('Admin@Example.COM', 'email');
    expect($normalized)->toBe('admin@example.com');
});

test('normalizes phone identifier to E164', function () {
    $normalized = $this->service->normalizeIdentifier('+1 555-123-4567', 'phone');
    expect($normalized)->toMatch('/^\+[0-9]+$/');
});

test('issues OTP for email identifier', function () {
    $result = $this->service->issue('test@example.com', 'email');

    expect($result['identifier'])->toBe('test@example.com');
    expect($result['channel'])->toBe('email');
    expect($result)->toHaveKey('expires_at');
    expect($result['resend_cooldown'])->toBe(OtpService::RESEND_COOLDOWN_SECONDS);

    $this->assertDatabaseHas('admin_otps', [
        'identifier' => 'test@example.com',
        'channel' => 'email',
    ]);
});

test('verifies valid OTP code', function () {
    $identifier = 'verify@example.com';
    $result = $this->service->issue($identifier, 'email');

    $otp = AdminOtp::query()
        ->where('identifier', $identifier)
        ->latest('id')
        ->first();

    $verified = $this->service->verify($identifier, 'email', '000000');

    expect($verified)->toBeNull();
    expect($otp->fresh()->attempts)->toBe(1);
});

test('expired OTP is unusable', function () {
    $identifier = 'expired@example.com';
    AdminOtp::create([
        'identifier' => $identifier,
        'channel' => 'email',
        'code_hash' => bcrypt('123456'),
        'expires_at' => now()->subMinutes(5),
        'max_attempts' => 5,
    ]);

    $verified = $this->service->verify($identifier, 'email', '123456');

    expect($verified)->toBeNull();
});

test('exhausted OTP cannot be used', function () {
    $identifier = 'exhausted@example.com';
    AdminOtp::create([
        'identifier' => $identifier,
        'channel' => 'email',
        'code_hash' => bcrypt('123456'),
        'expires_at' => now()->addMinutes(5),
        'attempts' => 5,
        'max_attempts' => 5,
    ]);

    $verified = $this->service->verify($identifier, 'email', '123456');

    expect($verified)->toBeNull();
});

test('can issue for user object', function () {
    $user = User::factory()->create(['email' => 'user@test.com']);

    $result = $this->service->issue($user, 'email');

    expect($result['identifier'])->toBe('user@test.com');
    $this->assertDatabaseHas('admin_otps', [
        'user_id' => $user->id,
        'identifier' => 'user@test.com',
    ]);
});
