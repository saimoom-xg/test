import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type OrderItem = {
    id: number;
    name: string;
    sku: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    total: number;
};

type Status = {
    id: number;
    code: string;
    name: string;
    color: string;
};

type StatusHistory = {
    id: number;
    from_status: string | null;
    to_status: string;
    comment: string | null;
    created_at: string;
    user: { name: string } | null;
};

type Order = {
    id: number;
    number: string;
    customer_email: string;
    customer_phone: string;
    customer_first_name: string;
    customer_last_name: string;
    customer: { full_name: string; email: string } | null;
    subtotal: number;
    shipping_total: number;
    tax_total: number;
    discount_total: number;
    grand_total: number;
    payment_status: string;
    shipping_status: string;
    currency_code: string;
    placed_at: string;
    notes: string;
    shipping_address_snapshot: Record<string, string> | null;
    billing_address_snapshot: Record<string, string> | null;
    status: Status | null;
    items: OrderItem[];
    status_histories: StatusHistory[];
};

type Props = {
    order: Order;
    statuses: Status[];
};

function formatCurrency(value: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
}

export default function OrderShow({ order, statuses }: Props) {
    const form = useForm({
        order_status_id: order.status?.id ?? '',
        comment: '',
    });

    const submit = (e: React.FormEvent): void => {
        e.preventDefault();
        form.post(`/admin/orders/${order.id}/status`, { preserveScroll: true });
    };

    return (
        <>
            <Head title={`Order ${order.number}`} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Button variant="ghost" asChild className="mb-2 -ml-2">
                            <Link href="/admin/orders">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to orders
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Order {order.number}
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Placed {order.placed_at}
                        </p>
                    </div>
                    <Badge variant="secondary">{order.status?.name ?? 'Pending'}</Badge>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Items</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-muted-foreground border-b text-left text-xs uppercase">
                                            <th className="px-6 py-3 font-medium">Product</th>
                                            <th className="px-6 py-3 font-medium">SKU</th>
                                            <th className="px-6 py-3 text-right font-medium">Qty</th>
                                            <th className="px-6 py-3 text-right font-medium">Price</th>
                                            <th className="px-6 py-3 text-right font-medium">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.items.map((item) => (
                                            <tr key={item.id} className="border-b">
                                                <td className="px-6 py-3 font-medium">{item.name}</td>
                                                <td className="text-muted-foreground px-6 py-3 font-mono text-xs">
                                                    {item.sku}
                                                </td>
                                                <td className="px-6 py-3 text-right">{item.quantity}</td>
                                                <td className="px-6 py-3 text-right">
                                                    {formatCurrency(item.unit_price, order.currency_code)}
                                                </td>
                                                <td className="px-6 py-3 text-right font-semibold">
                                                    {formatCurrency(item.total, order.currency_code)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Totals</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{formatCurrency(order.subtotal, order.currency_code)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span>{formatCurrency(order.shipping_total, order.currency_code)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tax</span>
                                    <span>{formatCurrency(order.tax_total, order.currency_code)}</span>
                                </div>
                                <div className="flex justify-between border-t pt-2 text-base font-semibold">
                                    <span>Total</span>
                                    <span>{formatCurrency(order.grand_total, order.currency_code)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Status history</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ol className="space-y-3">
                                    {order.status_histories.map((h) => (
                                        <li key={h.id} className="flex items-start gap-3 text-sm">
                                            <span className="bg-primary mt-1 h-2 w-2 rounded-full" />
                                            <div className="flex-1">
                                                <div className="font-medium">
                                                    {h.from_status ?? '—'} → {h.to_status}
                                                </div>
                                                <div className="text-muted-foreground text-xs">
                                                    {h.user?.name ?? 'System'} · {h.created_at}
                                                </div>
                                                {h.comment ? (
                                                    <p className="mt-1 text-sm">{h.comment}</p>
                                                ) : null}
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1 text-sm">
                                <p className="font-medium">
                                    {order.customer?.full_name ||
                                        `${order.customer_first_name} ${order.customer_last_name}`.trim() ||
                                        'Guest'}
                                </p>
                                <p className="text-muted-foreground">{order.customer_email}</p>
                                <p className="text-muted-foreground">{order.customer_phone}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Update status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submit} className="space-y-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <select
                                            id="status"
                                            className="border-input bg-transparent h-9 w-full rounded-md border px-3 text-sm"
                                            value={form.data.order_status_id}
                                            onChange={(e) =>
                                                form.setData('order_status_id', e.target.value)
                                            }
                                        >
                                            {statuses.map((s) => (
                                                <option key={s.id} value={s.id}>
                                                    {s.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="comment">Comment</Label>
                                        <Input
                                            id="comment"
                                            value={form.data.comment}
                                            onChange={(e) => form.setData('comment', e.target.value)}
                                            placeholder="Optional note..."
                                        />
                                    </div>
                                    <Button type="submit" disabled={form.processing} className="w-full">
                                        Update status
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

OrderShow.layout = (page: unknown): { breadcrumbs: { title: string; href: string }[] } => {
    void page;
    return {
        breadcrumbs: [
            { title: 'Dashboard', href: '/admin/dashboard' },
            { title: 'Orders', href: '/admin/orders' },
            { title: 'View', href: '#' },
        ],
    };
};