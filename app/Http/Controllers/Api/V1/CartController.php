<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\AddCartItemRequest;
use App\Http\Requests\Api\V1\UpdateCartItemRequest;
use App\Http\Resources\Api\V1\CartResource;
use App\Models\Cart;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CartController extends Controller
{
    public function __construct(private readonly CartService $cartService) {}

    public function show(Request $request): JsonResponse
    {
        $cart = $this->cartService->getOrCreateCart(
            $this->resolveSessionId($request),
            $request->user()?->id
        );

        $cart->load('items.product.images');

        return response()->json(['data' => new CartResource($cart)]);
    }

    public function addItem(AddCartItemRequest $request): JsonResponse
    {
        $product = Product::query()->findOrFail($request->integer('product_id'));
        $variant = $request->filled('variant_id')
            ? ProductVariant::query()->findOrFail($request->integer('variant_id'))
            : null;

        $cart = $this->cartService->getOrCreateCart(
            $this->resolveSessionId($request),
            $request->user()?->id
        );

        $this->cartService->addItem(
            $cart,
            $product,
            $variant,
            $request->integer('quantity'),
            $request->array('options') ?? []
        );

        return response()->json([
            'message' => __('Item added to cart.'),
            'data' => new CartResource($cart->fresh('items.product.images')),
        ]);
    }

    public function updateItem(UpdateCartItemRequest $request, int $item): JsonResponse
    {
        $cart = $this->cartService->getOrCreateCart(
            $this->resolveSessionId($request),
            $request->user()?->id
        );

        $updated = $this->cartService->updateQuantity($cart, $item, $request->integer('quantity'));

        if (! $updated) {
            return response()->json(['message' => __('Cart item not found.')], 404);
        }

        return response()->json([
            'message' => __('Cart updated.'),
            'data' => new CartResource($cart->fresh('items.product.images')),
        ]);
    }

    public function removeItem(Request $request, int $item): JsonResponse
    {
        $cart = $this->cartService->getOrCreateCart(
            $this->resolveSessionId($request),
            $request->user()?->id
        );

        $this->cartService->removeItem($cart, $item);

        return response()->json([
            'message' => __('Item removed.'),
            'data' => new CartResource($cart->fresh('items.product.images')),
        ]);
    }

    public function clear(Request $request): JsonResponse
    {
        $cart = $this->cartService->getOrCreateCart(
            $this->resolveSessionId($request),
            $request->user()?->id
        );

        $cart->items()->delete();

        return response()->json([
            'message' => __('Cart cleared.'),
            'data' => new CartResource($cart->fresh('items')),
        ]);
    }

    public function merge(Request $request): JsonResponse
    {
        $user = $request->user();
        $sessionId = $this->resolveSessionId($request);

        if (! $user) {
            return response()->json(['message' => __('Authentication required.')], 401);
        }

        $guestCart = Cart::query()
            ->where('session_id', $sessionId)
            ->where('status', 'active')
            ->latest('id')
            ->first();

        $customerCart = $this->cartService->getOrCreateCart(null, $user->id);

        if ($guestCart && $guestCart->id !== $customerCart->id) {
            $customerCart = $this->cartService->mergeGuestCartInto($guestCart, $customerCart);
        }

        return response()->json([
            'message' => __('Carts merged.'),
            'data' => new CartResource($customerCart->load('items.product.images')),
        ]);
    }

    private function resolveSessionId(Request $request): string
    {
        return $request->cookie('cart_session_id') ?? (string) Str::uuid();
    }
}
