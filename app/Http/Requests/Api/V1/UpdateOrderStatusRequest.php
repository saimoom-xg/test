<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateOrderStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'order_status_id' => ['required', 'integer', 'exists:order_statuses,id'],
            'payment_status' => ['nullable', Rule::in(['pending', 'paid', 'failed', 'refunded', 'partially_refunded'])],
            'shipping_status' => ['nullable', Rule::in(['pending', 'processing', 'shipped', 'delivered', 'returned'])],
            'comment' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
