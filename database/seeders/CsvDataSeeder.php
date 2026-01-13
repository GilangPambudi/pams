<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\Tenancy;
use App\Models\Tenant;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class CsvDataSeeder extends Seeder
{
    public function run(): void
    {
        $melatiProperty = Property::where('name', 'like', '%Melati%')->first();
        $pinurihProperty = Property::where('name', 'like', '%Pinurih%')->first();

        if ($melatiProperty) {
            $this->seedMelati($melatiProperty);
        }

        if ($pinurihProperty) {
            $this->seedPinurih($pinurihProperty);
        }
    }

    private function seedMelati(Property $property): void
    {
        $data = [
            ['name' => 'Ika Wulan Suciati', 'origin_city' => 'Grati Pasuruan', 'workplace_name' => 'Tirta Fresindo', 'start_date' => '2025-11-24'],
            ['name' => 'Rantika Nabillah', 'origin_city' => 'Jember', 'workplace_name' => 'Kimia Farma', 'start_date' => '2023-11-01'],
            ['name' => 'Dewi Fatmawati', 'origin_city' => 'Malang', 'workplace_name' => 'Pt Sejati', 'start_date' => '2025-11-24'],
            ['name' => 'Fauziah Widha Zuharini', 'origin_city' => 'Malang', 'workplace_name' => 'Bpjs Kesehatan', 'start_date' => '2025-11-24'],
            ['name' => 'Dwi Cahyani', 'origin_city' => 'Blitar', 'workplace_name' => 'Kalbe Farma', 'start_date' => '2025-02-01'],
            ['name' => 'Alifatul Dwi Agustin', 'origin_city' => 'Turen Malang', 'workplace_name' => 'Bpjs Kesehatan', 'start_date' => '2025-11-24'],
            ['name' => 'Indri (Pemkot)', 'origin_city' => 'Surabaya', 'workplace_name' => 'Pemkot', 'start_date' => '2020-08-18'],
        ];

        foreach ($data as $row) {
            $this->createTenantAndTenancy($row, $property);
        }
    }

    private function seedPinurih(Property $property): void
    {
        $data = [
            ['name' => 'Iva', 'origin_city' => 'Probolinggo', 'workplace_name' => null, 'start_date' => null],
            ['name' => 'Irma Subiatul Kibtiah', 'origin_city' => 'Jember', 'workplace_name' => null, 'start_date' => '2025-06-09'],
            ['name' => 'Reski Intan Yuliawati', 'origin_city' => 'Ponorogo', 'workplace_name' => null, 'start_date' => null],
            ['name' => 'Delima Agmara Susilo', 'origin_city' => 'Gempol', 'workplace_name' => null, 'start_date' => '2025-09-10'],
            ['name' => 'Riska', 'origin_city' => 'Sidoarjo', 'workplace_name' => null, 'start_date' => null],
            ['name' => 'Anita Suryawati', 'origin_city' => 'Sidoarjo', 'workplace_name' => null, 'start_date' => null],
            ['name' => 'Sofia Nur Laily', 'origin_city' => 'Probolinggo', 'workplace_name' => null, 'start_date' => '2025-09-29'],
        ];

        foreach ($data as $row) {
            $this->createTenantAndTenancy($row, $property);
        }
    }

    private function createTenantAndTenancy(array $row, Property $property): void
    {
        $startDate = $row['start_date'] ? Carbon::parse($row['start_date']) : now();

        $tenant = Tenant::create([
            'full_name' => $row['name'],
            'gender' => 'female',
            'date_of_birth' => fake()->dateTimeBetween('-35 years', '-18 years'),
            'origin_city' => $row['origin_city'],
            'occupation' => 'employee',
            'workplace_name' => $row['workplace_name'],
            'phone_number' => null,
        ]);

        Tenancy::create([
            'tenant_id' => $tenant->id,
            'property_id' => $property->id,
            'room_number' => null,
            'start_date' => $startDate,
            'rent_price' => $property->standard_monthly_rate,
            'status' => 'active',
            'valid_until' => $startDate->copy()->addMonth(),
            'paid_for_months' => 1,
        ]);
    }
}
