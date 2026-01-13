<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\TenantController;
use App\Http\Controllers\TenancyController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\UserController;

Route::get('/register', function () {
    abort(403);
});

Route::post('/register', function () {
    abort(403);
});

Route::get('/', function () {
    return redirect('/login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::resource('properties', PropertyController::class);
    Route::get('tenants/search', [TenantController::class, 'search'])->name('tenants.search');
    Route::resource('tenants', TenantController::class);
    Route::get('tenancies/search', [TenancyController::class, 'search'])->name('tenancies.search');
    Route::resource('tenancies', TenancyController::class);
    Route::resource('payments', PaymentController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('users', UserController::class);
});

require __DIR__.'/settings.php';
