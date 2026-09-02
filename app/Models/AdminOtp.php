<?php

namespace App\Models;

use Database\Factories\AdminOtpFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int|null $user_id
 * @property string $identifier
 * @property string $channel
 * @property string $code_hash
 * @property Carbon $expires_at
 * @property Carbon|null $consumed_at
 * @property int $attempts
 * @property int $max_attempts
 * @property string|null $ip_address
 */
#[Fillable(['user_id', 'identifier', 'channel', 'code_hash', 'expires_at', 'consumed_at', 'attempts', 'max_attempts', 'ip_address', 'user_agent'])]
class AdminOtp extends Model
{
    /** @use HasFactory<AdminOtpFactory> */
    use HasFactory;

    protected function casts(): array
    {
        return [
            'expires_at' => 'datetime',
            'consumed_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<User, AdminOtp> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function isExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    public function isExhausted(): bool
    {
        return $this->attempts >= $this->max_attempts;
    }

    public function isUsable(): bool
    {
        return ! $this->isExpired() && ! $this->isExhausted() && $this->consumed_at === null;
    }
}
