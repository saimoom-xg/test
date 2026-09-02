import { Head, router } from '@inertiajs/react';
import { CheckCircle, XCircle, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

type ProductReview = {
    id: number;
    product_id: number;
    customer_id: number;
    rating: number;
    title: string | null;
    body: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    product: {
        id: number;
        name: string;
    };
    customer: {
        id: number;
        name: string;
        email: string;
    };
};

type Props = { review: ProductReview };

export default function ReviewsShow({ review }: Props) {
    const updateStatus = (newStatus: string) => {
        router.post(`/admin/reviews/${review.id}/status`, {
            status: newStatus,
        }, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title={`Review #${review.id}`} />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-4xl mx-auto w-full">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Review Moderation</h1>
                        <p className="text-muted-foreground text-sm">Review for {review.product?.name}</p>
                    </div>
                    <Badge variant={review.status === 'approved' ? 'default' : review.status === 'rejected' ? 'destructive' : 'secondary'} className="text-sm px-4 py-1">
                        {review.status.toUpperCase()}
                    </Badge>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-6 md:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{review.title || 'No Title Provided'}</CardTitle>
                                        <CardDescription className="mt-1">
                                            Posted on {new Date(review.created_at).toLocaleString()}
                                        </CardDescription>
                                    </div>
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} />
                                        ))}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 bg-muted/50 rounded-lg whitespace-pre-wrap">
                                    {review.body}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Moderation Actions</CardTitle>
                                <CardDescription>Approve this review to make it public, or reject it.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2">
                                    {review.status !== 'approved' && (
                                        <Button onClick={() => updateStatus('approved')} className="bg-green-600 hover:bg-green-700">
                                            <CheckCircle className="mr-2 h-4 w-4" /> Approve Review
                                        </Button>
                                    )}
                                    {review.status !== 'rejected' && (
                                        <Button onClick={() => updateStatus('rejected')} variant="destructive">
                                            <XCircle className="mr-2 h-4 w-4" /> Reject Review
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="font-medium">{review.customer?.name}</div>
                                <div className="text-sm text-muted-foreground">{review.customer?.email}</div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

ReviewsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Products', href: '/admin/products' },
        { title: 'Reviews', href: '/admin/reviews' },
        { title: 'Moderate', href: '#' },
    ],
};
