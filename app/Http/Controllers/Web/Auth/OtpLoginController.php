<?php

namespace App\Http\Controllers\Web\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Web\Auth\RequestOtpRequest;
use App\Http\Requests\Web\Auth\VerifyOtpRequest;
use App\Models\Customer;
use App\Models\User;
use App\Services\OtpService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class OtpLoginController extends Controller
{
    public function __construct(private readonly OtpService $otp) {}

    public function show(): Response
    {
        return Inertia::render('auth/login');
    }

    public function requestOtp(RequestOtpRequest $request): RedirectResponse
    {
        $identifier = $this->otp->normalizeIdentifier(
            $request->string('identifier')->toString(),
            $request->string('channel')->toString()
        );
        $channel = $request->string('channel')->toString();

        if (! $this->otp->canRequest($identifier, $channel)) {
            $seconds = $this->otp->secondsUntilNextRequest($identifier, $channel);

            return back()->with([
                'otp' => [
                    'identifier' => $identifier,
                    'channel' => $channel,
                    'resend_cooldown' => $seconds,
                    'cooldown_active' => true,
                ],
            ])->withErrors([
                'identifier' => __('Please wait before requesting another code.'),
            ]);
        }

        $result = $this->otp->issue(
            $identifier,
            $channel,
            $request->ip(),
            $request->userAgent(),
        );

        return back()->with([
            'otp' => array_merge($result, ['identifier' => $identifier, 'channel' => $channel]),
        ]);
    }

    public function verifyOtp(VerifyOtpRequest $request): RedirectResponse
    {
        $identifier = $this->otp->normalizeIdentifier(
            $request->string('identifier')->toString(),
            $request->string('channel')->toString()
        );
        $channel = $request->string('channel')->toString();

        $otp = $this->otp->verify($identifier, $channel, $request->string('code')->toString());

        if (! $otp) {
            return back()->with([
                'otp' => [
                    'identifier' => $identifier,
                    'channel' => $channel,
                    'resend_cooldown' => 0,
                ],
            ])->withErrors([
                'code' => __('Invalid or expired code.'),
            ]);
        }

        $user = User::query()
            ->when($channel === 'phone', fn ($q) => $q->where('phone', $identifier))
            ->when($channel === 'email', fn ($q) => $q->where('email', $identifier))
            ->first();

        if (! $user) {
            $user = User::create([
                'name' => $channel === 'email' ? explode('@', $identifier)[0] : 'Customer',
                'email' => $channel === 'email' ? $identifier : null,
                'phone' => $channel === 'phone' ? $identifier : null,
                'phone_country' => $channel === 'phone' ? 'US' : null,
                'password' => null,
                'email_verified_at' => $channel === 'email' ? now() : null,
            ]);

            Customer::query()->firstOrCreate(
                ['user_id' => $user->id],
                [
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'phone_country' => $user->phone_country,
                    'first_name' => $user->name,
                    'is_guest' => false,
                ]
            );

            Log::info('New user auto-registered via OTP', ['user_id' => $user->id, 'channel' => $channel]);
        }

        Auth::login($user, true);
        $request->session()->regenerate();

        return redirect()->intended('/dashboard');
    }
}
