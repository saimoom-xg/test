import { Link, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, ChevronRight as ArrowRight, Loader2, ShoppingBag, SlidersHorizontal } from 'lucide-react';
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
            className={`col-span-1 sm:col-span-2 lg:col-span-2 relative rounded-[24px] p-5 sm:p-6 overflow-hidden flex flex-col justify-between bg-white border border-stone-200/80 shadow-xs hover:border-stone-300 transition-all duration-300 h-full ${className}`}
        >
            {/* Top Bar: Minimal Section Tag on Left + Controls on Right */}
            <div className="flex items-center justify-between gap-3 mb-3.5">
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-stone-400">
                        {title || 'Limited Offers'}
                    </span>
                </div>

                {/* Right Side: Manage Link & Carousel Buttons */}
                <div className="flex items-center gap-2">
                    <Link
                        href={manageUrl}
                        className="inline-flex items-center gap-1 text-xs font-medium text-stone-800 hover:text-black transition-colors group"
                        title="Manage flash sale items"
                    >
                        <SlidersHorizontal className="w-3 h-3 text-stone-400 group-hover:text-stone-900 transition-colors" />
                        <span className="underline underline-offset-4 decoration-stone-200 group-hover:decoration-stone-900">
                            Manage
                        </span>
                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </Link>

                    {total > 2 && (
                        <div className="flex items-center gap-1 ml-1">
                            <button
                                type="button"
                                onClick={handlePrev}
                                aria-label="Previous items"
                                className="w-7 h-7 rounded-full border border-stone-200 hover:border-stone-400 bg-white flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors cursor-pointer active:scale-90"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                                type="button"
                                onClick={handleNext}
                                aria-label="Next items"
                                className="w-7 h-7 rounded-full border border-stone-200 hover:border-stone-400 bg-white flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors cursor-pointer active:scale-90"
                            >
                                <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* 2-Product Display */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 flex-1 items-stretch">
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
                            className="group/card relative bg-stone-50/80 hover:bg-stone-50 border border-stone-200/60 rounded-[20px] p-3.5 flex flex-col justify-between transition-all duration-300"
                        >
                            {/* Product Card Top: Image + Discount Badge */}
                            <div className="relative w-full h-[140px] sm:h-[145px] bg-white rounded-[15px] overflow-hidden flex items-center justify-center mb-2.5 p-3 border border-stone-200/50">
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
                                    <span className="absolute top-2.5 right-2.5 text-[10px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-full bg-stone-900 text-white shadow-xs">
                                        -{discountPercent}%
                                    </span>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 flex flex-col justify-between">
                                <div>
                                    <p className="text-[10px] font-medium text-stone-400 tracking-wider uppercase truncate">
                                        {product.brand?.name || 'Limited Batch'}
                                    </p>
                                    <Link href={`/products/${product.slug}`}>
                                        <h4 className="text-[13px] font-medium text-stone-900 line-clamp-2 h-[36px] leading-snug group-hover/card:text-stone-600 transition-colors mt-0.5">
                                            {product.name}
                                        </h4>
                                    </Link>
                                </div>

                                {/* Price & Add to Cart Action */}
                                <div className="mt-3 pt-2.5 border-t border-stone-200/60 flex items-center justify-between gap-2">
                                    <div className="flex items-baseline gap-1.5 min-w-0">
                                        <span className="text-[15px] font-medium text-stone-900 tracking-tight">
                                            {formatPrice(product.sale_price || product.price)}
                                        </span>
                                        {product.sale_price && (
                                            <span className="text-[11px] text-stone-400 line-through truncate font-light">
                                                {formatPrice(product.price)}
                                            </span>
                                        )}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleAddToCart(product)}
                                        disabled={isAdding}
                                        className="h-8 px-3.5 rounded-full bg-stone-900 hover:bg-black text-white text-xs font-medium uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-40 shrink-0"
                                        aria-label={`Add ${product.name} to cart`}
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
                    );
                })}
            </div>
        </div>
    );
}
