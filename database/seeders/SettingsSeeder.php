<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // General & Branding
            [
                'group' => 'general',
                'key' => 'site_title',
                'value' => 'StoreHub',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'general',
                'key' => 'site_tagline',
                'value' => 'Artisan Craftsmanship & Premium Quality Goods',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'general',
                'key' => 'site_description',
                'value' => 'Your premier destination for curated fashion, artisan chocolates, and lifestyle essentials. Quality products with seamless delivery.',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'general',
                'key' => 'site_logo',
                'value' => 'https://static.vecteezy.com/system/resources/previews/034/994/756/non_2x/illustration-of-threads-logo-free-png.png',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'general',
                'key' => 'site_logo_dark',
                'value' => '',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'general',
                'key' => 'site_favicon',
                'value' => '/favicon.ico',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'general',
                'key' => 'site_og_image',
                'value' => 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=1200&q=80',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'general',
                'key' => 'copyright_text',
                'value' => '© {year} StoreHub. All rights reserved.',
                'type' => 'string',
                'is_public' => true,
            ],

            // Contact & Location
            [
                'group' => 'contact',
                'key' => 'contact_email',
                'value' => 'hello@storehub.com',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'contact',
                'key' => 'contact_phone',
                'value' => '+1 (555) 012-3456',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'contact',
                'key' => 'contact_whatsapp',
                'value' => '+15550123456',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'contact',
                'key' => 'contact_address',
                'value' => '128 Cocoa Lane, Suite 4, Brussels, BE 1000',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'contact',
                'key' => 'business_hours',
                'value' => "Mon–Fri: 9:00 AM – 6:00 PM\nSat: 10:00 AM – 4:00 PM\nSun: Closed",
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'contact',
                'key' => 'google_maps_embed_url',
                'value' => 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2519.267869680373!2d4.351710315745778!3d50.84666397953158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c3c47f7a1f5f5f%3A0x8e8a6d7bb5f3b7b8!2sGrand%20Place!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s',
                'type' => 'string',
                'is_public' => true,
            ],

            // Social Media
            [
                'group' => 'social',
                'key' => 'facebook',
                'value' => 'https://facebook.com/storehub',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'social',
                'key' => 'instagram',
                'value' => 'https://instagram.com/storehub',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'social',
                'key' => 'twitter',
                'value' => 'https://twitter.com/storehub',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'social',
                'key' => 'youtube',
                'value' => 'https://youtube.com/@storehub',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'social',
                'key' => 'linkedin',
                'value' => 'https://linkedin.com/company/storehub',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'social',
                'key' => 'tiktok',
                'value' => '',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'social',
                'key' => 'pinterest',
                'value' => '',
                'type' => 'string',
                'is_public' => true,
            ],

            // Localization
            [
                'group' => 'localization',
                'key' => 'default_currency',
                'value' => 'USD',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'localization',
                'key' => 'timezone',
                'value' => 'UTC',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'localization',
                'key' => 'default_locale',
                'value' => 'en',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'localization',
                'key' => 'date_format',
                'value' => 'Y-m-d',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'localization',
                'key' => 'time_format',
                'value' => '12h',
                'type' => 'string',
                'is_public' => true,
            ],

            // Layout (Header & Footer)
            [
                'group' => 'layout',
                'key' => 'header_announcement_enabled',
                'value' => '1',
                'type' => 'boolean',
                'is_public' => true,
            ],
            [
                'group' => 'layout',
                'key' => 'header_announcement_text',
                'value' => '✨ Complimentary gourmet gift box on all orders above $75! Use code SWEET',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'layout',
                'key' => 'header_announcement_link',
                'value' => '/shop',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'layout',
                'key' => 'footer_about_text',
                'value' => 'StoreHub brings you handcrafted artisan confections, timeless quality essentials, and delight in every box.',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'layout',
                'key' => 'footer_show_newsletter',
                'value' => '1',
                'type' => 'boolean',
                'is_public' => true,
            ],
            [
                'group' => 'layout',
                'key' => 'footer_show_socials',
                'value' => '1',
                'type' => 'boolean',
                'is_public' => true,
            ],
            [
                'group' => 'layout',
                'key' => 'footer_show_payment_methods',
                'value' => '1',
                'type' => 'boolean',
                'is_public' => true,
            ],

            // Maintenance Mode
            [
                'group' => 'system',
                'key' => 'maintenance_mode',
                'value' => '0',
                'type' => 'boolean',
                'is_public' => false,
            ],
            [
                'group' => 'system',
                'key' => 'maintenance_title',
                'value' => 'Crafting Something Special',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'system',
                'key' => 'maintenance_message',
                'value' => 'We are currently performing scheduled maintenance to upgrade your shopping experience. We will be back online shortly!',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'system',
                'key' => 'maintenance_bypass_key',
                'value' => 'storehub-preview-secret',
                'type' => 'string',
                'is_public' => false,
            ],

            // SEO & Analytics
            [
                'group' => 'analytics',
                'key' => 'google_analytics_id',
                'value' => '',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'analytics',
                'key' => 'google_tag_manager_id',
                'value' => '',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'analytics',
                'key' => 'facebook_pixel_id',
                'value' => '',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'analytics',
                'key' => 'meta_keywords',
                'value' => 'handcrafted chocolates, artisan gifts, luxury confections, gourmet food, storehub',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'analytics',
                'key' => 'meta_author',
                'value' => 'StoreHub Atelier',
                'type' => 'string',
                'is_public' => true,
            ],

            // SMTP & Mail
            [
                'group' => 'mail',
                'key' => 'mail_mailer',
                'value' => 'smtp',
                'type' => 'string',
                'is_public' => false,
            ],
            [
                'group' => 'mail',
                'key' => 'mail_host',
                'value' => '127.0.0.1',
                'type' => 'string',
                'is_public' => false,
            ],
            [
                'group' => 'mail',
                'key' => 'mail_port',
                'value' => '2525',
                'type' => 'string',
                'is_public' => false,
            ],
            [
                'group' => 'mail',
                'key' => 'mail_username',
                'value' => '',
                'type' => 'string',
                'is_public' => false,
            ],
            [
                'group' => 'mail',
                'key' => 'mail_password',
                'value' => '',
                'type' => 'string',
                'is_public' => false,
            ],
            [
                'group' => 'mail',
                'key' => 'mail_encryption',
                'value' => 'tls',
                'type' => 'string',
                'is_public' => false,
            ],
            [
                'group' => 'mail',
                'key' => 'mail_from_address',
                'value' => 'hello@storehub.com',
                'type' => 'string',
                'is_public' => false,
            ],
            [
                'group' => 'mail',
                'key' => 'mail_from_name',
                'value' => 'StoreHub Atelier',
                'type' => 'string',
                'is_public' => false,
            ],

            // Custom Code
            [
                'group' => 'custom_code',
                'key' => 'custom_css',
                'value' => '',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'custom_code',
                'key' => 'custom_header_js',
                'value' => '',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'custom_code',
                'key' => 'custom_footer_js',
                'value' => '',
                'type' => 'string',
                'is_public' => true,
            ],

            // Ecommerce Defaults
            [
                'group' => 'ecommerce',
                'key' => 'enable_guest_checkout',
                'value' => '1',
                'type' => 'boolean',
                'is_public' => true,
            ],
            [
                'group' => 'ecommerce',
                'key' => 'minimum_order_amount',
                'value' => '0',
                'type' => 'decimal',
                'is_public' => true,
            ],
            [
                'group' => 'ecommerce',
                'key' => 'order_id_prefix',
                'value' => 'SH-',
                'type' => 'string',
                'is_public' => true,
            ],
            [
                'group' => 'ecommerce',
                'key' => 'products_per_page',
                'value' => '12',
                'type' => 'integer',
                'is_public' => true,
            ],
            [
                'group' => 'ecommerce',
                'key' => 'inventory_low_stock_threshold',
                'value' => '5',
                'type' => 'integer',
                'is_public' => true,
            ],
            [
                'group' => 'ecommerce',
                'key' => 'cookie_consent_enabled',
                'value' => '1',
                'type' => 'boolean',
                'is_public' => true,
            ],
            [
                'group' => 'ecommerce',
                'key' => 'cookie_consent_message',
                'value' => 'We use cookies to deliver a tailored tasting experience and analyze our traffic.',
                'type' => 'string',
                'is_public' => true,
            ],
        ];

        foreach ($settings as $setting) {
            Setting::query()->updateOrCreate(
                ['group' => $setting['group'], 'key' => $setting['key']],
                [
                    'value' => $setting['value'],
                    'type' => $setting['type'],
                    'is_public' => $setting['is_public'],
                ]
            );
        }

        Setting::clearCache();
    }
}
