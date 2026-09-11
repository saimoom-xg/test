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
    Star,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useCurrency } from '@/hooks/use-currency';

export type PromotionalProduct = {
    id: number;
    name: string;
    slug: string;
    description?: string;
    short_description?: string;
    price: number | string;
    sale_price?: number | string | null;
    is_featured?: boolean;
    brand?: { name: string } | null;
    categories?: Array<{ id: number; name: string }>;
    images?: Array<{ path: string; is_primary?: boolean }>;
    badge?: string;
    offerHighlight?: string;
    [key: string]: any;
};

type PromotionalContentGridBlockProps = {
    products?: PromotionalProduct[];
    offers?: any[];
    staticTitle?: string;
    staticDescription?: string;
    manageUrl?: string;
    className?: string;
};

export default function PromotionalContentGridBlock({
    products = [],
    offers = [],
    staticTitle = 'Handcrafted Featured Confections',
    staticDescription = 'Discover our chef-curated selection of premium chocolates, handcrafted with single-origin cacao and rare European ingredients.',
    manageUrl = '/shop?featured=1',
    className = '',
}: PromotionalContentGridBlockProps) {
    const { formatPrice } = useCurrency();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAdding, setIsAdding] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // Strictly show real featured items dynamically
    const featuredList: PromotionalProduct[] = (() => {
        if (products && products.length > 0) {
            const explicitlyFeatured = products.filter((p) => Boolean(p && p.id && (p.is_featured || p.featured)));
            if (explicitlyFeatured.length > 0) return explicitlyFeatured;
            return products.filter((p) => Boolean(p && p.id));
        }
        if (offers && offers.length > 0) {
            return offers.map((o) => (o.product ? { ...o.product, ...o } : o)).filter((p) => Boolean(p && p.id));
        }
        return [];
    })();

    if (featuredList.length === 0) {
        return null;
    }

    const total = featuredList.length;
    const currentProduct = featuredList[currentIndex % total];

    const handlePrev = (): void => {
        if (total <= 1) return;
        setCurrentIndex((prev) => (prev - 1 + total) % total);
    };

    const handleNext = (): void => {
        if (total <= 1) return;
        setCurrentIndex((prev) => (prev + 1) % total);
    };

    // Auto-play carousel every 5.5 seconds; pauses on hover or when adding to cart
    useEffect(() => {
        if (total <= 1 || isPaused || isAdding) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % total);
        }, 5500);

        return () => clearInterval(timer);
    }, [total, isPaused, isAdding, currentIndex]);

    const getProductImg = (product: PromotionalProduct): string => {
        if (product.images && product.images.length > 0) {
            const primary = product.images.find((img) => img.is_primary) || product.images[0];
            if (primary?.path) {
                return primary.path.startsWith('http') ? primary.path : `/storage/${primary.path}`;
            }
        }
        if (product.image) {
            return product.image.startsWith('http') ? product.image : `/storage/${product.image}`;
        }
        return 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=800&auto=format&fit=crop';
    };

    const handleAddToCart = (): void => {
        if (!currentProduct?.id || isAdding) return;
        setIsAdding(true);

        router.post(
            '/cart/items',
            { product_id: currentProduct.id, quantity: 1 },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(`${currentProduct.name} added to cart!`);
                },
                onError: () => {
                    toast.error('Could not add item to cart.');
                },
                onFinish: () => setIsAdding(false),
            }
        );
    };

    const discountPercent =
        currentProduct.sale_price && Number(currentProduct.price) > 0
            ? Math.round(
                  ((Number(currentProduct.price) - Number(currentProduct.sale_price)) /
                      Number(currentProduct.price)) *
                      100
              )
            : null;

    const [touchStartX, setTouchStartX] = useState<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX === null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (diff > 45) {
            handleNext();
        } else if (diff < -45) {
            handlePrev();
        }
        setTouchStartX(null);
    };

    return (
        <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className={`group/banner w-full relative rounded-2xl sm:rounded-[28px] bg-gradient-to-r from-[#fff0f3] via-[#ffe4e8] to-[#fce7f3] border sm:border-2 border-pink-200/80 p-3 sm:p-5 md:px-7 md:py-4.5 overflow-hidden shadow transition-all duration-300 select-none ${className}`}
        >
            {/* Cute Soft Pastel Ambient Blobs */}
            <div className="absolute -left-12 -top-12 w-48 h-48 rounded-full bg-pink-300/20 blur-2xl pointer-events-none" />
            <div className="absolute -right-12 -bottom-12 w-56 h-56 rounded-full bg-rose-200/25 blur-2xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-12 gap-2.5 sm:gap-6 items-center">
                {/* Left Side: Editorial Story & Cute Actions */}
                <div className="col-span-7 sm:col-span-8 lg:col-span-8 xl:col-span-9 flex flex-col justify-center min-w-0">
                    {/* Top Row: Cute Ribbon Pill & Navigation */}
                    <div className="flex items-center justify-between gap-1.5 sm:gap-3 mb-1 sm:mb-1.5">
                        <span className="inline-flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-bold text-[#e11d48] bg-white/95 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full border border-pink-200/80 shadow-2xs truncate">
                            <span className="text-[11px] sm:text-xs">🎀</span>
                            <span className="font-extrabold truncate">{currentProduct.brand?.name || 'Chef’s Selection'}</span>
                            <span className="hidden sm:inline text-pink-300">•</span>
                            <span className="hidden sm:inline truncate text-pink-700 font-semibold">{currentProduct.badge || 'Sweet Treat of the Day'}</span>
                        </span>

                        {/* Cute Slide Indicators & Controls */}
                        {total > 1 && (
                            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                                <span className="text-[10px] sm:text-[11px] font-bold text-[#e11d48] bg-white/95 px-1.5 sm:px-2.5 py-0.5 rounded-full border border-pink-200 shadow-2xs">
                                    <span>{currentIndex + 1}</span>
                                    <span className="text-pink-300 mx-0.5">/</span>
                                    <span>{total}</span>
                                </span>

                                <div className="flex items-center gap-0.5 sm:gap-1">
                                    <button
                                        type="button"
                                        onClick={handlePrev}
                                        aria-label="Previous featured sweet"
                                        className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 rounded-full bg-white hover:bg-[#f43f5e] hover:text-white border border-pink-200 text-[#e11d48] flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-2xs"
                                    >
                                        <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        aria-label="Next featured sweet"
                                        className="w-5.5 h-5.5 sm:w-6.5 sm:h-6.5 rounded-full bg-white hover:bg-[#f43f5e] hover:text-white border border-pink-200 text-[#e11d48] flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-2xs"
                                    >
                                        <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Cute Headline */}
                    <Link href={`/products/${currentProduct.slug}`} className="group/title block mb-0.5 sm:mb-1">
                        <h2 className="text-xs min-[360px]:text-sm sm:text-xl md:text-2xl font-black text-[#2e151e] tracking-tight leading-snug group-hover/title:text-[#e11d48] transition-colors line-clamp-2 sm:truncate">
                            {currentProduct.name}
                        </h2>
                    </Link>

                    {/* Tasting Note / Description (hidden on mobile to keep banner sleek & compact, visible on sm+) */}
                    <p className="hidden sm:block text-xs sm:text-[13px] text-[#784e59] font-medium leading-relaxed truncate max-w-xl mb-2.5">
                        {currentProduct.short_description || currentProduct.description || staticDescription}
                    </p>

                    {/* Bottom Action Row: Price & Cute Bouncy Button */}
                    <div className="flex items-center justify-between sm:justify-start gap-1.5 sm:gap-3 mt-1 sm:mt-2.5 sm:pt-2.5 sm:border-t sm:border-pink-200/60">
                        <div className="flex items-baseline gap-1 sm:gap-2">
                            <span className="text-sm min-[360px]:text-base sm:text-2xl font-black text-[#e11d48] tracking-tight">
                                {formatPrice(currentProduct.sale_price || currentProduct.price)}
                            </span>
                            {currentProduct.sale_price && (
                                <span className="text-[10px] sm:text-xs text-[#9d737d] line-through font-semibold">
                                    {formatPrice(currentProduct.price)}
                                </span>
                            )}
                            {discountPercent && discountPercent > 0 && (
                                <span className="hidden sm:inline-block text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white text-[#e11d48] border border-pink-200 shadow-2xs ml-1">
                                    Save {discountPercent}%
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-2.5 sm:ml-auto">
                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={isAdding}
                                className="h-7 sm:h-9 px-2.5 sm:px-6 rounded-full bg-[#f43f5e] hover:bg-[#e11d48] text-white font-extrabold text-[11px] sm:text-xs tracking-wide shadow-2xs active:scale-95 transition-all flex items-center gap-1 sm:gap-2 cursor-pointer disabled:opacity-50 shrink-0"
                                aria-label={`Add ${currentProduct.name} to cart`}
                            >
                                {isAdding ? (
                                    <Loader2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin text-white" />
                                ) : (
                                    <>
                                        <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                        <span>Add<span className="hidden min-[380px]:inline">&nbsp;to Bag</span></span>
                                    </>
                                )}
                            </button>

                            <Link
                                href={`/products/${currentProduct.slug}`}
                                className="hidden sm:flex h-9 px-4 rounded-full bg-cyan-300 text-black font-bold text-xs items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                            >
                                <span>Details</span>
                                <ArrowRight className="w-3.5 h-3.5 text-black group-hover:translate-x-0.5 transition-transform" />
                            </Link>

                            <Link
                                href={manageUrl}
                                className="p-1.5 text-pink-400 hover:text-[#e11d48] transition-colors hidden md:inline-flex"
                                title="Manage featured items"
                            >
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Right Side: Cute Macaron White Card Showcase (3-5 cols) */}
                <div className="col-span-5 sm:col-span-4 lg:col-span-4 xl:col-span-3 flex items-center justify-end">
                    <div className="relative w-full max-w-[115px] min-[360px]:max-w-[130px] sm:max-w-[210px] md:max-w-[230px] aspect-square sm:aspect-[4/3] rounded-2xl sm:rounded-[22px] bg-white p-1.5 sm:p-2.5 border border-pink-200/80 shadow-xs sm:shadow-sm flex items-center justify-center overflow-hidden group/pedestal">
                        <Link
                            href={`/products/${currentProduct.slug}`}
                            className="w-full h-full flex items-center justify-center cursor-pointer relative z-10"
                        >
                            <img
                                src={getProductImg(currentProduct)}
                                alt={currentProduct.name}
                                className="w-full h-full object-cover mix-blend-multiply scale-[1.10] sm:scale-[1.12] transition-transform duration-500 group-hover/pedestal:scale-[1.20]"
                            />
                        </Link>

                        {/* Floating Cute Sticker Badge */}
                        {discountPercent && discountPercent > 0 ? (
                            <span className="absolute top-1 sm:top-1.5 left-1 sm:left-1.5 inline-flex items-center gap-0.5 sm:gap-1 text-[8.5px] sm:text-[10px] font-black px-1.5 sm:px-2.5 py-0.5 rounded-full bg-[#f43f5e] text-white shadow-xs border border-white z-20">
                                <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-white" />
                                <span>-{discountPercent}%</span>
                            </span>
                        ) : (
                            <span className="absolute top-1 sm:top-1.5 left-1 sm:left-1.5 inline-flex items-center gap-0.5 sm:gap-1 text-[8px] sm:text-[9.5px] font-black uppercase px-1.5 sm:px-2.5 py-0.5 rounded-full bg-red-400 text-white shadow-xs border border-white z-20">
                                <Star className="w-2 h-2 sm:w-2.5 sm:h-2.5 fill-white" />
                                <span>Special</span>
                            </span>
                        )}

                        <span className="hidden sm:inline-block absolute bottom-1.5 right-1.5 text-[9px] font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200/60 shadow-2xs z-20">
                            {currentProduct.brand?.name || 'Artisan Series'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
