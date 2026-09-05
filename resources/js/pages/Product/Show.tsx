import { Head, Link, router } from '@inertiajs/react';
import {
    ChevronRight,
    Heart,
    Loader2,
    Minus,
    Plus,
    Share2,
    ShoppingBag,
    Star,
    Tag,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import ProductCard from '@/components/landing/ProductCard';
import { useCurrency } from '@/hooks/use-currency';
import { useWishlist } from '@/hooks/use-wishlist';

export type ProductImage = {
    id: number;
    path: string;
    alt?: string | null;
    is_primary?: boolean;
    sort_order?: number;
};

export type ProductVariant = {
    id: number;
    name?: string | null;
    sku?: string;
    barcode?: string | null;
    price?: number | string | null;
    sale_price?: number | string | null;
    stock_quantity: number;
    reserved_quantity?: number;
    is_active?: boolean;
};

export type ProductReview = {
    id: number;
    rating: number;
    title?: string | null;
    body: string;
    status?: string;
    created_at?: string;
    customer?: {
        id: number;
        first_name?: string | null;
        last_name?: string | null;
        name?: string | null;
    } | null;
};

export type ProductDetail = {
    id: number;
    name: string;
    slug: string;
    sku?: string;
    barcode?: string | null;
    price: number | string;
    sale_price?: number | string | null;
    short_description?: string | null;
    description?: string | null;
    stock_quantity: number;
    reserved_quantity?: number;
    low_stock_threshold?: number;
    manage_stock?: boolean;
    stock_status?: string;
    weight?: number | string | null;
    length?: number | string | null;
    width?: number | string | null;
    height?: number | string | null;
    is_featured?: boolean;
    avg_rating?: number;
    reviews_count?: number;
    tax_class?: string | null;
    brand?: {
        id: number;
        name: string;
        slug: string;
        description?: string | null;
        logo?: string | null;
    } | null;
    categories?: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
    images?: ProductImage[];
    variants?: ProductVariant[];
    reviews?: ProductReview[];
    [key: string]: any;
};

type ProductShowProps = {
    product: ProductDetail;
    suggestedProducts?: any[];
};

export default function ProductShow({ product, suggestedProducts = [] }: ProductShowProps) {
    const { formatPrice } = useCurrency();
    const { isWishlisted, toggleWishlist } = useWishlist();

    // Image gallery resolution
    const allImages: ProductImage[] = useMemo(() => {
        if (product.images && product.images.length > 0) {
            return product.images;
        }
        return [
            {
                id: 0,
                path: '',
                alt: product.name,
                is_primary: true,
            },
        ];
    }, [product.images, product.name]);

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // Active variants
    const activeVariants = useMemo(() => {
        return (product.variants || []).filter((v) => v.is_active !== false);
    }, [product.variants]);

    const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
        activeVariants.length > 0 ? activeVariants[0].id : null
    );

    const selectedVariant = useMemo(() => {
        return activeVariants.find((v) => v.id === selectedVariantId) || null;
    }, [activeVariants, selectedVariantId]);

    // Live pricing
    const effectivePrice = Number(
        selectedVariant?.price !== null && selectedVariant?.price !== undefined
            ? selectedVariant.price
            : product.sale_price || product.price
    );

    const effectiveOriginalPrice = selectedVariant?.price
        ? selectedVariant.sale_price
            ? Number(selectedVariant.price)
            : null
        : product.sale_price
        ? Number(product.price)
        : null;

    const discountPercentage =
        effectiveOriginalPrice && effectiveOriginalPrice > effectivePrice
            ? Math.round(((effectiveOriginalPrice - effectivePrice) / effectiveOriginalPrice) * 100)
            : null;

    // Stock management
    const currentStock = selectedVariant
        ? Math.max(0, selectedVariant.stock_quantity - (selectedVariant.reserved_quantity || 0))
        : Math.max(0, product.stock_quantity - (product.reserved_quantity || 0));

    const isOutOfStock = product.manage_stock
        ? currentStock <= 0
        : product.stock_status === 'out_of_stock';

    const isLowStock =
        product.manage_stock &&
        currentStock > 0 &&
        currentStock <= (product.low_stock_threshold || 5);

    // Quantity state
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isBuyingNow, setIsBuyingNow] = useState(false);
    const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');

    const handleQuantityChange = (newQty: number): void => {
        if (newQty < 1) return;
        if (product.manage_stock && newQty > currentStock) {
            toast.warning(`Only ${currentStock} item(s) available in stock.`);
            return;
        }
        setQuantity(newQty);
    };

    const getImageUrl = (image?: ProductImage): string => {
        if (image?.path) {
            return image.path.startsWith('http') ? image.path : `/storage/${image.path}`;
        }
        return 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=1200&auto=format&fit=crop';
    };

    const activeImage = allImages[selectedImageIndex] || allImages[0];
    const favorited = isWishlisted(product.id);

    // Cart Actions
    const handleAddToCart = (redirectAfter: boolean = false): void => {
        if (isOutOfStock || isAddingToCart || isBuyingNow) return;

        if (redirectAfter) {
            setIsBuyingNow(true);
        } else {
            setIsAddingToCart(true);
        }

        router.post(
            '/cart/items',
            {
                product_id: product.id,
                quantity: quantity,
                variant_id: selectedVariantId || undefined,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(`${product.name} added to cart!`);
                    if (redirectAfter) {
                        router.visit('/checkout');
                    }
                },
                onError: () => {
                    toast.error('Could not add item to cart.');
                },
                onFinish: () => {
                    setIsAddingToCart(false);
                    setIsBuyingNow(false);
                },
            }
        );
    };

    const handleShare = async (): Promise<void> => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.name,
                    text: product.short_description || product.name,
                    url: window.location.href,
                });
            } catch (_) {}
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard!');
            } catch (_) {
                toast.info('Could not copy link');
            }
        }
    };

    const primaryCategory = product.categories && product.categories.length > 0 ? product.categories[0] : null;

    return (
        <>
            <Head title={`${product.name} - Store`} />

            <div className="max-w-7xl mx-auto w-full pb-20 flex flex-col gap-6 pt-2">
                {/* Main Product Showcase Grid (Theme-matched White Cards) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                    
                    {/* LEFT COLUMN: Media Showcase Card */}
                    <div className="lg:col-span-7 bg-white rounded-[28px] p-5 sm:p-7 shadow-sm border border-black/[0.04] flex flex-col justify-between">
                        {/* Top Bar inside Left Card: Category Tag on Left, Action Buttons on Right */}
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 flex-wrap">
                                {primaryCategory ? (
                                    <Link
                                        href={`/shop?category=${primaryCategory.slug}`}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f4f4f4] hover:bg-gray-200 text-black text-xs font-bold transition-colors"
                                    >
                                        <Tag className="w-3.5 h-3.5 text-gray-500" />
                                        <span>{primaryCategory.name}</span>
                                    </Link>
                                ) : product.brand ? (
                                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f4f4f4] text-black text-xs font-bold">
                                        {product.brand.name}
                                    </span>
                                ) : null}
                            </div>

                            {/* Theme Action Buttons (Black circular buttons matching card.html & ProductCard) */}
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => toggleWishlist(product)}
                                    className="w-[38px] h-[38px] rounded-full bg-black border border-[#35363c] text-white flex items-center justify-center hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer group active:scale-95"
                                    title={favorited ? 'Remove from Wishlist' : 'Save to Wishlist'}
                                    aria-label={favorited ? 'Remove from Wishlist' : 'Save to Wishlist'}
                                >
                                    <Heart
                                        className={`w-[17px] h-[17px] transition-colors ${
                                            favorited
                                                ? 'fill-red-500 text-red-500'
                                                : 'text-gray-300 group-hover:text-red-400'
                                        }`}
                                    />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleShare}
                                    className="w-[38px] h-[38px] rounded-full bg-black border border-[#35363c] text-gray-300 hover:text-white flex items-center justify-center hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer active:scale-95"
                                    title="Share product"
                                    aria-label="Share product"
                                >
                                    <Share2 className="w-[17px] h-[17px]" />
                                </button>
                            </div>
                        </div>

                        {/* Main Product Image Stage (matching card.html #f4f4f4 container and mix-blend-multiply drop-shadow) */}
                        <div className="w-full h-[320px] sm:h-[400px] lg:h-[430px] bg-[#f4f4f4] rounded-[22px] flex items-center justify-center overflow-hidden relative group my-4 p-6 sm:p-10">
                            <img
                                src={getImageUrl(activeImage)}
                                alt={activeImage.alt || product.name}
                                className="w-full h-full object-contain mix-blend-multiply drop-shadow-2xl scale-[1.05] transition-transform duration-500 group-hover:scale-[1.15]"
                            />

                            {/* Dynamic Badges */}
                            <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10">
                                {discountPercentage && discountPercentage > 0 && (
                                    <span className="bg-red-500 text-white text-[10.5px] font-bold px-3 py-1 rounded-full shadow-sm tracking-wider uppercase">
                                        -{discountPercentage}%
                                    </span>
                                )}
                                {product.is_featured && (
                                    <span className="bg-black text-white text-[10.5px] font-bold px-3 py-1 rounded-full shadow-sm tracking-wider uppercase">
                                        Featured
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Thumbnails Row (only rendered if multiple images exist) */}
                        {allImages.length > 1 && (
                            <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none pt-1">
                                {allImages.map((img, idx) => {
                                    const isSelected = selectedImageIndex === idx;
                                    return (
                                        <button
                                            key={img.id || idx}
                                            type="button"
                                            onClick={() => setSelectedImageIndex(idx)}
                                            className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-[16px] bg-[#f4f4f4] p-2 flex items-center justify-center shrink-0 cursor-pointer transition-all overflow-hidden ${
                                                isSelected
                                                    ? 'border-2 border-black scale-95 shadow-sm'
                                                    : 'border border-transparent hover:border-gray-300 opacity-70 hover:opacity-100'
                                            }`}
                                        >
                                            <img
                                                src={getImageUrl(img)}
                                                alt={img.alt || `${product.name} ${idx + 1}`}
                                                className="w-full h-full object-contain mix-blend-multiply"
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Product Information & Purchase Card */}
                    <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
                        <div>
                            {/* Brand & Stock Pill */}
                            <div className="flex items-center justify-between gap-3 mb-2.5">
                                {product.brand ? (
                                    <Link
                                        href={`/shop?brand=${product.brand.slug}`}
                                        className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors"
                                    >
                                        {product.brand.name}
                                    </Link>
                                ) : (
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                                        Product Details
                                    </span>
                                )}

                                {/* Stock Status Pill */}
                                {isOutOfStock ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                        Sold Out
                                    </span>
                                ) : isLowStock ? (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                        Only {currentStock} left
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        In Stock
                                    </span>
                                )}
                            </div>

                            {/* Product Title */}
                            <h1 className="text-2xl sm:text-[28px] font-bold text-black tracking-tight leading-snug">
                                {product.name}
                            </h1>

                            {/* Reviews Summary & SKU */}
                            <div className="flex items-center gap-3 mt-3 flex-wrap">
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${
                                                i < Math.round(product.avg_rating || 5)
                                                    ? 'fill-amber-400 text-amber-400'
                                                    : 'text-gray-200'
                                            }`}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs font-bold text-black">
                                    {(product.avg_rating || 5.0).toFixed(1)}
                                </span>
                                <span className="text-xs text-gray-300">•</span>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('reviews')}
                                    className="text-xs font-semibold text-gray-500 hover:text-black underline underline-offset-2 transition-colors cursor-pointer"
                                >
                                    {product.reviews_count || 0} customer reviews
                                </button>
                                {product.sku && (
                                    <>
                                        <span className="text-xs text-gray-300">•</span>
                                        <span className="text-xs text-gray-400 font-mono">
                                            SKU: {selectedVariant?.sku || product.sku}
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Dynamic Price Display */}
                            <div className="flex items-baseline gap-3 mt-6 pb-6 border-b border-gray-100 flex-wrap">
                                <span className="text-3xl sm:text-4xl font-bold text-black tracking-tight">
                                    {formatPrice(effectivePrice)}
                                </span>

                                {effectiveOriginalPrice && (
                                    <span className="text-lg font-semibold text-gray-400 line-through">
                                        {formatPrice(effectiveOriginalPrice)}
                                    </span>
                                )}

                                {discountPercentage && discountPercentage > 0 && (
                                    <span className="px-2.5 py-0.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-bold">
                                        Save {discountPercentage}%
                                    </span>
                                )}
                            </div>

                            {/* Dynamic Short Description (if present in database) */}
                            {product.short_description && (
                                <p className="text-sm text-[#4b4d54] leading-relaxed mt-5">
                                    {product.short_description}
                                </p>
                            )}

                            {/* Dynamic Variants Selector (only if variants exist in database) */}
                            {activeVariants.length > 0 && (
                                <div className="flex flex-col gap-2.5 mt-6">
                                    <label className="text-xs font-bold uppercase tracking-wider text-black">
                                        Select Specification:
                                    </label>
                                    <div className="flex flex-wrap gap-2.5">
                                        {activeVariants.map((variant) => {
                                            const isSelected = selectedVariantId === variant.id;
                                            return (
                                                <button
                                                    key={variant.id}
                                                    type="button"
                                                    onClick={() => setSelectedVariantId(variant.id)}
                                                    className={`px-4 py-2.5 rounded-[14px] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                                                        isSelected
                                                            ? 'bg-black text-white shadow-sm ring-2 ring-black ring-offset-1'
                                                            : 'bg-[#f4f4f4] text-black hover:bg-gray-200'
                                                    }`}
                                                >
                                                    <span>{variant.name || `Option ${variant.id}`}</span>
                                                    {variant.price && (
                                                        <span className={isSelected ? 'text-gray-300' : 'text-gray-500'}>
                                                            {formatPrice(variant.price)}
                                                        </span>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Quantity & Add to Cart Actions (matching card.html button styling) */}
                            <div className="flex flex-col gap-3 mt-7">
                                <div className="flex items-center gap-3">
                                    {/* Stepper */}
                                    <div className="flex items-center bg-[#f4f4f4] rounded-[18px] p-1 h-[52px] w-32 shrink-0">
                                        <button
                                            type="button"
                                            onClick={() => handleQuantityChange(quantity - 1)}
                                            disabled={quantity <= 1 || isOutOfStock}
                                            className="w-9 h-9 flex items-center justify-center rounded-[12px] text-gray-600 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus className="w-4 h-4" />
                                        </button>
                                        <span className="flex-1 text-center text-sm font-bold text-black">
                                            {quantity}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleQuantityChange(quantity + 1)}
                                            disabled={isOutOfStock || (product.manage_stock && quantity >= currentStock)}
                                            className="w-9 h-9 flex items-center justify-center rounded-[12px] text-gray-600 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                            aria-label="Increase quantity"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Primary Add to Cart Button */}
                                    <button
                                        type="button"
                                        onClick={() => handleAddToCart(false)}
                                        disabled={isOutOfStock || isAddingToCart || isBuyingNow}
                                        className="flex-1 h-[52px] bg-black text-white rounded-[18px] font-bold text-sm flex items-center justify-center gap-2 hover:bg-neutral-800 hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isAddingToCart ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Adding...</span>
                                            </>
                                        ) : (
                                            <>
                                                <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                                                <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* Buy Now Secondary Action */}
                                {!isOutOfStock && (
                                    <button
                                        type="button"
                                        onClick={() => handleAddToCart(true)}
                                        disabled={isAddingToCart || isBuyingNow}
                                        className="w-full h-[48px] rounded-[18px] border-2 border-black text-black hover:bg-black hover:text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
                                    >
                                        {isBuyingNow ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>Processing...</span>
                                            </>
                                        ) : (
                                            <span>Buy Now</span>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Dynamic Metadata Badges (Only rendered if dynamic values exist) */}
                        {(product.length || product.barcode) && (
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-400 mt-6 pt-5 border-t border-gray-100">
                                {product.length && (
                                    <span>Dimensions: <strong className="text-gray-700 font-semibold">{product.length}×{product.width}×{product.height} cm</strong></span>
                                )}
                                {product.barcode && (
                                    <span>Barcode: <strong className="text-gray-700 font-mono">{product.barcode}</strong></span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. Dynamic Deep Information Tabs Section */}
                <div className="bg-white rounded-[28px] p-6 sm:p-8 shadow-sm border border-black/[0.04]">
                    {/* Tab Selection */}
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4 overflow-x-auto scrollbar-none">
                        <button
                            type="button"
                            onClick={() => setActiveTab('description')}
                            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                                activeTab === 'description'
                                    ? 'bg-black text-white shadow-xs'
                                    : 'text-gray-600 hover:text-black hover:bg-gray-100'
                            }`}
                        >
                            Description
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('specs')}
                            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                                activeTab === 'specs'
                                    ? 'bg-black text-white shadow-xs'
                                    : 'text-gray-600 hover:text-black hover:bg-gray-100'
                            }`}
                        >
                            Specifications
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('reviews')}
                            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                                activeTab === 'reviews'
                                    ? 'bg-black text-white shadow-xs'
                                    : 'text-gray-600 hover:text-black hover:bg-gray-100'
                            }`}
                        >
                            Reviews ({product.reviews_count || 0})
                        </button>
                    </div>

                    <div className="pt-6 max-w-3xl">
                        {/* Tab 1: Description (Real Dynamic description from database) */}
                        {activeTab === 'description' && (
                            <div className="text-sm text-[#4b4d54] leading-relaxed space-y-4">
                                {product.description ? (
                                    <p className="whitespace-pre-line">{product.description}</p>
                                ) : product.short_description ? (
                                    <p>{product.short_description}</p>
                                ) : (
                                    <p className="text-gray-400 italic">No extended description provided for this product.</p>
                                )}
                            </div>
                        )}

                        {/* Tab 2: Specifications (All real dynamic attributes) */}
                        {activeTab === 'specs' && (
                            <div className="divide-y divide-gray-100 text-xs sm:text-sm">
                                {product.sku && (
                                    <div className="py-2.5 flex justify-between">
                                        <span className="text-gray-500 font-medium">SKU</span>
                                        <span className="font-mono font-semibold text-black">{product.sku}</span>
                                    </div>
                                )}
                                {product.brand && (
                                    <div className="py-2.5 flex justify-between">
                                        <span className="text-gray-500 font-medium">Brand</span>
                                        <span className="font-semibold text-black">{product.brand.name}</span>
                                    </div>
                                )}
                                {product.categories && product.categories.length > 0 && (
                                    <div className="py-2.5 flex justify-between">
                                        <span className="text-gray-500 font-medium">Categories</span>
                                        <span className="font-semibold text-black">
                                            {product.categories.map((c) => c.name).join(', ')}
                                        </span>
                                    </div>
                                )}

                                {(product.length || product.width || product.height) && (
                                    <div className="py-2.5 flex justify-between">
                                        <span className="text-gray-500 font-medium">Dimensions (L × W × H)</span>
                                        <span className="font-semibold text-black">
                                            {product.length || '-'} × {product.width || '-'} × {product.height || '-'} cm
                                        </span>
                                    </div>
                                )}
                                {product.barcode && (
                                    <div className="py-2.5 flex justify-between">
                                        <span className="text-gray-500 font-medium">Barcode</span>
                                        <span className="font-mono font-semibold text-black">{product.barcode}</span>
                                    </div>
                                )}
                                {product.tax_class && (
                                    <div className="py-2.5 flex justify-between">
                                        <span className="text-gray-500 font-medium">Tax Class</span>
                                        <span className="font-semibold text-black uppercase">{product.tax_class}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab 3: Reviews (Real reviews from database) */}
                        {activeTab === 'reviews' && (
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                                    <span className="text-3xl font-bold text-black">
                                        {(product.avg_rating || 5.0).toFixed(1)}
                                    </span>
                                    <div>
                                        <div className="flex items-center gap-0.5">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${
                                                        i < Math.round(product.avg_rating || 5)
                                                            ? 'fill-amber-400 text-amber-400'
                                                            : 'text-gray-200'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            Based on {product.reviews_count || 0} customer review(s)
                                        </p>
                                    </div>
                                </div>

                                {product.reviews && product.reviews.length > 0 ? (
                                    <div className="space-y-4">
                                        {product.reviews.map((rev) => (
                                            <div
                                                key={rev.id}
                                                className="p-4 rounded-[18px] bg-[#f8f8f8] border border-gray-100 flex flex-col gap-2"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-bold text-xs text-black">
                                                        {rev.customer?.name ||
                                                            `${rev.customer?.first_name || 'Customer'} ${
                                                                rev.customer?.last_name || ''
                                                            }`.trim()}
                                                    </span>
                                                    <div className="flex items-center gap-0.5">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`w-3.5 h-3.5 ${
                                                                    i < rev.rating
                                                                        ? 'fill-amber-400 text-amber-400'
                                                                        : 'text-gray-200'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                {rev.title && (
                                                    <h4 className="font-bold text-sm text-black">{rev.title}</h4>
                                                )}
                                                <p className="text-xs text-[#4b4d54] leading-relaxed">{rev.body}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-8 text-center text-xs text-gray-400">
                                        No reviews yet for this product. Be the first to review after purchasing!
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. Suggested / Related Products Grid */}
                {suggestedProducts.length > 0 && (
                    <div className="mt-6 flex flex-col gap-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl sm:text-2xl font-bold text-black tracking-tight">
                                Related Products
                            </h2>
                            <Link
                                href="/shop"
                                className="text-xs font-bold text-gray-500 hover:text-black transition-colors flex items-center gap-1 group"
                            >
                                <span>View Catalog</span>
                                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                            </Link>
                        </div>

                        {/* 4-column responsive grid matching theme using ProductCard */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                            {suggestedProducts.slice(0, 4).map((suggested) => (
                                <div key={suggested.id} className="col-span-1 flex justify-center w-full h-full">
                                    <ProductCard product={suggested} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
