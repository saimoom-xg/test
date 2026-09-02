import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';

type Tag = {
    id: number;
    name: string;
    slug: string;
    created_at: string;
};

type Paginated<T> = { data: T[] };
type Props = { tags: Paginated<Tag> };

export default function TagsIndex({ tags }: Props) {
    const form = useForm({
        name: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post('/admin/tags', {
            preserveScroll: true,
            onSuccess: () => form.reset(),
        });
    };

    const deleteTag = (id: number) => {
        if (confirm('Are you sure you want to delete this tag?')) {
            router.delete(`/admin/tags/${id}`, { preserveScroll: true });
        }
    };

    return (
        <>
            <Head title="Tags" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Product Tags</h1>
                        <p className="text-muted-foreground text-sm">Manage product tags for grouping and searching.</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <div className="md:col-span-1">
                        <Card>
                            <CardContent className="p-6">
                                <form onSubmit={submit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="name">Tag Name</Label>
                                        <Input
                                            id="name"
                                            value={form.data.name}
                                            onChange={e => form.setData('name', e.target.value)}
                                            placeholder="e.g. Summer Collection"
                                            className="mt-1"
                                        />
                                        <InputError message={form.errors.name} className="mt-2" />
                                    </div>
                                    <Button type="submit" disabled={form.processing} className="w-full">
                                        <Plus className="mr-2 h-4 w-4" /> Add Tag
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="md:col-span-2">
                        <Card>
                            <CardContent className="p-0 overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-muted-foreground border-b text-left text-xs uppercase">
                                            <th className="px-6 py-3 font-medium">Name</th>
                                            <th className="px-6 py-3 font-medium">Slug</th>
                                            <th className="px-6 py-3 font-medium">Date Created</th>
                                            <th className="px-6 py-3 text-right font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tags.data.map((tag) => (
                                            <tr key={tag.id} className="hover:bg-muted/40 border-b">
                                                <td className="px-6 py-3 font-medium">{tag.name}</td>
                                                <td className="px-6 py-3 text-muted-foreground">{tag.slug}</td>
                                                <td className="px-6 py-3 text-muted-foreground">
                                                    {new Date(tag.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-3 text-right">
                                                    <Button variant="ghost" size="icon" onClick={() => deleteTag(tag.id)}>
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                        {tags.data.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="text-muted-foreground px-6 py-12 text-center text-sm">
                                                    No tags created yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

TagsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Products', href: '/admin/products' },
        { title: 'Tags', href: '/admin/tags' },
    ],
};
