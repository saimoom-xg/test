<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\FlashSale;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LandingPageController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $featured = Product::query()
            ->where('status', 'published')
            ->where('is_featured', true)
            ->with(['brand:id,name', 'categories:id,name', 'images'])
            ->limit(8)
            ->get();

        $saleProducts = Product::query()
            ->where('status', 'published')
            ->whereNotNull('sale_price')
            ->with(['brand:id,name', 'categories:id,name', 'images'])
            ->limit(8)
            ->get();

        $newArrivals = Product::query()
            ->where('status', 'published')
            ->latest()
            ->with(['brand:id,name', 'images'])
            ->limit(8)
            ->get(['id', 'name', 'slug', 'price', 'sale_price', 'brand_id', 'images']);

        $bestSellers = Product::query()
            ->where('status', 'published')
            ->orderByDesc('sales_count')
            ->with(['brand:id,name', 'images'])
            ->limit(6)
            ->get(['id', 'name', 'slug', 'price', 'sale_price', 'brand_id', 'images']);

        $categories = Category::query()
            ->where('is_active', true)
            ->withCount('products')
            ->limit(4)
            ->get(['id', 'name', 'slug', 'image']);

        $flashSale = FlashSale::query()
            ->where('is_active', true)
            ->with(['products.product' => function ($q): void {
                $q->where('status', 'published')
                    ->with(['images', 'brand:id,name', 'categories:id,name']);
            }])
            ->latest('id')
            ->first();

        $topPicks = Product::query()
            ->where('status', 'published')
            ->inRandomOrder()
            ->with(['brand:id,name', 'images'])
            ->limit(8)
            ->get(['id', 'name', 'slug', 'price', 'sale_price', 'brand_id', 'images']);

        $collections = Category::query()
            ->where('is_active', true)
            ->whereNotNull('image')
            ->limit(2)
            ->get(['id', 'name', 'slug', 'image']);

        $allProducts = Product::query()
            ->where('status', 'published')
            ->with(['brand:id,name', 'categories:id,name', 'images'])
            ->latest()
            ->get();

        return Inertia::render('Home', [
            'allProducts' => $allProducts,
            'featuredProducts' => $featured,
            'newArrivals' => $newArrivals,
            'bestSellers' => $bestSellers,
            'categories' => $categories,
            'flashSale' => $flashSale,
            'saleProducts' => $saleProducts,
            'topPicks' => $topPicks,
            'collections' => $collections,
        ]);
    }
}
