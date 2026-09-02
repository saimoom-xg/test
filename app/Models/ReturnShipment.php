<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReturnShipment extends Model
{
    protected $fillable = [
        'order_return_id',
        'carrier',
        'tracking_number',
        'label_url',
    ];

    public function orderReturn()
    {
        return $this->belongsTo(OrderReturn::class);
    }
}
