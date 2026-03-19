<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\Tenancy;
use App\Models\Tenant;
use Illuminate\Support\Facades\DB;

class TenancyService
{
    /**
     * Create a new tenancy, optionally creating a tenant and initial payment.
     *
     * @param array $data
     * @return Tenancy
     */
    public function createTenancy(array $data): Tenancy
    {
        return DB::transaction(function () use ($data) {
            // 1. Handle Tenant (Find or Create)
            if (!empty($data['tenant_id'])) {
                $tenant = Tenant::findOrFail($data['tenant_id']);
            } else {
                $tenant = Tenant::create([
                    'full_name' => $data['full_name'],
                    'gender' => $data['gender'],
                    'date_of_birth' => $data['date_of_birth'] ?? null,
                    'origin_city' => $data['origin_city'],
                    'occupation' => $data['occupation'] ?? null,
                    'workplace_name' => $data['workplace_name'] ?? null,
                    'phone_number' => $data['phone_number'] ?? null,
                ]);
            }

            // 2. Create Tenancy
            $paidForMonths = (int) ($data['paid_for_months'] ?? 1);
            $validUntil = null;
            if (isset($data['pay_initial_rent']) && $data['pay_initial_rent'] && ($data['payment_amount'] ?? 0) > 0) {
                $validUntil = \Carbon\Carbon::parse($data['start_date'])->addMonths($paidForMonths);
            }

            $tenancy = Tenancy::create([
                'tenant_id' => $tenant->id,
                'property_id' => $data['property_id'],
                'room_number' => $data['room_number'] ?? null,
                'start_date' => $data['start_date'],
                'rent_price' => $data['rent_price'],
                'status' => 'active',
                'valid_until' => $validUntil,
                'paid_for_months' => $paidForMonths,
            ]);

            // 3. Create Payment (if requested)
            if (isset($data['pay_initial_rent']) && $data['pay_initial_rent'] && ($data['payment_amount'] ?? 0) > 0) {
                $paymentDate = match ($data['initial_payment_date_option'] ?? 'now') {
                    'start_date' => $data['start_date'],
                    default => now(),
                };

                Payment::create([
                    'tenancy_id' => $tenancy->id,
                    'amount' => $data['payment_amount'],
                    'payment_date' => $paymentDate,
                    'payment_type' => 'monthly_rent',
                    'notes' => 'Initial payment upon check-in',
                ]);
            }

            return $tenancy;
        });
    }

    /**
     * Update an existing tenancy.
     *
     * @param Tenancy $tenancy
     * @param array $data
     * @return Tenancy
     */
    public function updateTenancy(Tenancy $tenancy, array $data): Tenancy
    {
        return DB::transaction(function () use ($tenancy, $data) {
            // Determine status based on end_date
            $status = !empty($data['end_date']) ? 'finished' : 'active';

            $tenancy->update([
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'] ?? null,
                'rent_price' => $data['rent_price'],
                'status' => $status,
                'property_id' => $data['property_id'] ?? $tenancy->property_id,
            ]);

            return $tenancy;
        });
    }

    /**
     * Migrate tenancy from CSV data.
     */
    public function migrateTenancy(array $data): Tenancy
    {
        return DB::transaction(function () use ($data) {
            // Find or Create Tenant
            $tenantQuery = Tenant::where('full_name', $data['Nama']);
            if (!empty($data['Nomor HP'])) {
                $tenantQuery->where('phone_number', $data['Nomor HP']);
            }
            $tenant = $tenantQuery->first();

            if (!$tenant) {
                $tenant = Tenant::create([
                    'full_name' => $data['Nama'],
                    'gender' => !empty($data['Gender']) ? $data['Gender'] : 'Laki-laki',
                    'date_of_birth' => !empty($data['Tanggal Lahir']) ? $data['Tanggal Lahir'] : null,
                    'origin_city' => !empty($data['Asal']) ? $data['Asal'] : '-',
                    'occupation' => !empty($data['Pekerjaan']) ? $data['Pekerjaan'] : null,
                    'workplace_name' => !empty($data['Tempat Kerja']) ? $data['Tempat Kerja'] : null,
                    'phone_number' => !empty($data['Nomor HP']) ? $data['Nomor HP'] : null,
                ]);
            }

            $rentPrice = floatval(preg_replace('/[^0-9]/', '', $data['Harga Sewa']));
            $startDate = \Carbon\Carbon::parse($data['Tanggal Mulai']);

            $paidForMonthsStr = trim($data['Periode Pembayaran'] ?? '');
            $paidForMonths = 0;

            if ($paidForMonthsStr !== '') {
                $paidForMonths = (int) $paidForMonthsStr;
            } else {
                $now = now();
                $monthsPassed = $startDate->diffInMonths($now);
                
                $dueDateThisMonth = $startDate->copy()->addMonths($monthsPassed);
                if ($now->greaterThanOrEqualTo($dueDateThisMonth)) {
                    $monthsPassed++;
                }
                
                $paidForMonths = max(1, $monthsPassed);
            }

            $validUntil = $startDate->copy()->addMonths($paidForMonths);

            $tenancy = Tenancy::create([
                'tenant_id' => $tenant->id,
                'property_id' => $data['property_id'],
                'room_number' => null,
                'start_date' => $startDate->toDateString(),
                'rent_price' => $rentPrice,
                'status' => 'active',
                'valid_until' => $validUntil->toDateString(),
                'paid_for_months' => $paidForMonths,
            ]);

            for ($i = 0; $i < $paidForMonths; $i++) {
                $paymentDate = $startDate->copy()->addMonths($i);
                
                Payment::create([
                    'tenancy_id' => $tenancy->id,
                    'amount' => $rentPrice,
                    'payment_date' => $paymentDate->toDateString(),
                    'payment_type' => 'monthly_rent',
                    'notes' => 'Migrasi sistem otomatis: Tagihan bulan ke-' . ($i + 1),
                ]);
            }

            return $tenancy;
        });
    }
}
