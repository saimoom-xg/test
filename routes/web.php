<?php

use App\Http\Controllers\User\DashboardController;
use App\Http\Controllers\Web\LandingPageController;
use Illuminate\Support\Facades\Route;

Route::get('/', LandingPageController::class)->name('home');

Route::get('/dashboard', function () {
    if (auth()->check()) {
        if (auth()->user()->hasRole('admin')) {
            return redirect()->route('admin.dashboard');
        }

        // Everyone else goes to the user panel
        return redirect()->route('user.dashboard');
    }

    return redirect()->route('login');
})->name('dashboard');

Route::middleware(['auth'])->prefix('user')->name('user.')->group(function (): void {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

require __DIR__.'/settings.php';
