<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tenants', function (Blueprint $table) {
            $table->id()->comment('ID unik untuk setiap penghuni.');
            $table->string('full_name')->comment('Nama lengkap.');
            $table->string('gender')->comment('Jenis kelamin.');
            $table->date('date_of_birth')->nullable()->comment('Kunci untuk analisis usia.');
            $table->string('origin_city')->comment('Kota asal untuk analisis demografi.');
            $table->string('occupation')->comment('Status/Jenis Pekerjaan.');
            $table->string('workplace_name')->nullable()->comment('Tempat kerja/kampus.');
            $table->string('phone_number')->nullable()->comment('Nomor kontak.');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tenants');
    }
};
