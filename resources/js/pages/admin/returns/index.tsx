import { Head, Link } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type OrderReturn = {
    id: number;
    order_id: number;
    customer_id: number;
    status: 'pending' | 'approved' | 'received' | 'refunded' | 'rejected';
    reason: string;
    resolution: 'refund' | 'store_credit' | 'replacement';
    return_amount: number;
    created_at: string;
    order: {
        id: number;
        order_number: string;
    };
    customer: {
        id: number;
        name: string;
    };
};

type Paginated<T> = { data: T[] };
type Props = { returns: Paginated<OrderReturn> };

export default function ReturnsIndex({ returns }: Props) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'approved': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'received': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
            case 'refunded': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-neutral-100 text-neutral-800';
        }
    };

    return (
        <>
            <Head title="Returns & RMA" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Returns & RMA</h1>
                        <p className="text-muted-foreground text-sm">Manage customer return requests and refunds.</p>
                    </div>
                </div>

                <Card>
                    <CardContent className="p-0 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-muted-foreground border-b text-left text-xs uppercase">
                                    <th className="px-6 py-3 font-medium">RMA #</th>
                                    <th className="px-6 py-3 font-medium">Order</th>
                                    <th className="px-6 py-3 font-medium">Customer</th>
                                    <th className="px-6 py-3 font-medium">Reason</th>
                                    <th className="px-6 py-3 text-right font-medium">Amount</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {returns.data.map((req) => (
                                    <tr key={req.id} className="hover:bg-muted/40 border-b">
                                        <td className="px-6 py-3 font-medium font-mono">
                                            RMA-{req.id.toString().padStart(5, '0')}
                                        </td>
                                        <td className="px-6 py-3 font-mono text-xs">
                                            <Link href={`/admin/orders/${req.order_id}`} className="hover:underline">
                                                {req.order?.order_number || `#${req.order_id}`}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-3">{req.customer?.name}</td>
                                        <td className="px-6 py-3 text-muted-foreground">{req.reason}</td>
                                        <td className="px-6 py-3 text-right font-mono">${req.return_amount}</td>
                                        <td className="px-6 py-3">
                                            <Badge variant="secondary" className={getStatusColor(req.status)}>
                                                {req.status.toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/returns/${req.id}`}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {returns.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-muted-foreground px-6 py-12 text-center text-sm">
                                            No return requests found.
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

ReturnsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Returns', href: '/admin/returns' },
    ],
};
