<?php

namespace App\Models;

use Database\Factories\InventoryLevelFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $product_id
 * @property int|null $variant_id
 * @property int $warehouse_id
 * @property int $quantity
 * @property int $reserved_quantity
 * @property int|null $low_stock_threshold
 */
#[Fillable(['product_id', 'variant_id', 'warehouse_id', 'quantity', 'reserved_quantity', 'low_stock_threshold'])]
class InventoryLevel extends Model
{
    /** @use HasFactory<InventoryLevelFactory> */
    use HasFactory;

    /** @return BelongsTo<Product, InventoryLevel> */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /** @return BelongsTo<ProductVariant, InventoryLevel> */
    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }

    /** @return BelongsTo<Warehouse, InventoryLevel> */
    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }
}
