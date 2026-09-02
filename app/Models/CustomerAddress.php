<?php

namespace App\Models;

use Database\Factories\CustomerAddressFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $customer_id
 * @property string $type
 * @property string $address_line1
 * @property string $city
 * @property string $country_code
 * @property bool $is_default
 */
#[Fillable(['customer_id', 'type', 'first_name', 'last_name', 'company', 'phone', 'address_line1', 'address_line2', 'city', 'state', 'postal_code', 'country_code', 'is_default'])]
class CustomerAddress extends Model
{
    /** @use HasFactory<CustomerAddressFactory> */
    use HasFactory;

    /** @return BelongsTo<Customer, CustomerAddress> */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}
