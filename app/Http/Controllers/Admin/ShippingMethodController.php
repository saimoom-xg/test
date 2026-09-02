<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShippingMethod;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShippingMethodController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/settings/shipping/index', [
            'shipping' => ShippingMethod::query()->orderBy('name')->paginate(20),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        ShippingMethod::create($validated);

        return back()->with('success', 'Shipping method created.');
    }

    public function update(Request $request, ShippingMethod $shipping): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $shipping->update($validated);

        return back()->with('success', 'Shipping method updated.');
    }

    public function destroy(ShippingMethod $shipping): RedirectResponse
    {
        $shipping->delete();

        return back()->with('success', 'Shipping method deleted.');
    }
}
