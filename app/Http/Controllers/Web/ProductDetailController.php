<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class ProductDetailController extends Controller
{
    public function __invoke(string $slug): Response
    {
        $product = Product::query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->with(['brand', 'categories', 'images', 'variants', 'reviews.customer'])
            ->firstOrFail();

        // Calculate reviews summary
        $avgRating = (float) $product->reviews()->avg('rating') ?: 5.0;
        $reviewsCount = $product->reviews()->count();

        // Find suggested products by same categories or brand
        $categoryIds = $product->categories->pluck('id')->all();
        $brandId = $product->brand_id;

        $suggestedProducts = Product::query()
            ->where('id', '!=', $product->id)
            ->where('is_active', true)
            ->where(function ($query) use ($categoryIds, $brandId) {
                if (! empty($categoryIds)) {
                    $query->whereHas('categories', function ($q) use ($categoryIds) {
                        $q->whereIn('categories.id', $categoryIds);
                    });
                }
                if ($brandId) {
                    $query->orWhere('brand_id', $brandId);
                }
            })
            ->with(['brand', 'categories', 'images'])
            ->inRandomOrder()
            ->take(4)
            ->get();

        // If fewer than 4 related products, supplement with top products
        if ($suggestedProducts->count() < 4) {
            $excludeIds = $suggestedProducts->pluck('id')->push($product->id)->all();
            $moreProducts = Product::query()
                ->whereNotIn('id', $excludeIds)
                ->where('is_active', true)
                ->with(['brand', 'categories', 'images'])
                ->latest('id')
                ->take(4 - $suggestedProducts->count())
                ->get();

            $suggestedProducts = $suggestedProducts->concat($moreProducts);
        }

        return Inertia::render('Product/Show', [
            'product' => [
                ...$product->toArray(),
                'avg_rating' => round($avgRating, 1),
                'reviews_count' => $reviewsCount,
            ],
            'suggestedProducts' => $suggestedProducts,
        ]);
    }
}
