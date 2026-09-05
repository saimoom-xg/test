import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, Loader2, Minus, Plus, ShieldCheck, ShoppingBag, Tag, Trash2, Truck, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import FrontendLayout from '@/layouts/frontend-layout';
import { useCurrency } from '@/hooks/use-currency';

type CartItem = {
    id: number;
    quantity: number;
    unit_price: number;
    subtotal: number;
    options?: Record<string, any> | null;
    product: {
        id?: number;
        name: string;
        slug?: string;
        price?: number;
        sale_price?: number | null;
        brand?: string;
        image?: string;
    };
};

type AppliedCoupon = {
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    discount_amount: number;
    description: string;
};

type Props = {
    cart: {
        item_count: number;
        subtotal: number;
        discount_amount?: number;
        total?: number;
        coupon?: AppliedCoupon | null;
        items: CartItem[];
    };
};

export default function Cart(): React.JSX.Element {
    const { cart } = usePage<Props>().props;
    const { formatPrice } = useCurrency();
    const [updatingId, setUpdatingId] = useState<number | 'clear' | null>(null);
    const [couponCode, setCouponCode] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);

    const updateQuantity = (itemId: number, newQuantity: number): void => {
        if (updatingId !== null) return;
        setUpdatingId(itemId);

        router.patch(
            `/cart/items/${itemId}`,
            { quantity: newQuantity },
            {
                preserveScroll: true,
                onSuccess: () => {
                    if (newQuantity <= 0) {
                        toast.success('Item removed from cart.');
                    }
                },
                onError: () => {
                    toast.error('Failed to update cart.');
                },
                onFinish: () => setUpdatingId(null),
            }
        );
    };

    const removeItem = (itemId: number, productName: string): void => {
        if (updatingId !== null) return;
        setUpdatingId(itemId);

        router.delete(`/cart/items/${itemId}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`${productName} removed from cart.`);
            },
            onError: () => {
                toast.error('Failed to remove item.');
            },
            onFinish: () => setUpdatingId(null),
        });
    };

    const clearCart = (): void => {
        if (updatingId !== null) return;
        if (!confirm('Are you sure you want to clear your cart?')) return;

        setUpdatingId('clear');

        router.delete('/cart', {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Cart cleared.');
            },
            onError: () => {
                toast.error('Failed to clear cart.');
            },
            onFinish: () => setUpdatingId(null),
        });
    };

    const handleApplyCoupon = (e: React.FormEvent): void => {
        e.preventDefault();
        const trimmed = couponCode.trim();
        if (!trimmed || couponLoading) return;

        setCouponLoading(true);
        router.post(
            '/cart/coupon',
            { code: trimmed },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setCouponCode('');
                },
                onError: (err: any) => {
                    toast.error(err?.code || 'Failed to apply coupon.');
                },
                onFinish: () => setCouponLoading(false),
            }
        );
    };

    const handleRemoveCoupon = (): void => {
        if (couponLoading) return;
        setCouponLoading(true);

        router.delete('/cart/coupon', {
            preserveScroll: true,
            onError: () => {
                toast.error('Failed to remove coupon.');
            },
            onFinish: () => setCouponLoading(false),
        });
    };

    const defaultPlaceholder = 'https://media.istockphoto.com/id/908259584/photo/various-chocolate-pralines.jpg?s=612x612&w=0&k=20&c=Nqv-2Foy0yFJ7OrlO-PrLa0bkh_HEFcIeCY2Dg8JL5I=';

    return (
        <>
            <Head title="Shopping Cart" />
            <div className="flex-1 flex flex-col pb-12 w-full max-w-7xl mx-auto min-w-0">
                <div className="w-full min-w-0">
                    {/* Top Navigation */}
                    <div className="mb-6 flex items-center justify-between">
                        <Link
                            href="/shop"
                            className="inline-flex items-center gap-2 text-sm font-bold text-[#2a2b30] hover:opacity-75 transition-opacity"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Continue shopping
                        </Link>
                        {cart.items.length > 0 && (
                            <button
                                onClick={clearCart}
                                disabled={updatingId !== null}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50"
                            >
                                {updatingId === 'clear' ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                    <Trash2 className="h-3.5 w-3.5" />
                                )}
                                Clear Cart
                            </button>
                        )}
                    </div>

                    {cart.items.length > 0 && (
                        <div className="mb-6 flex items-baseline gap-3">
                            <h2 className="text-xl font-bold tracking-tight text-[#2a2b30]">Selected Items</h2>
                            <span className="text-xs font-semibold text-gray-500 bg-white px-2.5 py-1 rounded-full border border-black/5 shadow-xs">
                                {cart.item_count} {cart.item_count === 1 ? 'item' : 'items'}
                            </span>
                        </div>
                    )}

                    {cart.items.length === 0 ? (
                        /* Empty State */
                        <div className="mt-8 flex flex-col items-center justify-center rounded-[32px] bg-white p-16 text-center shadow-sm border border-black/5">
                            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#f3eee7] text-gray-400">
                                <ShoppingBag className="h-10 w-10 text-[#2a2b30]" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight text-[#2a2b30]">Your cart is empty</h2>
                            <p className="mt-2 max-w-sm text-sm text-gray-500 font-medium">
                                Looks like you haven&apos;t added any items to your cart yet. Explore our curated catalog and discover something you love!
                            </p>
                            <Link
                                href="/shop"
                                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#2a2b30] px-7 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-black transition-all active:scale-[0.98]"
                            >
                                Start Shopping
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    ) : (
                        /* Cart Grid Layout */
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full">
                            {/* Items List */}
                            <div className="lg:col-span-7 xl:col-span-8 min-w-0 space-y-4 w-full">
                                {cart.items.map((item) => {
                                    const isItemUpdating = updatingId === item.id;
                                    const imgSrc = item.product.image
                                        ? item.product.image.startsWith('http://') || item.product.image.startsWith('https://')
                                            ? item.product.image
                                            : `/storage/${item.product.image}`
                                        : defaultPlaceholder;

                                    return (
                                        <div
                                            key={item.id}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl bg-white p-4 sm:p-5 shadow-sm border border-black/5 transition-all min-w-0"
                                        >
                                            <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                                                {/* Product Image */}
                                                <div className="h-20 w-20 sm:h-22 sm:w-22 shrink-0 overflow-hidden rounded-2xl bg-[#f4f4f4] border border-gray-100 flex items-center justify-center">
                                                    <img
                                                        src={imgSrc}
                                                        alt={item.product.name}
                                                        className="h-full w-full object-cover mix-blend-multiply transition-transform hover:scale-105 duration-300"
                                                    />
                                                </div>

                                                {/* Info */}
                                                <div className="min-w-0 flex-1">
                                                    {item.product.brand && (
                                                        <span className="text-[10.5px] font-bold uppercase tracking-wider text-gray-400">
                                                            {item.product.brand}
                                                        </span>
                                                    )}
                                                    <h2 className="truncate text-sm sm:text-base font-bold text-[#2a2b30]">
                                                        {item.product.name}
                                                    </h2>
                                                    <p className="mt-0.5 text-xs font-semibold text-gray-500">
                                                        {formatPrice(item.unit_price)} each
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Quantity and Actions */}
                                            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-5 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                                                {/* Quantity Pill */}
                                                <div className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-[#f8f6f2] px-2 py-1 shadow-inner">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        disabled={isItemUpdating}
                                                        className="flex h-7 w-7 items-center justify-center rounded-full text-gray-600 hover:bg-white hover:text-black hover:shadow-xs transition-all disabled:opacity-40"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <Minus className="h-3.5 w-3.5" />
                                                    </button>
                                                    <span className="w-6 text-center text-xs sm:text-sm font-bold text-[#2a2b30]">
                                                        {isItemUpdating ? (
                                                            <Loader2 className="mx-auto h-3.5 w-3.5 animate-spin text-gray-500" />
                                                        ) : (
                                                            item.quantity
                                                        )}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        disabled={isItemUpdating}
                                                        className="flex h-7 w-7 items-center justify-center rounded-full text-gray-600 hover:bg-white hover:text-black hover:shadow-xs transition-all disabled:opacity-40"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <Plus className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>

                                                {/* Line Total */}
                                                <div className="text-right min-w-[70px]">
                                                    <p className="text-sm sm:text-base font-extrabold text-[#2a2b30]">
                                                        {formatPrice(item.unit_price * item.quantity)}
                                                    </p>
                                                </div>

                                                {/* Remove Item Button */}
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item.id, item.product.name)}
                                                    disabled={isItemUpdating}
                                                    className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-40"
                                                    title="Remove item"
                                                    aria-label={`Remove ${item.product.name}`}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Order Summary Sidebar */}
                            <aside className="lg:col-span-5 xl:col-span-4 min-w-0 w-full sticky top-6 rounded-3xl bg-white p-6 shadow-sm border border-black/5">
                                <h3 className="text-lg font-bold text-[#2a2b30] pb-4 border-b border-gray-100">
                                    Order Summary
                                </h3>

                                {/* Coupon Section */}
                                <div className="py-4 border-b border-gray-100">
                                    {cart.coupon ? (
                                        <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200/80 p-3.5 flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white shrink-0 shadow-2xs">
                                                    <Tag className="h-4 w-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono text-xs font-black uppercase text-emerald-950 tracking-wider">
                                                            {cart.coupon.code}
                                                        </span>
                                                        <span className="rounded-full bg-emerald-200/70 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                                                            Applied
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-emerald-700 font-medium truncate mt-0.5">
                                                        {cart.coupon.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleRemoveCoupon}
                                                disabled={couponLoading}
                                                className="flex h-7 w-7 items-center justify-center rounded-full text-emerald-600 hover:bg-emerald-100/80 hover:text-emerald-900 transition-colors disabled:opacity-40 shrink-0 cursor-pointer"
                                                title="Remove coupon"
                                                aria-label="Remove coupon"
                                            >
                                                {couponLoading ? (
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                ) : (
                                                    <X className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleApplyCoupon} className="space-y-2">
                                            <label htmlFor="cart-coupon-input" className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                                                Promotional Code
                                            </label>
                                            <div className="flex items-center gap-2">
                                                <div className="relative flex-1">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                        <Tag className="h-3.5 w-3.5" />
                                                    </div>
                                                    <input
                                                        id="cart-coupon-input"
                                                        type="text"
                                                        value={couponCode}
                                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                        placeholder="e.g. CHOCO10"
                                                        className="w-full rounded-xl border border-gray-200 bg-[#fbfaf8] pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#2a2b30] outline-none transition-all focus:bg-white focus:border-[#2a2b30] focus:ring-2 focus:ring-[#2a2b30]/10"
                                                    />
                                                </div>
                                                <button
                                                    type="submit"
                                                    disabled={!couponCode.trim() || couponLoading}
                                                    className="inline-flex items-center justify-center rounded-xl bg-[#2a2b30] px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-black transition-all active:scale-[0.98] disabled:opacity-40 shrink-0 cursor-pointer h-[38px]"
                                                >
                                                    {couponLoading ? (
                                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                    ) : (
                                                        'Apply'
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>

                                <div className="mt-4 space-y-3 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span className="font-semibold text-[#2a2b30]">
                                            {formatPrice(cart.subtotal)}
                                        </span>
                                    </div>
                                    {cart.coupon && (cart.discount_amount ?? 0) > 0 && (
                                        <div className="flex justify-between text-emerald-600 font-medium">
                                            <span className="flex items-center gap-1.5">
                                                <Tag className="h-3.5 w-3.5" />
                                                Discount ({cart.coupon.code})
                                            </span>
                                            <span className="font-bold">
                                                -{formatPrice(cart.discount_amount)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-gray-600 items-center">
                                        <span>Shipping</span>
                                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-xs">
                                            <Truck className="h-3 w-3" /> Free
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Estimated Tax</span>
                                        <span className="text-gray-400 text-xs">Calculated at checkout</span>
                                    </div>

                                    <div className="pt-3 border-t border-gray-100">
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-base font-bold text-[#2a2b30]">Total</span>
                                            <span className="text-2xl font-extrabold text-[#2a2b30]">
                                                {formatPrice(cart.total ?? (cart.subtotal - (cart.discount_amount ?? 0)))}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Checkout Button */}
                                <Link
                                    href="/checkout"
                                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2a2b30] py-4 text-sm font-bold text-white shadow-sm hover:bg-black transition-all active:scale-[0.98] group"
                                >
                                    Proceed to Checkout
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>

                                {/* Trust & Guarantees */}
                                <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                                    <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-500">
                                        <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                                        <span>Secure 256-bit SSL encrypted checkout</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-xs font-semibold text-gray-500">
                                        <Truck className="h-4 w-4 text-blue-500 shrink-0" />
                                        <span>Fast & reliable tracked shipping</span>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Cart.layout = {
    title: 'Shopping Cart',
    subtitle: 'Review your selected items and proceed to checkout',
    showSearch: false,
};