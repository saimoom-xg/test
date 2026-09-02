<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaymentMethod;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentMethodController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/settings/payments/index', [
            'payments' => PaymentMethod::query()->orderBy('name')->paginate(20),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'provider' => 'required|string|max:255',
            'is_active' => 'boolean',
        ]);

        PaymentMethod::create($validated);

        return back()->with('success', 'Payment method created.');
    }

    public function update(Request $request, PaymentMethod $payment): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'provider' => 'required|string|max:255',
            'is_active' => 'boolean',
        ]);

        $payment->update($validated);

        return back()->with('success', 'Payment method updated.');
    }

    public function destroy(PaymentMethod $payment): RedirectResponse
    {
        $payment->delete();

        return back()->with('success', 'Payment method deleted.');
    }
}
