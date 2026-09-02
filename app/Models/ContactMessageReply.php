<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactMessageReply extends Model
{
    protected $fillable = [
        'contact_message_id',
        'user_id',
        'message',
    ];

    public function message()
    {
        return $this->belongsTo(ContactMessage::class, 'contact_message_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
