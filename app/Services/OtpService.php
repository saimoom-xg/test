<?php

namespace App\Services;

use App\Mail\OtpCodeMail;
use App\Models\AdminOtp;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\RateLimiter;
use Propaganistas\LaravelPhone\PhoneNumber;

class OtpService
{
    public const RESEND_COOLDOWN_SECONDS = 60;

    public const OTP_LENGTH = 6;

    public const OTP_TTL_MINUTES = 10;

    public function normalizeIdentifier(string $identifier, string $channel): string
    {
        $identifier = trim($identifier);

        if ($channel === 'phone') {
            try {
                $phone = new PhoneNumber($identifier);

                return $phone->formatE164();
            } catch (\Throwable) {
                return $identifier;
            }
        }

        return strtolower($identifier);
    }

    public function canRequest(string $identifier, string $channel): bool
    {
        $key = $this->rateKey($identifier, $channel);

        if (RateLimiter::tooManyAttempts($key, 5)) {
            return false;
        }

        $last = AdminOtp::query()
            ->where('identifier', $identifier)
            ->where('channel', $channel)
            ->whereNull('consumed_at')
            ->latest('id')
            ->first();

        if ($last && $last->created_at->diffInSeconds(Carbon::now(), true) < self::RESEND_COOLDOWN_SECONDS) {
            return false;
        }

        return true;
    }

    public function secondsUntilNextRequest(string $identifier, string $channel): int
    {
        $last = AdminOtp::query()
            ->where('identifier', $identifier)
            ->where('channel', $channel)
            ->latest('id')
            ->first();

        if (! $last) {
            return 0;
        }

        $elapsed = $last->created_at->diffInSeconds(Carbon::now(), true);
        $remaining = self::RESEND_COOLDOWN_SECONDS - $elapsed;

        return max(0, (int) $remaining);
    }

    public function issue(User|string $identifierOrUser, string $channel, ?string $ipAddress = null, ?string $userAgent = null): array
    {
        if ($identifierOrUser instanceof User) {
            $identifier = $identifierOrUser->{$channel === 'phone' ? 'phone' : 'email'};
            $userId = $identifierOrUser->id;
        } else {
            $identifier = $identifierOrUser;
            $userId = null;
        }

        $identifier = $this->normalizeIdentifier($identifier, $channel);

        $code = $this->generateCode();

        $otp = AdminOtp::create([
            'user_id' => $userId,
            'identifier' => $identifier,
            'channel' => $channel,
            'code_hash' => Hash::make($code),
            'expires_at' => now()->addMinutes(self::OTP_TTL_MINUTES),
            'max_attempts' => 5,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
        ]);

        RateLimiter::hit($this->rateKey($identifier, $channel), 60);

        $this->deliver($channel, $identifier, $code);

        return [
            'identifier' => $identifier,
            'channel' => $channel,
            'expires_at' => $otp->expires_at->toIso8601String(),
            'resend_cooldown' => self::RESEND_COOLDOWN_SECONDS,
        ];
    }

    public function verify(string $identifier, string $channel, string $code): ?AdminOtp
    {
        $identifier = $this->normalizeIdentifier($identifier, $channel);

        $otp = AdminOtp::query()
            ->where('identifier', $identifier)
            ->where('channel', $channel)
            ->whereNull('consumed_at')
            ->latest('id')
            ->first();

        if (! $otp || ! $otp->isUsable()) {
            return null;
        }

        $otp->increment('attempts');

        if (! Hash::check($code, $otp->code_hash)) {
            return null;
        }

        $otp->update(['consumed_at' => now()]);

        return $otp;
    }

    public function consumeAttempts(string $identifier, string $channel): void
    {
        RateLimiter::hit($this->rateKey('verify', $identifier.$channel), 60);
    }

    private function generateCode(): string
    {
        $max = (10 ** self::OTP_LENGTH) - 1;
        $min = 10 ** (self::OTP_LENGTH - 1);

        return (string) random_int($min, $max);
    }

    private function rateKey(string $identifier, string $channel): string
    {
        return 'otp:'.$channel.':'.$identifier;
    }

    private function deliver(string $channel, string $identifier, string $code): void
    {
        Log::info("OTP generated for {$channel} ({$identifier}): {$code}");

        if ($channel === 'email') {
            Mail::to($identifier)->send(new OtpCodeMail($code, self::OTP_TTL_MINUTES));
        }
    }
}
