<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Property;

class PropertySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $properties = [
            [
                'name' => 'Kos Putri Pinurih',
                'address' => 'Jalan Dokter Wahidin Sudirohusodo, Gang Manggis I Nomor 2',
                'total_capacity' => 7,
                'standard_monthly_rate' => 600000,
            ],
            [
                'name' => 'Kos Putri Melati',
                'address' => 'Jalan Dokter Wahidin Sudirohusodo, Gang Manggis Raya Belakang',
                'total_capacity' => 9,
                'standard_monthly_rate' => 450000,
            ],
            
        ];

        foreach ($properties as $property) {
            Property::create($property);
        }
    }
}
