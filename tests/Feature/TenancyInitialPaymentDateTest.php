<?php

namespace Tests\Feature;

use App\Models\Payment;
use App\Models\Property;
use App\Models\Tenancy;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TenancyInitialPaymentDateTest extends TestCase
{
    use RefreshDatabase;

    public function test_initial_payment_date_is_now_by_default()
    {
        $user = User::factory()->create();
        $property = Property::create([
            'name' => 'Kos A', 
            'standard_monthly_rate' => 1000000,
            'address' => 'Test Address A',
            'total_capacity' => 10
        ]);
        $tenant = Tenant::create([
             'full_name' => 'John Doe',
             'gender' => 'male',
             'origin_city' => 'Jakarta',
             'workplace_name' => 'Office',
        ]);

        $response = $this->actingAs($user)->post(route('tenancies.store'), [
            'tenant_id' => $tenant->id,
            'property_id' => $property->id,
            'start_date' => now()->subDays(7)->format('Y-m-d'), // Started last week
            'rent_price' => 1000000,
            'pay_initial_rent' => true,
            'initial_payment_date_option' => 'now',
            'paid_for_months' => 1,
            'payment_amount' => 1000000,
        ]);

        $response->assertSessionHasNoErrors();
        
        $payment = Payment::latest()->first();
        $this->assertTrue($payment->payment_date->isToday());
    }

    public function test_initial_payment_date_can_be_set_to_start_date()
    {
        $user = User::factory()->create();
        $property = Property::create([
            'name' => 'Kos B', 
            'standard_monthly_rate' => 1000000,
            'address' => 'Test Address B',
            'total_capacity' => 10
        ]);
        $tenant = Tenant::create([
             'full_name' => 'Jane Doe',
             'gender' => 'female',
             'origin_city' => 'Bandung',
             'workplace_name' => 'Studio',
        ]);

        $startDate = now()->subDays(10);

        $response = $this->actingAs($user)->post(route('tenancies.store'), [
            'tenant_id' => $tenant->id,
            'property_id' => $property->id,
            'start_date' => $startDate->format('Y-m-d'),
            'rent_price' => 1000000,
            'pay_initial_rent' => true,
            'initial_payment_date_option' => 'start_date',
            'paid_for_months' => 1,
            'payment_amount' => 1000000,
        ]);

        $response->assertSessionHasNoErrors();
        
        $payment = Payment::latest()->first();
        $this->assertTrue($payment->payment_date->isSameDay($startDate));
    }
}
