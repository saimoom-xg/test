<?php

namespace App\Models;

use Database\Factories\ProductFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property int|null $brand_id
 * @property int|null $product_type_id
 * @property int|null $unit_id
 * @property string $name
 * @property string $slug
 * @property string|null $short_description
 * @property string|null $description
 * @property string $sku
 * @property string|null $barcode
 * @property float $price
 * @property float|null $sale_price
 * @property Carbon|null $sale_starts_at
 * @property Carbon|null $sale_ends_at
 * @property float|null $cost_price
 * @property string $tax_class
 * @property bool $track_inventory
 * @property int $stock_quantity
 * @property int $reserved_quantity
 * @property int $low_stock_threshold
 * @property bool $manage_stock
 * @property string $stock_status
 * @property float|null $weight
 * @property float|null $length
 * @property float|null $width
 * @property float|null $height
 * @property bool $is_active
 * @property bool $is_featured
 * @property string $status
 */
#[Fillable([
    'brand_id', 'product_type_id', 'unit_id', 'name', 'slug', 'short_description', 'description',
    'sku', 'barcode', 'price', 'sale_price', 'sale_starts_at', 'sale_ends_at', 'cost_price',
    'tax_class', 'track_inventory', 'stock_quantity', 'reserved_quantity', 'low_stock_threshold',
    'manage_stock', 'stock_status', 'weight', 'length', 'width', 'height',
    'is_active', 'is_featured', 'status', 'meta_title', 'meta_description',
])]
class Product extends Model
{
    /** @use HasFactory<ProductFactory> */
    use HasFactory, SoftDeletes;

    protected static function booted(): void
    {
        static::saving(function (Product $product): void {
            if (empty($product->slug)) {
                $product->slug = Str::slug($product->name);
            }
        });
    }

    /** @return BelongsTo<Brand, Product> */
    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    /** @return BelongsTo<ProductType, Product> */
    public function productType(): BelongsTo
    {
        return $this->belongsTo(ProductType::class);
    }

    /** @return BelongsTo<Unit, Product> */
    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    /** @return BelongsToMany<Category> */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }

    /** @return HasMany<ProductImage> */
    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    /** @return HasMany<ProductVariant> */
    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function getAvailableQuantityAttribute(): int
    {
        return max(0, $this->stock_quantity - $this->reserved_quantity);
    }

    public function getIsLowStockAttribute(): bool
    {
        return $this->manage_stock && $this->available_quantity <= $this->low_stock_threshold;
    }

    public function getCurrentPriceAttribute(): float
    {
        if ($this->sale_price !== null) {
            $now = now();
            $starts = $this->sale_starts_at;
            $ends = $this->sale_ends_at;

            $isStarted = $starts === null || $now->greaterThanOrEqualTo($starts);
            $isEnded = $ends !== null && $now->greaterThan($ends);

            if ($isStarted && ! $isEnded) {
                return (float) $this->sale_price;
            }
        }

        return (float) $this->price;
    }
}
