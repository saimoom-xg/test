<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderStatus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Order::query()->with(['status', 'customer']);

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search): void {
                $q->where('number', 'like', "%{$search}%")
                    ->orWhere('customer_email', 'like', "%{$search}%");
            });
        }

        if ($status = $request->string('payment_status')->toString()) {
            $query->where('payment_status', $status);
        }

        if ($status = $request->string('shipping_status')->toString()) {
            $query->where('shipping_status', $status);
        }

        $orders = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
            'filters' => $request->only(['search', 'payment_status', 'shipping_status']),
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load(['items', 'status', 'statusHistories.user', 'customer']);

        return Inertia::render('admin/orders/show', [
            'order' => $order,
            'statuses' => OrderStatus::query()->where('is_active', true)->orderBy('sort_order')->get(),
        ]);
    }

    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $data = $request->validate([
            'order_status_id' => ['required', 'exists:order_statuses,id'],
            'comment' => ['nullable', 'string', 'max:2000'],
        ]);

        $previous = $order->status?->code;
        $newStatus = OrderStatus::query()->find($data['order_status_id']);

        $order->update(['order_status_id' => $data['order_status_id']]);

        $order->statusHistories()->create([
            'order_status_id' => $data['order_status_id'],
            'from_status' => $previous,
            'to_status' => $newStatus->code,
            'user_id' => auth()->id(),
            'comment' => $data['comment'] ?? null,
        ]);

        return to_route('admin.orders.show', $order)
            ->with('toast', ['type' => 'success', 'message' => 'Order status updated.']);
    }
}
