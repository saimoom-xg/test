<?php

use App\Mail\TestConfigurationMail;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->admin = User::factory()->create();
    $this->admin->syncRoles(['admin']);

    $this->customer = User::factory()->create();
});

test('guest cannot access admin settings page', function () {
    $this->get(route('admin.settings.index'))
        ->assertRedirect(route('login'));
});

test('non-admin customer cannot access admin settings page', function () {
    $this->actingAs($this->customer)
        ->get(route('admin.settings.index'))
        ->assertForbidden();
});

test('admin can view admin settings page with settings props', function () {
    $this->actingAs($this->admin)
        ->get(route('admin.settings.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/settings/index')
            ->has('settings')
            ->has('currencies')
            ->has('timezones')
            ->has('locales')
        );
});

test('visiting /settings as admin redirects to admin settings', function () {
    $this->actingAs($this->admin)
        ->get('/settings')
        ->assertRedirect(route('admin.settings.index'));
});

test('visiting /settings as regular customer redirects to profile edit', function () {
    $this->actingAs($this->customer)
        ->get('/settings')
        ->assertRedirect(route('profile.edit'));
});

test('admin can update site configuration settings', function () {
    $payload = [
        'settings' => [
            'general.site_title' => 'Updated StoreHub Name',
            'contact.contact_phone' => '+1 800 999 0000',
            'layout.header_announcement_enabled' => '1',
            'layout.header_announcement_text' => 'New Flash Sale Announcement',
            'system.maintenance_mode' => '0',
        ],
    ];

    $this->actingAs($this->admin)
        ->post(route('admin.settings.update'), $payload)
        ->assertRedirect()
        ->assertSessionHas('success');

    expect(Setting::get('general.site_title'))->toBe('Updated StoreHub Name');
    expect(Setting::get('contact.contact_phone'))->toBe('+1 800 999 0000');
    expect(Setting::get('layout.header_announcement_enabled'))->toBe(true);
    expect(Setting::get('layout.header_announcement_text'))->toBe('New Flash Sale Announcement');
});

test('admin can upload a logo file', function () {
    Storage::fake('public');

    $file = UploadedFile::fake()->image('custom_logo.png', 300, 100);

    $this->actingAs($this->admin)
        ->post(route('admin.settings.update'), [
            'logo_file' => $file,
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    $logoUrl = Setting::get('general.site_logo');
    expect($logoUrl)->not->toBeEmpty();
    expect($logoUrl)->toContain('settings/');
});

test('admin can send a test email', function () {
    Mail::fake();

    $this->actingAs($this->admin)
        ->post(route('admin.settings.test-mail'), [
            'recipient_email' => 'tester@example.com',
        ])
        ->assertRedirect()
        ->assertSessionHas('success');

    Mail::assertSent(TestConfigurationMail::class, function ($mail) {
        return $mail->hasTo('tester@example.com');
    });
});

test('maintenance mode allows admin to browse', function () {
    Setting::set('system', 'maintenance_mode', true, 'boolean');

    $this->actingAs($this->admin)
        ->get('/')
        ->assertOk();
});

test('maintenance mode blocks regular guest with 503 unless bypass key is provided', function () {
    Setting::set('system', 'maintenance_mode', true, 'boolean');
    Setting::set('system', 'maintenance_bypass_key', 'test-secret-bypass', 'string');

    // Guest without bypass gets 503
    $this->get('/')
        ->assertStatus(503);

    // Guest with bypass key parameter passes through
    $this->get('/?bypass=test-secret-bypass')
        ->assertOk();
});

test('toggling announcement bar to disabled correctly sets boolean false and propagates to frontend props', function () {
    $this->actingAs($this->admin)
        ->post(route('admin.settings.update'), [
            'settings' => [
                'layout.header_announcement_enabled' => '0',
                'layout.header_announcement_text' => 'Special promo notice',
            ],
        ])
        ->assertRedirect();

    expect(Setting::get('layout.header_announcement_enabled'))->toBeFalse();
    expect(Setting::getPublicSettings()['header_announcement_enabled'])->toBeFalse();

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('siteSettings.header_announcement_enabled', false)
            ->where('siteSettings.header_announcement_text', 'Special promo notice')
        );
});

test('toggling announcement bar to enabled correctly sets boolean true and propagates to frontend props', function () {
    $this->actingAs($this->admin)
        ->post(route('admin.settings.update'), [
            'settings' => [
                'layout.header_announcement_enabled' => '1',
                'layout.header_announcement_text' => 'Flash sale live now!',
            ],
        ])
        ->assertRedirect();

    expect(Setting::get('layout.header_announcement_enabled'))->toBeTrue();
    expect(Setting::getPublicSettings()['header_announcement_enabled'])->toBeTrue();

    $this->get('/')
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('siteSettings.header_announcement_enabled', true)
            ->where('siteSettings.header_announcement_text', 'Flash sale live now!')
        );
});

