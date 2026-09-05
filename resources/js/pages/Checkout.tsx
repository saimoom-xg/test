import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    ArrowLeft,
    Banknote,
    CheckCircle2,
    CreditCard,
    FileText,
    Loader2,
    Lock,
    Mail,
    MapPin,
    Phone,
    ShieldCheck,
    Sparkles,
    Tag,
    Truck,
    User,
    X,
} from 'lucide-react';
import React, { FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { useCurrency } from '@/hooks/use-currency';

type CartItem = {
    id: number;
    quantity: number;
    unit_price: number;
    subtotal: number;
    options?: any;
    product: {
        id: number;
        name: string;
        slug: string;
        brand?: string | null;
        image?: string | null;
    };
};

type AppliedCoupon = {
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    discount_amount: number;
    description: string;
};

type CheckoutProps = {
    title?: string;
    subtitle?: string;
    customer: {
        name: string;
        email: string;
        phone: string;
    };
    cart: {
        item_count: number;
        subtotal: number;
        discount_amount?: number;
        total?: number;
        coupon?: AppliedCoupon | null;
        items: CartItem[];
    };
};

const getImageUrl = (path?: string | null) => {
    if (!path) return 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=400&q=80';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `/storage/${path}`;
};

export default function Checkout({
    customer,
    cart,
}: CheckoutProps) {
    const { formatPrice } = useCurrency();
    const [couponCode, setCouponCode] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        name: customer?.name || '',
        email: customer?.email || '',
        phone: customer?.phone || '',
        address: '',
        notes: '',
        payment_method: 'cod', // 'cod' or 'card'
    });

    const handleApplyCoupon = (e: FormEvent) => {
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

    const handleRemoveCoupon = () => {
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

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/checkout');
    };

    return (
        <>
            <Head title="Express Checkout" />

            <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
                {/* Back Link & Header */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <Link
                            href="/cart"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#2a2b30] transition-colors mb-2"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Back to Shopping Cart
                        </Link>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#2a2b30]">
                            Express Checkout
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            Only essential information required. Fast, direct, and secure.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
                        <Lock className="h-3.5 w-3.5 text-emerald-600" />
                        <span>SSL 256-Bit Encrypted</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Minimal Input Form (8 Cols) */}
                    <div className="lg:col-span-7 xl:col-span-8 space-y-6">
                        {/* 1. Contact & Recipient */}
                        <div className="rounded-3xl bg-white p-5 sm:p-7 shadow-xs border border-black/5 transition-all">
                            <div className="flex items-center gap-3 pb-5 border-b border-gray-100">
                                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#2a2b30] text-white font-bold text-sm shadow-xs">
                                    1
                                </div>
                                <div>
                                    <h2 className="text-base sm:text-lg font-extrabold text-[#2a2b30]">
                                        Contact & Recipient
                                    </h2>
                                    <p className="text-xs text-gray-400">
                                        Where should we send your receipt and tracking updates?
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 space-y-4">
                                {/* Full Name */}
                                <div>
                                    <label htmlFor="name" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Full Name <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                            <User className="h-4 w-4" />
                                        </div>
                                        <input
                                            id="name"
                                            type="text"
                                            required
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="e.g. Eleanor Vance"
                                            className={`w-full rounded-2xl border ${
                                                errors.name ? 'border-rose-400 focus:ring-rose-200' : 'border-gray-200 focus:border-[#2a2b30] focus:ring-[#2a2b30]/10'
                                            } bg-[#fbfaf8] pl-10 pr-4 py-3 text-sm font-medium text-[#2a2b30] outline-none transition-all focus:bg-white focus:ring-4`}
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="mt-1 text-xs text-rose-500 font-medium">{errors.name}</p>
                                    )}
                                </div>

                                {/* Email & Phone in 2 columns */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Email */}
                                    <div>
                                        <label htmlFor="email" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                            Email Address <span className="text-rose-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                                <Mail className="h-4 w-4" />
                                            </div>
                                            <input
                                                id="email"
                                                type="email"
                                                required
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="eleanor@example.com"
                                                className={`w-full rounded-2xl border ${
                                                    errors.email ? 'border-rose-400 focus:ring-rose-200' : 'border-gray-200 focus:border-[#2a2b30] focus:ring-[#2a2b30]/10'
                                                } bg-[#fbfaf8] pl-10 pr-4 py-3 text-sm font-medium text-[#2a2b30] outline-none transition-all focus:bg-white focus:ring-4`}
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="mt-1 text-xs text-rose-500 font-medium">{errors.email}</p>
                                        )}
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label htmlFor="phone" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                            Phone Number <span className="text-rose-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                                                <Phone className="h-4 w-4" />
                                            </div>
                                            <input
                                                id="phone"
                                                type="tel"
                                                required
                                                value={data.phone}
                                                onChange={(e) => setData('phone', e.target.value)}
                                                placeholder="+1 (555) 000-0000"
                                                className={`w-full rounded-2xl border ${
                                                    errors.phone ? 'border-rose-400 focus:ring-rose-200' : 'border-gray-200 focus:border-[#2a2b30] focus:ring-[#2a2b30]/10'
                                                } bg-[#fbfaf8] pl-10 pr-4 py-3 text-sm font-medium text-[#2a2b30] outline-none transition-all focus:bg-white focus:ring-4`}
                                            />
                                        </div>
                                        {errors.phone && (
                                            <p className="mt-1 text-xs text-rose-500 font-medium">{errors.phone}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. Delivery Destination */}
                        <div className="rounded-3xl bg-white p-5 sm:p-7 shadow-xs border border-black/5 transition-all">
                            <div className="flex items-center gap-3 pb-5 border-b border-gray-100">
                                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#2a2b30] text-white font-bold text-sm shadow-xs">
                                    2
                                </div>
                                <div>
                                    <h2 className="text-base sm:text-lg font-extrabold text-[#2a2b30]">
                                        Delivery Destination
                                    </h2>
                                    <p className="text-xs text-gray-400">
                                        Single simplified delivery address line. No complicated forms.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 space-y-4">
                                {/* Single Delivery Address */}
                                <div>
                                    <label htmlFor="address" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Delivery Address <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none text-gray-400">
                                            <MapPin className="h-4 w-4" />
                                        </div>
                                        <textarea
                                            id="address"
                                            rows={2}
                                            required
                                            value={data.address}
                                            onChange={(e) => setData('address', e.target.value)}
                                            placeholder="Street address, Apartment / Suite, City, State / Province, Postal Code"
                                            className={`w-full rounded-2xl border ${
                                                errors.address ? 'border-rose-400 focus:ring-rose-200' : 'border-gray-200 focus:border-[#2a2b30] focus:ring-[#2a2b30]/10'
                                            } bg-[#fbfaf8] pl-10 pr-4 py-3 text-sm font-medium text-[#2a2b30] outline-none transition-all focus:bg-white focus:ring-4 resize-none`}
                                        />
                                    </div>
                                    {errors.address && (
                                        <p className="mt-1 text-xs text-rose-500 font-medium">{errors.address}</p>
                                    )}
                                </div>

                                {/* Optional Delivery Notes */}
                                <div>
                                    <label htmlFor="notes" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                                        <span>Delivery Instructions <span className="text-gray-400 font-normal">(Optional)</span></span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none text-gray-400">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <input
                                            id="notes"
                                            type="text"
                                            value={data.notes}
                                            onChange={(e) => setData('notes', e.target.value)}
                                            placeholder="e.g. Leave with doorman, gate code #4921, ring bell"
                                            className="w-full rounded-2xl border border-gray-200 bg-[#fbfaf8] pl-10 pr-4 py-2.5 text-sm font-medium text-[#2a2b30] outline-none transition-all focus:bg-white focus:border-[#2a2b30] focus:ring-4 focus:ring-[#2a2b30]/10"
                                        />
                                    </div>
                                    {errors.notes && (
                                        <p className="mt-1 text-xs text-rose-500 font-medium">{errors.notes}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* 3. Payment Method */}
                        <div className="rounded-3xl bg-white p-5 sm:p-7 shadow-xs border border-black/5 transition-all">
                            <div className="flex items-center gap-3 pb-5 border-b border-gray-100">
                                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-[#2a2b30] text-white font-bold text-sm shadow-xs">
                                    3
                                </div>
                                <div>
                                    <h2 className="text-base sm:text-lg font-extrabold text-[#2a2b30]">
                                        Payment Method
                                    </h2>
                                    <p className="text-xs text-gray-400">
                                        Select your preferred payment arrangement
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Cash on Delivery */}
                                <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => setData('payment_method', 'cod')}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            setData('payment_method', 'cod');
                                        }
                                    }}
                                    className={`relative cursor-pointer rounded-2xl border p-4 transition-all flex flex-col justify-between text-left ${
                                        data.payment_method === 'cod'
                                            ? 'border-[#2a2b30] bg-[#fbfaf8] ring-2 ring-[#2a2b30]/10 shadow-xs'
                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-xl ${data.payment_method === 'cod' ? 'bg-[#2a2b30] text-white' : 'bg-gray-100 text-gray-600'}`}>
                                                <Banknote className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#2a2b30]">Cash on Delivery</p>
                                                <p className="text-[11px] text-gray-400">Pay upon package arrival</p>
                                            </div>
                                        </div>
                                        {data.payment_method === 'cod' && (
                                            <CheckCircle2 className="h-5 w-5 text-[#2a2b30] shrink-0" />
                                        )}
                                    </div>
                                    <div className="mt-3 text-[11px] font-medium text-emerald-700 bg-emerald-50 rounded-lg px-2.5 py-1 inline-block self-start">
                                        No advance payment required
                                    </div>
                                </div>

                                {/* Credit / Debit Card */}
                                <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => setData('payment_method', 'card')}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            setData('payment_method', 'card');
                                        }
                                    }}
                                    className={`relative cursor-pointer rounded-2xl border p-4 transition-all flex flex-col justify-between text-left ${
                                        data.payment_method === 'card'
                                            ? 'border-[#2a2b30] bg-[#fbfaf8] ring-2 ring-[#2a2b30]/10 shadow-xs'
                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-xl ${data.payment_method === 'card' ? 'bg-[#2a2b30] text-white' : 'bg-gray-100 text-gray-600'}`}>
                                                <CreditCard className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#2a2b30]">Credit / Debit Card</p>
                                                <p className="text-[11px] text-gray-400">Instant direct authorization</p>
                                            </div>
                                        </div>
                                        {data.payment_method === 'card' && (
                                            <CheckCircle2 className="h-5 w-5 text-[#2a2b30] shrink-0" />
                                        )}
                                    </div>
                                    <div className="mt-3 text-[11px] font-medium text-blue-700 bg-blue-50 rounded-lg px-2.5 py-1 inline-block self-start">
                                        Visa, MasterCard, Amex
                                    </div>
                                </div>
                            </div>
                            {errors.payment_method && (
                                <p className="mt-2 text-xs text-rose-500 font-medium">{errors.payment_method}</p>
                            )}
                        </div>
                    </div>

                    {/* Right: Sticky Order Summary (4-5 Cols) */}
                    <aside className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-6">
                        <div className="rounded-3xl bg-white p-5 sm:p-7 shadow-sm border border-black/5">
                            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                <h3 className="text-lg font-extrabold text-[#2a2b30]">
                                    Order Summary
                                </h3>
                                <span className="rounded-full bg-[#f3eee7] px-3 py-1 text-xs font-bold text-[#2a2b30]">
                                    {cart.item_count} {cart.item_count === 1 ? 'item' : 'items'}
                                </span>
                            </div>

                            {/* Item Mini List */}
                            <div className="mt-4 max-h-[260px] overflow-y-auto divide-y divide-gray-100 pr-1 space-y-3">
                                {cart.items.map((item) => (
                                    <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3">
                                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-[#f8f6f2]">
                                            <img
                                                src={getImageUrl(item.product.image)}
                                                alt={item.product.name}
                                                className="h-full w-full object-cover"
                                            />
                                            <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-300 text-[10px] font-black text-black shadow-xs">
                                                {item.quantity}
                                            </span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-xs sm:text-sm font-bold text-[#2a2b30]">
                                                {item.product.name}
                                            </p>
                                            {item.product.brand && (
                                                <p className="text-[11px] font-medium text-gray-400">
                                                    {item.product.brand}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-xs sm:text-sm font-extrabold text-[#2a2b30]">
                                                {formatPrice(item.subtotal)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Coupon Code Section */}
                            <div className="mt-5 pt-4 border-t border-gray-100">
                                {cart.coupon ? (
                                    <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200/80 p-3 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 text-white shrink-0 shadow-2xs">
                                                <Tag className="h-3.5 w-3.5" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-xs font-black uppercase text-emerald-950 tracking-wider">
                                                        {cart.coupon.code}
                                                    </span>
                                                    <span className="rounded-full bg-emerald-200/70 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800">
                                                        Applied
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-emerald-700 font-medium truncate">
                                                    {cart.coupon.description}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRemoveCoupon}
                                            disabled={couponLoading}
                                            className="flex h-6 w-6 items-center justify-center rounded-full text-emerald-600 hover:bg-emerald-100/80 hover:text-emerald-900 transition-colors disabled:opacity-40 shrink-0 cursor-pointer"
                                            title="Remove coupon"
                                            aria-label="Remove coupon"
                                        >
                                            {couponLoading ? (
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                            ) : (
                                                <X className="h-3.5 w-3.5" />
                                            )}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-1.5">
                                        <label htmlFor="checkout-coupon-input" className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                                            Have a Coupon?
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <div className="relative flex-1">
                                                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400">
                                                    <Tag className="h-3.5 w-3.5" />
                                                </div>
                                                <input
                                                    id="checkout-coupon-input"
                                                    type="text"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                    placeholder="e.g. CHOCO10"
                                                    className="w-full rounded-xl border border-gray-200 bg-[#fbfaf8] pl-8 pr-2.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#2a2b30] outline-none transition-all focus:bg-white focus:border-[#2a2b30] focus:ring-2 focus:ring-[#2a2b30]/10"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleApplyCoupon}
                                                disabled={!couponCode.trim() || couponLoading}
                                                className="inline-flex items-center justify-center rounded-xl bg-[#2a2b30] px-3.5 py-1.5 text-xs font-bold text-white shadow-2xs hover:bg-black transition-all active:scale-[0.98] disabled:opacity-40 shrink-0 cursor-pointer h-[33px]"
                                            >
                                                {couponLoading ? (
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                ) : (
                                                    'Apply'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Calculation Breakdown */}
                            <div className="mt-5 pt-4 border-t border-gray-100 space-y-2.5 text-xs sm:text-sm">
                                <div className="flex justify-between text-gray-500 font-medium">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-[#2a2b30]">{formatPrice(cart.subtotal)}</span>
                                </div>
                                {cart.coupon && (cart.discount_amount ?? 0) > 0 && (
                                    <div className="flex justify-between text-emerald-600 font-medium">
                                        <span className="flex items-center gap-1.5">
                                            <Tag className="h-3.5 w-3.5" />
                                            Coupon Discount ({cart.coupon.code})
                                        </span>
                                        <span className="font-bold">
                                            -{formatPrice(cart.discount_amount)}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center text-gray-500 font-medium">
                                    <span className="flex items-center gap-1.5">
                                        <Truck className="h-3.5 w-3.5 text-blue-500" />
                                        Insulated Chilled Shipping
                                    </span>
                                    <span className="font-bold text-emerald-600 uppercase text-[11px] bg-emerald-50 px-2 py-0.5 rounded-full">
                                        Free
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-500 font-medium">
                                    <span>Estimated Sales Tax</span>
                                    <span className="font-bold text-[#2a2b30]">{formatPrice(0)}</span>
                                </div>

                                <div className="pt-4 border-t border-gray-100 flex justify-between items-baseline">
                                    <div>
                                        <p className="text-sm sm:text-base font-black text-[#2a2b30]">Total Due</p>
                                        <p className="text-[11px] text-gray-400">Including all fees & packaging</p>
                                    </div>
                                    <span className="text-2xl font-black text-[#2a2b30] tracking-tight">
                                        {formatPrice(cart.total ?? (cart.subtotal - (cart.discount_amount ?? 0)))}
                                    </span>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2a2b30] py-4 text-sm font-bold text-white shadow-sm hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 group cursor-pointer"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                                        <span>Securing Order...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="h-4 w-4 text-amber-300" />
                                        <span>Place Order Now</span>
                                    </>
                                )}
                            </button>

                            {/* Trust Guarantee Details */}
                            <div className="mt-6 pt-5 border-t border-gray-100 space-y-2.5">
                                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                    <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                                    <span>No hidden fees. 100% gourmet guarantee.</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                    <Truck className="h-4 w-4 text-blue-500 shrink-0" />
                                    <span>Dispatched in climate-controlled packaging.</span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </form>
            </div>
        </>
    );
}

Checkout.layout = {
    title: 'Express Checkout',
    subtitle: 'Quick & seamless order placement with minimal steps',
    showSearch: false,
};
