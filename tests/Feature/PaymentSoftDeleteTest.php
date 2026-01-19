<?php

namespace Tests\Feature;

use App\Models\Payment;
use App\Models\Property;
use App\Models\Tenancy;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentSoftDeleteTest extends TestCase
{
    use RefreshDatabase;

    public function test_payment_can_be_soft_deleted()
    {
        $user = User::factory()->create();
        
        $tenant = Tenant::create([
             'full_name' => 'John Doe',
             'gender' => 'male',
             'origin_city' => 'Jakarta',
             'workplace_name' => 'Office',
        ]);
        
        $property = Property::create([
             'name' => 'Kost A',
             'address' => 'Street A',
             'total_capacity' => 10,
             'standard_monthly_rate' => 1000000,
        ]);
        
        $tenancy = Tenancy::create([
             'tenant_id' => $tenant->id,
             'property_id' => $property->id,
             'start_date' => now(),
             'rent_price' => 1000000,
             'status' => 'active',
        ]);

        $payment = Payment::create([
            'tenancy_id' => $tenancy->id,
            'amount' => 1000000,
            'payment_date' => now(),
            'payment_type' => 'monthly_rent',
        ]);

        $response = $this->actingAs($user)->delete(route('payments.destroy', $payment->id));

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Payment voided successfully.');
        
        $this->assertSoftDeleted('payments', [
            'id' => $payment->id,
        ]);
    }
}
