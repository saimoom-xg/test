import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type WishlistData = {
    count: number;
    productIds: number[];
};

export function useWishlist() {
    const pageProps = usePage<any>().props;
    const serverWishlist: WishlistData = pageProps.wishlist || { count: 0, productIds: [] };

    const [productIds, setProductIds] = useState<number[]>(serverWishlist.productIds || []);
    const [isToggling, setIsToggling] = useState<number | null>(null);

    // Synchronize with Inertia page props
    useEffect(() => {
        if (serverWishlist?.productIds) {
            setProductIds(serverWishlist.productIds);
        }
    }, [serverWishlist?.productIds]);

    const isWishlisted = (productId: number): boolean => {
        return productIds.includes(productId);
    };

    const toggleWishlist = (product: { id: number; name: string }): void => {
        if (!pageProps.auth?.user) {
            toast.info('Please sign in to save items to your wishlist.');
            router.visit('/login');
            return;
        }

        if (isToggling === product.id) return;
        setIsToggling(product.id);

        const currentlyWishlisted = isWishlisted(product.id);

        // Optimistic UI update
        const updatedIds = currentlyWishlisted
            ? productIds.filter((id) => id !== product.id)
            : [...productIds, product.id];
        setProductIds(updatedIds);

        router.post(
            '/user/wishlist/toggle',
            { product_id: product.id },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    toast.success(
                        currentlyWishlisted
                            ? `${product.name} removed from wishlist.`
                            : `${product.name} added to wishlist!`
                    );
                },
                onError: () => {
                    // Revert optimistic update
                    setProductIds(serverWishlist.productIds || []);
                    toast.error('Could not update wishlist.');
                },
                onFinish: () => {
                    setIsToggling(null);
                },
            }
        );
    };

    const removeFromWishlist = (productId: number, productName?: string): void => {
        if (isToggling === productId) return;
        setIsToggling(productId);

        // Optimistic UI update
        setProductIds((prev) => prev.filter((id) => id !== productId));

        router.delete(`/user/wishlist/items/${productId}`, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                toast.success(
                    productName
                        ? `${productName} removed from wishlist.`
                        : 'Item removed from wishlist.'
                );
            },
            onError: () => {
                setProductIds(serverWishlist.productIds || []);
                toast.error('Failed to remove item from wishlist.');
            },
            onFinish: () => {
                setIsToggling(null);
            },
        });
    };

    const clearWishlist = (): void => {
        setProductIds([]);
        router.delete('/user/wishlist', {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                toast.success('Wishlist cleared.');
            },
            onError: () => {
                setProductIds(serverWishlist.productIds || []);
                toast.error('Failed to clear wishlist.');
            },
        });
    };

    return {
        wishlistCount: productIds.length,
        wishlistProductIds: productIds,
        isWishlisted,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        isToggling,
    };
}
