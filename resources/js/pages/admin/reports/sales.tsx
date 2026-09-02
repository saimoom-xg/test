import { Head } from '@inertiajs/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

type SalesData = {
    date: string;
    total: number;
};

type Props = { salesData: SalesData[] };

export default function SalesOverview({ salesData }: Props) {
    const formattedData = salesData.map(item => ({
        ...item,
        total: Number(item.total),
    }));

    const totalRevenue = formattedData.reduce((sum, item) => sum + item.total, 0);

    return (
        <>
            <Head title="Sales Overview" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Sales Overview</h1>
                        <p className="text-muted-foreground text-sm">Revenue generated over the last 30 days.</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardDescription>Total Revenue (30 Days)</CardDescription>
                            <CardTitle className="text-4xl">${totalRevenue.toFixed(2)}</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Daily Revenue</CardTitle>
                        <CardDescription>A breakdown of your revenue day by day.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                        {formattedData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={formattedData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} />
                                    <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                    <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']} />
                                    <Line type="monotone" dataKey="total" stroke="var(--color-primary, #3b82f6)" strokeWidth={2} dot={false} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-muted-foreground">
                                No sales data available for this period.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

SalesOverview.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Reports', href: '#' },
        { title: 'Sales Overview', href: '/admin/reports/sales' },
    ],
};
