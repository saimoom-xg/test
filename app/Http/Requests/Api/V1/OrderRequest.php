<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'customer_id' => ['nullable', 'integer', 'exists:customers,id'],
            'order_status_id' => ['nullable', 'integer', 'exists:order_statuses,id'],
            'payment_method_id' => ['nullable', 'integer', 'exists:payment_methods,id'],
            'shipping_method_id' => ['nullable', 'integer', 'exists:shipping_methods,id'],
            'currency_id' => ['nullable', 'integer', 'exists:currencies,id'],
            'tax_rate_id' => ['nullable', 'integer', 'exists:tax_rates,id'],
            'customer_email' => ['nullable', 'email'],
            'customer_phone' => ['nullable', 'string', 'max:32'],
            'customer_first_name' => ['nullable', 'string', 'max:80'],
            'customer_last_name' => ['nullable', 'string', 'max:80'],
            'subtotal' => ['required', 'numeric', 'min:0'],
            'discount_total' => ['nullable', 'numeric', 'min:0'],
            'shipping_total' => ['nullable', 'numeric', 'min:0'],
            'tax_total' => ['nullable', 'numeric', 'min:0'],
            'grand_total' => ['required', 'numeric', 'min:0'],
            'payment_status' => ['nullable', Rule::in(['pending', 'paid', 'failed', 'refunded', 'partially_refunded'])],
            'shipping_status' => ['nullable', Rule::in(['pending', 'processing', 'shipped', 'delivered', 'returned'])],
            'currency_code' => ['nullable', 'string', 'size:3'],
            'exchange_rate' => ['nullable', 'numeric'],
            'is_guest' => ['boolean'],
            'notes' => ['nullable', 'string'],
            'placed_at' => ['nullable', 'date'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.variant_id' => ['nullable', 'integer', 'exists:product_variants,id'],
            'items.*.name' => ['required', 'string', 'max:255'],
            'items.*.sku' => ['nullable', 'string', 'max:64'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.unit_price' => ['required', 'numeric', 'min:0'],
            'items.*.tax_total' => ['nullable', 'numeric', 'min:0'],
            'items.*.discount_total' => ['nullable', 'numeric', 'min:0'],
        ];
    }
}
