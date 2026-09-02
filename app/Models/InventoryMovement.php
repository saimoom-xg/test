<?php

namespace App\Models;

use Database\Factories\InventoryMovementFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * @property int $id
 * @property int $product_id
 * @property int|null $variant_id
 * @property int $warehouse_id
 * @property string $type
 * @property int $quantity
 * @property int|null $before_quantity
 * @property int|null $after_quantity
 * @property string|null $reason
 * @property string|null $reference_type
 * @property int|null $reference_id
 * @property int|null $user_id
 * @property string|null $notes
 */
#[Fillable(['product_id', 'variant_id', 'warehouse_id', 'type', 'quantity', 'before_quantity', 'after_quantity', 'reason', 'reference_type', 'reference_id', 'user_id', 'notes'])]
class InventoryMovement extends Model
{
    /** @use HasFactory<InventoryMovementFactory> */
    use HasFactory;

    /** @return BelongsTo<Product, InventoryMovement> */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    /** @return BelongsTo<ProductVariant, InventoryMovement> */
    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }

    /** @return BelongsTo<Warehouse, InventoryMovement> */
    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    /** @return BelongsTo<User, InventoryMovement> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return MorphTo<Model, InventoryMovement> */
    public function reference(): MorphTo
    {
        return $this->morphTo();
    }
}
