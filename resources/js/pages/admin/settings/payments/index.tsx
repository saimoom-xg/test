import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type PaymentMethod = {
    id: number;
    name: string;
    provider: string;
    is_active: boolean;
};

type Paginated<T> = { data: T[] };

type Props = { payments: Paginated<PaymentMethod> };

export default function PaymentsIndex({ payments }: Props) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [creating, setCreating] = useState(false);

    const form = useForm({
        name: '',
        provider: '',
        is_active: true,
    });

    const openCreate = () => {
        form.reset();
        setEditingId(null);
        setCreating(true);
    };

    const openEdit = (method: PaymentMethod) => {
        form.setData({
            name: method.name,
            provider: method.provider,
            is_active: method.is_active,
        });
        setCreating(false);
        setEditingId(method.id);
    };

    const submit = (e: React.FormEvent): void => {
        e.preventDefault();
        
        if (editingId) {
            form.put(`/admin/settings/payments/${editingId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    form.reset();
                    setEditingId(null);
                },
            });
        } else {
            form.post('/admin/settings/payments', {
                preserveScroll: true,
                onSuccess: () => {
                    form.reset();
                    setCreating(false);
                },
            });
        }
    };

    const cancel = () => {
        form.reset();
        setCreating(false);
        setEditingId(null);
    };

    return (
        <>
            <Head title="Payment Methods" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Payment Methods</h1>
                        <p className="text-muted-foreground text-sm">Configure available payment gateways.</p>
                    </div>
                    <Button onClick={openCreate} disabled={creating || editingId !== null}>
                        <Plus className="mr-2 h-4 w-4" />
                        New payment method
                    </Button>
                </div>

                {(creating || editingId) ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>{editingId ? 'Edit payment method' : 'New payment method'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name (e.g. Credit Card)</Label>
                                    <Input
                                        id="name"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                    />
                                    <InputError message={form.errors.name} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="provider">Provider (e.g. stripe)</Label>
                                    <Input
                                        id="provider"
                                        value={form.data.provider}
                                        onChange={(e) => form.setData('provider', e.target.value.toLowerCase())}
                                    />
                                    <InputError message={form.errors.provider} />
                                </div>
                                
                                <div className="flex items-center gap-4 md:col-span-2">
                                    <div className="flex items-center gap-2">
                                        <input
                                            id="is_active"
                                            type="checkbox"
                                            checked={form.data.is_active}
                                            onChange={(e) => form.setData('is_active', e.target.checked)}
                                        />
                                        <Label htmlFor="is_active">Active</Label>
                                    </div>
                                </div>

                                <div className="md:col-span-2 flex justify-end gap-2 mt-4">
                                    <Button type="button" variant="ghost" onClick={cancel}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={form.processing}>
                                        Save
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                ) : null}

                <Card>
                    <CardContent className="p-0 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-muted-foreground border-b text-left text-xs uppercase">
                                    <th className="px-6 py-3 font-medium">Name</th>
                                    <th className="px-6 py-3 font-medium">Provider</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.data.map((method) => (
                                    <tr key={method.id} className="hover:bg-muted/40 border-b">
                                        <td className="px-6 py-3 font-medium">{method.name}</td>
                                        <td className="px-6 py-3 font-mono text-xs">{method.provider}</td>
                                        <td className="px-6 py-3">
                                            {method.is_active ? 'Active' : 'Inactive'}
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEdit(method)}
                                                disabled={creating || editingId !== null}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                disabled={creating || editingId !== null}
                                                onClick={() => {
                                                    if (confirm('Delete this payment method?')) {
                                                        router.delete(`/admin/settings/payments/${method.id}`);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {payments.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-muted-foreground px-6 py-12 text-center text-sm">
                                            No payment methods configured.
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

PaymentsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Settings', href: '#' },
        { title: 'Payment Methods', href: '/admin/settings/payments' },
    ],
};
