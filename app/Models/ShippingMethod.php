<?php

namespace App\Models;

use Database\Factories\ShippingMethodFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $code
 * @property string $name
 * @property string|null $description
 * @property float|null $flat_rate
 * @property bool $is_active
 * @property array|null $config
 */
#[Fillable(['code', 'name', 'description', 'flat_rate', 'is_active', 'config'])]
#[Hidden(['config'])]
class ShippingMethod extends Model
{
    /** @use HasFactory<ShippingMethodFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'config' => 'array',
            'flat_rate' => 'decimal:4',
            'is_active' => 'boolean',
        ];
    }
}
