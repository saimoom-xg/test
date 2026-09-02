<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ __('Your sign-in code') }}</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #111;">{{ __('Your sign-in code') }}</h1>

    <p>{{ __('Use the following one-time code to sign in. It expires in :minutes minutes.', ['minutes' => $ttlMinutes]) }}</p>

    <div style="text-align: center; margin: 24px 0; padding: 16px; background: #f4f4f5; border-radius: 8px;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px;">{{ $code }}</span>
    </div>

    <p>{{ __('If you did not request this code, you can safely ignore this email.') }}</p>

    <p>{{ __('Thanks,') }}<br>{{ config('app.name') }}</p>
</body>
</html>
