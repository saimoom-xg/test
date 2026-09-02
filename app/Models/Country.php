<?php

namespace App\Models;

use Database\Factories\CountryFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $iso2
 * @property string $iso3
 * @property string $name
 * @property string|null $phone_code
 * @property string|null $currency_code
 * @property bool $is_active
 */
#[Fillable(['iso2', 'iso3', 'name', 'phone_code', 'currency_code', 'is_active'])]
class Country extends Model
{
    /** @use HasFactory<CountryFactory> */
    use HasFactory;
}
