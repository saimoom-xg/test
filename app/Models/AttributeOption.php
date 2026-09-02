<?php

namespace App\Models;

use Database\Factories\AttributeOptionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int $attribute_id
 * @property string $value
 * @property string $slug
 * @property int $sort_order
 */
#[Fillable(['attribute_id', 'value', 'slug', 'sort_order'])]
class AttributeOption extends Model
{
    /** @use HasFactory<AttributeOptionFactory> */
    use HasFactory;

    protected static function booted(): void
    {
        static::saving(function (AttributeOption $option): void {
            if (empty($option->slug)) {
                $option->slug = Str::slug($option->value);
            }
        });
    }

    /** @return BelongsTo<Attribute, AttributeOption> */
    public function attribute(): BelongsTo
    {
        return $this->belongsTo(Attribute::class);
    }
}
