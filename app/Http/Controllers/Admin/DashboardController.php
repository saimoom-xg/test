<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Customer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $today = now()->startOfDay();
        $last7 = now()->subDays(7);
        $last30 = now()->subDays(30);

        $stats = [
            'orders' => [
                'total' => Order::query()->count(),
                'today' => Order::query()->where('placed_at', '>=', $today)->count(),
                'last_7_days' => Order::query()->where('placed_at', '>=', $last7)->count(),
                'last_30_days' => Order::query()->where('placed_at', '>=', $last30)->count(),
            ],
            'revenue' => [
                'total' => (float) Order::query()->where('payment_status', 'paid')->sum('grand_total'),
                'last_7_days' => (float) Order::query()->where('payment_status', 'paid')->where('placed_at', '>=', $last7)->sum('grand_total'),
                'last_30_days' => (float) Order::query()->where('payment_status', 'paid')->where('placed_at', '>=', $last30)->sum('grand_total'),
                'currency' => 'USD',
            ],
            'customers' => [
                'total' => Customer::query()->count(),
                'last_30_days' => Customer::query()->where('created_at', '>=', $last30)->count(),
            ],
            'products' => [
                'total' => Product::query()->count(),
                'low_stock' => Product::query()
                    ->where('manage_stock', true)
                    ->whereColumn('stock_quantity', '<=', 'low_stock_threshold')
                    ->count(),
            ],
        ];

        $recentOrders = Order::query()
            ->with(['status', 'customer'])
            ->latest()
            ->limit(8)
            ->get();

        $lowStockProducts = Product::query()
            ->where('manage_stock', true)
            ->whereColumn('stock_quantity', '<=', 'low_stock_threshold')
            ->orderBy('stock_quantity')
            ->limit(8)
            ->get();

        $topSelling = OrderItem::query()
            ->selectRaw('product_id, name, SUM(quantity) as total_quantity, SUM(total) as total_revenue')
            ->groupBy('product_id', 'name')
            ->orderByDesc('total_quantity')
            ->limit(8)
            ->get();

        $salesChart = Order::query()
            ->selectRaw("strftime('%Y-%m-%d', placed_at) as date, SUM(grand_total) as total")
            ->where('placed_at', '>=', now()->subDays(14))
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('total', 'date');

        $recentActivity = ActivityLog::query()
            ->with('user:id,name')
            ->latest()
            ->limit(8)
            ->get();

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'lowStockProducts' => $lowStockProducts,
            'topSelling' => $topSelling,
            'salesChart' => $salesChart,
            'recentActivity' => $recentActivity,
        ]);
    }
}
