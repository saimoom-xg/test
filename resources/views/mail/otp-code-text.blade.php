{{ __('Your sign-in code') }}

{{ __('Use the following one-time code to sign in. It expires in :minutes minutes.', ['minutes' => $ttlMinutes]) }}

{{ $code }}

{{ __('If you did not request this code, you can safely ignore this email.') }}

{{ __('Thanks,') }}
{{ config('app.name') }}
