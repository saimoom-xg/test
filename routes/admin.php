<?php

use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ContactMessageController;
use App\Http\Controllers\Admin\CouponController;
use App\Http\Controllers\Admin\CurrencyController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\FlashSaleController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\PaymentMethodController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProductImageController;
use App\Http\Controllers\Admin\ReportController;
use App\Http\Controllers\Admin\ReturnController;
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Admin\ShippingMethodController;
use App\Http\Controllers\Admin\TagController;
use App\Http\Controllers\Admin\TaxRateController;
use App\Http\Controllers\Admin\VariantController;
use App\Http\Controllers\Web\Admin\SearchController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function (): void {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    // Route::get('/update-role', function () {
    //     $user = auth()->user();
    //     if ($user) {
    //         $user->syncRoles(['admin']);
    //         return response()->json(['message' => 'Role updated to admin.']);
    //     }
    //     return response()->json(['message' => 'User not authenticated.'], 401);
    // });
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard.alt');
    Route::get('search', [SearchController::class, 'global'])->name('search.global');

    Route::get('products', [ProductController::class, 'index'])->name('products.index');
    Route::post('products', [ProductController::class, 'store'])->name('products.store');
    Route::get('products/create', [ProductController::class, 'create'])->name('products.create');
    Route::get('products/{product}', [ProductController::class, 'show'])->name('products.show');
    Route::put('products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::patch('products/{product}', [ProductController::class, 'update']);
    Route::delete('products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
    Route::get('products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
    Route::delete('product-images/batch', [ProductImageController::class, 'batchDestroy'])->name('product-images.batch-destroy');
    Route::delete('product-images/{productImage}', [ProductImageController::class, 'destroy'])->name('product-images.destroy');

    Route::get('categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::post('categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::put('categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::patch('categories/{category}', [CategoryController::class, 'update']);
    Route::delete('categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');

    Route::get('brands', [BrandController::class, 'index'])->name('brands.index');
    Route::post('brands', [BrandController::class, 'store'])->name('brands.store');
    Route::put('brands/{brand}', [BrandController::class, 'update'])->name('brands.update');
    Route::patch('brands/{brand}', [BrandController::class, 'update']);
    Route::delete('brands/{brand}', [BrandController::class, 'destroy'])->name('brands.destroy');

    Route::get('customers', [CustomerController::class, 'index'])->name('customers.index');
    Route::get('customers/{customer}', [CustomerController::class, 'show'])->name('customers.show');
    Route::put('customers/{customer}', [CustomerController::class, 'update'])->name('customers.update');
    Route::patch('customers/{customer}', [CustomerController::class, 'update']);
    Route::delete('customers/{customer}', [CustomerController::class, 'destroy'])->name('customers.destroy');

    Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::post('orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.status');

    Route::resource('coupons', CouponController::class);
    Route::resource('flash-sales', FlashSaleController::class);

    Route::get('returns', [ReturnController::class, 'index'])->name('returns.index');
    Route::get('returns/{return}', [ReturnController::class, 'show'])->name('returns.show');
    Route::post('returns/{return}/status', [ReturnController::class, 'updateStatus'])->name('returns.status');

    Route::prefix('reports')->name('reports.')->group(function (): void {
        Route::get('sales', [ReportController::class, 'sales'])->name('sales');
        Route::get('orders', [ReportController::class, 'orders'])->name('orders');
        Route::get('products', [ReportController::class, 'products'])->name('products');
        Route::get('customers', [ReportController::class, 'customers'])->name('customers');
        Route::get('coupons', [ReportController::class, 'coupons'])->name('coupons');
        Route::get('inventory', [ReportController::class, 'inventory'])->name('inventory');
        Route::get('payments', [ReportController::class, 'payments'])->name('payments');
        Route::get('taxes', [ReportController::class, 'taxes'])->name('taxes');
    });

    Route::resource('tags', TagController::class)->except(['create', 'edit', 'show', 'update']);

    Route::get('reviews', [ReviewController::class, 'index'])->name('reviews.index');
    Route::get('reviews/{review}', [ReviewController::class, 'show'])->name('reviews.show');
    Route::post('reviews/{review}/status', [ReviewController::class, 'updateStatus'])->name('reviews.status');
    Route::delete('reviews/{review}', [ReviewController::class, 'destroy'])->name('reviews.destroy');

    Route::get('variants', [VariantController::class, 'index'])->name('variants.index');

    Route::get('contacts', [ContactMessageController::class, 'index'])->name('contacts.index');
    Route::get('contacts/{contact}', [ContactMessageController::class, 'show'])->name('contacts.show');
    Route::post('contacts/{contact}/reply', [ContactMessageController::class, 'reply'])->name('contacts.reply');
    Route::post('contacts/{contact}/close', [ContactMessageController::class, 'close'])->name('contacts.close');

    Route::prefix('settings')->name('settings.')->group(function (): void {
        Route::resource('currencies', CurrencyController::class);
        Route::resource('taxes', TaxRateController::class);
        Route::resource('shipping', ShippingMethodController::class);
        Route::resource('payments', PaymentMethodController::class);
    });
});
