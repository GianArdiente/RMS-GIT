<?php

use App\Http\Controllers\Auth\LoginController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Authentication Routes  —  Auth Module
|--------------------------------------------------------------------------
|
| These routes handle login / logout only.
| Registration is intentionally excluded; accounts are created by an Admin.
|
*/

// ── Guest-only routes (redirect to dashboard if already authenticated) ──
Route::middleware('guest')->group(function () {

    Route::get('login', [LoginController::class, 'showLoginForm'])
         ->name('login');

    Route::post('login', [LoginController::class, 'login']);

});

// ── Authenticated routes ──
Route::middleware('auth')->group(function () {

    Route::post('logout', [LoginController::class, 'logout'])
         ->name('logout');

});


/*
|--------------------------------------------------------------------------
| Role-Specific Dashboard Stubs
|--------------------------------------------------------------------------
|
| These are placeholder routes for each role's dashboard.
| Replace the closures with your real dashboard controllers once built.
|
*/

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', fn () => view('admin.dashboard'))->name('dashboard');
});

Route::middleware(['auth', 'role:technician'])->prefix('technician')->name('technician.')->group(function () {
    Route::get('dashboard', fn () => view('technician.dashboard'))->name('dashboard');
});

Route::middleware(['auth', 'role:staff'])->prefix('staff')->name('staff.')->group(function () {
    Route::get('dashboard', fn () => view('staff.dashboard'))->name('dashboard');
});