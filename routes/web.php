<?php

use App\Http\Controllers\User\DashboardController;
use App\Http\Controllers\User\WishlistController;
use App\Http\Controllers\Web\CartController;
use App\Http\Controllers\Web\CheckoutController;
use App\Http\Controllers\Web\LandingPageController;
use App\Http\Controllers\Web\ProductDetailController;
use App\Http\Controllers\Web\ShopController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Route;

Route::get('/', LandingPageController::class)->name('home');
Route::get('/shop', [ShopController::class, 'index'])->name('shop');
Route::get('/products/{slug}', ProductDetailController::class)->name('products.show');
Route::get('/wishlist', fn () => redirect()->route('user.wishlist'))->name('wishlist');

Route::get('/cart', [CartController::class, 'index'])->name('cart');
Route::post('/cart/items', [CartController::class, 'store'])->name('cart.items.store');
Route::patch('/cart/items/{item}', [CartController::class, 'update'])->name('cart.items.update');
Route::delete('/cart/items/{item}', [CartController::class, 'destroy'])->name('cart.items.destroy');
Route::delete('/cart', [CartController::class, 'clear'])->name('cart.clear');
Route::post('/cart/coupon', [CartController::class, 'applyCoupon'])->name('cart.coupon.apply');
Route::delete('/cart/coupon', [CartController::class, 'removeCoupon'])->name('cart.coupon.remove');

Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout');
Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
Route::get('/checkout/success/{orderNumber}', [CheckoutController::class, 'success'])->name('checkout.success');

Route::post('/currency', function (Request $request) {
    $validated = $request->validate([
        'currency' => ['required', 'string'],
    ]);

    session(['selected_currency' => $validated['currency']]);
    session()->save();

    Cookie::queue('selected_currency', $validated['currency'], 60 * 24 * 365);

    return back()->withCookie(cookie('selected_currency', $validated['currency'], 60 * 24 * 365));
})->name('currency.switch');

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
    Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist');
    Route::post('/wishlist/toggle', [WishlistController::class, 'toggle'])->name('wishlist.toggle');
    Route::delete('/wishlist/items/{productId}', [WishlistController::class, 'destroy'])->name('wishlist.destroy');
    Route::delete('/wishlist', [WishlistController::class, 'clear'])->name('wishlist.clear');
});

require __DIR__.'/settings.php';
