<?php

use App\Models\AdminOtp;
use App\Models\CartItem;
use App\Models\Customer;
use App\Models\Product;
use App\Models\User;
use App\Services\OtpService;
use Illuminate\Support\Facades\Hash;

beforeEach(function () {
    $this->service = app(OtpService::class);
});

function otpCodeFor(string $identifier, string $channel = 'email'): string
{
    $otp = AdminOtp::query()
        ->where('identifier', $identifier)
        ->where('channel', $channel)
        ->latest('id')
        ->firstOrFail();

    expect($otp->code_hash)->not->toBeNull();

    $known = str_pad((string) random_int(100000, 999999), 6, '0', STR_PAD_LEFT);

    $otp->update(['code_hash' => Hash::make($known)]);

    return $known;
}

test('existing user can login with email OTP', function () {
    $user = User::factory()->create(['email' => 'existing@example.com']);

    $this->post('/login/otp/request', [
        'identifier' => 'existing@example.com',
        'channel' => 'email',
    ])->assertRedirect();

    $code = otpCodeFor('existing@example.com', 'email');

    $this->post('/login/otp/verify', [
        'identifier' => 'existing@example.com',
        'channel' => 'email',
        'code' => $code,
    ])->assertRedirect();
});

test('new user is auto-created when verifying email OTP', function () {
    expect(User::query()->where('email', 'new@example.com')->exists())->toBeFalse();

    $this->post('/login/otp/request', [
        'identifier' => 'new@example.com',
        'channel' => 'email',
    ])->assertRedirect();

    $code = otpCodeFor('new@example.com', 'email');

    $this->post('/login/otp/verify', [
        'identifier' => 'new@example.com',
        'channel' => 'email',
        'code' => $code,
    ])->assertRedirect();

    $user = User::query()->where('email', 'new@example.com')->firstOrFail();
    expect($user->email_verified_at)->not->toBeNull();
    expect(Customer::query()->where('user_id', $user->id)->exists())->toBeTrue();
});

test('existing user can login with phone OTP', function () {
    $user = User::factory()->create([
        'email' => null,
        'phone' => '+12065551234',
        'phone_country' => 'US',
    ]);

    $this->post('/login/otp/request', [
        'identifier' => '+12065551234',
        'channel' => 'phone',
    ])->assertRedirect();

    $code = otpCodeFor('+12065551234', 'phone');

    $this->post('/login/otp/verify', [
        'identifier' => '+12065551234',
        'channel' => 'phone',
        'code' => $code,
    ])->assertRedirect();

    expect(User::query()->count())->toBe(1);
});

test('new user is auto-created when verifying phone OTP', function () {
    $this->post('/login/otp/request', [
        'identifier' => '+14155551234',
        'channel' => 'phone',
    ])->assertRedirect();

    $code = otpCodeFor('+14155551234', 'phone');

    $this->post('/login/otp/verify', [
        'identifier' => '+14155551234',
        'channel' => 'phone',
        'code' => $code,
    ])->assertRedirect();

    $user = User::query()->where('phone', '+14155551234')->firstOrFail();
    expect($user->phone_country)->toBe('US');
    expect(Customer::query()->where('user_id', $user->id)->exists())->toBeTrue();
});

test('invalid OTP code shows error', function () {
    $user = User::factory()->create(['email' => 'x@example.com']);

    $this->post('/login/otp/request', [
        'identifier' => 'x@example.com',
        'channel' => 'email',
    ])->assertRedirect();

    $this->post('/login/otp/verify', [
        'identifier' => 'x@example.com',
        'channel' => 'email',
        'code' => '000000',
    ])->assertRedirect();
});

test('expired OTP cannot be used', function () {
    $identifier = 'expired@example.com';
    AdminOtp::create([
        'identifier' => $identifier,
        'channel' => 'email',
        'code_hash' => Hash::make('123456'),
        'expires_at' => now()->subMinutes(1),
        'max_attempts' => 5,
    ]);

    $this->post('/login/otp/verify', [
        'identifier' => $identifier,
        'channel' => 'email',
        'code' => '123456',
    ])->assertRedirect();
});

test('resend cooldown enforces a wait', function () {
    $this->post('/login/otp/request', [
        'identifier' => 'cooldown@example.com',
        'channel' => 'email',
    ])->assertRedirect();

    $this->post('/login/otp/request', [
        'identifier' => 'cooldown@example.com',
        'channel' => 'email',
    ])->assertRedirect();
});

test('OTP rate limit caps requests per minute', function () {
    $identifier = 'rate-limit@example.com';
    $channel = 'email';

    for ($i = 0; $i < 5; $i++) {
        $this->post('/login/otp/request', [
            'identifier' => $identifier,
            'channel' => $channel,
        ])->assertRedirect();

        $otp = otpCodeFor($identifier, $channel);

        $this->post('/login/otp/verify', [
            'identifier' => $identifier,
            'channel' => $channel,
            'code' => $otp,
        ])->assertRedirect();
    }

    $this->post('/login/otp/request', [
        'identifier' => $identifier,
        'channel' => $channel,
    ])->assertRedirect();
});

test('guest cart merges into user cart after OTP login', function () {
    $product = Product::factory()->create(['price' => 25]);

    $this->withSession([])->postJson('/api/v1/cart/items', [
        'product_id' => $product->id,
        'quantity' => 2,
    ])->assertOk();

    expect(CartItem::query()->count())->toBe(1);

    $this->post('/login/otp/request', [
        'identifier' => 'cart@example.com',
        'channel' => 'email',
    ])->assertRedirect();

    $code = otpCodeFor('cart@example.com', 'email');

    $this->post('/login/otp/verify', [
        'identifier' => 'cart@example.com',
        'channel' => 'email',
        'code' => $code,
    ])->assertRedirect();

    $user = User::query()->where('email', 'cart@example.com')->firstOrFail();

    $this->actingAs($user)
        ->postJson('/api/v1/cart/merge')
        ->assertOk();
});

test('fortify password login route is not registered', function () {
    $this->get('/login')->assertSuccessful();
    $this->post('/login')->assertStatus(405);
    $this->get('/register')->assertStatus(404);
});
