<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function sales(): Response
    {
        // For demonstration: get sales grouped by date for the last 30 days
        $salesData = Order::query()
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('SUM(grand_total) as total'))
            ->where('created_at', '>=', now()->subDays(30))
            ->where('payment_status', 'paid')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return Inertia::render('admin/reports/sales', [
            'salesData' => $salesData,
        ]);
    }

    public function orders(): Response
    {
        // For demonstration: get orders count by payment_status
        $statusData = Order::query()
            ->select('payment_status as status', DB::raw('COUNT(*) as count'))
            ->groupBy('payment_status')
            ->get();

        return Inertia::render('admin/reports/orders', [
            'statusData' => $statusData,
        ]);
    }

    public function products(): Response
    {
        return Inertia::render('admin/reports/placeholder', ['title' => 'Product Performance']);
    }

    public function customers(): Response
    {
        return Inertia::render('admin/reports/placeholder', ['title' => 'Customer Insights']);
    }

    public function coupons(): Response
    {
        return Inertia::render('admin/reports/placeholder', ['title' => 'Coupon Performance']);
    }

    public function inventory(): Response
    {
        return Inertia::render('admin/reports/placeholder', ['title' => 'Inventory Status']);
    }

    public function payments(): Response
    {
        return Inertia::render('admin/reports/placeholder', ['title' => 'Payment Summary']);
    }

    public function taxes(): Response
    {
        return Inertia::render('admin/reports/placeholder', ['title' => 'Tax Summary']);
    }
}
