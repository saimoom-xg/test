<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FlashSale;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class FlashSaleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/flash-sales/index', [
            'sales' => FlashSale::query()->latest()->paginate(20),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/flash-sales/form', [
            'products' => Product::query()->select('id', 'name', 'price')->where('is_active', true)->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'starts_at' => 'required|date',
            'ends_at' => 'required|date|after:starts_at',
            'is_active' => 'boolean',
            'products' => 'nullable|array',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.discount_price' => 'required|numeric|min:0',
            'products.*.allocated_quantity' => 'required|integer|min:1',
        ]);

        $sale = FlashSale::create([
            'title' => $validated['title'],
            'starts_at' => $validated['starts_at'],
            'ends_at' => $validated['ends_at'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        if (!empty($validated['products'])) {
            foreach ($validated['products'] as $productData) {
                $sale->products()->create($productData);
            }
        }

        return redirect()->route('admin.flash-sales.index')->with('success', 'Flash sale created.');
    }

    public function edit(FlashSale $flashSale): Response
    {
        $flashSale->load('products.product');

        return Inertia::render('admin/flash-sales/form', [
            'sale' => $flashSale,
            'products' => Product::query()->select('id', 'name', 'price')->where('is_active', true)->get(),
        ]);
    }

    public function update(Request $request, FlashSale $flashSale): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'starts_at' => 'required|date',
            'ends_at' => 'required|date|after:starts_at',
            'is_active' => 'boolean',
            'products' => 'nullable|array',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.discount_price' => 'required|numeric|min:0',
            'products.*.allocated_quantity' => 'required|integer|min:1',
        ]);

        $flashSale->update([
            'title' => $validated['title'],
            'starts_at' => $validated['starts_at'],
            'ends_at' => $validated['ends_at'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        // Sync products
        $flashSale->products()->delete();
        if (!empty($validated['products'])) {
            foreach ($validated['products'] as $productData) {
                $flashSale->products()->create($productData);
            }
        }

        return redirect()->route('admin.flash-sales.index')->with('success', 'Flash sale updated.');
    }

    public function destroy(FlashSale $flashSale): RedirectResponse
    {
        $flashSale->delete();
        return back()->with('success', 'Flash sale deleted.');
    }
}
