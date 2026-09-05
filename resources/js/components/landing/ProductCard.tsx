import { Link, router } from '@inertiajs/react';
import { Heart, Loader2, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useCurrency } from '@/hooks/use-currency';
import { useWishlist } from '@/hooks/use-wishlist';

export default function ProductCard({ product, onAdded }: { product: any; onAdded?: (count: number) => void }) {
    const { formatPrice } = useCurrency();
    const { isWishlisted, toggleWishlist } = useWishlist();
    const favorited = isWishlisted(product.id);
    const [isAdding, setIsAdding] = useState(false);

    const addToCart = (): void => {
        if (isAdding) return;
        setIsAdding(true);

        router.post('/cart/items', {
            product_id: product.id,
            quantity: 1,
        }, {
            preserveScroll: true,
            onSuccess: (page) => {
                const count = (page.props as any).cart?.count;
                if (count !== undefined && onAdded) {
                    onAdded(count);
                }
                toast.success(`${product.name} added to cart!`);
            },
            onError: () => {
                toast.error('Failed to add item to cart.');
            },
            onFinish: () => setIsAdding(false),
        });
    };
    // Determine the main image
    let mainImage = 'https://media.istockphoto.com/id/908259584/photo/various-chocolate-pralines.jpg?s=612x612&w=0&k=20&c=Nqv-2Foy0yFJ7OrlO-PrLa0bkh_HEFcIeCY2Dg8JL5I=';
    
    if (product.images && product.images.length > 0) {
        // Find primary image or fallback to first
        const primary = product.images.find((img: any) => img.is_primary) || product.images[0];
        if (primary && primary.path) {
            mainImage = primary.path.startsWith('http://') || primary.path.startsWith('https://')
                ? primary.path
                : `/storage/${primary.path}`;
        }
    }
    
    // Determine the category or brand name
    const label = product.categories && product.categories.length > 0 
        ? product.categories[0].name 
        : (product.brand?.name);

    return (
        <div className="relative w-full max-w-[320px] sm:max-w-none mx-auto h-full flex flex-col">
            {/* Action Buttons */}
            <div className="absolute top-[7px] right-[10px] flex gap-2 z-20">
                <button
                    type="button"
                    onClick={() => toggleWishlist(product)}
                    className="shadow-sm w-[34px] h-[34px] rounded-full bg-black border border-[#35363c] text-gray-400 flex items-center justify-center hover:bg-black transition-colors group cursor-pointer"
                    title={favorited ? 'Remove from Wishlist' : 'Save to Wishlist'}
                    aria-label={favorited ? `Remove ${product.name} from Wishlist` : `Save ${product.name} to Wishlist`}
                >
                    <Heart
                        className={`w-[15px] h-[15px] transition-colors ${
                            favorited
                                ? 'fill-red-500 text-red-500'
                                : 'text-gray-400 group-hover:text-red-400'
                        }`}
                    />
                </button>
            </div>

            {/* Card Container */}
            <div className="relative flex-1 flex flex-col">
                {/* Tab */}
                <div className="bg-white w-[calc(100%-54px)] h-[48px] rounded-tl-[22px] rounded-tr-[22px] relative z-10 flex items-center px-4.5 shrink-0">
                    <div className="flex items-center gap-2 min-w-0">
                        <div className="text-[17px] font-bold text-black tracking-tight shrink-0">
                            {formatPrice(product.sale_price || product.price)}
                        </div> 
                        {product.sale_price && (
                            <div className="text-[11.5px] font-semibold text-gray-400 line-through shrink-0">
                                {formatPrice(product.price)}
                            </div>
                        )}
                    </div>
                    {/* Concave curve transition using precise vector SVG with subpixel anti-gap overlap */}
                    <svg
                        className="absolute -bottom-[1px] w-[23px] h-[23px] pointer-events-none text-white fill-current z-10"
                        style={{ left: 'calc(100% - 1px)' }}
                        viewBox="0 0 23 23"
                    >
                        <path d="M 1 0 C 1 12.15 10.85 22 23 22 V 23 H 0 V 0 Z" />
                    </svg>
                </div>

                {/* Main Body */}
                <div className="bg-white w-full rounded-b-[22px] rounded-tr-[22px] px-4.5 pt-2.5 pb-4 relative z-0 shadow-sm flex-1 flex flex-col justify-between">
                    <div>
                        {/* Product Image */}
                        <Link href={`/products/${product.slug}`} className="block w-full h-[140px] sm:h-[145px] bg-[#f4f4f4] rounded-[15px] mb-3 flex items-center justify-center overflow-hidden relative group">
                            <img 
                                src={mainImage} 
                                alt={product.name} 
                                className="w-full h-full object-cover mix-blend-multiply drop-shadow-xl scale-[1.15] transition-transform duration-500 group-hover:scale-[1.25]" 
                            />
                            {/* Badge */}
                            {product.sale_price ? (
                                <div className="absolute top-2.5 left-2.5 bg-red-400 backdrop-blur px-2.5 py-0.5 rounded-full text-[9.5px] font-bold tracking-wider uppercase text-black shadow-sm">
                                    Sale
                                </div>
                            ) : product.is_featured ? (
                                <div className="absolute top-2.5 left-2.5 bg-cyan-300 backdrop-blur px-2.5 py-0.5 rounded-full text-[9.5px] font-bold tracking-wider uppercase text-black shadow-sm">
                                    Featured
                                </div>
                            ) : null}
                        </Link>
                        
                        {/* Product Info */}
                        <div className="flex justify-between items-start mb-1.5 gap-2">
                            <div className="flex-1 min-w-0">
                                <Link href={`/products/${product.slug}`}>
                                    <h2 className="text-[15px] font-bold text-[#262615] leading-snug line-clamp-2 h-[40px] hover:underline">{product.name}</h2>
                                </Link>
                                <p className="text-[12.5px] font-medium text-gray-400 mt-0.5 truncate">{product.brand?.name || 'Brand'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={addToCart}
                        disabled={isAdding}
                        className="w-full mt-3 bg-black text-white h-[38px] rounded-[13px] font-semibold text-[13px] flex items-center justify-center gap-1.5 hover:bg-gray-800 hover:shadow-sm transition-all active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isAdding ? (
                            <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                Adding...
                            </>
                        ) : (
                            <>
                                <ShoppingBag className="w-3.5 h-3.5" />
                                Add to Cart
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
