import { Head, router, useForm } from '@inertiajs/react';
import { Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import InputError from '@/components/input-error';

type StatusHistory = {
    id: number;
    status: string;
    notes: string | null;
    created_at: string;
    user: { name: string } | null;
};

type OrderReturn = {
    id: number;
    order_id: number;
    customer_id: number;
    status: 'pending' | 'approved' | 'received' | 'refunded' | 'rejected';
    reason: string;
    resolution: 'refund' | 'store_credit' | 'replacement';
    return_amount: number;
    admin_notes: string | null;
    created_at: string;
    order: { id: number; order_number: string };
    customer: { id: number; name: string; email: string };
    shipments: any[];
    status_histories: StatusHistory[];
};

type Props = { returnRequest: OrderReturn };

export default function ReturnsShow({ returnRequest }: Props) {
    const form = useForm({
        status: returnRequest.status,
        notes: '',
    });

    const updateStatus = (newStatus: string) => {
        form.setData('status', newStatus as any);
        // Wait for state to update, then submit (or use a ref/effect in a real app, 
        // but for simplicity we'll just put it directly in the post data here)
        router.post(`/admin/returns/${returnRequest.id}/status`, {
            status: newStatus,
            notes: form.data.notes,
        }, {
            preserveScroll: true,
            onSuccess: () => form.reset('notes'),
        });
    };

    return (
        <>
            <Head title={`RMA-${returnRequest.id.toString().padStart(5, '0')}`} />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-5xl mx-auto w-full">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            RMA-{returnRequest.id.toString().padStart(5, '0')}
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Return request for Order #{returnRequest.order?.order_number || returnRequest.order_id}
                        </p>
                    </div>
                    <Badge variant="outline" className="text-sm px-4 py-1">
                        {returnRequest.status.toUpperCase()}
                    </Badge>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-6 md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Return Details</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <Label className="text-muted-foreground">Reason</Label>
                                    <div className="font-medium mt-1">{returnRequest.reason}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Requested Resolution</Label>
                                    <div className="font-medium mt-1 capitalize">{returnRequest.resolution.replace('_', ' ')}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Return Amount</Label>
                                    <div className="font-mono text-lg font-bold mt-1">${returnRequest.return_amount}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Date Requested</Label>
                                    <div className="font-medium mt-1">{new Date(returnRequest.created_at).toLocaleString()}</div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Update Status</CardTitle>
                                <CardDescription>Process this RMA by updating its status.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label>Internal Notes (Optional)</Label>
                                    <Textarea 
                                        placeholder="Add notes about this status change..."
                                        value={form.data.notes}
                                        onChange={e => form.setData('notes', e.target.value)}
                                        className="mt-2"
                                    />
                                    <InputError message={form.errors.notes} />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {returnRequest.status === 'pending' && (
                                        <>
                                            <Button onClick={() => updateStatus('approved')} className="bg-blue-600 hover:bg-blue-700">
                                                <CheckCircle className="mr-2 h-4 w-4" /> Approve Return
                                            </Button>
                                            <Button onClick={() => updateStatus('rejected')} variant="destructive">
                                                <XCircle className="mr-2 h-4 w-4" /> Reject Return
                                            </Button>
                                        </>
                                    )}
                                    {returnRequest.status === 'approved' && (
                                        <Button onClick={() => updateStatus('received')} className="bg-indigo-600 hover:bg-indigo-700">
                                            <Package className="mr-2 h-4 w-4" /> Mark as Received
                                        </Button>
                                    )}
                                    {returnRequest.status === 'received' && (
                                        <Button onClick={() => updateStatus('refunded')} className="bg-green-600 hover:bg-green-700">
                                            <CheckCircle className="mr-2 h-4 w-4" /> Issue Refund
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="font-medium">{returnRequest.customer?.name}</div>
                                <div className="text-sm text-muted-foreground">{returnRequest.customer?.email}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Timeline</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {returnRequest.status_histories?.map((history, i) => (
                                        <div key={i} className="flex gap-4 border-b pb-4 last:border-0 last:pb-0">
                                            <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                                                <div className="h-2 w-2 rounded-full bg-primary" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-medium">
                                                    Status changed to {history.status.toUpperCase()}
                                                </p>
                                                {history.notes && (
                                                    <p className="text-sm text-muted-foreground">{history.notes}</p>
                                                )}
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(history.created_at).toLocaleString()} by {history.user?.name || 'System'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {(!returnRequest.status_histories || returnRequest.status_histories.length === 0) && (
                                        <p className="text-sm text-muted-foreground">No history available.</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

ReturnsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Returns', href: '/admin/returns' },
        { title: 'View RMA', href: '#' },
    ],
};
