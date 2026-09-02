<?php

namespace App\Services;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ActivityLogger
{
    public function log(?User $user, string $action, ?Model $subject = null, array $properties = [], ?string $ip = null, ?string $userAgent = null): ActivityLog
    {
        return ActivityLog::create([
            'user_id' => $user?->id,
            'action' => $action,
            'subject_type' => $subject ? Str::of($subject::class)->afterLast('\\')->toString() : null,
            'subject_id' => $subject?->getKey(),
            'ip_address' => $ip,
            'user_agent' => $userAgent,
            'properties' => $properties,
        ]);
    }
}
