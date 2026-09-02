<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Propaganistas\LaravelPhone\Rules\Phone;

class CustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        $customerId = $this->route('customer')?->id;

        return [
            'first_name' => ['nullable', 'string', 'max:80'],
            'last_name' => ['nullable', 'string', 'max:80'],
            'email' => ['nullable', 'email', 'max:191', Rule::unique('customers', 'email')->ignore($customerId)],
            'phone' => ['nullable', 'string', (new Phone)->international()],
            'phone_country' => ['nullable', 'string', 'size:2'],
            'is_guest' => ['boolean'],
            'is_active' => ['boolean'],
            'accepts_marketing' => ['boolean'],
        ];
    }
}
