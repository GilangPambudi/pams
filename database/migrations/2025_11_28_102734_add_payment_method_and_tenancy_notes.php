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
        Schema::table('payments', function (Blueprint $table) {
            $table->enum('payment_type', ['monthly_rent', 'deposit', 'other'])->default('monthly_rent')->change(); // Ensure existing column is correct if needed, but we are adding 'method'
            $table->enum('method', ['cash', 'transfer', 'other'])->default('transfer')->after('amount');
        });

        Schema::table('tenancies', function (Blueprint $table) {
            $table->text('leaving_reason')->nullable()->after('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn('method');
        });

        Schema::table('tenancies', function (Blueprint $table) {
            $table->dropColumn('leaving_reason');
        });
    }
};
