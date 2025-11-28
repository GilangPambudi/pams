<?php

namespace Tests\Feature;

use App\Models\Property;
use App\Models\Tenancy;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TenantSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_search_excludes_active_tenants()
    {
        $user = User::factory()->create();

        // Tenant with active tenancy
        $tenantActive = Tenant::create([
            'full_name' => 'Active Tenant',
            'gender' => 'male',
            'date_of_birth' => '1990-01-01',
            'origin_city' => 'City A',
            'occupation' => 'Worker',
        ]);
        $property = Property::create([
            'name' => 'Test Property',
            'address' => 'Test Address',
            'total_capacity' => 5,
            'standard_monthly_rate' => 1000000,
        ]);
        Tenancy::create([
            'tenant_id' => $tenantActive->id,
            'property_id' => $property->id,
            'start_date' => now(),
            'rent_price' => 1000000,
            'status' => 'active',
        ]);

        // Tenant without active tenancy
        $tenantInactive = Tenant::create([
            'full_name' => 'Inactive Tenant',
            'gender' => 'female',
            'date_of_birth' => '1995-01-01',
            'origin_city' => 'City B',
            'occupation' => 'Student',
        ]);

        // Tenant with past tenancy (finished)
        $tenantPast = Tenant::create([
            'full_name' => 'Past Tenant',
            'gender' => 'male',
            'date_of_birth' => '1980-01-01',
            'origin_city' => 'City C',
            'occupation' => 'Retired',
        ]);
        Tenancy::create([
            'tenant_id' => $tenantPast->id,
            'property_id' => $property->id,
            'start_date' => now()->subYear(),
            'end_date' => now()->subMonth(),
            'rent_price' => 1000000,
            'status' => 'finished',
        ]);

        $response = $this->actingAs($user)->getJson(route('tenants.search', ['query' => 'Tenant']));

        $response->assertStatus(200);
        $response->assertJsonCount(2); // Should find Inactive Tenant and Past Tenant
        $response->assertJsonFragment(['value' => (string) $tenantInactive->id]);
        $response->assertJsonFragment(['value' => (string) $tenantPast->id]);
        $response->assertJsonMissing(['value' => (string) $tenantActive->id]);
    }
}
