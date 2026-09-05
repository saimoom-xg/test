<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BrandRequest;
use App\Models\Brand;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BrandController extends Controller
{
    public function index(Request $request): Response
    {
        $brands = Brand::query()
            ->withCount('products')
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/brands/index', [
            'brands' => $brands,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(BrandRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('logo')) {
            $data['logo'] = $request->file('logo')->store('brands', 'public');
        }

        Brand::create($data);

        return to_route('admin.brands.index')
            ->with('toast', ['type' => 'success', 'message' => 'Brand created.']);
    }

    public function update(BrandRequest $request, Brand $brand): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('logo')) {
            if ($brand->logo) {
                Storage::disk('public')->delete($brand->logo);
            }
            $data['logo'] = $request->file('logo')->store('brands', 'public');
        }

        $brand->update($data);

        return to_route('admin.brands.index')
            ->with('toast', ['type' => 'success', 'message' => 'Brand updated.']);
    }

    public function destroy(Brand $brand): RedirectResponse
    {
        if ($brand->logo) {
            Storage::disk('public')->delete($brand->logo);
        }
        $brand->delete();

        return to_route('admin.brands.index')
            ->with('toast', ['type' => 'success', 'message' => 'Brand deleted.']);
    }
}
