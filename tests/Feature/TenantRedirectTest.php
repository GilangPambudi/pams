<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TenantRedirectTest extends TestCase
{
    use RefreshDatabase;

    public function test_store_tenant_redirects_to_search_page_with_success_message()
    {
        $user = User::factory()->create();
        $tenantData = [
            'full_name' => 'John Wick',
            'gender' => 'male',
            'origin_city' => 'New York',
            'workplace_name' => 'The Continental',
        ];

        $response = $this->actingAs($user)->post(route('tenants.store'), $tenantData);

        // precise URL verification
        $expectedUrl = route('tenants.index', [
            'dir' => 'asc',
            'page' => 1,
            'per_page' => 10,
            'q' => 'John Wick',
            'sort' => 'full_name',
        ]);

        $response->assertRedirect($expectedUrl);
        $response->assertSessionHas('success', 'Tenant created successfully.');
    }
}
