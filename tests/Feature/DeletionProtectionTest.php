<?php

namespace Tests\Feature;

use App\Models\Property;
use App\Models\Tenancy;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeletionProtectionTest extends TestCase
{
    use RefreshDatabase;

    public function test_cannot_delete_property_with_active_tenancy()
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
        Tenancy::create([
            'tenant_id' => $tenant->id,
            'property_id' => $property->id,
            'start_date' => now(),
            'rent_price' => 1000000,
            'status' => 'active',
        ]);

        $response = $this->actingAs($user)->delete(route('properties.destroy', $property));

        $response->assertRedirect();
        $response->assertSessionHas('error', 'Cannot delete property with active tenants.');
        $this->assertDatabaseHas('properties', ['id' => $property->id]);
    }

    public function test_can_delete_property_with_finished_tenancy()
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
        Tenancy::create([
            'tenant_id' => $tenant->id,
            'property_id' => $property->id,
            'start_date' => now()->subYear(),
            'end_date' => now()->subMonth(),
            'rent_price' => 1000000,
            'status' => 'finished',
        ]);

        $response = $this->actingAs($user)->delete(route('properties.destroy', $property));

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Property deleted successfully.');
        $this->assertSoftDeleted('properties', ['id' => $property->id]);
    }

    public function test_cannot_delete_tenant_with_active_tenancy()
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
        Tenancy::create([
            'tenant_id' => $tenant->id,
            'property_id' => $property->id,
            'start_date' => now(),
            'rent_price' => 1000000,
            'status' => 'active',
        ]);

        $response = $this->actingAs($user)->delete(route('tenants.destroy', $tenant));

        $response->assertRedirect();
        $response->assertSessionHas('error', 'Cannot delete tenant with active tenancy.');
        $this->assertDatabaseHas('tenants', ['id' => $tenant->id]);
    }

    public function test_can_delete_tenant_with_finished_tenancy()
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
        Tenancy::create([
            'tenant_id' => $tenant->id,
            'property_id' => $property->id,
            'start_date' => now()->subYear(),
            'end_date' => now()->subMonth(),
            'rent_price' => 1000000,
            'status' => 'finished',
        ]);

        $response = $this->actingAs($user)->delete(route('tenants.destroy', $tenant));

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Tenant deleted successfully.');
        $this->assertDatabaseMissing('tenants', ['id' => $tenant->id]);
    }
}
