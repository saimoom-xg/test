import { Head, Link, router, useForm } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImagePlus, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';

type Brand = { id: number; name: string };
type Category = { id: number; name: string };
type ProductImage = {
    id: number;
    path: string;
    alt: string | null;
    is_primary: boolean;
    sort_order: number;
};

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
    images: ProductImage[];
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
        images: [] as File[],
    });

    const [selectedImages, setSelectedImages] = useState<number[]>([]);
    const [deletingId, setDeletingId] = useState<number | 'batch' | null>(null);

    const handleDeleteSingle = (imageId: number): void => {
        if (!confirm('Are you sure you want to delete this image?')) {
            return;
        }
        setDeletingId(imageId);
        router.delete(`/admin/product-images/${imageId}`, {
            preserveScroll: true,
            onFinish: () => {
                setDeletingId(null);
                setSelectedImages((prev) => prev.filter((id) => id !== imageId));
            },
        });
    };

    const handleBatchDelete = (): void => {
        if (selectedImages.length === 0) {
            return;
        }
        if (!confirm(`Are you sure you want to delete ${selectedImages.length} selected images?`)) {
            return;
        }
        setDeletingId('batch');
        router.delete('/admin/product-images/batch', {
            data: { ids: selectedImages },
            preserveScroll: true,
            onFinish: () => {
                setDeletingId(null);
                setSelectedImages([]);
            },
        });
    };

    const toggleSelectImage = (imageId: number): void => {
        setSelectedImages((prev) =>
            prev.includes(imageId) ? prev.filter((id) => id !== imageId) : [...prev, imageId],
        );
    };

    const submit = (e: React.FormEvent): void => {
        e.preventDefault();
        const url = isEdit ? `/admin/products/${product.id}` : '/admin/products';
        const data = new FormData();
        
        Object.entries(form.data).forEach(([key, value]) => {
            if (key === 'images') {
                (value as File[]).forEach((file) => data.append('images[]', file));
            } else if (key === 'category_ids') {
                (value as number[]).forEach((id) => data.append('category_ids[]', String(id)));
            } else if (typeof value === 'boolean') {
                data.append(key, value ? '1' : '0');
            } else if (value !== null && value !== undefined && value !== '') {
                data.append(key, String(value));
            }
        });

        if (isEdit) {
            data.append('_method', 'PUT');
        }

        router.post(url, data, {
            preserveScroll: true,
            forceFormData: true,
        });
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
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                <CardTitle>Images</CardTitle>
                                {product.images?.length > 0 && selectedImages.length > 0 && (
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        onClick={handleBatchDelete}
                                        disabled={deletingId !== null}
                                        className="h-7 text-xs px-2.5"
                                    >
                                        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                        Delete Selected ({selectedImages.length})
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="images">Upload new images</Label>
                                    <Input
                                        id="images"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files ?? []);
                                            form.setData('images', files);
                                        }}
                                    />
                                    <InputError message={form.errors.images} />
                                </div>

                                {product.images?.length > 0 && (
                                    <div className="space-y-2.5 pt-2">
                                        <div className="flex items-center justify-between text-xs text-muted-foreground pb-1 border-b">
                                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        selectedImages.length === product.images.length &&
                                                        product.images.length > 0
                                                    }
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedImages(product.images.map((img) => img.id));
                                                        } else {
                                                            setSelectedImages([]);
                                                        }
                                                    }}
                                                    className="h-3.5 w-3.5 rounded border-gray-300 text-primary cursor-pointer"
                                                />
                                                <span>Select all ({product.images.length})</span>
                                            </label>
                                            <span className="text-[11px] text-muted-foreground/70">
                                                Click trash to delete single
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3">
                                            {product.images.map((img) => {
                                                const isSelected = selectedImages.includes(img.id);
                                                const isDeleting =
                                                    deletingId === img.id || (deletingId === 'batch' && isSelected);
                                                const src = img.path.startsWith('http')
                                                    ? img.path
                                                    : `/storage/${img.path}`;

                                                return (
                                                    <div
                                                        key={img.id}
                                                        className={`group relative aspect-square rounded-lg border overflow-hidden bg-muted transition-all ${
                                                            isSelected
                                                                ? 'ring-2 ring-destructive border-destructive'
                                                                : 'hover:border-foreground/30'
                                                        }`}
                                                    >
                                                        <img
                                                            src={src}
                                                            alt={img.alt ?? ''}
                                                            className="h-full w-full object-cover"
                                                        />

                                                        {/* Checkbox for batch selection */}
                                                        <div className="absolute top-1.5 left-1.5 z-10">
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={() => toggleSelectImage(img.id)}
                                                                className="h-4 w-4 rounded border-gray-300 bg-white/90 text-primary shadow-xs cursor-pointer"
                                                                title="Select image for deletion"
                                                            />
                                                        </div>

                                                        {/* Individual Delete Button */}
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteSingle(img.id);
                                                            }}
                                                            disabled={deletingId !== null}
                                                            className="absolute top-1.5 right-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-md bg-red-600 text-white shadow-xs opacity-90 transition-all hover:bg-red-700 hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                                                            title="Delete this image"
                                                            aria-label="Delete image"
                                                        >
                                                            {isDeleting ? (
                                                                <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                                                            ) : (
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            )}
                                                        </button>

                                                        {img.is_primary && (
                                                            <span className="bg-primary text-primary-foreground absolute bottom-1.5 left-1.5 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase shadow-xs">
                                                                Primary
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
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
                        <CardFooter className="flex justify-end">
                            <Button type="submit" disabled={form.processing}>
                                {isEdit ? 'Update product' : 'Create product'}
                            </Button>
                        </CardFooter>
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