import { Head, Link } from '@inertiajs/react';
import { useCurrency } from '@/hooks/use-currency';
import {
    ArrowRight,
    CheckCircle2,
    Clock,
    CreditCard,
    Home,
    Mail,
    MapPin,
    PackageCheck,
    Phone,
    ShoppingBag,
    Sparkles,
    Tag,
    Truck,
} from 'lucide-react';

type OrderItem = {
    id: number;
    name: string;
    quantity: number;
    unit_price: number;
    total: number;
    image?: string | null;
};

type CheckoutSuccessProps = {
    title?: string;
    subtitle?: string;
    order: {
        number: string;
        customer_name: string;
        customer_email: string;
        customer_phone: string;
        subtotal: number;
        discount_total?: number;
        shipping_total: number;
        grand_total: number;
        payment_method: string;
        payment_status: string;
        shipping_status: string;
        shipping_address?: {
            name?: string;
            phone?: string;
            address?: string;
            notes?: string;
        } | null;
        notes?: string | null;
        placed_at: string;
        items: OrderItem[];
    };
};

const getImageUrl = (path?: string | null) => {
    if (!path) return 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=400&q=80';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `/storage/${path}`;
};

export default function CheckoutSuccess({ order }: CheckoutSuccessProps) {
    const { formatPrice } = useCurrency();
    return (
        <>
            <Head title={`Order ${order.number} Confirmed`} />

            <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 lg:px-6 py-6 sm:py-10">
                {/* Hero Confirmation Card */}
                <div className="rounded-3xl bg-white p-6 sm:p-10 shadow-xs border border-black/5 text-center">
                    <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/50">
                        <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
                    </div>

                    <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3.5 py-1 text-xs font-bold text-amber-900 border border-amber-200/60 mb-3">
                        <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                        <span>Artisanal Order Confirmed</span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#2a2b30]">
                        Thank You, {order.customer_name || 'Valued Guest'}!
                    </h1>
                    <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-md mx-auto">
                        Your order <span className="font-extrabold text-[#2a2b30]">{order.number}</span> has been received and is now being handcrafted and packaged.
                    </p>

                    {/* Order Meta Bar */}
                    <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#fbfaf8] p-4 rounded-2xl border border-gray-100 text-left">
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Order Number</p>
                            <p className="text-xs sm:text-sm font-black text-[#2a2b30] mt-0.5">{order.number}</p>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Date Placed</p>
                            <p className="text-xs sm:text-sm font-bold text-[#2a2b30] mt-0.5">{order.placed_at}</p>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Payment</p>
                            <p className="text-xs sm:text-sm font-bold text-[#2a2b30] mt-0.5 capitalize">{order.payment_method}</p>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Total Amount</p>
                            <p className="text-xs sm:text-sm font-black text-emerald-700 mt-0.5">{formatPrice(order.grand_total)}</p>
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Left: Shipping Destination & Customer Info (5 cols) */}
                    <div className="md:col-span-5 space-y-6">
                        {/* Destination Card */}
                        <div className="rounded-3xl bg-white p-6 shadow-xs border border-black/5 space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-wider text-[#2a2b30] flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                Delivery Destination
                            </h3>

                            <div className="bg-[#fbfaf8] rounded-2xl p-4 border border-gray-100 text-xs sm:text-sm space-y-2">
                                <p className="font-extrabold text-[#2a2b30]">{order.customer_name}</p>
                                <p className="text-gray-600 whitespace-pre-line leading-relaxed">
                                    {order.shipping_address?.address || 'No address specified'}
                                </p>
                                {order.shipping_address?.notes && (
                                    <div className="mt-2 pt-2 border-t border-gray-200/60 text-gray-500 italic text-xs">
                                        " {order.shipping_address.notes} "
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2 text-xs text-gray-500">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                    <span>{order.customer_email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                    <span>{order.customer_phone}</span>
                                </div>
                            </div>
                        </div>

                        {/* Dispatch Notice */}
                        <div className="rounded-3xl bg-[#f8f6f2] p-6 border border-gray-200/60 space-y-3">
                            <div className="flex items-center gap-2.5 text-sm font-bold text-[#2a2b30]">
                                <Truck className="h-4 w-4 text-blue-600" />
                                <span>Climate-Controlled Courier</span>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                Your artisanal chocolates are packed with insulated liners and food-safe cool packs to ensure perfection upon arrival.
                            </p>
                        </div>
                    </div>

                    {/* Right: Items Ordered (7 cols) */}
                    <div className="md:col-span-7">
                        <div className="rounded-3xl bg-white p-6 shadow-xs border border-black/5">
                            <h3 className="text-sm font-black uppercase tracking-wider text-[#2a2b30] flex items-center gap-2 pb-4 border-b border-gray-100">
                                <ShoppingBag className="h-4 w-4 text-gray-500" />
                                Ordered Items ({order.items.length})
                            </h3>

                            <div className="divide-y divide-gray-100">
                                {order.items.map((item) => (
                                    <div key={item.id} className="py-3.5 flex items-center gap-3.5">
                                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-[#f8f6f2]">
                                            <img
                                                src={getImageUrl(item.image)}
                                                alt={item.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-bold text-[#2a2b30]">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                Qty: {item.quantity} × {formatPrice(item.unit_price)}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-sm font-black text-[#2a2b30]">
                                                {formatPrice(item.total)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-xs sm:text-sm">
                                <div className="flex justify-between text-gray-500">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-[#2a2b30]">{formatPrice(order.subtotal)}</span>
                                </div>
                                {order.discount_total && order.discount_total > 0 ? (
                                    <div className="flex justify-between text-emerald-600 font-medium">
                                        <span className="flex items-center gap-1.5">
                                            <Tag className="h-3.5 w-3.5" />
                                            Coupon Discount
                                        </span>
                                        <span className="font-bold">
                                            -{formatPrice(order.discount_total)}
                                        </span>
                                    </div>
                                ) : null}
                                <div className="flex justify-between text-gray-500">
                                    <span>Insulated Shipping</span>
                                    <span className="font-bold text-emerald-600 uppercase text-xs">Free</span>
                                </div>
                                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                                    <span className="text-base font-extrabold text-[#2a2b30]">Total Paid</span>
                                    <span className="text-xl font-black text-[#2a2b30]">
                                        {formatPrice(order.grand_total)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Navigation CTA */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/shop"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2a2b30] px-8 py-3.5 text-sm font-bold text-white shadow-xs hover:bg-black transition-all active:scale-[0.98]"
                    >
                        <ShoppingBag className="h-4 w-4" />
                        Explore More Chocolates
                        <ArrowRight className="h-4 w-4" />
                    </Link>

                    <Link
                        href="/"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-gray-200 px-7 py-3.5 text-sm font-bold text-gray-700 shadow-2xs hover:bg-gray-50 transition-all"
                    >
                        <Home className="h-4 w-4" />
                        Return to Homepage
                    </Link>
                </div>
            </div>
        </>
    );
}

CheckoutSuccess.layout = {
    title: 'Order Confirmation',
    subtitle: 'Your order was placed successfully',
    showSearch: false,
};
