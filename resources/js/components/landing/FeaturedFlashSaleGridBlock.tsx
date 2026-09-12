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
            className={`col-span-1 sm:col-span-2 lg:col-span-2 relative rounded-[28px] p-5 sm:p-6 overflow-hidden flex flex-col justify-between bg-gradient-to-b from-[#16161B] via-[#121215] to-[#0A0A0C] transition-all duration-300 h-full select-none ${className}`}
        >
            {/* Atmosphere & Botanical Leaf Accents inspired by the artisanal dark poster */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                {/* SVG Definitions for realistic leaf gradients */}
                <svg className="absolute w-0 h-0" aria-hidden="true">
                    <defs>
                        <linearGradient id="leafGradTop" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#55A760" />
                            <stop offset="50%" stopColor="#2E6C38" />
                            <stop offset="100%" stopColor="#153B1C" />
                        </linearGradient>
                        <linearGradient id="leafGradSide" x1="100%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#66B872" />
                            <stop offset="60%" stopColor="#31783C" />
                            <stop offset="100%" stopColor="#184320" />
                        </linearGradient>
                        <linearGradient id="leafGradBottom" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#4A9954" />
                            <stop offset="60%" stopColor="#245A2C" />
                            <stop offset="100%" stopColor="#123317" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Subtle warm golden ambient radial light from top */}
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-40 bg-[#D4AF37]/10 blur-3xl rounded-full" />
                <div className="absolute -bottom-16 right-10 w-60 h-36 bg-[#2E6C38]/10 blur-3xl rounded-full" />

                {/* Subtle smoky marble texture / vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/[0.05] via-transparent to-black/40" />

                {/* Botanical Leaf 1: Top-Left Corner Cluster */}
                <svg
                    className="absolute -top-3 -left-3 w-16 h-16 sm:w-20 sm:h-20 drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] rotate-[-15deg] transition-transform duration-700 group-hover:scale-105"
                    viewBox="0 0 80 80"
                    fill="none"
                >
                    <path
                        d="M12,68 C16,40 38,18 68,12 C72,28 58,54 36,64 C24,70 16,69 12,68 Z"
                        fill="url(#leafGradTop)"
                    />
                    <path
                        d="M16,65 Q38,42 64,16"
                        stroke="#A7F3D0"
                        strokeWidth="1.2"
                        strokeOpacity="0.45"
                    />
                    <path
                        d="M32,50 Q42,48 48,42"
                        stroke="#A7F3D0"
                        strokeWidth="0.8"
                        strokeOpacity="0.3"
                    />
                </svg>

                {/* Botanical Leaf 2: Top-Left Secondary Leaf */}
                <svg
                    className="absolute top-8 -left-3 w-10 h-12 drop-shadow-md rotate-[35deg] opacity-80"
                    viewBox="0 0 60 70"
                    fill="none"
                >
                    <path
                        d="M8,55 C12,32 30,14 52,10 C56,22 44,44 26,52 C16,56 10,55 8,55 Z"
                        fill="url(#leafGradSide)"
                    />
                    <path
                        d="M11,52 Q28,34 49,13"
                        stroke="#A7F3D0"
                        strokeWidth="0.9"
                        strokeOpacity="0.4"
                    />
                </svg>

                {/* Botanical Leaf 3: Bottom-Right Corner Accent */}
                <svg
                    className="absolute -bottom-4 -right-4 w-18 h-18 sm:w-22 sm:h-22 drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)] rotate-[195deg] transition-transform duration-700 group-hover:scale-105"
                    viewBox="0 0 80 80"
                    fill="none"
                >
                    <path
                        d="M10,68 C15,38 38,16 68,10 C72,26 58,54 35,64 C22,70 14,69 10,68 Z"
                        fill="url(#leafGradBottom)"
                    />
                    <path
                        d="M14,65 Q38,40 64,14"
                        stroke="#A7F3D0"
                        strokeWidth="1.2"
                        strokeOpacity="0.4"
                    />
                </svg>

                {/* Botanical Leaf 4: Bottom-Left subtle leaf */}
                <svg
                    className="absolute -bottom-2 left-16 w-8 h-10 drop-shadow-md rotate-[-45deg] opacity-60"
                    viewBox="0 0 50 60"
                    fill="none"
                >
                    <path
                        d="M6,48 C10,28 25,12 44,8 C47,18 38,36 22,44 C14,48 8,48 6,48 Z"
                        fill="url(#leafGradSide)"
                    />
                </svg>
            </div>

            {/* Top Bar: Luxury Dark & Gold Header */}
            <div className="relative z-10 flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide bg-[#1C1C22]/90 text-[#F5D061] border border-[#D4AF37]/50 backdrop-blur-sm">
                        <Sparkles className="w-3.5 h-3.5 text-[#F5D061] animate-pulse" />
                        <span>{title || 'Flash Sale'}</span>
                    </span>
                </div>

                {/* Right Side: Manage Link & Gold Carousel Buttons */}
                <div className="flex items-center gap-2">
                    <Link
                        href={manageUrl}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-300 hover:text-[#F5D061] transition-colors group px-3 py-1.5 rounded-full bg-[#1C1C22]/80 hover:bg-[#25252D] border border-zinc-700/80 hover:border-[#D4AF37]/60 cursor-pointer backdrop-blur-sm"
                        title="Manage flash sale items"
                    >
                        <SlidersHorizontal className="w-3 h-3 text-zinc-400 group-hover:text-[#F5D061] transition-colors" />
                        <span>Manage</span>
                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 text-zinc-400 group-hover:text-[#F5D061]" />
                    </Link>

                    {total > 2 && (
                        <div className="flex items-center gap-1.5 ml-1">
                            <button
                                type="button"
                                onClick={handlePrev}
                                aria-label="Previous items"
                                className="w-8 h-8 rounded-full border border-zinc-700/80 bg-[#1C1C22]/90 hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#F5D061] hover:border-[#D4AF37] text-zinc-300 hover:text-black flex items-center justify-center transition-all cursor-pointer active:scale-90"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={handleNext}
                                aria-label="Next items"
                                className="w-8 h-8 rounded-full border border-zinc-700/80 bg-[#1C1C22]/90 hover:bg-gradient-to-r hover:from-[#D4AF37] hover:to-[#F5D061] hover:border-[#D4AF37] text-zinc-300 hover:text-black flex items-center justify-center transition-all cursor-pointer active:scale-90"
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
                            className="group/card relative bg-[#18181D]/95 hover:bg-[#1E1E24] rounded-[22px] p-3.5 flex flex-col justify-between border-2 border-zinc-800/90 transition-all duration-300"
                        >
                            {/* Product Card Top: Image + Gold Discount Badge */}
                            <div className="relative w-full h-[105px] sm:h-[135px] bg-gradient-to-b from-[#25252C] via-[#1D1D22] to-[#141418] rounded-[16px] overflow-hidden flex items-center justify-center mb-2.5 border border-zinc-800/80 transition-colors">
                                <Link
                                    href={`/products/${product.slug}`}
                                    className="w-full h-full flex items-center justify-center cursor-pointer"
                                >
                                    <img
                                        src={getProductImg(product)}
                                        alt={product.name}
                                        className="w-full h-full object-cover drop-shadow-[0_6px_14px_rgba(0,0,0,0.6)] scale-[1.08] transition-transform duration-500 group-hover/card:scale-[1.18]"
                                    />
                                </Link>

                                {discountPercent && discountPercent > 0 && (
                                    <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 text-[11px] font-black tracking-tight px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F5D061] to-[#D4AF37] text-black border border-amber-200/70">
                                        <Flame className="w-3 h-3 fill-black text-black" />
                                        <span>-{discountPercent}%</span>
                                    </span>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <Link href={`/products/${product.slug}`}>
                                        <h4 className="text-[13.5px] font-extrabold text-zinc-100 line-clamp-2 h-[38px] leading-snug group-hover/card:text-[#F5D061] transition-colors mt-1.5">
                                            {product.name}
                                        </h4>
                                    </Link>
                                </div>

                                {/* Price & Add to Cart Action */}
                                <div className="pt-2.5 flex items-center justify-between gap-2">
                                    <div className="flex flex-col min-w-0">
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-[16px] font-black text-[#F5D061] tracking-tight drop-shadow-[0_0_8px_rgba(245,208,97,0.3)]">
                                                {formatPrice(product.sale_price || product.price)}
                                            </span>
                                            {product.sale_price && (
                                                <span className="text-[11px] text-zinc-400 line-through font-semibold truncate">
                                                    {formatPrice(product.price)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleAddToCart(product)}
                                        disabled={isAdding}
                                        className="h-9 px-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F5D061] to-[#E5B842] hover:from-[#F5D061] hover:to-[#D4AF37] text-black hover:text-black text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50 shrink-0"
                                        aria-label={`Add ${product.name} to cart`}
                                    >
                                        {isAdding ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin text-black" />
                                        ) : (
                                            <>
                                                <ShoppingBag className="w-3.5 h-3.5 text-black" />
                                                <span className="text-black font-black">Add</span>
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
