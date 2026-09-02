<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\RequestOtpRequest;
use App\Http\Requests\Api\V1\VerifyOtpRequest;
use App\Models\Customer;
use App\Models\User;
use App\Services\OtpService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(private readonly OtpService $otp) {}

    public function requestOtp(RequestOtpRequest $request): JsonResponse
    {
        $identifier = $this->otp->normalizeIdentifier(
            $request->string('identifier')->toString(),
            $request->string('channel')->toString()
        );
        $channel = $request->string('channel')->toString();

        if (! $this->otp->canRequest($identifier, $channel)) {
            $seconds = $this->otp->secondsUntilNextRequest($identifier, $channel);

            return response()->json([
                'message' => __('Please wait before requesting another code.'),
                'errors' => [
                    'identifier' => [__('Please wait before requesting another code.')],
                ],
                'resend_cooldown' => $seconds,
            ], 429);
        }

        $result = $this->otp->issue(
            $identifier,
            $channel,
            $request->ip(),
            $request->userAgent(),
        );

        return response()->json([
            'message' => __('OTP sent.'),
            'data' => $result,
        ]);
    }

    public function verifyOtp(VerifyOtpRequest $request): JsonResponse
    {
        $identifier = $this->otp->normalizeIdentifier(
            $request->string('identifier')->toString(),
            $request->string('channel')->toString()
        );
        $channel = $request->string('channel')->toString();

        $otp = $this->otp->verify($identifier, $channel, $request->string('code')->toString());

        if (! $otp) {
            throw ValidationException::withMessages([
                'code' => [__('Invalid or expired code.')],
            ])->status(422);
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

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'message' => __('Authenticated.'),
            'data' => [
                'user' => $user,
                'token' => $token,
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        if ($request->user()?->currentAccessToken()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json(['message' => __('Logged out.')]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'data' => $request->user(),
        ]);
    }
}
