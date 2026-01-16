<?php

namespace App\Http\Requests\Settings;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTenantRequest extends FormRequest
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
            'full_name' => 'required|string|max:255',
            'gender' => 'required|string|in:male,female',
            'date_of_birth' => 'nullable|date',
            'origin_city' => 'required|string|max:255',
            'occupation' => 'required|string|max:255',
            'workplace_name' => 'required|string|max:255',
            'phone_number' => 'nullable|string|max:255',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'full_name' => is_string($this->full_name) ? trim(preg_replace('/\s+/', ' ', $this->full_name)) : $this->full_name,
        ]);
    }
}
