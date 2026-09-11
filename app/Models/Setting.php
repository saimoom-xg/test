<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['group', 'key', 'value', 'type', 'is_public'])]
class Setting extends Model
{
    public const CACHE_KEY_ALL = 'site_settings_all';

    public const CACHE_KEY_PUBLIC = 'site_settings_public';

    protected function casts(): array
    {
        return [
            'is_public' => 'boolean',
        ];
    }

    /**
     * Get a setting value by group and key (legacy compatibility).
     */
    public static function getValue(string $group, string $key, mixed $default = null): mixed
    {
        $all = static::getAllKeyed();
        $fullKey = "{$group}.{$key}";

        if (array_key_exists($fullKey, $all)) {
            return $all[$fullKey];
        }

        if (array_key_exists($key, $all)) {
            return $all[$key];
        }

        return $default;
    }

    /**
     * Get a setting by dot-notation key (e.g., 'general.site_title' or 'site_title').
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        $all = static::getAllKeyed();

        if (array_key_exists($key, $all)) {
            return $all[$key];
        }

        if (! str_contains($key, '.')) {
            foreach ($all as $k => $v) {
                if (str_ends_with($k, ".{$key}")) {
                    return $v;
                }
            }
        }

        return $default;
    }

    public static array $booleanKeys = [
        'header_announcement_enabled',
        'footer_show_newsletter',
        'footer_show_socials',
        'footer_show_payment_methods',
        'maintenance_mode',
        'enable_guest_checkout',
        'cookie_consent_enabled',
    ];

    /**
     * Set a single setting.
     */
    public static function set(string $group, string $key, mixed $value, string $type = 'string', bool $isPublic = false): static
    {
        $isBool = $type === 'boolean'
            || in_array($key, self::$booleanKeys, true)
            || str_ends_with($key, '_enabled')
            || str_ends_with($key, '_mode')
            || str_starts_with($key, 'is_');

        if ($isBool) {
            $type = 'boolean';
            $storedValue = filter_var($value, FILTER_VALIDATE_BOOLEAN) ? '1' : '0';
        } else {
            $storedValue = match ($type) {
                'json', 'array' => is_string($value) ? $value : json_encode($value),
                default => is_null($value) ? null : (string) $value,
            };
        }

        $setting = static::query()->updateOrCreate(
            ['group' => $group, 'key' => $key],
            [
                'value' => $storedValue,
                'type' => $type,
                'is_public' => $isPublic,
            ]
        );

        static::clearCache();

        return $setting;
    }

    /**
     * Bulk save settings.
     *
     * @param  array<string, mixed>  $settings
     */
    public static function setMany(array $settings, ?string $defaultGroup = 'general'): void
    {
        foreach ($settings as $key => $value) {
            $group = $defaultGroup;
            $settingKey = $key;

            if (str_contains($key, '.')) {
                [$group, $settingKey] = explode('.', $key, 2);
            }

            $existing = static::query()
                ->where('group', $group)
                ->where('key', $settingKey)
                ->first();

            $isBool = in_array($settingKey, self::$booleanKeys, true)
                || str_ends_with($settingKey, '_enabled')
                || str_ends_with($settingKey, '_mode')
                || str_starts_with($settingKey, 'is_')
                || is_bool($value);

            if ($isBool) {
                $type = 'boolean';
            } elseif ($existing && $existing->type !== 'boolean') {
                $type = $existing->type;
            } elseif (is_int($value)) {
                $type = 'integer';
            } elseif (is_float($value)) {
                $type = 'decimal';
            } elseif (is_array($value)) {
                $type = 'json';
            } else {
                $type = 'string';
            }

            $isPublic = $existing ? $existing->is_public : true;

            static::set($group, $settingKey, $value, $type, $isPublic);
        }

        static::clearCache();
    }

    /**
     * Get all settings flattened as key => cast_value.
     *
     * @return array<string, mixed>
     */
    public static function getAllKeyed(): array
    {
        return \Illuminate\Support\Facades\Cache::rememberForever(self::CACHE_KEY_ALL, function (): array {
            $settings = static::query()->get();
            $result = [];

            foreach ($settings as $setting) {
                $isBool = $setting->type === 'boolean'
                    || in_array($setting->key, self::$booleanKeys, true)
                    || str_ends_with($setting->key, '_enabled')
                    || str_ends_with($setting->key, '_mode')
                    || str_starts_with($setting->key, 'is_');

                $type = $isBool ? 'boolean' : $setting->type;
                $result["{$setting->group}.{$setting->key}"] = static::castValue($setting->value, $type);
            }

            return $result;
        });
    }

    /**
     * Get all settings grouped by their group name.
     *
     * @return array<string, array<string, mixed>>
     */
    public static function getAllGrouped(): array
    {
        $all = static::getAllKeyed();
        $grouped = [];

        foreach ($all as $dotKey => $value) {
            [$group, $key] = explode('.', $dotKey, 2);
            $grouped[$group][$key] = $value;
        }

        return $grouped;
    }

    /**
     * Get only public settings for frontend consumption.
     *
     * @return array<string, mixed>
     */
    public static function getPublicSettings(): array
    {
        return \Illuminate\Support\Facades\Cache::rememberForever(self::CACHE_KEY_PUBLIC, function (): array {
            $settings = static::query()->where('is_public', true)->get();
            $result = [];

            foreach ($settings as $setting) {
                $isBool = $setting->type === 'boolean'
                    || in_array($setting->key, self::$booleanKeys, true)
                    || str_ends_with($setting->key, '_enabled')
                    || str_ends_with($setting->key, '_mode')
                    || str_starts_with($setting->key, 'is_');

                $type = $isBool ? 'boolean' : $setting->type;
                $castVal = static::castValue($setting->value, $type);
                $result[$setting->key] = $castVal;
                $result["{$setting->group}.{$setting->key}"] = $castVal;
            }

            return $result;
        });
    }

    /**
     * Clear the settings cache.
     */
    public static function clearCache(): void
    {
        \Illuminate\Support\Facades\Cache::forget(self::CACHE_KEY_ALL);
        \Illuminate\Support\Facades\Cache::forget(self::CACHE_KEY_PUBLIC);
    }

    /**
     * Cast raw string value to its proper PHP type.
     */
    public static function castValue(?string $value, string $type): mixed
    {
        if (is_null($value)) {
            return null;
        }

        return match ($type) {
            'boolean' => filter_var($value, FILTER_VALIDATE_BOOLEAN),
            'integer' => (int) $value,
            'decimal' => (float) $value,
            'json', 'array' => json_decode($value, true),
            default => $value,
        };
    }
}
