<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Services\WishlistService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WishlistController extends Controller
{
    public function __construct(
        protected WishlistService $wishlistService
    ) {}

    public function index(Request $request): Response
    {
        $sessionId = $request->cookie('cart_session_id');
        $products = $this->wishlistService->getWishlistProducts($sessionId, $request->user());

        return Inertia::render('user/wishlist', [
            'products' => $products,
        ]);
    }

    public function toggle(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
        ]);

        $sessionId = $request->cookie('cart_session_id');
        $product = Product::findOrFail($validated['product_id']);

        $added = $this->wishlistService->toggle($sessionId, $request->user(), $product->id);

        return back()->with('success', $added ? "{$product->name} added to wishlist." : "{$product->name} removed from wishlist.");
    }

    public function destroy(Request $request, int $productId): RedirectResponse
    {
        $sessionId = $request->cookie('cart_session_id');
        $this->wishlistService->remove($sessionId, $request->user(), $productId);

        return back()->with('success', 'Item removed from wishlist.');
    }

    public function clear(Request $request): RedirectResponse
    {
        $sessionId = $request->cookie('cart_session_id');
        $this->wishlistService->clear($sessionId, $request->user());

        return back()->with('success', 'Wishlist cleared.');
    }
}
