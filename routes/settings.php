<?php

use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Web\Auth\OtpLoginController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function (): void {
    Route::get('login', function () {
        return inertia('auth/login', [
            'otp' => session('otp'),
        ]);
    })->name('login');
    Route::post('login/otp/request', [OtpLoginController::class, 'requestOtp'])->name('web.auth.otp.request');
    Route::post('login/otp/verify', [OtpLoginController::class, 'verifyOtp'])->name('web.auth.otp.verify');
});

Route::post('logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();

    return redirect('/');
})->name('logout');

Route::middleware(['auth'])->group(function (): void {
    Route::get('settings', function () {
        if (auth()->user()?->hasRole('admin')) {
            return redirect()->route('admin.settings.index');
        }

        return redirect()->route('profile.edit');
    })->name('settings');
    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::inertia('settings/appearance', 'settings/appearance')->name('appearance.edit');
});
