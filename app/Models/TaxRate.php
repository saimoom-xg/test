<?php

namespace App\Models;

use Database\Factories\TaxRateFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 * @property float $rate
 * @property string|null $country_code
 * @property string|null $region
 * @property bool $is_inclusive
 * @property bool $is_active
 */
#[Fillable(['name', 'rate', 'country_code', 'region', 'is_inclusive', 'is_active'])]
class TaxRate extends Model
{
    /** @use HasFactory<TaxRateFactory> */
    use HasFactory;
}
