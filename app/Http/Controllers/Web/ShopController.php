<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Product::query()
            ->where('status', 'published')
            ->where('is_active', true)
            ->with(['brand:id,name,slug', 'categories:id,name,slug', 'images']);

        // Search query
        if ($search = trim((string) $request->input('search'))) {
            $query->where(function ($q) use ($search): void {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('short_description', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhereHas('brand', fn ($bq) => $bq->where('name', 'like', "%{$search}%"));
            });
        }

        // Category filter (slug or id)
        if ($categoryParam = $request->input('category')) {
            $query->whereHas('categories', function ($q) use ($categoryParam): void {
                if (is_numeric($categoryParam)) {
                    $q->where('categories.id', (int) $categoryParam);
                } else {
                    $q->where('categories.slug', $categoryParam);
                }
            });
        }

        // Brand filter (slug or id)
        if ($brandParam = $request->input('brand')) {
            if (is_numeric($brandParam)) {
                $query->where('brand_id', (int) $brandParam);
            } else {
                $query->whereHas('brand', fn ($q) => $q->where('slug', $brandParam));
            }
        }

        // Price range
        if ($minPrice = $request->input('min_price')) {
            if (is_numeric($minPrice)) {
                $query->where(function ($q) use ($minPrice): void {
                    $q->where(function ($sq) use ($minPrice): void {
                        $sq->whereNotNull('sale_price')->where('sale_price', '>=', (float) $minPrice);
                    })->orWhere(function ($pq) use ($minPrice): void {
                        $pq->whereNull('sale_price')->where('price', '>=', (float) $minPrice);
                    });
                });
            }
        }

        if ($maxPrice = $request->input('max_price')) {
            if (is_numeric($maxPrice)) {
                $query->where(function ($q) use ($maxPrice): void {
                    $q->where(function ($sq) use ($maxPrice): void {
                        $sq->whereNotNull('sale_price')->where('sale_price', '<=', (float) $maxPrice);
                    })->orWhere(function ($pq) use ($maxPrice): void {
                        $pq->whereNull('sale_price')->where('price', '<=', (float) $maxPrice);
                    });
                });
            }
        }

        // In-stock only
        if ($request->boolean('in_stock')) {
            $query->where(function ($q): void {
                $q->where('stock_quantity', '>', 0)
                    ->orWhere('stock_status', 'in_stock');
            });
        }

        // Sorting
        $sort = $request->input('sort', 'featured');
        match ($sort) {
            'newest' => $query->latest(),
            'price_asc' => $query->orderByRaw('COALESCE(sale_price, price) ASC'),
            'price_desc' => $query->orderByRaw('COALESCE(sale_price, price) DESC'),
            'name_asc' => $query->orderBy('name', 'asc'),
            default => $query->orderByDesc('is_featured')->latest(),
        };

        $products = $query->paginate(16)->withQueryString();

        // Query active categories with published product count
        $categories = Category::query()
            ->where('is_active', true)
            ->whereHas('products', function ($q): void {
                $q->where('status', 'published')->where('is_active', true);
            })
            ->withCount(['products' => function ($q): void {
                $q->where('status', 'published')->where('is_active', true);
            }])
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'image']);

        // Query active brands with published product count
        $brands = Brand::query()
            ->where('is_active', true)
            ->whereHas('products', function ($q): void {
                $q->where('status', 'published')->where('is_active', true);
            })
            ->withCount(['products' => function ($q): void {
                $q->where('status', 'published')->where('is_active', true);
            }])
            ->orderBy('name')
            ->get(['id', 'name', 'slug', 'logo']);

        // Min and max price bounds across published products
        $minPossiblePrice = (float) (Product::where('status', 'published')->where('is_active', true)->min('price') ?? 0);
        $maxPossiblePrice = (float) (Product::where('status', 'published')->where('is_active', true)->max('price') ?? 1000);

        return Inertia::render('Shop', [
            'products' => $products,
            'categories' => $categories,
            'brands' => $brands,
            'priceRange' => [
                'min' => floor($minPossiblePrice),
                'max' => ceil($maxPossiblePrice),
            ],
            'filters' => [
                'search' => $request->input('search', ''),
                'category' => $request->input('category', ''),
                'brand' => $request->input('brand', ''),
                'min_price' => $request->input('min_price', ''),
                'max_price' => $request->input('max_price', ''),
                'in_stock' => $request->boolean('in_stock'),
                'sort' => $sort,
            ],
        ]);
    }

    /**
     * Search product suggestions for live autocomplete.
     */
    public function suggestions(Request $request): \Illuminate\Http\JsonResponse
    {
        $q = trim((string) $request->input('q', ''));
        if (strlen($q) < 2) {
            return response()->json(['products' => []]);
        }

        $products = Product::query()
            ->where('status', 'published')
            ->where('is_active', true)
            ->where(function ($w) use ($q): void {
                $w->where('name', 'like', "%{$q}%")
                    ->orWhere('short_description', 'like', "%{$q}%")
                    ->orWhere('sku', 'like', "%{$q}%")
                    ->orWhereHas('brand', fn ($bq) => $bq->where('name', 'like', "%{$q}%"));
            })
            ->with(['brand:id,name', 'images' => fn ($iq) => $iq->orderByDesc('is_primary')->limit(1)])
            ->limit(6)
            ->get(['id', 'name', 'slug', 'price', 'sale_price', 'brand_id']);

        $results = $products->map(function ($p): array {
            $image = $p->images->first();
            $imagePath = $image ? $image->path : null;
            if ($imagePath && ! str_starts_with($imagePath, 'http')) {
                $imagePath = "/storage/{$imagePath}";
            }

            return [
                'id' => $p->id,
                'name' => $p->name,
                'slug' => $p->slug,
                'price' => (float) $p->price,
                'sale_price' => $p->sale_price !== null ? (float) $p->sale_price : null,
                'brand' => $p->brand?->name,
                'image' => $imagePath,
            ];
        });

        return response()->json(['products' => $results]);
    }
}

