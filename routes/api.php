<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BrandController;
use App\Http\Controllers\Api\V1\CartController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\CustomerController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\SearchController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')
    ->middleware(['api'])
    ->group(function (): void {

        Route::middleware('throttle:30,1')->group(function (): void {
            Route::post('auth/otp/request', [AuthController::class, 'requestOtp'])->name('api.v1.auth.otp.request');
            Route::post('auth/otp/verify', [AuthController::class, 'verifyOtp'])->name('api.v1.auth.otp.verify');
        });

        Route::get('cart', [CartController::class, 'show'])->name('api.v1.cart.show');
        Route::post('cart/items', [CartController::class, 'addItem'])->name('api.v1.cart.items.add');
        Route::patch('cart/items/{item}', [CartController::class, 'updateItem'])->name('api.v1.cart.items.update');
        Route::delete('cart/items/{item}', [CartController::class, 'removeItem'])->name('api.v1.cart.items.remove');
        Route::delete('cart', [CartController::class, 'clear'])->name('api.v1.cart.clear');

        Route::middleware('auth:sanctum')->group(function (): void {
            Route::post('auth/logout', [AuthController::class, 'logout'])->name('api.v1.auth.logout');
            Route::get('auth/me', [AuthController::class, 'me'])->name('api.v1.auth.me');
            Route::post('cart/merge', [CartController::class, 'merge'])->name('api.v1.cart.merge');

            Route::get('dashboard/stats', [DashboardController::class, 'stats'])->name('api.v1.dashboard.stats');
            Route::get('search', [SearchController::class, 'global'])->name('api.v1.search.global');

            Route::apiResource('products', ProductController::class)->names('api.v1.products');
            Route::apiResource('categories', CategoryController::class)->names('api.v1.categories');
            Route::apiResource('brands', BrandController::class)->names('api.v1.brands');
            Route::apiResource('customers', CustomerController::class)->names('api.v1.customers');
            Route::apiResource('orders', OrderController::class)->names('api.v1.orders');

            Route::post('orders/{order}/status', [OrderController::class, 'updateStatus'])->name('api.v1.orders.status');
        });
    });
