<?php

namespace Tests\Feature;

use App\Models\Property;
use App\Models\Tenancy;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DeletionUXTest extends TestCase
{
    use RefreshDatabase;

    public function test_property_edit_passes_can_delete_prop()
    {
        $user = User::factory()->create();
        $property = Property::create([
            'name' => 'Test Property',
            'address' => 'Test Address',
            'total_capacity' => 5,
            'standard_monthly_rate' => 1000000,
        ]);

        // Case 1: No active tenants -> can_delete should be true
        $response = $this->actingAs($user)->get(route('properties.edit', $property));
        $response->assertInertia(fn (Assert $page) => $page
            ->component('properties/edit')
            ->where('can_delete', true)
        );

        // Case 2: Active tenants -> can_delete should be false
        $tenant = Tenant::create([
            'full_name' => 'Test Tenant',
            'gender' => 'male',
            'date_of_birth' => '1990-01-01',
            'origin_city' => 'City A',
            'occupation' => 'Worker',
        ]);
        Tenancy::create([
            'tenant_id' => $tenant->id,
            'property_id' => $property->id,
            'start_date' => now(),
            'rent_price' => 1000000,
            'status' => 'active',
        ]);

        $response = $this->actingAs($user)->get(route('properties.edit', $property));
        $response->assertInertia(fn (Assert $page) => $page
            ->component('properties/edit')
            ->where('can_delete', false)
        );
    }

    public function test_tenant_edit_passes_can_delete_prop()
    {
        $user = User::factory()->create();
        $property = Property::create([
            'name' => 'Test Property',
            'address' => 'Test Address',
            'total_capacity' => 5,
            'standard_monthly_rate' => 1000000,
        ]);
        $tenant = Tenant::create([
            'full_name' => 'Test Tenant',
            'gender' => 'male',
            'date_of_birth' => '1990-01-01',
            'origin_city' => 'City A',
            'occupation' => 'Worker',
        ]);

        // Case 1: No active tenancy -> can_delete should be true
        $response = $this->actingAs($user)->get(route('tenants.edit', $tenant));
        $response->assertInertia(fn (Assert $page) => $page
            ->component('tenants/edit')
            ->where('can_delete', true)
        );

        // Case 2: Active tenancy -> can_delete should be false
        Tenancy::create([
            'tenant_id' => $tenant->id,
            'property_id' => $property->id,
            'start_date' => now(),
            'rent_price' => 1000000,
            'status' => 'active',
        ]);

        $response = $this->actingAs($user)->get(route('tenants.edit', $tenant));
        $response->assertInertia(fn (Assert $page) => $page
            ->component('tenants/edit')
            ->where('can_delete', false)
        );
    }
}
