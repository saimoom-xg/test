<?php

namespace App\Http\Middleware;

use App\Models\Currency;
use App\Services\CartService;
use App\Services\WishlistService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Str;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $sessionId = $request->cookie('cart_session_id');
        if (! $sessionId) {
            $sessionId = (string) Str::uuid();
            Cookie::queue('cart_session_id', $sessionId, 60 * 24 * 30);
        }

        $cartService = app(CartService::class);
        $cart = $cartService->getOrCreateCart($sessionId, $request->user());

        $cartCount = $cartService->itemCount($cart);
        $cartSubtotal = $cartService->subtotal($cart);

        $wishlistService = app(WishlistService::class);
        $wishlistProductIds = $wishlistService->getWishlistProductIds($sessionId, $request->user());
        $wishlistCount = count($wishlistProductIds);

        $currencies = Currency::query()
            ->where('is_active', true)
            ->orderBy('code')
            ->get();

        $selectedCode = session('selected_currency') ?? $request->cookie('selected_currency');
        $currentCurrency = $currencies->firstWhere('code', $selectedCode)
            ?? $currencies->firstWhere('is_default', true)
            ?? $currencies->firstWhere('code', 'USD')
            ?? $currencies->first();

        $defaultCurrencyData = [
            'id' => 1,
            'code' => 'USD',
            'name' => 'US Dollar',
            'symbol' => '$',
            'exchange_rate' => 1.0,
            'is_default' => true,
        ];

        $currenciesData = $currencies->isNotEmpty()
            ? $currencies->map(fn ($c): array => [
                'id' => $c->id,
                'code' => $c->code,
                'name' => $c->name,
                'symbol' => $c->symbol,
                'exchange_rate' => (float) $c->exchange_rate,
                'is_default' => (bool) $c->is_default,
            ])->values()->all()
            : [$defaultCurrencyData];

        $currentCurrencyData = $currentCurrency
            ? [
                'id' => $currentCurrency->id,
                'code' => $currentCurrency->code,
                'name' => $currentCurrency->name,
                'symbol' => $currentCurrency->symbol,
                'exchange_rate' => (float) $currentCurrency->exchange_rate,
                'is_default' => (bool) $currentCurrency->is_default,
            ]
            : $defaultCurrencyData;

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user() ? [
                    ...$request->user()->toArray(),
                    'roles' => $request->user()->getRoleNames(),
                ] : null,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'cart' => [
                'count' => $cartCount,
                'subtotal' => $cartSubtotal,
            ],
            'wishlist' => [
                'count' => $wishlistCount,
                'productIds' => $wishlistProductIds,
            ],
            'currencies' => $currenciesData,
            'currentCurrency' => $currentCurrencyData,
        ];
    }
}
