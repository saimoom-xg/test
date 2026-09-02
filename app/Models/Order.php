<?php

namespace App\Models;

use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $number
 * @property int|null $customer_id
 * @property string|null $customer_email
 * @property float $subtotal
 * @property float $grand_total
 * @property string $payment_status
 * @property string $shipping_status
 */
#[Fillable([
    'number', 'customer_id', 'order_status_id', 'payment_method_id', 'shipping_method_id',
    'currency_id', 'tax_rate_id', 'shipping_address_id', 'billing_address_id',
    'customer_email', 'customer_phone', 'customer_first_name', 'customer_last_name',
    'subtotal', 'discount_total', 'shipping_total', 'tax_total', 'grand_total',
    'payment_status', 'shipping_status', 'refunded_amount', 'cancelled_amount',
    'is_guest', 'currency_code', 'exchange_rate', 'notes',
    'shipping_address_snapshot', 'billing_address_snapshot', 'placed_at',
])]
class Order extends Model
{
    /** @use HasFactory<OrderFactory> */
    use HasFactory, SoftDeletes;

    protected static function booted(): void
    {
        static::creating(function (Order $order): void {
            if (empty($order->number)) {
                $order->number = 'ORD-'.strtoupper(Str::random(10));
            }
        });
    }

    protected function casts(): array
    {
        return [
            'shipping_address_snapshot' => 'array',
            'billing_address_snapshot' => 'array',
            'placed_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<Customer, Order> */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /** @return BelongsTo<OrderStatus, Order> */
    public function status(): BelongsTo
    {
        return $this->belongsTo(OrderStatus::class, 'order_status_id');
    }

    /** @return BelongsTo<PaymentMethod, Order> */
    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    /** @return BelongsTo<ShippingMethod, Order> */
    public function shippingMethod(): BelongsTo
    {
        return $this->belongsTo(ShippingMethod::class);
    }

    /** @return BelongsTo<Currency, Order> */
    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }

    /** @return BelongsTo<TaxRate, Order> */
    public function taxRate(): BelongsTo
    {
        return $this->belongsTo(TaxRate::class);
    }

    /** @return BelongsTo<CustomerAddress, Order> */
    public function shippingAddress(): BelongsTo
    {
        return $this->belongsTo(CustomerAddress::class, 'shipping_address_id');
    }

    /** @return BelongsTo<CustomerAddress, Order> */
    public function billingAddress(): BelongsTo
    {
        return $this->belongsTo(CustomerAddress::class, 'billing_address_id');
    }

    /** @return HasMany<OrderItem> */
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    /** @return HasMany<OrderStatusHistory> */
    public function statusHistories(): HasMany
    {
        return $this->hasMany(OrderStatusHistory::class);
    }
}
