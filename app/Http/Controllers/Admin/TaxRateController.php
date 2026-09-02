<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TaxRate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TaxRateController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/settings/taxes/index', [
            'taxes' => TaxRate::query()->orderBy('name')->paginate(20),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'rate' => 'required|numeric|min:0',
            'country_code' => 'nullable|string|max:2',
            'state_code' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        TaxRate::create($validated);

        return back()->with('success', 'Tax rate created.');
    }

    public function update(Request $request, TaxRate $tax): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'rate' => 'required|numeric|min:0',
            'country_code' => 'nullable|string|max:2',
            'state_code' => 'nullable|string|max:255',
            'is_active' => 'boolean',
        ]);

        $tax->update($validated);

        return back()->with('success', 'Tax rate updated.');
    }

    public function destroy(TaxRate $tax): RedirectResponse
    {
        $tax->delete();

        return back()->with('success', 'Tax rate deleted.');
    }
}
