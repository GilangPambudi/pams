<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Tenant;
use App\Models\Property;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TenantValidationTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_tenant_with_minimal_requirements()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('tenants.store'), [
            'full_name' => 'John Doe',
            'gender' => 'male',
            'origin_city' => 'Jakarta',
            'workplace_name' => 'Tech Corp',
            // occupation is omitted (optional)
            // date_of_birth is omitted (optional)
        ]);

        $response->assertRedirect(route('tenants.index'));
        $this->assertDatabaseHas('tenants', [
            'full_name' => 'John Doe',
            'workplace_name' => 'Tech Corp',
        ]);
    }

    public function test_cannot_create_tenant_without_workplace_name()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('tenants.store'), [
            'full_name' => 'John Doe',
            'gender' => 'male',
            'origin_city' => 'Jakarta',
            // workplace_name is omitted (required)
            'occupation' => 'Developer',
        ]);

        $response->assertSessionHasErrors(['workplace_name']);
    }

    public function test_can_create_tenancy_with_minimal_new_tenant_requirements()
    {
        $user = User::factory()->create();
        $property = Property::factory()->create();

        $response = $this->actingAs($user)->post(route('tenancies.store'), [
            // Tenant Data
            'full_name' => 'Jane Doe',
            'gender' => 'female',
            'origin_city' => 'Bandung',
            'workplace_name' => 'Uni Bandung',
            // occupation omitted
            // date_of_birth omitted

            // Tenancy Data
            'property_id' => $property->id,
            'start_date' => '2026-01-01',
            'rent_price' => 1000000,
        ]);

        $response->assertRedirect(route('properties.edit', $property->id));
        $this->assertDatabaseHas('tenants', [
            'full_name' => 'Jane Doe',
            'workplace_name' => 'Uni Bandung',
        ]);
    }
}
