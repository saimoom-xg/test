import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Currency = {
    id: number;
    code: string;
    name: string;
    symbol: string;
    exchange_rate: number;
    is_default: boolean;
    is_active: boolean;
};

type Paginated<T> = { data: T[] };

type Props = { currencies: Paginated<Currency> };

export default function CurrenciesIndex({ currencies }: Props) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [creating, setCreating] = useState(false);

    const form = useForm({
        code: '',
        name: '',
        symbol: '',
        exchange_rate: 1.0,
        is_default: false,
        is_active: true,
    });

    const openCreate = () => {
        form.reset();
        setEditingId(null);
        setCreating(true);
    };

    const openEdit = (currency: Currency) => {
        form.setData({
            code: currency.code,
            name: currency.name,
            symbol: currency.symbol,
            exchange_rate: currency.exchange_rate,
            is_default: currency.is_default,
            is_active: currency.is_active,
        });
        setCreating(false);
        setEditingId(currency.id);
    };

    const submit = (e: React.FormEvent): void => {
        e.preventDefault();
        
        if (editingId) {
            form.put(`/admin/settings/currencies/${editingId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    form.reset();
                    setEditingId(null);
                },
            });
        } else {
            form.post('/admin/settings/currencies', {
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
            <Head title="Currencies" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Currencies</h1>
                        <p className="text-muted-foreground text-sm">Manage store currencies and exchange rates.</p>
                    </div>
                    <Button onClick={openCreate} disabled={creating || editingId !== null}>
                        <Plus className="mr-2 h-4 w-4" />
                        New currency
                    </Button>
                </div>

                {(creating || editingId) ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>{editingId ? 'Edit currency' : 'New currency'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                                <div className="space-y-2">
                                    <Label htmlFor="code">Currency Code (e.g. USD)</Label>
                                    <Input
                                        id="code"
                                        maxLength={3}
                                        value={form.data.code}
                                        onChange={(e) => form.setData('code', e.target.value.toUpperCase())}
                                    />
                                    <InputError message={form.errors.code} />
                                </div>
                                <div className="space-y-2 lg:col-span-2">
                                    <Label htmlFor="name">Name (e.g. US Dollar)</Label>
                                    <Input
                                        id="name"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                    />
                                    <InputError message={form.errors.name} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="symbol">Symbol</Label>
                                    <Input
                                        id="symbol"
                                        value={form.data.symbol}
                                        onChange={(e) => form.setData('symbol', e.target.value)}
                                    />
                                    <InputError message={form.errors.symbol} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="exchange_rate">Exchange Rate</Label>
                                    <Input
                                        id="exchange_rate"
                                        type="number"
                                        step="0.000001"
                                        min="0.000001"
                                        value={form.data.exchange_rate}
                                        onChange={(e) => form.setData('exchange_rate', parseFloat(e.target.value) || 0)}
                                    />
                                    <InputError message={form.errors.exchange_rate} />
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
                                    <div className="flex items-center gap-2">
                                        <input
                                            id="is_default"
                                            type="checkbox"
                                            checked={form.data.is_default}
                                            onChange={(e) => form.setData('is_default', e.target.checked)}
                                        />
                                        <Label htmlFor="is_default">Default Store Currency</Label>
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
                                    <th className="px-6 py-3 font-medium">Code</th>
                                    <th className="px-6 py-3 font-medium">Name</th>
                                    <th className="px-6 py-3 font-medium">Symbol</th>
                                    <th className="px-6 py-3 text-right font-medium">Rate</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currencies.data.map((currency) => (
                                    <tr key={currency.id} className="hover:bg-muted/40 border-b">
                                        <td className="px-6 py-3 font-mono font-medium">{currency.code}</td>
                                        <td className="px-6 py-3">
                                            {currency.name}
                                            {currency.is_default && (
                                                <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                    Default
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-3">{currency.symbol}</td>
                                        <td className="px-6 py-3 text-right font-mono">{currency.exchange_rate}</td>
                                        <td className="px-6 py-3">
                                            {currency.is_active ? 'Active' : 'Inactive'}
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEdit(currency)}
                                                disabled={creating || editingId !== null}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                disabled={currency.is_default || creating || editingId !== null}
                                                onClick={() => {
                                                    if (confirm('Delete this currency?')) {
                                                        router.delete(`/admin/settings/currencies/${currency.id}`);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {currencies.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-muted-foreground px-6 py-12 text-center text-sm">
                                            No currencies configured.
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

CurrenciesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Settings', href: '#' },
        { title: 'Currencies', href: '/admin/settings/currencies' },
    ],
};
