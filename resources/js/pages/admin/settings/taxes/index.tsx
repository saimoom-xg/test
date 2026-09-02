import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type TaxRate = {
    id: number;
    name: string;
    rate: number;
    country_code: string | null;
    state_code: string | null;
    is_active: boolean;
};

type Paginated<T> = { data: T[] };

type Props = { taxes: Paginated<TaxRate> };

export default function TaxesIndex({ taxes }: Props) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [creating, setCreating] = useState(false);

    const form = useForm({
        name: '',
        rate: 0,
        country_code: '',
        state_code: '',
        is_active: true,
    });

    const openCreate = () => {
        form.reset();
        setEditingId(null);
        setCreating(true);
    };

    const openEdit = (tax: TaxRate) => {
        form.setData({
            name: tax.name,
            rate: tax.rate,
            country_code: tax.country_code || '',
            state_code: tax.state_code || '',
            is_active: tax.is_active,
        });
        setCreating(false);
        setEditingId(tax.id);
    };

    const submit = (e: React.FormEvent): void => {
        e.preventDefault();
        
        if (editingId) {
            form.put(`/admin/settings/taxes/${editingId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    form.reset();
                    setEditingId(null);
                },
            });
        } else {
            form.post('/admin/settings/taxes', {
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
            <Head title="Tax Rates" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Tax Rates</h1>
                        <p className="text-muted-foreground text-sm">Manage tax rates and regions.</p>
                    </div>
                    <Button onClick={openCreate} disabled={creating || editingId !== null}>
                        <Plus className="mr-2 h-4 w-4" />
                        New tax rate
                    </Button>
                </div>

                {(creating || editingId) ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>{editingId ? 'Edit tax rate' : 'New tax rate'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-2 lg:col-span-2">
                                    <Label htmlFor="name">Name (e.g. VAT, State Tax)</Label>
                                    <Input
                                        id="name"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                    />
                                    <InputError message={form.errors.name} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rate">Rate (%)</Label>
                                    <Input
                                        id="rate"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={form.data.rate}
                                        onChange={(e) => form.setData('rate', parseFloat(e.target.value) || 0)}
                                    />
                                    <InputError message={form.errors.rate} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="country_code">Country Code (2 letters)</Label>
                                    <Input
                                        id="country_code"
                                        maxLength={2}
                                        placeholder="US"
                                        value={form.data.country_code}
                                        onChange={(e) => form.setData('country_code', e.target.value.toUpperCase())}
                                    />
                                    <InputError message={form.errors.country_code} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="state_code">State/Province</Label>
                                    <Input
                                        id="state_code"
                                        placeholder="CA"
                                        value={form.data.state_code}
                                        onChange={(e) => form.setData('state_code', e.target.value)}
                                    />
                                    <InputError message={form.errors.state_code} />
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

                                <div className="md:col-span-2 lg:col-span-4 flex justify-end gap-2 mt-4">
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
                                    <th className="px-6 py-3 text-right font-medium">Rate</th>
                                    <th className="px-6 py-3 font-medium">Country</th>
                                    <th className="px-6 py-3 font-medium">State</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {taxes.data.map((tax) => (
                                    <tr key={tax.id} className="hover:bg-muted/40 border-b">
                                        <td className="px-6 py-3 font-medium">{tax.name}</td>
                                        <td className="px-6 py-3 text-right font-mono">{tax.rate}%</td>
                                        <td className="px-6 py-3">{tax.country_code || '*'}</td>
                                        <td className="px-6 py-3">{tax.state_code || '*'}</td>
                                        <td className="px-6 py-3">
                                            {tax.is_active ? 'Active' : 'Inactive'}
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEdit(tax)}
                                                disabled={creating || editingId !== null}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                disabled={creating || editingId !== null}
                                                onClick={() => {
                                                    if (confirm('Delete this tax rate?')) {
                                                        router.delete(`/admin/settings/taxes/${tax.id}`);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {taxes.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-muted-foreground px-6 py-12 text-center text-sm">
                                            No tax rates configured.
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

TaxesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Settings', href: '#' },
        { title: 'Taxes', href: '/admin/settings/taxes' },
    ],
};
