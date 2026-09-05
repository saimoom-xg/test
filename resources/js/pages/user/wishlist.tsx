import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, Heart, Loader2, ShoppingBag, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import UserLayout from '@/layouts/user-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCurrency } from '@/hooks/use-currency';
import { useWishlist } from '@/hooks/use-wishlist';

type WishlistProduct = {
    id: number;
    name: string;
    slug: string;
    price: number;
    sale_price?: number | null;
    brand?: { id: number; name: string } | null;
    images?: Array<{ id: number; path: string; is_primary: boolean }>;
    categories?: Array<{ id: number; name: string }>;
};

type Props = {
    products: WishlistProduct[];
};

export default function UserWishlist({ products = [] }: Props) {
    const { formatPrice } = useCurrency();
    const { removeFromWishlist, clearWishlist } = useWishlist();
    const [addingId, setAddingId] = useState<number | null>(null);

    const getProductImage = (product: WishlistProduct): string => {
        if (product.images && product.images.length > 0) {
            const primary = product.images.find((img) => img.is_primary) || product.images[0];
            if (primary?.path) {
                return primary.path.startsWith('http://') || primary.path.startsWith('https://')
                    ? primary.path
                    : `/storage/${primary.path}`;
            }
        }
        return 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80';
    };

    const handleAddToCart = (product: WishlistProduct) => {
        if (addingId !== null) return;
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
                    toast.error('Failed to add item to cart.');
                },
                onFinish: () => setAddingId(null),
            }
        );
    };

    return (
        <UserLayout>
            <Head title="My Wishlist" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">My Wishlist</h1>
                        <p className="text-muted-foreground mt-1">
                            {products.length === 0
                                ? 'No items saved in your wishlist.'
                                : `You have ${products.length} saved item${products.length === 1 ? '' : 's'} in your wishlist.`}
                        </p>
                    </div>

                    {products.length > 0 && (
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearWishlist}
                                className="text-destructive hover:bg-destructive/10 cursor-pointer"
                            >
                                <Trash2 className="w-4 h-4 mr-1.5" />
                                Clear Wishlist
                            </Button>
                            <Button asChild size="sm">
                                <Link href="/shop">
                                    Browse More
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>

                {products.length === 0 ? (
                    <Card className="p-12 text-center flex flex-col items-center justify-center my-6">
                        <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4 ring-8 ring-red-50/50">
                            <Heart className="w-8 h-8 stroke-[1.75]" />
                        </div>
                        <h2 className="text-xl font-bold text-foreground mb-1">
                            Your Wishlist is Empty
                        </h2>
                        <p className="text-sm text-muted-foreground max-w-sm mb-6">
                            Save items you love from the shop and review them anytime from your account dashboard.
                        </p>
                        <Button asChild>
                            <Link href="/shop" className="inline-flex items-center gap-2">
                                Discover Chocolates
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </Button>
                    </Card>
                ) : (
                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {products.map((product) => {
                            const isAdding = addingId === product.id;
                            const mainImage = getProductImage(product);

                            return (
                                <Card
                                    key={product.id}
                                    className="overflow-hidden flex flex-col justify-between hover:border-primary/50 transition-colors group relative"
                                >
                                    {/* Remove from wishlist button */}
                                    <button
                                        type="button"
                                        onClick={() => removeFromWishlist(product.id, product.name)}
                                        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors shadow-2xs cursor-pointer"
                                        title="Remove from wishlist"
                                        aria-label={`Remove ${product.name} from wishlist`}
                                    >
                                        <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                                    </button>

                                    <div>
                                        {/* Image */}
                                        <Link
                                            href={`/products/${product.slug}`}
                                            className="block aspect-4/3 w-full bg-muted overflow-hidden relative"
                                        >
                                            <img
                                                src={mainImage}
                                                alt={product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            {product.sale_price && (
                                                <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                                                    Sale
                                                </span>
                                            )}
                                        </Link>

                                        {/* Details */}
                                        <CardContent className="p-4">
                                            {product.brand && (
                                                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                                                    {product.brand.name}
                                                </p>
                                            )}
                                            <Link href={`/products/${product.slug}`}>
                                                <h3 className="font-bold text-sm text-foreground line-clamp-2 hover:underline leading-snug">
                                                    {product.name}
                                                </h3>
                                            </Link>
                                        </CardContent>
                                    </div>

                                    {/* Footer with price & actions */}
                                    <div className="p-4 pt-0 border-t border-border mt-2 flex items-center justify-between gap-2">
                                        <div>
                                            <span className="text-base font-extrabold text-foreground">
                                                {formatPrice(product.sale_price || product.price)}
                                            </span>
                                            {product.sale_price && (
                                                <span className="text-xs text-muted-foreground line-through ml-1.5 font-medium">
                                                    {formatPrice(product.price)}
                                                </span>
                                            )}
                                        </div>

                                        <Button
                                            size="sm"
                                            onClick={() => handleAddToCart(product)}
                                            disabled={isAdding}
                                            className="cursor-pointer"
                                        >
                                            {isAdding ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                                            ) : (
                                                <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                                            )}
                                            <span>Add to Cart</span>
                                        </Button>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </UserLayout>
    );
}
