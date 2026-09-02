import { Head, Link, router } from '@inertiajs/react';
import { Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type Customer = {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    is_active: boolean;
    is_guest: boolean;
    orders_count: number;
    created_at: string;
};

type Paginated<T> = { data: T[] };

type Props = {
    customers: Paginated<Customer>;
    filters: { search?: string };
};

export default function CustomersIndex({ customers, filters }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const apply = (): void => {
        router.get('/admin/customers', { search }, { preserveState: true });
    };

    return (
        <>
            <Head title="Customers" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
                    <p className="text-muted-foreground text-sm">All registered and guest customers</p>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    placeholder="Search customers..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && apply()}
                                    className="pl-9"
                                />
                            </div>
                            <Button onClick={apply}>Search</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-muted-foreground border-b text-left text-xs uppercase">
                                    <th className="px-6 py-3 font-medium">Name</th>
                                    <th className="px-6 py-3 font-medium">Email</th>
                                    <th className="px-6 py-3 font-medium">Phone</th>
                                    <th className="px-6 py-3 font-medium">Type</th>
                                    <th className="px-6 py-3 text-right font-medium">Orders</th>
                                    <th className="px-6 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.data.map((c) => (
                                    <tr key={c.id} className="hover:bg-muted/40 border-b">
                                        <td className="px-6 py-3 font-medium">
                                            <Link href={`/admin/customers/${c.id}`} className="hover:underline">
                                                {c.full_name || '—'}
                                            </Link>
                                        </td>
                                        <td className="text-muted-foreground px-6 py-3">{c.email ?? '—'}</td>
                                        <td className="text-muted-foreground px-6 py-3">{c.phone ?? '—'}</td>
                                        <td className="px-6 py-3">
                                            {c.is_guest ? (
                                                <Badge variant="outline">Guest</Badge>
                                            ) : (
                                                <Badge variant="secondary">Registered</Badge>
                                            )}
                                        </td>
                                        <td className="px-6 py-3 text-right">{c.orders_count}</td>
                                        <td className="px-6 py-3 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    if (confirm('Delete this customer?')) {
                                                        router.delete(`/admin/customers/${c.id}`);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {customers.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-muted-foreground px-6 py-12 text-center text-sm">
                                            No customers found.
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

CustomersIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Customers', href: '/admin/customers' },
    ],
};