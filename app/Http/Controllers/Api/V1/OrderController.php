<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\OrderRequest;
use App\Http\Requests\Api\V1\UpdateOrderStatusRequest;
use App\Http\Resources\Api\V1\OrderResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatus;
use App\Models\OrderStatusHistory;
use App\Services\ActivityLogger;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function __construct(private readonly ActivityLogger $logger) {}

    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Order::query()->with(['status', 'items']);

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search): void {
                $q->where('number', 'like', "%{$search}%")
                    ->orWhere('customer_email', 'like', "%{$search}%")
                    ->orWhere('customer_phone', 'like', "%{$search}%");
            });
        }

        if ($status = $request->string('payment_status')->toString()) {
            $query->where('payment_status', $status);
        }

        if ($status = $request->string('shipping_status')->toString()) {
            $query->where('shipping_status', $status);
        }

        if ($id = $request->integer('order_status_id')) {
            $query->where('order_status_id', $id);
        }

        $perPage = min((int) $request->integer('per_page', 20), 100);

        return OrderResource::collection(
            $query->latest()->paginate($perPage)->withQueryString()
        );
    }

    public function store(OrderRequest $request): JsonResponse
    {
        $order = DB::transaction(function () use ($request): Order {
            $payload = $request->validated();
            $items = $payload['items'];
            unset($payload['items']);

            $order = Order::create($payload);

            foreach ($items as $itemData) {
                $subtotal = $itemData['unit_price'] * $itemData['quantity'];
                $tax = (float) ($itemData['tax_total'] ?? 0);
                $discount = (float) ($itemData['discount_total'] ?? 0);
                $total = $subtotal + $tax - $discount;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $itemData['product_id'],
                    'variant_id' => $itemData['variant_id'] ?? null,
                    'name' => $itemData['name'],
                    'sku' => $itemData['sku'] ?? null,
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $itemData['unit_price'],
                    'subtotal' => $subtotal,
                    'tax_total' => $tax,
                    'discount_total' => $discount,
                    'total' => $total,
                ]);
            }

            return $order;
        });

        $order->load(['items', 'status']);

        return response()->json([
            'message' => __('Order created.'),
            'data' => new OrderResource($order),
        ], 201);
    }

    public function show(Order $order): JsonResponse
    {
        $order->load(['items', 'status', 'statusHistories']);

        return response()->json(['data' => new OrderResource($order)]);
    }

    public function update(OrderRequest $request, Order $order): JsonResponse
    {
        DB::transaction(function () use ($request, $order): void {
            $payload = $request->validated();
            $items = $payload['items'] ?? null;
            unset($payload['items']);

            $order->update($payload);

            if ($items !== null) {
                $order->items()->delete();
                foreach ($items as $itemData) {
                    $subtotal = $itemData['unit_price'] * $itemData['quantity'];
                    $tax = (float) ($itemData['tax_total'] ?? 0);
                    $discount = (float) ($itemData['discount_total'] ?? 0);

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $itemData['product_id'],
                        'variant_id' => $itemData['variant_id'] ?? null,
                        'name' => $itemData['name'],
                        'sku' => $itemData['sku'] ?? null,
                        'quantity' => $itemData['quantity'],
                        'unit_price' => $itemData['unit_price'],
                        'subtotal' => $subtotal,
                        'tax_total' => $tax,
                        'discount_total' => $discount,
                        'total' => $subtotal + $tax - $discount,
                    ]);
                }
            }
        });

        $order->load(['items', 'status']);

        return response()->json([
            'message' => __('Order updated.'),
            'data' => new OrderResource($order),
        ]);
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Order $order): JsonResponse
    {
        $newStatus = OrderStatus::query()->find($request->integer('order_status_id'));
        $previousStatus = $order->status;

        DB::transaction(function () use ($request, $order, $newStatus, $previousStatus): void {
            $order->update([
                'order_status_id' => $newStatus->id,
                'payment_status' => $request->input('payment_status', $order->payment_status),
                'shipping_status' => $request->input('shipping_status', $order->shipping_status),
            ]);

            OrderStatusHistory::create([
                'order_id' => $order->id,
                'order_status_id' => $newStatus->id,
                'from_status' => $previousStatus?->code,
                'to_status' => $newStatus->code,
                'user_id' => auth()->id(),
                'comment' => $request->input('comment'),
            ]);
        });

        $this->logger->log(auth()->user(), 'order.status_updated', $order, [
            'from' => $previousStatus?->code,
            'to' => $newStatus->code,
        ]);

        return response()->json([
            'message' => __('Order status updated.'),
            'data' => new OrderResource($order->fresh('items', 'status', 'statusHistories')),
        ]);
    }

    public function destroy(Order $order): JsonResponse
    {
        $order->delete();

        return response()->json(['message' => __('Order deleted.')]);
    }
}
