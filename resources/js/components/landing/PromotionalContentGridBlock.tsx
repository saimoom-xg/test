import { Link, router } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    ShoppingBag,
} from 'lucide-react';
import { useEffect, useState } from 'react';
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
    image?: string;
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
    staticTitle,
    staticDescription = 'Discover our handpicked selection of premium creations, crafted with exceptional quality and attention to detail.',
    manageUrl = '/shop?featured=1',
    className = '',
}: PromotionalContentGridBlockProps) {
    const { formatPrice } = useCurrency();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [isFading, setIsFading] = useState(false);

    // Build the dynamic list of featured/promotional items
    const featuredList: PromotionalProduct[] = (() => {
        if (products && products.length > 0) {
            const explicitlyFeatured = products.filter((p) => Boolean(p && p.id && (p.is_featured || p.featured)));
            if (explicitlyFeatured.length > 0) return explicitlyFeatured;
            return products.filter((p) => Boolean(p && p.id));
        }
        if (offers && offers.length > 0) {
            const mapped = offers.map((o) => (o.product ? { ...o.product, ...o } : o)).filter((p) => Boolean(p && p.id));
            if (mapped.length > 0) return mapped;
        }
        return [];
    })();

    if (featuredList.length === 0) {
        return null;
    }

    const total = featuredList.length;
    const currentProduct = featuredList[currentIndex % total];

    const changeSlide = (newIndex: number): void => {
        if (isFading || total <= 1) return;
        setIsFading(true);
        setTimeout(() => {
            setCurrentIndex(newIndex);
            setIsFading(false);
        }, 180);
    };

    const handlePrev = (): void => {
        if (total <= 1) return;
        changeSlide((currentIndex - 1 + total) % total);
    };

    const handleNext = (): void => {
        if (total <= 1) return;
        changeSlide((currentIndex + 1) % total);
    };

    // Auto-play carousel every 5.5 seconds; pauses on hover
    useEffect(() => {
        if (total <= 1 || isPaused) return;

        const timer = setInterval(() => {
            handleNext();
        }, 5500);

        return () => clearInterval(timer);
    }, [total, isPaused, currentIndex, isFading]);

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
        return 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=900&auto=format&fit=crop';
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

    const handleTouchStart = (e: React.TouchEvent): void => {
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent): void => {
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

    // Up to 5 pagination dots for a balanced, compact look
    const dotCount = Math.min(total, 5);

    return (
        <section
            aria-label="Promotional Showcase"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className={`group/promo relative w-full rounded-2xl sm:rounded-3xl bg-[#1e1e24] border border-zinc-800/90 shadow-xl overflow-hidden select-none transition-all duration-300 ${className}`}
        >
            {/* Smooth Floating Keyframes for 3D Offer Badge */}
            <style>{`
                @keyframes promoBadgeFloat {
                    0%, 100% {
                        transform: translateY(0px) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-5px) rotate(-1deg);
                    }
                }
                .animate-promo-badge {
                    animation: promoBadgeFloat 3.8s ease-in-out infinite;
                }
            `}</style>

            {/* Background Dark Fluid Wave on Left */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <svg
                    className="absolute -left-10 -top-8 h-[130%] w-[65%] text-[#17171d] fill-current opacity-95 transition-transform duration-700 group-hover/promo:scale-[1.01]"
                    viewBox="0 0 500 500"
                    preserveAspectRatio="none"
                >
                    <path d="M0,0 L300,0 C370,120 270,230 350,380 C400,450 360,500 320,500 L0,500 Z" />
                </svg>
                <div className="absolute -left-12 top-1/4 w-60 h-60 rounded-full bg-yellow-500/5 blur-3xl pointer-events-none" />
            </div>

            {/* Decorative Wavy Lines in Top-Right Corner */}
            <div className="absolute top-3.5 right-4 sm:top-5 sm:right-7 flex gap-1 opacity-25 pointer-events-none">
                {[0, 1, 2].map((idx) => (
                    <svg
                        key={idx}
                        className="w-3 h-8 sm:w-3.5 sm:h-11 text-zinc-400"
                        viewBox="0 0 16 48"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            d="M8,0 C13,6 3,12 8,18 C13,24 3,30 8,36 C13,42 3,48 8,48"
                            strokeLinecap="round"
                        />
                    </svg>
                ))}
            </div>

            {/* MOBILE VIEW (< md): Simple, clean, uncluttered, lightweight layout */}
            <div className="md:hidden relative z-10 flex items-center justify-between gap-3 p-3.5 min-[380px]:p-4">
                {/* Left Side: Clean Typography & Quick Actions */}
                <div className="flex-1 min-w-0 pr-1">
                    <span
                        className="text-white text-xs font-bold tracking-wide drop-shadow-sm block mb-0.5"
                        style={{ fontFamily: "'Dancing Script', 'Caveat', cursive" }}
                    >
                        Featured Product
                    </span>

                    <Link href={`/products/${currentProduct.slug}`} className="block">
                        <h2 className="text-base min-[380px]:text-lg font-black text-[#b45309] tracking-tight leading-tight uppercase line-clamp-1 select-none">
                            {staticTitle || currentProduct.name}
                        </h2>
                    </Link>

                    <div className="mt-1 mb-1.5">
                        <span className="px-2 py-0.5 rounded-full bg-white text-zinc-950 font-extrabold text-[9px] tracking-tight shadow-xs inline-block truncate max-w-full">
                            {currentProduct.badge || currentProduct.brand?.name || 'Limited offer only'}
                        </span>
                    </div>

                    <div className="flex items-baseline gap-1.5 mb-2">
                        <span className="text-xs min-[380px]:text-sm font-black text-[#FFDE17]">
                            {formatPrice(currentProduct.sale_price || currentProduct.price)}
                        </span>
                        {currentProduct.sale_price && (
                            <span className="line-through text-zinc-500 font-semibold text-[9px] min-[380px]:text-[10px]">
                                {formatPrice(currentProduct.price)}
                            </span>
                        )}
                        {discountPercent && discountPercent > 0 && (
                            <span className="bg-[#FFDE17] text-zinc-950 text-[8px] min-[380px]:text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase">
                                -{discountPercent}%
                            </span>
                        )}
                    </div>

                    <Link
                        href={`/products/${currentProduct.slug}`}
                        className="inline-flex h-7 px-3.5 rounded-full bg-[#FFDE17] hover:bg-[#FCE138] text-zinc-950 font-black text-[10px] min-[380px]:text-[11px] tracking-wide uppercase items-center justify-center active:scale-95 transition-all cursor-pointer"
                    >
                        Shop Now
                    </Link>
                </div>

                {/* Right Side: Clean White Product Card with Dots */}
                <div className="flex flex-col items-center shrink-0">
                    <Link
                        href={`/products/${currentProduct.slug}`}
                        className="relative w-24 h-24 min-[380px]:w-28 min-[380px]:h-28 rounded-2xl bg-white shadow-md overflow-hidden flex items-center justify-center active:scale-95 transition-transform"
                    >
                        {discountPercent && discountPercent > 0 && (
                            <span className="absolute top-1 left-1 z-10 px-1.5 py-0.5 rounded-full bg-[#FFDE17] text-zinc-950 font-black text-[9px] shadow-xs">
                                -{discountPercent}%
                            </span>
                        )}
                        <img
                            src={getProductImg(currentProduct)}
                            alt={currentProduct.name}
                            className={`w-full h-full object-cover transition-all duration-200 ease-out ${
                                isFading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                            }`}
                        />
                    </Link>

                    {/* Mobile Dots */}
                    {dotCount > 1 && (
                        <div className="flex items-center gap-1 mt-2">
                            {Array.from({ length: dotCount }).map((_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => changeSlide(idx)}
                                    aria-label={`Go to slide ${idx + 1}`}
                                    className={`transition-all duration-200 rounded-full cursor-pointer ${
                                        idx === currentIndex % dotCount
                                            ? 'w-3.5 h-1 bg-[#FFDE17]'
                                            : 'w-1 h-1 bg-zinc-600'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* DESKTOP / TABLET VIEW (md+): Rich 3D Design with Isometric Stage, Floating Badge & Controls */}
            <div className="hidden md:grid relative z-10 grid-cols-12 gap-6 items-center px-8 py-5 lg:px-9 lg:py-6">
                {/* Left Column: 3D Typography, Tag & Action Row */}
                <div className="col-span-7 flex flex-col justify-center min-w-0 pr-2">
                    {/* 1. Script Accent */}
                    <div className="mb-0.5">
                        <span
                            className="text-white text-lg lg:text-xl font-bold tracking-wide drop-shadow-sm inline-block"
                            style={{ fontFamily: "'Dancing Script', 'Caveat', cursive" }}
                        >
                            Featured Product
                        </span>
                    </div>

                    {/* 2. Bold 3D Yellow Title */}
                    <Link
                        href={`/products/${currentProduct.slug}`}
                        className="group/title block my-0.5"
                    >
                        <h2
                            className="text-3xl md:text-4xl lg:text-[46px] font-black text-[#b45309] tracking-tight leading-tight uppercase line-clamp-1 select-none transition-colors duration-200 group-hover/title:text-[#FFF275]"
                            style={{
                                textShadow:
                                    '0 1.5px 0 #d97706, 0 3px 0 #b45309, 0 4.5px 0 #78350f, 0 6px 10px rgba(0, 0, 0, 0.45)',
                            }}
                        >
                            {staticTitle || currentProduct.name}
                        </h2>
                    </Link>

                    {/* 3. Subheading Row: Badge / Brand Pill */}
                    <div className="flex flex-wrap items-center gap-2 mt-0.5 mb-1.5">
                        <span className="px-3 py-0.5 rounded-full bg-white text-zinc-950 font-extrabold text-xs tracking-tight shadow-xs inline-flex items-center truncate max-w-full">
                            {currentProduct.badge || currentProduct.brand?.name || 'Limited offer only'}
                        </span>
                    </div>

                    {/* 4. Description */}
                    <p className={`text-zinc-400 text-xs sm:text-[13px] font-normal leading-relaxed max-w-lg mb-3 line-clamp-1 sm:line-clamp-2 transition-opacity duration-200 ${isFading ? 'opacity-30' : 'opacity-100'}`}>
                        {currentProduct.short_description ||
                            currentProduct.description ||
                            staticDescription}
                    </p>

                    {/* 5. Action Row: "Shop Now" Button with Outer White Border + Dynamic Price Pill */}
                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                        <div className="inline-flex rounded-full p-[1.5px] bg-white shadow-lg hover:shadow-yellow-500/20 transition-all duration-300">
                            <Link
                                href={`/products/${currentProduct.slug}`}
                                className="h-8.5 sm:h-9 px-5 sm:px-6 rounded-full bg-[#FFDE17] hover:bg-[#FCE138] text-zinc-950 font-black text-xs tracking-wide uppercase flex items-center justify-center gap-1.5 active:scale-95 transition-all duration-150 cursor-pointer shrink-0"
                            >
                                <span>Shop Now</span>
                            </Link>
                        </div>

                        {/* Dynamic Real Price & Savings Pill */}
                        <div className="inline-flex items-center gap-2 bg-[#FFDE17] text-zinc-950 px-3.5 py-1.5 rounded-full shadow-md font-extrabold text-xs sm:text-sm shrink-0">
                            <span>
                                {formatPrice(currentProduct.sale_price || currentProduct.price)}
                            </span>
                            {currentProduct.sale_price && (
                                <span className="line-through text-zinc-700 font-bold text-[11px]">
                                    {formatPrice(currentProduct.price)}
                                </span>
                            )}
                            {discountPercent && discountPercent > 0 && (
                                <span className="bg-zinc-950 text-[#FFDE17] text-[10px] font-black px-1.5 py-0.5 rounded-full uppercase ml-0.5">
                                    Save {discountPercent}%
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: 3D Yellow Podium + Product Showcase Card */}
                <div className="col-span-5 relative flex flex-col items-center justify-center">
                    {/* Floating 3D Yellow Offer Badge (Dynamic % or Deal) */}
                    <div className="absolute -top-1 -left-3 lg:-left-4 z-30 animate-promo-badge pointer-events-none">
                        <div
                            className="relative flex flex-col items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#FFDE17] text-zinc-950 font-black shadow-lg"
                            style={{
                                filter: 'drop-shadow(0 2px 0 #d97706) drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
                            }}
                        >
                            <span className="text-xs md:text-sm leading-none font-black">
                                {discountPercent ? `${discountPercent}%` : 'HOT'}
                            </span>
                            <span className="text-[9px] md:text-[10px] font-black tracking-wider leading-none mt-0.5">
                                {discountPercent ? 'OFF' : 'DEAL'}
                            </span>
                            {/* Speech Bubble Pointer */}
                            <div
                                className="absolute -bottom-0.5 left-2 w-2.5 h-2.5 bg-[#FFDE17] rotate-45 rounded-xs"
                                style={{
                                    clipPath: 'polygon(100% 0, 0 100%, 100% 100%)',
                                }}
                            />
                        </div>
                    </div>

                    {/* 3D Isometric Yellow Stage & Product Container */}
                    <div className="relative w-full max-w-[250px] lg:max-w-[280px] aspect-[16/11] flex items-center justify-center">
                        {/* SVG Isometric Yellow Podium Stage */}
                        <div className="absolute bottom-0.5 inset-x-0 w-full flex items-center justify-center pointer-events-none z-0">
                            <svg
                                viewBox="0 0 340 160"
                                className="w-[90%] sm:w-[92%] h-auto drop-shadow-xl"
                                preserveAspectRatio="xMidYMid meet"
                            >
                                <defs>
                                    <linearGradient id="promoPodiumTop" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#FFF275" />
                                        <stop offset="100%" stopColor="#FFDE17" />
                                    </linearGradient>
                                    <linearGradient id="promoPodiumFront" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#d97706" />
                                        <stop offset="100%" stopColor="#92400e" />
                                    </linearGradient>
                                    <linearGradient id="promoPodiumRight" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#b45309" />
                                        <stop offset="100%" stopColor="#78350f" />
                                    </linearGradient>
                                    <radialGradient id="promoFloorShadow" cx="50%" cy="50%" r="50%">
                                        <stop offset="0%" stopColor="rgba(0, 0, 0, 0.65)" />
                                        <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
                                    </radialGradient>
                                </defs>

                                {/* Ambient Floor Shadow */}
                                <ellipse
                                    cx="170"
                                    cy="140"
                                    rx="135"
                                    ry="15"
                                    fill="url(#promoFloorShadow)"
                                />

                                {/* 3D Extruded Front Bevels */}
                                <polygon
                                    points="24,72 170,128 170,144 24,88"
                                    fill="url(#promoPodiumFront)"
                                />
                                <polygon
                                    points="170,128 316,72 316,88 170,144"
                                    fill="url(#promoPodiumRight)"
                                />

                                {/* Yellow Top Isometric Plane */}
                                <polygon
                                    points="170,16 316,72 170,128 24,72"
                                    fill="url(#promoPodiumTop)"
                                    stroke="#FFF9A6"
                                    strokeWidth="1.2"
                                />
                            </svg>
                        </div>

                        {/* Showcase Pedestal Card with full-bleed product image */}
                        <Link
                            href={`/products/${currentProduct.slug}`}
                            className="relative z-10 w-[145px] h-[145px] lg:w-[165px] lg:h-[165px] rounded-2xl bg-white shadow-lg border border-white/60 flex items-center justify-center cursor-pointer group/item transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl overflow-hidden mb-2 sm:mb-3"
                        >
                            <img
                                src={getProductImg(currentProduct)}
                                alt={currentProduct.name}
                                className={`w-full h-full object-cover transition-all duration-300 ease-out ${
                                    isFading
                                        ? 'opacity-0 scale-95'
                                        : 'opacity-100 scale-100 group-hover/item:scale-105'
                                }`}
                            />
                        </Link>
                    </div>

                    {/* Carousel Navigation: Arrow Left, Dots, Arrow Right */}
                    <div className="flex items-center justify-center gap-2.5 md:gap-3 mt-1 z-20">
                        {/* Prev Button */}
                        <button
                            type="button"
                            onClick={handlePrev}
                            aria-label="Previous product"
                            className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800/80 active:scale-90 transition-all cursor-pointer"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        {/* Pagination Dots */}
                        <div className="flex items-center gap-1.5">
                            {Array.from({ length: dotCount }).map((_, idx) => {
                                const isActive = idx === currentIndex % dotCount;
                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => changeSlide(idx)}
                                        aria-label={`Go to slide ${idx + 1}`}
                                        className={`transition-all duration-300 rounded-full cursor-pointer ${
                                            isActive
                                                ? 'w-5 h-1.5 bg-[#FFDE17] shadow-xs shadow-yellow-500/50'
                                                : 'w-1.5 h-1.5 bg-zinc-600 hover:bg-zinc-400'
                                        }`}
                                    />
                                );
                            })}
                        </div>

                        {/* Next Button */}
                        <button
                            type="button"
                            onClick={handleNext}
                            aria-label="Next product"
                            className="w-7 h-7 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800/80 active:scale-90 transition-all cursor-pointer"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
