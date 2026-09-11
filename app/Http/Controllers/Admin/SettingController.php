<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use App\Models\Setting;
use DateTimeZone;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    /**
     * Display the site configuration management page.
     */
    public function index(): Response
    {
        $allKeyed = Setting::getAllKeyed();
        $grouped = Setting::getAllGrouped();

        $currencies = Currency::query()
            ->where('is_active', true)
            ->orderBy('code')
            ->get(['id', 'code', 'name', 'symbol', 'is_default']);

        $timezones = DateTimeZone::listIdentifiers(DateTimeZone::ALL);

        $locales = [
            'en' => 'English (US/UK)',
            'es' => 'Español (Spanish)',
            'fr' => 'Français (French)',
            'de' => 'Deutsch (German)',
            'it' => 'Italiano (Italian)',
            'nl' => 'Nederlands (Dutch)',
            'pt' => 'Português (Portuguese)',
            'ar' => 'العربية (Arabic)',
            'bn' => 'বাংলা (Bengali)',
            'zh' => '中文 (Chinese)',
            'ja' => '日本語 (Japanese)',
        ];

        return Inertia::render('admin/settings/index', [
            'settings' => $allKeyed,
            'groupedSettings' => $grouped,
            'currencies' => $currencies,
            'timezones' => $timezones,
            'locales' => $locales,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Update website configuration settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'settings' => ['sometimes', 'array'],
            'settings.*' => ['nullable'],
            'logo_file' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp,svg', 'max:4096'],
            'logo_dark_file' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp,svg', 'max:4096'],
            'favicon_file' => ['nullable', 'file', 'mimes:ico,png,svg,webp', 'max:2048'],
            'og_image_file' => ['nullable', 'image', 'mimes:png,jpg,jpeg,webp', 'max:6144'],
            'remove_logo' => ['nullable', 'boolean'],
            'remove_logo_dark' => ['nullable', 'boolean'],
            'remove_favicon' => ['nullable', 'boolean'],
            'remove_og_image' => ['nullable', 'boolean'],
        ]);

        $settingsData = $request->input('settings', []);

        // File upload handling
        if ($request->hasFile('logo_file')) {
            $path = $request->file('logo_file')->store('settings', 'public');
            $settingsData['general.site_logo'] = Storage::disk('public')->url($path);
        } elseif ($request->boolean('remove_logo')) {
            $settingsData['general.site_logo'] = '';
        }

        if ($request->hasFile('logo_dark_file')) {
            $path = $request->file('logo_dark_file')->store('settings', 'public');
            $settingsData['general.site_logo_dark'] = Storage::disk('public')->url($path);
        } elseif ($request->boolean('remove_logo_dark')) {
            $settingsData['general.site_logo_dark'] = '';
        }

        if ($request->hasFile('favicon_file')) {
            $path = $request->file('favicon_file')->store('settings', 'public');
            $settingsData['general.site_favicon'] = Storage::disk('public')->url($path);
        } elseif ($request->boolean('remove_favicon')) {
            $settingsData['general.site_favicon'] = '';
        }

        if ($request->hasFile('og_image_file')) {
            $path = $request->file('og_image_file')->store('settings', 'public');
            $settingsData['general.site_og_image'] = Storage::disk('public')->url($path);
        } elseif ($request->boolean('remove_og_image')) {
            $settingsData['general.site_og_image'] = '';
        }

        if (! empty($settingsData)) {
            Setting::setMany($settingsData);
        }

        return redirect()->back()->with('success', 'Site configuration updated successfully.');
    }

    /**
     * Send a test email to verify SMTP configuration.
     */
    public function testMail(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'recipient_email' => ['required', 'email'],
        ]);

        $recipient = $validated['recipient_email'];

        try {
            $mailer = Setting::get('mail.mail_mailer', config('mail.default'));
            $host = Setting::get('mail.mail_host', config('mail.mailers.smtp.host'));
            $port = Setting::get('mail.mail_port', config('mail.mailers.smtp.port'));
            $username = Setting::get('mail.mail_username', config('mail.mailers.smtp.username'));
            $password = Setting::get('mail.mail_password', config('mail.mailers.smtp.password'));
            $encryption = Setting::get('mail.mail_encryption', config('mail.mailers.smtp.encryption'));
            $fromAddress = Setting::get('mail.mail_from_address', config('mail.from.address'));
            $fromName = Setting::get('mail.mail_from_name', config('mail.from.name'));

            if (! app()->runningUnitTests()) {
                Config::set('mail.default', $mailer);
                Config::set('mail.mailers.smtp.host', $host);
                Config::set('mail.mailers.smtp.port', (int) $port);
                Config::set('mail.mailers.smtp.username', $username);
                Config::set('mail.mailers.smtp.password', $password);
                Config::set('mail.mailers.smtp.encryption', $encryption);
                Config::set('mail.from.address', $fromAddress);
                Config::set('mail.from.name', $fromName);
            }

            $siteName = Setting::get('general.site_title', config('app.name', 'StoreHub'));

            Mail::to($recipient)->send(new \App\Mail\TestConfigurationMail($siteName, (string) $fromAddress, (string) $fromName));

            return redirect()->back()->with('success', "Test email sent successfully to {$recipient}.");
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Failed to send test email: '.$e->getMessage());
        }
    }
}
