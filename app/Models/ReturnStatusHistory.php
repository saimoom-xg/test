<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReturnStatusHistory extends Model
{
    protected $fillable = [
        'order_return_id',
        'user_id',
        'status',
        'notes',
    ];

    public function orderReturn()
    {
        return $this->belongsTo(OrderReturn::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
