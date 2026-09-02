import { Head, Link, router } from '@inertiajs/react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type FlashSale = {
    id: number;
    title: string;
    starts_at: string;
    ends_at: string;
    is_active: boolean;
};

type Paginated<T> = { data: T[] };
type Props = { sales: Paginated<FlashSale> };

export default function FlashSalesIndex({ sales }: Props) {
    const isOngoing = (startsAt: string, endsAt: string) => {
        const now = new Date();
        return new Date(startsAt) <= now && new Date(endsAt) >= now;
    };

    return (
        <>
            <Head title="Flash Sales" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Flash Sales</h1>
                        <p className="text-muted-foreground text-sm">Manage time-limited sales and product allocations.</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/flash-sales/create">
                            <Plus className="mr-2 h-4 w-4" />
                            New flash sale
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardContent className="p-0 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-muted-foreground border-b text-left text-xs uppercase">
                                    <th className="px-6 py-3 font-medium">Title</th>
                                    <th className="px-6 py-3 font-medium">Starts At</th>
                                    <th className="px-6 py-3 font-medium">Ends At</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sales.data.map((sale) => (
                                    <tr key={sale.id} className="hover:bg-muted/40 border-b">
                                        <td className="px-6 py-3 font-medium">{sale.title}</td>
                                        <td className="px-6 py-3 text-muted-foreground whitespace-nowrap">
                                            {new Date(sale.starts_at).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-3 text-muted-foreground whitespace-nowrap">
                                            {new Date(sale.ends_at).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-3">
                                            {sale.is_active ? (
                                                isOngoing(sale.starts_at, sale.ends_at) ? (
                                                    <Badge variant="default" className="bg-green-600">Ongoing</Badge>
                                                ) : new Date(sale.ends_at) < new Date() ? (
                                                    <Badge variant="secondary">Ended</Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">Scheduled</Badge>
                                                )
                                            ) : (
                                                <Badge variant="outline">Inactive</Badge>
                                            )}
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/flash-sales/${sale.id}/edit`}>
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    if (confirm('Delete this flash sale?')) {
                                                        router.delete(`/admin/flash-sales/${sale.id}`);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {sales.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-muted-foreground px-6 py-12 text-center text-sm">
                                            No flash sales created.
                                        </td>
                                    </tr>
                                ) : null}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

FlashSalesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Flash Sales', href: '/admin/flash-sales' },
    ],
};
