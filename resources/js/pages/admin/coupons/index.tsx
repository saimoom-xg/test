import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Coupon = {
    id: number;
    code: string;
    type: 'percentage' | 'fixed';
    value: number;
    min_order_amount: number | null;
    max_discount: number | null;
    starts_at: string | null;
    ends_at: string | null;
    usage_limit: number | null;
    usage_count: number;
    is_active: boolean;
};

type Paginated<T> = { data: T[] };
type Props = { coupons: Paginated<Coupon> };

export default function CouponsIndex({ coupons }: Props) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [creating, setCreating] = useState(false);

    const form = useForm({
        code: '',
        type: 'percentage' as 'percentage' | 'fixed',
        value: 0,
        min_order_amount: '',
        max_discount: '',
        starts_at: '',
        ends_at: '',
        usage_limit: '',
        is_active: true,
    });

    const openCreate = () => {
        form.reset();
        setEditingId(null);
        setCreating(true);
    };

    const openEdit = (coupon: Coupon) => {
        form.setData({
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            min_order_amount: coupon.min_order_amount?.toString() || '',
            max_discount: coupon.max_discount?.toString() || '',
            starts_at: coupon.starts_at ? new Date(coupon.starts_at).toISOString().slice(0, 16) : '',
            ends_at: coupon.ends_at ? new Date(coupon.ends_at).toISOString().slice(0, 16) : '',
            usage_limit: coupon.usage_limit?.toString() || '',
            is_active: coupon.is_active,
        });
        setCreating(false);
        setEditingId(coupon.id);
    };

    const submit = (e: React.FormEvent): void => {
        e.preventDefault();
        
        const endpoint = editingId ? `/admin/coupons/${editingId}` : '/admin/coupons';
        const method = editingId ? 'put' : 'post';
        
        form[method](endpoint, {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setEditingId(null);
                setCreating(false);
            },
        });
    };

    const cancel = () => {
        form.reset();
        setCreating(false);
        setEditingId(null);
    };

    return (
        <>
            <Head title="Coupons" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Coupons</h1>
                        <p className="text-muted-foreground text-sm">Manage discount codes and promotions.</p>
                    </div>
                    <Button onClick={openCreate} disabled={creating || editingId !== null}>
                        <Plus className="mr-2 h-4 w-4" />
                        New coupon
                    </Button>
                </div>

                {(creating || editingId) ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>{editingId ? 'Edit coupon' : 'New coupon'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="code">Code</Label>
                                    <Input
                                        id="code"
                                        value={form.data.code}
                                        onChange={(e) => form.setData('code', e.target.value.toUpperCase())}
                                        placeholder="SUMMER25"
                                    />
                                    <InputError message={form.errors.code} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="type">Type</Label>
                                    <select
                                        id="type"
                                        className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none"
                                        value={form.data.type}
                                        onChange={(e) => form.setData('type', e.target.value as 'percentage' | 'fixed')}
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount</option>
                                    </select>
                                    <InputError message={form.errors.type} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="value">Discount Value</Label>
                                    <Input
                                        id="value"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={form.data.value}
                                        onChange={(e) => form.setData('value', parseFloat(e.target.value) || 0)}
                                    />
                                    <InputError message={form.errors.value} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="min_order_amount">Min Order Amount (Optional)</Label>
                                    <Input
                                        id="min_order_amount"
                                        type="number"
                                        step="0.01"
                                        value={form.data.min_order_amount}
                                        onChange={(e) => form.setData('min_order_amount', e.target.value)}
                                    />
                                    <InputError message={form.errors.min_order_amount} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="max_discount">Max Discount (Optional)</Label>
                                    <Input
                                        id="max_discount"
                                        type="number"
                                        step="0.01"
                                        value={form.data.max_discount}
                                        onChange={(e) => form.setData('max_discount', e.target.value)}
                                        disabled={form.data.type === 'fixed'}
                                    />
                                    <InputError message={form.errors.max_discount} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="usage_limit">Total Usage Limit (Optional)</Label>
                                    <Input
                                        id="usage_limit"
                                        type="number"
                                        min="1"
                                        value={form.data.usage_limit}
                                        onChange={(e) => form.setData('usage_limit', e.target.value)}
                                    />
                                    <InputError message={form.errors.usage_limit} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="starts_at">Starts At (Optional)</Label>
                                    <Input
                                        id="starts_at"
                                        type="datetime-local"
                                        value={form.data.starts_at}
                                        onChange={(e) => form.setData('starts_at', e.target.value)}
                                    />
                                    <InputError message={form.errors.starts_at} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="ends_at">Ends At (Optional)</Label>
                                    <Input
                                        id="ends_at"
                                        type="datetime-local"
                                        value={form.data.ends_at}
                                        onChange={(e) => form.setData('ends_at', e.target.value)}
                                    />
                                    <InputError message={form.errors.ends_at} />
                                </div>
                                
                                <div className="flex items-center gap-4 lg:col-span-3">
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

                                <div className="md:col-span-2 lg:col-span-3 flex justify-end gap-2 mt-4">
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
                                    <th className="px-6 py-3 font-medium">Code</th>
                                    <th className="px-6 py-3 font-medium">Type</th>
                                    <th className="px-6 py-3 text-right font-medium">Value</th>
                                    <th className="px-6 py-3 text-right font-medium">Usage</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coupons.data.map((coupon) => (
                                    <tr key={coupon.id} className="hover:bg-muted/40 border-b">
                                        <td className="px-6 py-3 font-medium font-mono">{coupon.code}</td>
                                        <td className="px-6 py-3 capitalize">{coupon.type}</td>
                                        <td className="px-6 py-3 text-right font-mono">
                                            {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            {coupon.usage_count} {coupon.usage_limit ? `/ ${coupon.usage_limit}` : ''}
                                        </td>
                                        <td className="px-6 py-3">
                                            {coupon.is_active ? 'Active' : 'Inactive'}
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEdit(coupon)}
                                                disabled={creating || editingId !== null}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                disabled={creating || editingId !== null}
                                                onClick={() => {
                                                    if (confirm('Delete this coupon?')) {
                                                        router.delete(`/admin/coupons/${coupon.id}`);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {coupons.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-muted-foreground px-6 py-12 text-center text-sm">
                                            No coupons created.
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

CouponsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Coupons', href: '/admin/coupons' },
    ],
};
