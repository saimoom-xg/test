<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\ProductRequest;
use App\Http\Resources\Api\V1\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Product::query()->with(['brand', 'categories', 'images', 'variants']);

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search): void {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('barcode', 'like', "%{$search}%");
            });
        }

        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($category = $request->integer('category_id')) {
            $query->whereHas('categories', fn ($q) => $q->where('categories.id', $category));
        }

        if ($brand = $request->integer('brand_id')) {
            $query->where('brand_id', $brand);
        }

        match ($request->string('sort')->toString()) {
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderByDesc('price'),
            'name_asc' => $query->orderBy('name'),
            'name_desc' => $query->orderByDesc('name'),
            'oldest' => $query->orderBy('created_at'),
            'newest' => $query->orderByDesc('created_at'),
            'stock_asc' => $query->orderBy('stock_quantity'),
            'stock_desc' => $query->orderByDesc('stock_quantity'),
            default => $query->latest(),
        };

        $perPage = min((int) $request->integer('per_page', 20), 100);

        return ProductResource::collection(
            $query->latest()->paginate($perPage)->withQueryString()
        );
    }

    public function store(ProductRequest $request): JsonResponse
    {
        $product = Product::create($request->validated());

        if ($request->filled('category_ids')) {
            $product->categories()->sync($request->array('category_ids'));
        }

        $product->load(['brand', 'categories', 'images', 'variants']);

        return response()->json([
            'message' => __('Product created.'),
            'data' => new ProductResource($product),
        ], 201);
    }

    public function show(Product $product): JsonResponse
    {
        $product->load(['brand', 'categories', 'images', 'variants']);

        return response()->json([
            'data' => new ProductResource($product),
        ]);
    }

    public function update(ProductRequest $request, Product $product): JsonResponse
    {
        $product->update($request->validated());

        if ($request->has('category_ids')) {
            $product->categories()->sync($request->array('category_ids'));
        }

        $product->load(['brand', 'categories', 'images', 'variants']);

        return response()->json([
            'message' => __('Product updated.'),
            'data' => new ProductResource($product),
        ]);
    }

    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json(['message' => __('Product deleted.')]);
    }
}
