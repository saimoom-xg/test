<?php

use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Web\Auth\OtpLoginController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function (): void {
    Route::inertia('login', 'auth/login')->name('login');
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
    Route::redirect('settings', '/settings/profile');
    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::inertia('settings/appearance', 'settings/appearance')->name('appearance.edit');
});
