import { Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Clock,
    Flame,
    Loader2,
    ShoppingBag,
    SlidersHorizontal,
    Sparkles,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useCurrency } from '@/hooks/use-currency';

export type PromoProduct = {
    id: number;
    name: string;
    slug: string;
    price: number | string;
    sale_price?: number | string | null;
    brand?: { name: string } | null;
    images?: Array<{ path: string; is_primary?: boolean }>;
    [key: string]: any;
};

type FeaturedFlashSaleGridBlockProps = {
    title?: string;
    products?: PromoProduct[];
    manageUrl?: string;
    className?: string;
};

export default function FeaturedFlashSaleGridBlock({
    title = 'Flash Sale',
    products = [],
    manageUrl = '/shop?sale=1',
    className = '',
}: FeaturedFlashSaleGridBlockProps) {
    const { formatPrice } = useCurrency();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [addingId, setAddingId] = useState<number | null>(null);
    const [isPaused, setIsPaused] = useState(false);

    // ONLY show products that have a valid sale price (i.e. in offer)
    const items = products.filter(
        (product): product is PromoProduct =>
            Boolean(
                product &&
                product.id &&
                product.sale_price !== null &&
                product.sale_price !== undefined &&
                Number(product.sale_price) > 0 &&
                Number(product.sale_price) < Number(product.price)
            )
    );

    // If no products on offer, do not render this block
    if (items.length === 0) {
        return null;
    }

    const total = items.length;

    const handlePrev = (): void => {
        if (total <= 2) return;
        setCurrentIndex((prev) => (prev - 2 + total) % total);
    };

    const handleNext = (): void => {
        if (total <= 2) return;
        setCurrentIndex((prev) => (prev + 2) % total);
    };

    // Auto-play carousel every 5.5 seconds; pauses on hover or when adding to cart
    useEffect(() => {
        if (total <= 2 || isPaused || addingId !== null) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 2) % total);
        }, 5500);

        return () => clearInterval(timer);
    }, [total, isPaused, addingId, currentIndex]);

    // Calculate the 2 products currently shown
    const visibleProducts: PromoProduct[] = total <= 2
        ? items
        : [
            items[currentIndex % total],
            items[(currentIndex + 1) % total],
        ];

    const getProductImg = (product: PromoProduct): string => {
        if (product.images && product.images.length > 0) {
            const primary = product.images.find((img) => img.is_primary) || product.images[0];
            if (primary?.path) {
                return primary.path.startsWith('http') ? primary.path : `/storage/${primary.path}`;
            }
        }
        return 'https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=600&auto=format&fit=crop';
    };

    const handleAddToCart = (product: PromoProduct): void => {
        if (addingId === product.id) return;
        setAddingId(product.id);

        router.post(
            '/cart/items',
            { product_id: product.id, quantity: 1 },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(`${product.name} added to cart!`);
                },
                onError: () => {
                    toast.error('Could not add item to cart.');
                },
                onFinish: () => setAddingId(null),
            }
        );
    };

    return (
        <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className={`col-span-1 sm:col-span-2 lg:col-span-2 relative rounded-[28px] p-5 sm:p-6 overflow-hidden flex flex-col justify-between bg-gradient-to-br from-[#fffdfa] via-[#fffbf5] to-[#fef6ea] border border-[#f3e4d0] shadow-[0_4px_24px_rgba(217,119,6,0.06)] hover:shadow-[0_10px_35px_rgba(217,119,6,0.12)] transition-all duration-300 h-full ${className}`}
        >
            {/* Cute Decorative Warm Radial Background Auras */}
            <div className="absolute -top-16 -right-16 w-44 h-44 rounded-full bg-gradient-to-br from-amber-200/40 via-orange-200/25 to-rose-200/20 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-gradient-to-tr from-amber-100/30 to-yellow-100/25 blur-xl pointer-events-none" />

            {/* Top Bar: Playful Badge + Quick Stats + Carousel Navigation */}
            <div className="relative z-10 flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 text-white shadow-xs">
                        <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                        <span>{title || 'Flash Sale'}</span>
                    </span>
                </div>

                {/* Right Side: Manage Link & Cute Carousel Buttons */}
                <div className="flex items-center gap-2">
                    <Link
                        href={manageUrl}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2a2b30] hover:text-amber-700 transition-colors group px-3 py-1.5 rounded-full bg-white/90 border border-stone-200/80 hover:border-amber-300 shadow-2xs cursor-pointer"
                        title="Manage flash sale items"
                    >
                        <SlidersHorizontal className="w-3 h-3 text-stone-400 group-hover:text-amber-600 transition-colors" />
                        <span>Manage</span>
                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 text-stone-400 group-hover:text-amber-600" />
                    </Link>

                    {total > 2 && (
                        <div className="flex items-center gap-1.5 ml-1">
                            <button
                                type="button"
                                onClick={handlePrev}
                                aria-label="Previous items"
                                className="w-8 h-8 rounded-full border border-stone-200/80 bg-white hover:bg-stone-50 hover:border-stone-400 flex items-center justify-center text-stone-600 hover:text-black transition-all cursor-pointer active:scale-90 shadow-2xs"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={handleNext}
                                aria-label="Next items"
                                className="w-8 h-8 rounded-full border border-stone-200/80 bg-white hover:bg-stone-50 hover:border-stone-400 flex items-center justify-center text-stone-600 hover:text-black transition-all cursor-pointer active:scale-90 shadow-2xs"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* 2-Product Display */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 flex-1 items-stretch">
                {visibleProducts.map((product) => {
                    const isAdding = addingId === product.id;
                    const discountPercent =
                        product.sale_price && Number(product.price) > 0
                            ? Math.round(
                                  ((Number(product.price) - Number(product.sale_price)) /
                                      Number(product.price)) *
                                      100
                              )
                            : null;

                    return (
                        <div
                            key={product.id}
                            className="group/card relative bg-white/95 hover:bg-white rounded-[24px] p-3.5 flex flex-col justify-between border border-stone-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(217,119,6,0.12)] transition-all duration-300"
                        >
                            {/* Product Card Top: Image + Discount Badge */}
                            <div className="relative w-full h-[102px] sm:h-[132px] bg-gradient-to-b from-stone-50 to-[#f9f7f4] rounded-[18px] overflow-hidden flex items-center justify-center mb-2.5 border border-stone-100 group-hover/card:border-amber-100 transition-colors">
                                <Link
                                    href={`/products/${product.slug}`}
                                    className="w-full h-full flex items-center justify-center cursor-pointer"
                                >
                                    <img
                                        src={getProductImg(product)}
                                        alt={product.name}
                                        className="w-full h-full object-cover mix-blend-multiply drop-shadow-xl scale-[1.15] transition-transform duration-500 group-hover:scale-[1.25]"
                                    />
                                </Link>

                                {discountPercent && discountPercent > 0 && (
                                    <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 text-[11px] font-extrabold tracking-tight px-2.5 py-0.5 rounded-full bg-red-400 text-white shadow-sm">
                                        <Flame className="w-3 h-3 fill-white" />
                                        <span>-{discountPercent}%</span>
                                    </span>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <Link href={`/products/${product.slug}`}>
                                        <h4 className="text-[13.5px] font-bold text-[#2a2b30] line-clamp-2 h-[38px] leading-snug group-hover/card:text-amber-800 transition-colors mt-1.5">
                                            {product.name}
                                        </h4>
                                    </Link>
                                </div>

                                {/* Price & Add to Cart Action */}
                                <div className="pt-2.5 flex items-center justify-between gap-2">
                                    <div className="flex flex-col min-w-0">
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-[16px] font-extrabold text-[#2a2b30] tracking-tight">
                                                {formatPrice(product.sale_price || product.price)}
                                            </span>
                                            {product.sale_price && (
                                                <span className="text-[11px] text-stone-400 line-through font-semibold truncate">
                                                    {formatPrice(product.price)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleAddToCart(product)}
                                        disabled={isAdding}
                                        className="h-9 px-3.5 rounded-full bg-[#2a2b30] hover:bg-black text-[#facc15] hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50 shrink-0 shadow-xs hover:shadow"
                                        aria-label={`Add ${product.name} to cart`}
                                    >
                                        {isAdding ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                                        ) : (
                                            <>
                                                <ShoppingBag className="w-3.5 h-3.5" />
                                                <span>Add</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
