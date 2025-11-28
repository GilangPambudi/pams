<?php

namespace App\Http\Requests\Settings;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTenancyRequest extends FormRequest
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
            'tenant_id' => 'sometimes|exists:tenants,id',
            'property_id' => 'sometimes|exists:properties,id',
            'room_number' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'rent_price' => 'required|numeric',
            'status' => 'nullable|string|in:active,finished,cancelled',
            'leaving_reason' => 'nullable|string',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'room_number' => is_string($this->room_number) ? trim(preg_replace('/\s+/', ' ', $this->room_number)) : $this->room_number,
        ]);
    }
}
