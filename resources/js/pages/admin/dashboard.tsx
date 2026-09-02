import { Head, Link } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowRight,
    Box,
    DollarSign,
    History,
    Package,
    Search,
    ShoppingCart,
    TrendingUp,
    Users,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type Stat = {
    orders: { total: number; today: number; last_7_days: number; last_30_days: number };
    revenue: { total: number; last_7_days: number; last_30_days: number; currency: string };
    customers: { total: number; last_30_days: number };
    products: { total: number; low_stock: number };
};

type RecentOrder = {
    id: number;
    number: string;
    grand_total: number;
    payment_status: string;
    placed_at: string | null;
    status: { code: string; name: string; color: string } | null;
    customer: { full_name: string } | null;
};

type LowStockProduct = {
    id: number;
    name: string;
    sku: string;
    stock_quantity: number;
    low_stock_threshold: number;
};

type TopSelling = {
    product_id: number;
    name: string;
    total_quantity: number;
    total_revenue: number;
};

type ActivityLog = {
    id: number;
    action: string;
    subject_type: string | null;
    subject_id: number | null;
    created_at: string;
    user: { name: string } | null;
};

type Props = {
    stats: Stat;
    recentOrders: RecentOrder[];
    lowStockProducts: LowStockProduct[];
    topSelling: TopSelling[];
    salesChart: Record<string, number>;
    recentActivity: ActivityLog[];
};

function formatCurrency(value: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
}

function statusVariant(status: string | undefined): 'default' | 'secondary' | 'destructive' | 'outline' {
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

export default function AdminDashboard({
    stats,
    recentOrders,
    lowStockProducts,
    topSelling,
    recentActivity,
}: Props) {
    const maxRevenue = Math.max(...topSelling.map((p) => Number(p.total_revenue) || 0), 1);
    const [search, setSearch] = useState('');
    const [results, setResults] = useState<{
        products: { id: number; name: string; sku: string }[];
        categories: { id: number; name: string }[];
        brands: { id: number; name: string }[];
        customers: { id: number; first_name: string | null; last_name: string | null; email: string | null }[];
        orders: { id: number; number: string }[];
    } | null>(null);
    const [searching, setSearching] = useState(false);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (search.length < 2) {
            setResults(null);
            return;
        }
        if (timerRef.current) {
            window.clearTimeout(timerRef.current);
        }
        timerRef.current = window.setTimeout(async () => {
            setSearching(true);
            try {
                const response = await fetch(`/admin/search?q=${encodeURIComponent(search)}`, {
                    headers: { Accept: 'application/json' },
                    credentials: 'same-origin',
                });
                if (response.ok) {
                    const json = await response.json();
                    setResults(json.data);
                } else {
                    setResults(null);
                }
            } finally {
                setSearching(false);
            }
        }, 250);
        return () => {
            if (timerRef.current) {
                window.clearTimeout(timerRef.current);
            }
        };
    }, [search]);

    return (
        <>
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground text-sm">
                            Welcome back. Here's what's happening today.
                        </p>
                    </div>

                    <div className="relative w-full max-w-xs">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                            placeholder="Search products, orders, customers..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                        {results ? (
                            <div className="bg-popover absolute right-0 left-0 z-50 mt-2 max-h-96 overflow-y-auto rounded-md border p-2 shadow-md">
                                {searching ? (
                                    <p className="text-muted-foreground p-3 text-sm">Searching…</p>
                                ) : (
                                    <>
                                        {results.products.length > 0 ? (
                                            <div>
                                                <p className="text-muted-foreground px-2 py-1 text-xs font-medium uppercase">
                                                    Products
                                                </p>
                                                {results.products.map((p) => (
                                                    <Link
                                                        key={p.id}
                                                        href={`/admin/products/${p.id}/edit`}
                                                        className="hover:bg-muted block rounded px-2 py-1 text-sm"
                                                        onClick={() => setSearch('')}
                                                    >
                                                        {p.name} <span className="text-muted-foreground text-xs">({p.sku})</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : null}
                                        {results.orders.length > 0 ? (
                                            <div className="mt-2">
                                                <p className="text-muted-foreground px-2 py-1 text-xs font-medium uppercase">
                                                    Orders
                                                </p>
                                                {results.orders.map((o) => (
                                                    <Link
                                                        key={o.id}
                                                        href={`/admin/orders/${o.id}`}
                                                        className="hover:bg-muted block rounded px-2 py-1 text-sm"
                                                        onClick={() => setSearch('')}
                                                    >
                                                        {o.number}
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : null}
                                        {results.customers.length > 0 ? (
                                            <div className="mt-2">
                                                <p className="text-muted-foreground px-2 py-1 text-xs font-medium uppercase">
                                                    Customers
                                                </p>
                                                {results.customers.map((c) => (
                                                    <Link
                                                        key={c.id}
                                                        href={`/admin/customers/${c.id}`}
                                                        className="hover:bg-muted block rounded px-2 py-1 text-sm"
                                                        onClick={() => setSearch('')}
                                                    >
                                                        {`${c.first_name ?? ''} ${c.last_name ?? ''}`.trim() ||
                                                            c.email}
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : null}
                                        {results.brands.length > 0 ? (
                                            <div className="mt-2">
                                                <p className="text-muted-foreground px-2 py-1 text-xs font-medium uppercase">
                                                    Brands
                                                </p>
                                                {results.brands.map((b) => (
                                                    <Link
                                                        key={b.id}
                                                        href="/admin/brands"
                                                        className="hover:bg-muted block rounded px-2 py-1 text-sm"
                                                        onClick={() => setSearch('')}
                                                    >
                                                        {b.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : null}
                                        {results.categories.length > 0 ? (
                                            <div className="mt-2">
                                                <p className="text-muted-foreground px-2 py-1 text-xs font-medium uppercase">
                                                    Categories
                                                </p>
                                                {results.categories.map((c) => (
                                                    <Link
                                                        key={c.id}
                                                        href="/admin/categories"
                                                        className="hover:bg-muted block rounded px-2 py-1 text-sm"
                                                        onClick={() => setSearch('')}
                                                    >
                                                        {c.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        ) : null}
                                        {!results.products.length &&
                                        !results.orders.length &&
                                        !results.customers.length &&
                                        !results.brands.length &&
                                        !results.categories.length ? (
                                            <p className="text-muted-foreground p-3 text-sm">No results.</p>
                                        ) : null}
                                    </>
                                )}
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(stats.revenue.total, stats.revenue.currency)}
                            </div>
                            <p className="text-muted-foreground text-xs">
                                {formatCurrency(stats.revenue.last_30_days, stats.revenue.currency)} last 30d
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Orders</CardTitle>
                            <ShoppingCart className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.orders.total.toLocaleString()}</div>
                            <p className="text-muted-foreground text-xs">
                                {stats.orders.today} today · {stats.orders.last_7_days} last 7d
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Customers</CardTitle>
                            <Users className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.customers.total.toLocaleString()}</div>
                            <p className="text-muted-foreground text-xs">
                                +{stats.customers.last_30_days} in last 30d
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Products</CardTitle>
                            <Package className="text-muted-foreground h-4 w-4" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.products.total.toLocaleString()}</div>
                            <p className="text-muted-foreground text-xs">
                                {stats.products.low_stock} low stock
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Recent Orders</CardTitle>
                                <CardDescription>Latest orders across your store</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/admin/orders">
                                    View all <ArrowRight className="ml-1 h-4 w-4" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {recentOrders.length === 0 ? (
                                <div className="text-muted-foreground flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-sm">
                                    <Box className="mb-2 h-8 w-8" />
                                    No orders yet.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {recentOrders.map((order) => (
                                        <Link
                                            key={order.id}
                                            href={`/admin/orders/${order.id}`}
                                            className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium">{order.number}</span>
                                                    <Badge variant={statusVariant(order.status?.code)}>
                                                        {order.status?.name ?? '—'}
                                                    </Badge>
                                                </div>
                                                <p className="text-muted-foreground text-xs">
                                                    {order.customer?.full_name || order.customer_email || 'Guest'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-semibold">
                                                    {formatCurrency(order.grand_total)}
                                                </div>
                                                <p className="text-muted-foreground text-xs">
                                                    {order.placed_at}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Low Stock</CardTitle>
                                <CardDescription>Products running low</CardDescription>
                            </div>
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            {lowStockProducts.length === 0 ? (
                                <div className="text-muted-foreground flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-sm">
                                    <Package className="mb-2 h-8 w-8" />
                                    All products are well stocked.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {lowStockProducts.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/admin/products/${product.id}/edit`}
                                            className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
                                        >
                                            <div>
                                                <p className="font-medium text-sm">{product.name}</p>
                                                <p className="text-muted-foreground text-xs">{product.sku}</p>
                                            </div>
                                            <Badge variant="destructive">{product.stock_quantity} left</Badge>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Top Selling Products</CardTitle>
                                <CardDescription>Best performers by units sold</CardDescription>
                            </div>
                            <TrendingUp className="h-4 w-4 text-emerald-500" />
                        </CardHeader>
                        <CardContent>
                                {topSelling.length === 0 ? (
                                    <div className="text-muted-foreground flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-sm">
                                        <TrendingUp className="mb-2 h-8 w-8" />
                                        No sales recorded yet.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {topSelling.map((product) => (
                                            <div key={product.product_id} className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="font-medium">{product.name}</span>
                                                    <span className="text-muted-foreground">
                                                        {product.total_quantity} units · {formatCurrency(Number(product.total_revenue))}
                                                    </span>
                                                </div>
                                                <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
                                                    <div
                                                        className="bg-primary h-full rounded-full transition-all"
                                                        style={{
                                                            width: `${Math.max(10, (Number(product.total_revenue) / maxRevenue) * 100)}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Recent activity</CardTitle>
                                <CardDescription>Audit log of recent admin actions</CardDescription>
                            </div>
                            <History className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {recentActivity.length === 0 ? (
                                <div className="text-muted-foreground flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-sm">
                                    <History className="mb-2 h-8 w-8" />
                                    No activity yet.
                                </div>
                            ) : (
                                <ol className="space-y-3">
                                    {recentActivity.map((entry) => (
                                        <li key={entry.id} className="flex items-start gap-3 text-sm">
                                            <span className="bg-primary mt-1 h-2 w-2 rounded-full" />
                                            <div className="flex-1">
                                                <div className="font-medium">
                                                    {entry.action.replace(/[._]/g, ' ')}
                                                </div>
                                                <div className="text-muted-foreground text-xs">
                                                    {entry.user?.name ?? 'System'} · {entry.created_at}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: '/admin/dashboard' }],
};