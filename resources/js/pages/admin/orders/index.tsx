import { Head, Link, router } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

type Order = {
    id: number;
    number: string;
    grand_total: number;
    payment_status: string;
    shipping_status: string;
    customer_email: string;
    customer_first_name: string;
    customer_last_name: string;
    placed_at: string;
    status: { code: string; name: string; color: string } | null;
};

type Paginated<T> = { data: T[]; links: { url: string | null; label: string; active: boolean }[]; current_page: number; last_page: number };

type Props = {
    orders: Paginated<Order>;
    filters: { search?: string; payment_status?: string; shipping_status?: string };
};

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function statusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status) {
        case 'paid':
        case 'completed':
        case 'delivered':
            return 'default';
        case 'pending':
        case 'processing':
        case 'shipped':
            return 'secondary';
        case 'failed':
        case 'cancelled':
        case 'refunded':
            return 'destructive';
        default:
            return 'outline';
    }
}

export default function OrdersIndex({ orders }: Props) {
    return (
        <>
            <Head title="Orders" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
                    <p className="text-muted-foreground text-sm">Manage customer orders</p>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex gap-2" />
                    </CardHeader>
                    <CardContent className="p-0">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-muted-foreground border-b text-left text-xs uppercase">
                                    <th className="px-6 py-3 font-medium">Order</th>
                                    <th className="px-6 py-3 font-medium">Customer</th>
                                    <th className="px-6 py-3 font-medium">Date</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium">Payment</th>
                                    <th className="px-6 py-3 text-right font-medium">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.data.map((o) => (
                                    <tr key={o.id} className="hover:bg-muted/40 border-b">
                                        <td className="px-6 py-3">
                                            <Link href={`/admin/orders/${o.id}`} className="font-medium hover:underline">
                                                {o.number}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-3">
                                            {o.customer_first_name || o.customer_last_name
                                                ? `${o.customer_first_name ?? ''} ${o.customer_last_name ?? ''}`
                                                : o.customer_email ?? 'Guest'}
                                        </td>
                                        <td className="text-muted-foreground px-6 py-3 text-xs">
                                            {o.placed_at}
                                        </td>
                                        <td className="px-6 py-3">
                                            <Badge variant={statusVariant(o.status?.code ?? '')}>
                                                {o.status?.name ?? '—'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-3">
                                            <Badge variant={statusVariant(o.payment_status)}>
                                                {o.payment_status}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-3 text-right font-semibold">
                                                {formatCurrency(o.grand_total)}
                                        </td>
                                    </tr>
                                ))}
                                {orders.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-muted-foreground px-6 py-12 text-center text-sm">
                                            No orders found.
                                        </td>
                                    </tr>
                                ) : null}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                {orders.last_page > 1 ? (
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                            Page {orders.current_page} of {orders.last_page}
                        </span>
                        <div className="flex gap-2">
                            {orders.links.map((link, i) => (
                                <Button
                                    key={i}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                    asChild={!!link.url}
                                >
                                    {link.url ? (
                                        <Link href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                                    ) : (
                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                    )}
                                </Button>
                            ))}
                        </div>
                    </div>
                ) : null}
            </div>
        </>
    );
}

void router;

OrdersIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Orders', href: '/admin/orders' },
    ],
};