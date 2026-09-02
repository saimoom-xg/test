<?php

namespace App\Models;

use Database\Factories\AttributeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property int $id
 * @property string $code
 * @property string $name
 * @property string $type
 * @property bool $is_filterable
 * @property bool $is_required
 * @property int $sort_order
 */
#[Fillable(['code', 'name', 'type', 'is_filterable', 'is_required', 'sort_order'])]
class Attribute extends Model
{
    /** @use HasFactory<AttributeFactory> */
    use HasFactory;

    /** @return HasMany<AttributeOption> */
    public function options(): HasMany
    {
        return $this->hasMany(AttributeOption::class);
    }
}
