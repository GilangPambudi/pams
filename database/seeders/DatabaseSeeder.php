<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Property;
use App\Models\Tenant;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'gilangpambudiwibawanto@gmail.com'],
            [
                'name' => 'Gilang',
                'password' => 'gilangpambudiwibawanto@gmail.com',
                'email_verified_at' => now(),
            ]
        );
        
        $this->call([
            PropertySeeder::class,
            CsvDataSeeder::class,
        ]);

    }
}
