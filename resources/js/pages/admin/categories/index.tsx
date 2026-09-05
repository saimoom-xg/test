import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Trash2, Edit } from 'lucide-react';
import { useState, useEffect } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Category = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image: string | null;
    is_active: boolean;
    products_count: number;
    parent: { id: number; name: string } | null;
    parent_id: number | null;
};

type Paginated<T> = { data: T[]; links: any[]; meta: any };

type Props = {
    categories: Paginated<Category>;
    filters: { search?: string };
    allCategories: { id: number; name: string }[];
};

export default function CategoriesIndex({ categories, allCategories }: Props) {
    const [creating, setCreating] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);

    const form = useForm({
        name: '',
        parent_id: '',
        description: '',
        is_active: true,
        image: null as File | null,
    });

    useEffect(() => {
        if (editing) {
            form.setData({
                name: editing.name,
                parent_id: editing.parent_id ? String(editing.parent_id) : '',
                description: editing.description || '',
                is_active: editing.is_active,
                image: null,
            });
        } else if (!creating) {
            form.reset();
        }
    }, [editing, creating]);

    const submit = (e: React.FormEvent): void => {
        e.preventDefault();
        
        form.transform((data) => ({
            ...data,
            ...(editing ? { _method: 'put' } : {}),
        }));

        const url = editing ? `/admin/categories/${editing.id}` : '/admin/categories';

        form.post(url, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                form.reset();
                setCreating(false);
                setEditing(null);
            },
        });
    };

    return (
        <>
            <Head title="Categories" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
                        <p className="text-muted-foreground text-sm">Organize your catalog</p>
                    </div>
                    <Button onClick={() => {
                        setEditing(null);
                        setCreating(!creating);
                    }}>
                        <Plus className="mr-2 h-4 w-4" />
                        New category
                    </Button>
                </div>

                {creating || editing ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>{editing ? 'Edit category' : 'New category'}</CardTitle>
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
                                <div className="space-y-2">
                                    <Label htmlFor="parent_id">Parent</Label>
                                    <select
                                        id="parent_id"
                                        className="border-input bg-transparent h-9 w-full rounded-md border px-3 text-sm"
                                        value={form.data.parent_id}
                                        onChange={(e) => form.setData('parent_id', e.target.value)}
                                    >
                                        <option value="">— None —</option>
                                        {allCategories.filter(c => c.id !== editing?.id).map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2 md:col-span-1">
                                    <Label htmlFor="image">Image</Label>
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => form.setData('image', e.target.files?.[0] || null)}
                                    />
                                    <InputError message={form.errors.image} />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="description">Description</Label>
                                    <textarea
                                        id="description"
                                        className="border-input flex min-h-[60px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs"
                                        value={form.data.description}
                                        onChange={(e) => form.setData('description', e.target.value)}
                                    />
                                </div>
                                <div className="md:col-span-3 flex items-center gap-2">
                                    <input
                                        id="is_active"
                                        type="checkbox"
                                        checked={form.data.is_active}
                                        onChange={(e) => form.setData('is_active', e.target.checked)}
                                    />
                                    <Label htmlFor="is_active">Active</Label>
                                </div>
                                <div className="md:col-span-3 flex justify-end gap-2">
                                    <Button type="button" variant="ghost" onClick={() => {
                                        setCreating(false);
                                        setEditing(null);
                                    }}>
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
                                    <th className="px-6 py-3 font-medium w-16">Image</th>
                                    <th className="px-6 py-3 font-medium">Name</th>
                                    <th className="px-6 py-3 font-medium">Parent</th>
                                    <th className="px-6 py-3 text-right font-medium">Products</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.data.map((category) => (
                                    <tr key={category.id} className="hover:bg-muted/40 border-b">
                                        <td className="px-6 py-3">
                                            {category.image ? (
                                                <img src={`/storage/${category.image}`} alt={category.name} className="w-8 h-8 rounded-full object-cover border" />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-gray-200" />
                                            )}
                                        </td>
                                        <td className="px-6 py-3 font-medium">{category.name}</td>
                                        <td className="px-6 py-3">{category.parent?.name ?? '—'}</td>
                                        <td className="px-6 py-3 text-right">{category.products_count}</td>
                                        <td className="px-6 py-3">
                                            <span
                                                className={
                                                    category.is_active
                                                        ? 'inline-flex items-center rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                        : 'inline-flex items-center rounded-md bg-neutral-200 px-2 py-0.5 text-xs font-medium dark:bg-neutral-800'
                                                }
                                            >
                                                {category.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setCreating(false);
                                                    setEditing(category);
                                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                                }}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    if (confirm('Delete this category?')) {
                                                        router.delete(
                                                            `/admin/categories/${category.id}`,
                                                        );
                                                    }
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {categories.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-muted-foreground px-6 py-12 text-center text-sm">
                                            No categories yet.
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

CategoriesIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Categories', href: '/admin/categories' },
    ],
};