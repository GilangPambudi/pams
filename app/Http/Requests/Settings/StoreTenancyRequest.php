<?php

namespace App\Http\Requests\Settings;

use App\Models\Tenancy;
use Illuminate\Foundation\Http\FormRequest;

class StoreTenancyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Tenant Data (if creating new)
            'tenant_id' => [
                'nullable', 
                'exists:tenants,id',
                function ($attribute, $value, $fail) {
                    if ($value) {
                        $hasActiveTenancy = Tenancy::where('tenant_id', $value)
                            ->where('status', 'active')
                            ->exists();
                        
                        if ($hasActiveTenancy) {
                            $fail('This tenant already has an active tenancy.');
                        }
                    }
                },
            ],
            'full_name' => ['required_without:tenant_id', 'nullable', 'string', 'max:255'],
            'gender' => ['required_without:tenant_id', 'nullable', 'string', 'in:male,female'],
            'date_of_birth' => ['nullable', 'date'],
            'origin_city' => ['required_without:tenant_id', 'nullable', 'string', 'max:255'],
            'occupation' => ['nullable', 'string', 'max:255'],
            'workplace_name' => ['required_without:tenant_id', 'nullable', 'string', 'max:255'],
            'phone_number' => ['nullable', 'string', 'max:20'],

            // Tenancy Data
            'property_id' => ['required', 'exists:properties,id'],
            'room_number' => ['nullable', 'string', 'max:50'],
            'start_date' => ['required', 'date'],
            'rent_price' => ['required', 'numeric', 'min:0'],

            // Payment Data (Optional)
            'pay_initial_rent' => ['boolean'],
            'initial_payment_date_option' => ['nullable', 'string', 'in:now,start_date'],
            'paid_for_months' => ['required_if:pay_initial_rent,true', 'integer', 'min:1', 'max:12'],
            'payment_amount' => ['required_if:pay_initial_rent,true', 'numeric', 'min:0'],
        ];
    }
}
