import { Head } from '@inertiajs/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

type StatusData = {
    status: string;
    count: number;
};

type Props = { statusData: StatusData[] };

export default function OrdersAnalytics({ statusData }: Props) {
    const formattedData = statusData.map(item => ({
        name: item.status.charAt(0).toUpperCase() + item.status.slice(1),
        count: Number(item.count),
    }));

    const totalOrders = formattedData.reduce((sum, item) => sum + item.count, 0);

    return (
        <>
            <Head title="Orders Analytics" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Orders Analytics</h1>
                        <p className="text-muted-foreground text-sm">Analyze order volume and status distribution.</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Total Orders</CardDescription>
                            <CardTitle className="text-4xl">{totalOrders}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Orders by Status</CardTitle>
                        <CardDescription>A breakdown of your orders by their current status.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                        {formattedData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={formattedData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={10} />
                                    <YAxis tickLine={false} axisLine={false} />
                                    <Tooltip cursor={{ fill: 'transparent' }} />
                                    <Bar dataKey="count" fill="var(--color-primary, #10b981)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground">
                                No orders data available.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

OrdersAnalytics.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Reports', href: '#' },
        { title: 'Orders Analytics', href: '/admin/reports/orders' },
    ],
};
