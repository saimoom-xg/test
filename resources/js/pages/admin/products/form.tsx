import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Brand = { id: number; name: string };
type Category = { id: number; name: string };
type Product = {
    id: number;
    name: string;
    slug: string;
    sku: string;
    barcode: string | null;
    short_description: string | null;
    description: string | null;
    brand_id: number | null;
    price: number;
    sale_price: number | null;
    cost_price: number | null;
    stock_quantity: number;
    low_stock_threshold: number;
    manage_stock: boolean;
    stock_status: string;
    weight: number | null;
    is_active: boolean;
    is_featured: boolean;
    status: string;
    meta_title: string | null;
    meta_description: string | null;
    categories: { id: number }[];
};

type Props = {
    product: Product;
    brands: Brand[];
    categories: Category[];
};

export default function ProductForm({ product, brands, categories }: Props) {
    const isEdit = Boolean(product.id);

    const form = useForm({
        name: product.name ?? '',
        slug: product.slug ?? '',
        sku: product.sku ?? '',
        barcode: product.barcode ?? '',
        short_description: product.short_description ?? '',
        description: product.description ?? '',
        brand_id: product.brand_id ? String(product.brand_id) : '',
        price: product.price ?? 0,
        sale_price: product.sale_price ?? '',
        cost_price: product.cost_price ?? '',
        stock_quantity: product.stock_quantity ?? 0,
        low_stock_threshold: product.low_stock_threshold ?? 5,
        manage_stock: product.manage_stock ?? true,
        stock_status: product.stock_status ?? 'in_stock',
        weight: product.weight ?? '',
        is_active: product.is_active ?? true,
        is_featured: product.is_featured ?? false,
        status: product.status ?? 'draft',
        meta_title: product.meta_title ?? '',
        meta_description: product.meta_description ?? '',
        category_ids: product.categories?.map((c) => c.id) ?? [],
    });

    const submit = (e: React.FormEvent): void => {
        e.preventDefault();
        const url = isEdit ? `/admin/products/${product.id}` : '/admin/products';
        form[isEdit ? 'put' : 'post'](url, { preserveScroll: true });
    };

    return (
        <>
            <Head title={isEdit ? 'Edit Product' : 'New Product'} />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            {isEdit ? 'Edit product' : 'New product'}
                        </h1>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/admin/products">Back</Link>
                    </Button>
                </div>

                <form onSubmit={submit} className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={form.data.name}
                                        onChange={(e) => form.setData('name', e.target.value)}
                                    />
                                    <InputError message={form.errors.name} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="sku">SKU</Label>
                                        <Input
                                            id="sku"
                                            value={form.data.sku}
                                            onChange={(e) => form.setData('sku', e.target.value)}
                                        />
                                        <InputError message={form.errors.sku} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="barcode">Barcode</Label>
                                        <Input
                                            id="barcode"
                                            value={form.data.barcode}
                                            onChange={(e) => form.setData('barcode', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="short_description">Short description</Label>
                                    <textarea
                                        className="border-input flex min-h-[60px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs"
                                        value={form.data.short_description}
                                        onChange={(e) => form.setData('short_description', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <textarea
                                        className="border-input flex min-h-[160px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs"
                                        value={form.data.description}
                                        onChange={(e) => form.setData('description', e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Pricing & inventory</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            value={form.data.price}
                                            onChange={(e) =>
                                                form.setData('price', Number(e.target.value))
                                            }
                                        />
                                        <InputError message={form.errors.price} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="sale_price">Sale price</Label>
                                        <Input
                                            id="sale_price"
                                            type="number"
                                            step="0.01"
                                            value={form.data.sale_price}
                                            onChange={(e) =>
                                                form.setData('sale_price', e.target.value)
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cost_price">Cost price</Label>
                                        <Input
                                            id="cost_price"
                                            type="number"
                                            step="0.01"
                                            value={form.data.cost_price}
                                            onChange={(e) =>
                                                form.setData('cost_price', e.target.value)
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="stock_quantity">Stock</Label>
                                        <Input
                                            id="stock_quantity"
                                            type="number"
                                            value={form.data.stock_quantity}
                                            onChange={(e) =>
                                                form.setData('stock_quantity', Number(e.target.value))
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="low_stock_threshold">Low stock at</Label>
                                        <Input
                                            id="low_stock_threshold"
                                            type="number"
                                            value={form.data.low_stock_threshold}
                                            onChange={(e) =>
                                                form.setData('low_stock_threshold', Number(e.target.value))
                                            }
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="stock_status">Stock status</Label>
                                        <select
                                            id="stock_status"
                                            className="border-input bg-transparent h-9 w-full rounded-md border px-3 text-sm"
                                            value={form.data.stock_status}
                                            onChange={(e) => form.setData('stock_status', e.target.value)}
                                        >
                                            <option value="in_stock">In stock</option>
                                            <option value="out_of_stock">Out of stock</option>
                                            <option value="on_backorder">On backorder</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        id="manage_stock"
                                        type="checkbox"
                                        checked={form.data.manage_stock}
                                        onChange={(e) => form.setData('manage_stock', e.target.checked)}
                                    />
                                    <Label htmlFor="manage_stock">Track inventory</Label>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>SEO</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="meta_title">Meta title</Label>
                                    <Input
                                        id="meta_title"
                                        value={form.data.meta_title}
                                        onChange={(e) => form.setData('meta_title', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="meta_description">Meta description</Label>
                                    <textarea
                                        className="border-input flex min-h-[80px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs"
                                        value={form.data.meta_description}
                                        onChange={(e) => form.setData('meta_description', e.target.value)}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
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
                                        id="is_featured"
                                        type="checkbox"
                                        checked={form.data.is_featured}
                                        onChange={(e) => form.setData('is_featured', e.target.checked)}
                                    />
                                    <Label htmlFor="is_featured">Featured</Label>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <select
                                        id="status"
                                        className="border-input bg-transparent h-9 w-full rounded-md border px-3 text-sm"
                                        value={form.data.status}
                                        onChange={(e) => form.setData('status', e.target.value)}
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-2">
                                <Button type="submit" disabled={form.processing}>
                                    {isEdit ? 'Update product' : 'Create product'}
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Organization</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="brand_id">Brand</Label>
                                    <select
                                        id="brand_id"
                                        className="border-input bg-transparent h-9 w-full rounded-md border px-3 text-sm"
                                        value={form.data.brand_id}
                                        onChange={(e) => form.setData('brand_id', e.target.value)}
                                    >
                                        <option value="">No brand</option>
                                        {brands.map((b) => (
                                            <option key={b.id} value={b.id}>
                                                {b.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Categories</Label>
                                    <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border p-3">
                                        {categories.map((c) => (
                                            <label key={c.id} className="flex items-center gap-2 text-sm">
                                                <input
                                                    type="checkbox"
                                                    checked={form.data.category_ids.includes(c.id)}
                                                    onChange={(e) => {
                                                        const ids = e.target.checked
                                                            ? [...form.data.category_ids, c.id]
                                                            : form.data.category_ids.filter(
                                                                  (id) => id !== c.id,
                                                              );
                                                        form.setData('category_ids', ids);
                                                    }}
                                                />
                                                {c.name}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
        </>
    );
}

ProductForm.layout = (page: unknown): { breadcrumbs: { title: string; href: string }[] } => {
    void page;
    return {
        breadcrumbs: [
            { title: 'Dashboard', href: '/admin/dashboard' },
            { title: 'Products', href: '/admin/products' },
            { title: 'Form', href: '#' },
        ],
    };
};