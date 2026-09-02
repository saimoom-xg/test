import { Head, Link, router } from '@inertiajs/react';
import { Eye, Star, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type ProductReview = {
    id: number;
    product_id: number;
    customer_id: number;
    rating: number;
    title: string | null;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    product: {
        id: number;
        name: string;
    };
    customer: {
        id: number;
        name: string;
    };
};

type Paginated<T> = { data: T[] };
type Props = { reviews: Paginated<ProductReview> };

export default function ReviewsIndex({ reviews }: Props) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-neutral-100 text-neutral-800';
        }
    };

    const deleteReview = (id: number) => {
        if (confirm('Are you sure you want to delete this review?')) {
            router.delete(`/admin/reviews/${id}`, { preserveScroll: true });
        }
    };

    return (
        <>
            <Head title="Product Reviews" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Product Reviews</h1>
                        <p className="text-muted-foreground text-sm">Moderate customer reviews before they appear on the store.</p>
                    </div>
                </div>

                <Card>
                    <CardContent className="p-0 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-muted-foreground border-b text-left text-xs uppercase">
                                    <th className="px-6 py-3 font-medium">Product</th>
                                    <th className="px-6 py-3 font-medium">Customer</th>
                                    <th className="px-6 py-3 font-medium">Rating</th>
                                    <th className="px-6 py-3 font-medium">Title</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium">Date</th>
                                    <th className="px-6 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.data.map((review) => (
                                    <tr key={review.id} className="hover:bg-muted/40 border-b">
                                        <td className="px-6 py-3 font-medium">
                                            <Link href={`/admin/products/${review.product_id}`} className="hover:underline">
                                                {review.product?.name || `Product #${review.product_id}`}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-3 text-muted-foreground">{review.customer?.name}</td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                                <span className="font-medium">{review.rating}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 max-w-[200px] truncate">{review.title || '-'}</td>
                                        <td className="px-6 py-3">
                                            <Badge variant="secondary" className={getStatusColor(review.status)}>
                                                {review.status.toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-3 text-muted-foreground">
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" asChild>
                                                    <Link href={`/admin/reviews/${review.id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => deleteReview(review.id)}>
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {reviews.data.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-muted-foreground px-6 py-12 text-center text-sm">
                                            No reviews found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ReviewsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Products', href: '/admin/products' },
        { title: 'Reviews', href: '/admin/reviews' },
    ],
};
