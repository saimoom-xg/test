<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        $today = now()->startOfDay();
        $last7 = now()->subDays(7);
        $last30 = now()->subDays(30);

        $ordersCount = Order::query()->count();
        $todayOrdersCount = Order::query()->where('placed_at', '>=', $today)->count();
        $last7OrdersCount = Order::query()->where('placed_at', '>=', $last7)->count();
        $last30OrdersCount = Order::query()->where('placed_at', '>=', $last30)->count();

        $totalRevenue = (float) Order::query()->where('payment_status', 'paid')->sum('grand_total');
        $last7Revenue = (float) Order::query()->where('payment_status', 'paid')->where('placed_at', '>=', $last7)->sum('grand_total');
        $last30Revenue = (float) Order::query()->where('payment_status', 'paid')->where('placed_at', '>=', $last30)->sum('grand_total');

        $productsCount = Product::query()->count();
        $lowStockCount = Product::query()
            ->where('manage_stock', true)
            ->whereColumn('stock_quantity', '<=', 'low_stock_threshold')
            ->count();

        return response()->json([
            'data' => [
                'orders' => [
                    'total' => $ordersCount,
                    'today' => $todayOrdersCount,
                    'last_7_days' => $last7OrdersCount,
                    'last_30_days' => $last30OrdersCount,
                ],
                'revenue' => [
                    'total' => $totalRevenue,
                    'last_7_days' => $last7Revenue,
                    'last_30_days' => $last30Revenue,
                    'currency' => 'USD',
                ],
                'products' => [
                    'total' => $productsCount,
                    'low_stock' => $lowStockCount,
                ],
            ],
        ]);
    }
}
