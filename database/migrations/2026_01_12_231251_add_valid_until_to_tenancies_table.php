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
        Schema::table('tenancies', function (Blueprint $table) {
            $table->date('valid_until')->nullable()->after('status');
            $table->unsignedTinyInteger('paid_for_months')->default(1)->after('valid_until');
        });
    }

    public function down(): void
    {
        Schema::table('tenancies', function (Blueprint $table) {
            $table->dropColumn(['valid_until', 'paid_for_months']);
        });
    }
};
