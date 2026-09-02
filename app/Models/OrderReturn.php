<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderReturn extends Model
{
    protected $fillable = [
        'order_id',
        'customer_id',
        'status',
        'reason',
        'resolution',
        'return_amount',
        'admin_notes',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function shipments()
    {
        return $this->hasMany(ReturnShipment::class);
    }

    public function statusHistories()
    {
        return $this->hasMany(ReturnStatusHistory::class);
    }
}
