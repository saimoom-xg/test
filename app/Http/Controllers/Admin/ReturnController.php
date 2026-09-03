<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\OrderReturn;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReturnController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/returns/index', [
            'returns' => OrderReturn::query()->with(['order', 'customer'])->latest()->paginate(20),
        ]);
    }

    public function show(OrderReturn $return): Response
    {
        $return->load(['order', 'customer', 'shipments', 'statusHistories.user']);

        return Inertia::render('admin/returns/show', [
            'returnRequest' => $return,
        ]);
    }

    public function updateStatus(Request $request, OrderReturn $return): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,received,refunded,rejected',
            'notes' => 'nullable|string',
        ]);

        $return->update(['status' => $validated['status']]);

        $return->statusHistories()->create([
            'user_id' => $request->user()->id,
            'status' => $validated['status'],
            'notes' => $validated['notes'],
        ]);

        return back()->with('success', 'Return status updated.');
    }
}
