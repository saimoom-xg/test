import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type ShippingMethod = {
    id: number;
    name: string;
    description: string | null;
    price: number;
    is_active: boolean;
};

type Paginated<T> = { data: T[] };

type Props = { shipping: Paginated<ShippingMethod> };

export default function ShippingIndex({ shipping }: Props) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [creating, setCreating] = useState(false);

    const form = useForm({
        name: '',
        description: '',
        price: 0,
        is_active: true,
    });

    const openCreate = () => {
        form.reset();
        setEditingId(null);
        setCreating(true);
    };

    const openEdit = (method: ShippingMethod) => {
        form.setData({
            name: method.name,
            description: method.description || '',
            price: method.price,
            is_active: method.is_active,
        });
        setCreating(false);
        setEditingId(method.id);
    };

    const submit = (e: React.FormEvent): void => {
        e.preventDefault();
        
        if (editingId) {
            form.put(`/admin/settings/shipping/${editingId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    form.reset();
                    setEditingId(null);
                },
            });
        } else {
            form.post('/admin/settings/shipping', {
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
            <Head title="Shipping Methods" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Shipping Methods</h1>
                        <p className="text-muted-foreground text-sm">Configure shipping options available at checkout.</p>
                    </div>
                    <Button onClick={openCreate} disabled={creating || editingId !== null}>
                        <Plus className="mr-2 h-4 w-4" />
                        New method
                    </Button>
                </div>

                {(creating || editingId) ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>{editingId ? 'Edit shipping method' : 'New shipping method'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name (e.g. Standard Shipping)</Label>
                                    <Input
                                        id="name"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                    />
                                    <InputError message={form.errors.name} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="price">Base Price</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={form.data.price}
                                        onChange={(e) => form.setData('price', parseFloat(e.target.value) || 0)}
                                    />
                                    <InputError message={form.errors.price} />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={form.data.description}
                                        onChange={(e) => form.setData('description', e.target.value)}
                                        rows={2}
                                    />
                                    <InputError message={form.errors.description} />
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
                                    <th className="px-6 py-3 font-medium">Description</th>
                                    <th className="px-6 py-3 text-right font-medium">Price</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shipping.data.map((method) => (
                                    <tr key={method.id} className="hover:bg-muted/40 border-b">
                                        <td className="px-6 py-3 font-medium">{method.name}</td>
                                        <td className="px-6 py-3 text-muted-foreground">{method.description}</td>
                                        <td className="px-6 py-3 text-right font-mono">{method.price}</td>
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
                                                    if (confirm('Delete this shipping method?')) {
                                                        router.delete(`/admin/settings/shipping/${method.id}`);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {shipping.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-muted-foreground px-6 py-12 text-center text-sm">
                                            No shipping methods configured.
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

ShippingIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Settings', href: '#' },
        { title: 'Shipping Methods', href: '/admin/settings/shipping' },
    ],
};
