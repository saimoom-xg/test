import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Brand = {
    id: number;
    name: string;
    slug: string;
    is_active: boolean;
    products_count: number;
};

type Paginated<T> = { data: T[] };

type Props = { brands: Paginated<Brand> };

export default function BrandsIndex({ brands }: Props) {
    const [creating, setCreating] = useState(false);
    const form = useForm({ name: '', is_active: true });

    const submit = (e: React.FormEvent): void => {
        e.preventDefault();
        form.post('/admin/brands', {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setCreating(false);
            },
        });
    };

    return (
        <>
            <Head title="Brands" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Brands</h1>
                    </div>
                    <Button onClick={() => setCreating(!creating)}>
                        <Plus className="mr-2 h-4 w-4" />
                        New brand
                    </Button>
                </div>

                {creating ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>New brand</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                    />
                                    <InputError message={form.errors.name} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        id="is_active"
                                        type="checkbox"
                                        checked={form.data.is_active}
                                        onChange={(e) => form.setData('is_active', e.target.checked)}
                                    />
                                    <Label htmlFor="is_active">Active</Label>
                                </div>
                                <div className="md:col-span-3 flex justify-end gap-2">
                                    <Button type="button" variant="ghost" onClick={() => setCreating(false)}>
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
                    <CardContent className="p-0">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-muted-foreground border-b text-left text-xs uppercase">
                                    <th className="px-6 py-3 font-medium">Name</th>
                                    <th className="px-6 py-3 font-medium">Slug</th>
                                    <th className="px-6 py-3 text-right font-medium">Products</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {brands.data.map((brand) => (
                                    <tr key={brand.id} className="hover:bg-muted/40 border-b">
                                        <td className="px-6 py-3 font-medium">{brand.name}</td>
                                        <td className="text-muted-foreground px-6 py-3 font-mono text-xs">
                                            {brand.slug}
                                        </td>
                                        <td className="px-6 py-3 text-right">{brand.products_count}</td>
                                        <td className="px-6 py-3">
                                            {brand.is_active ? 'Active' : 'Inactive'}
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    if (confirm('Delete this brand?')) {
                                                        router.delete(`/admin/brands/${brand.id}`);
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {brands.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-muted-foreground px-6 py-12 text-center text-sm">
                                            No brands yet.
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

BrandsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Brands', href: '/admin/brands' },
    ],
};