<?php

namespace App\Http\Resources\Api\V1;

use App\Models\Cart;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Cart
 */
class CartResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'session_id' => $this->session_id,
            'customer_id' => $this->customer_id,
            'currency_code' => $this->currency_code,
            'status' => $this->status,
            'subtotal' => (float) $this->items->sum(fn ($i) => $i->unit_price * $i->quantity),
            'item_count' => (int) $this->items->sum('quantity'),
            'items' => $this->whenLoaded('items', fn () => CartItemResource::collection($this->items)),
        ];
    }
}
