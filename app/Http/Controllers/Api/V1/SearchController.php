<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function global(Request $request): JsonResponse
    {
        $request->validate(['q' => ['required', 'string', 'min:2', 'max:100']]);
        $q = $request->string('q')->toString();
        $like = "%{$q}%";

        $products = Product::query()
            ->with('brand:id,name')
            ->where(function ($w) use ($like): void {
                $w->where('name', 'like', $like)
                    ->orWhere('sku', 'like', $like)
                    ->orWhere('barcode', 'like', $like);
            })
            ->limit(5)
            ->get(['id', 'name', 'sku', 'price', 'brand_id']);

        $categories = Category::query()
            ->where('name', 'like', $like)
            ->limit(5)
            ->get(['id', 'name']);

        $brands = Brand::query()
            ->where('name', 'like', $like)
            ->limit(5)
            ->get(['id', 'name']);

        $customers = Customer::query()
            ->where(function ($w) use ($like): void {
                $w->where('email', 'like', $like)
                    ->orWhere('first_name', 'like', $like)
                    ->orWhere('last_name', 'like', $like)
                    ->orWhere('phone', 'like', $like);
            })
            ->limit(5)
            ->get(['id', 'first_name', 'last_name', 'email', 'phone']);

        $orders = Order::query()
            ->where('number', 'like', $like)
            ->limit(5)
            ->get(['id', 'number', 'grand_total', 'payment_status']);

        return response()->json([
            'data' => [
                'products' => $products,
                'categories' => $categories,
                'brands' => $brands,
                'customers' => $customers,
                'orders' => $orders,
            ],
        ]);
    }
}
