<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $customer_id
 * @property int $product_id
 */
#[Fillable(['customer_id', 'product_id'])]
class Wishlist extends Model
{
    use HasFactory;

    /**
     * @return BelongsTo<Customer, Wishlist>
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * @return BelongsTo<Product, Wishlist>
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
