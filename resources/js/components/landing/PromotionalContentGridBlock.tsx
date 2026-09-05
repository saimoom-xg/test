import { Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, ChevronRight as ArrowRight, Loader2, ShoppingBag, SlidersHorizontal } from 'lucide-react';
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
    const featuredList: PromotionalProduct[] = (products && products.length > 0)
        ? products.filter((p) => Boolean(p && p.id && (p.is_featured || p.featured)))
        : (offers && offers.length > 0)
        ? offers.map((o) => (o.product ? { ...o.product, ...o } : o)).filter((p) => Boolean(p && p.id))
        : [];

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

    // Auto-play carousel every 4.5 seconds; pauses on hover or when adding to cart
    useEffect(() => {
        if (total <= 1 || isPaused || isAdding) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % total);
        }, 4500);

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

    return (
        <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className={`col-span-1 sm:col-span-2 lg:col-span-2 relative rounded-[24px] p-5 sm:p-6 overflow-hidden flex flex-col justify-between bg-white border border-stone-200/80 shadow-xs hover:border-stone-300 transition-all duration-300 h-full ${className}`}
        >
            {/* Top Bar: Minimal Section Tag on Left + Carousel Indicator & Controls on Right */}
            <div className="flex items-center justify-between gap-3 mb-4">
                <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-stone-400">
                    Featured Selection
                </span>

                <div className="flex items-center gap-2.5">
                    {/* Slide counter pill */}
                    {total > 1 && (
                        <div className="text-xs text-stone-400 font-light tracking-wider">
                            <span className="text-stone-800 font-medium">{String(currentIndex + 1).padStart(2, '0')}</span>
                            <span className="mx-1 text-stone-300">/</span>
                            <span>{String(total).padStart(2, '0')}</span>
                        </div>
                    )}

                    {/* Carousel Navigation Buttons */}
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={handlePrev}
                            disabled={total <= 1}
                            aria-label="Previous featured product"
                            className={`w-7 h-7 rounded-full border border-stone-200 hover:border-stone-400 bg-white flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors ${
                                total <= 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer active:scale-90'
                            }`}
                        >
                            <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={total <= 1}
                            aria-label="Next featured product"
                            className={`w-7 h-7 rounded-full border border-stone-200 hover:border-stone-400 bg-white flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors ${
                                total <= 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer active:scale-90'
                            }`}
                        >
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Split Content: Left Side Static Content & Manage Link, Right Side Product Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 items-stretch flex-1">
                
                {/* Left Side: Static Editorial Content & Manage Link */}
                <div className="flex flex-col justify-between py-1">
                    <div>
                        <h3 className="text-xl sm:text-[22px] font-light text-stone-900 leading-snug tracking-tight">
                            {staticTitle}
                        </h3>
                        <p className="text-xs sm:text-[13px] text-stone-500 font-light mt-2.5 leading-relaxed line-clamp-3">
                            {staticDescription}
                        </p>

                        {/* Minimalist Feature Tags */}
                        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-stone-100">
                            <span className="text-[11px] text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-full font-medium">
                                Single-Origin Cacao
                            </span>
                            <span className="text-[11px] text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-full font-medium">
                                Small-Batch Artisan
                            </span>
                        </div>
                    </div>

                    {/* Left Side Manage Link */}
                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center">
                        <Link
                            href={manageUrl}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-800 hover:text-black transition-colors group"
                        >
                            <SlidersHorizontal className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-900 transition-colors" />
                            <span className="underline underline-offset-4 decoration-stone-200 group-hover:decoration-stone-900">
                                Manage Selection
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    </div>
                </div>

                {/* Right Side: Product Card */}
                <div className="flex flex-col justify-between h-full">
                    <div
                        key={currentProduct.id}
                        className="group/card relative rounded-[20px] bg-stone-50/80 hover:bg-stone-50 border border-stone-200/60 p-3.5 flex flex-col justify-between flex-1 transition-all duration-300"
                    >
                        <div>
                            {/* Product Image */}
                            <Link
                                href={`/products/${currentProduct.slug}`}
                                className="relative w-full h-[140px] sm:h-[145px] rounded-[15px] overflow-hidden bg-white object-cover p-3 flex items-center justify-center cursor-pointer block mb-2.5 border border-stone-200/50"
                            >
                                <img
                                    src={getProductImg(currentProduct)}
                                    alt={currentProduct.name}
                                    className="w-full h-full object-cover mix-blend-multiply drop-shadow-xl scale-[1.15] transition-transform duration-500 group-hover:scale-[1.25]"
                                />

                                {discountPercent && discountPercent > 0 ? (
                                    <span className="absolute top-2.5 right-2.5 text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-stone-900 text-white shadow-xs">
                                        -{discountPercent}%
                                    </span>
                                ) : (
                                    <span className="absolute top-2.5 right-2.5 text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                                        Featured
                                    </span>
                                )}
                            </Link>

                            {/* Title & Brand */}
                            <div>
                                <p className="text-[10px] font-medium uppercase tracking-wider text-stone-400 truncate">
                                    {currentProduct.brand?.name || 'Artisan Collection'}
                                </p>
                                <Link href={`/products/${currentProduct.slug}`}>
                                    <h4 className="text-[13px] font-medium text-stone-900 line-clamp-2 h-[36px] leading-snug group-hover/card:text-stone-600 transition-colors mt-0.5">
                                        {currentProduct.name}
                                    </h4>
                                </Link>
                            </div>
                        </div>

                        {/* Price & Add to Cart Button */}
                        <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex items-center justify-between gap-2">
                            <div className="flex items-baseline gap-1.5 min-w-0">
                                <span className="text-[15px] font-medium text-stone-900 tracking-tight">
                                    {formatPrice(currentProduct.sale_price || currentProduct.price)}
                                </span>
                                {currentProduct.sale_price && (
                                    <span className="text-[11px] text-stone-400 line-through truncate font-light">
                                        {formatPrice(currentProduct.price)}
                                    </span>
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={handleAddToCart}
                                disabled={isAdding}
                                className="h-8 px-3.5 rounded-full bg-stone-900 hover:bg-black text-white text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-40 shrink-0"
                                aria-label={`Add ${currentProduct.name} to cart`}
                            >
                                {isAdding ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <>
                                        <ShoppingBag className="w-3.5 h-3.5" />
                                        {/* <span>Add</span> */}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
