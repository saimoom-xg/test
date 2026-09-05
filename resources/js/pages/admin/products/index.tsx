import { Head, Link, router, usePage } from '@inertiajs/react';
import { Image as ImageIcon, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

type ProductImage = {
    id: number;
    path: string;
    alt: string | null;
    is_primary: boolean;
};

type Product = {
    id: number;
    name: string;
    sku: string;
    price: number;
    stock_quantity: number;
    is_active: boolean;
    is_featured: boolean;
    status: string;
    brand: { id: number; name: string } | null;
    images?: ProductImage[];
};

type Paginated<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
};

type Props = {
    products: Paginated<Product>;
    filters: { search?: string; status?: string; brand_id?: number; category_id?: number };
    brands: { id: number; name: string }[];
    categories: { id: number; name: string }[];
};

function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function getImageUrl(path?: string | null): string | null {
    if (!path) return null;
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    return `/storage/${path}`;
}

export default function ProductsIndex({ products, filters, brands, categories }: Props) {
    const [search, setSearch] = useState(filters.search ?? '');

    const apply = (overrides: Partial<typeof filters> = {}): void => {
        router.get(
            '/admin/products',
            { ...filters, ...overrides, search: overrides.search ?? search },
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title="Products" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
                        <p className="text-muted-foreground text-sm">Manage your catalog</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/products/create">
                            <Plus className="mr-2 h-4 w-4" />
                            New product
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                <Input
                                    placeholder="Search by name or SKU..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && apply()}
                                    className="pl-9"
                                />
                            </div>

                            <select
                                className="border-input bg-transparent h-9 rounded-md border px-3 text-sm"
                                value={filters.status ?? ''}
                                onChange={(e) => apply({ status: e.target.value || undefined })}
                            >
                                <option value="">All statuses</option>
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Archived</option>
                            </select>

                            <select
                                className="border-input bg-transparent h-9 rounded-md border px-3 text-sm"
                                value={filters.brand_id ?? ''}
                                onChange={(e) =>
                                    apply({ brand_id: e.target.value ? Number(e.target.value) : undefined })
                                }
                            >
                                <option value="">All brands</option>
                                {brands.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="border-input bg-transparent h-9 rounded-md border px-3 text-sm"
                                value={filters.category_id ?? ''}
                                onChange={(e) =>
                                    apply({
                                        category_id: e.target.value ? Number(e.target.value) : undefined,
                                    })
                                }
                            >
                                <option value="">All categories</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </CardHeader>

                    <CardContent>
                        {products.data.length === 0 ? (
                            <div className="text-muted-foreground flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-sm">
                                No products found.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-muted-foreground border-b text-left text-xs uppercase">
                                            <th className="py-3 w-14 font-medium">Image</th>
                                            <th className="py-3 font-medium">Name</th>
                                            <th className="py-3 font-medium">SKU</th>
                                            <th className="py-3 font-medium">Brand</th>
                                            <th className="py-3 text-right font-medium">Price</th>
                                            <th className="py-3 text-right font-medium">Stock</th>
                                            <th className="py-3 font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.data.map((product) => {
                                            const primaryImage = product.images?.find((img) => img.is_primary) ?? product.images?.[0];
                                            const imageUrl = getImageUrl(primaryImage?.path);

                                            return (
                                                <tr key={product.id} className="hover:bg-muted/40 border-b">
                                                    <td className="py-2.5">
                                                        <Link
                                                            href={`/admin/products/${product.id}/edit`}
                                                            className="group relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/40 transition-all hover:ring-2 hover:ring-primary/20"
                                                            title={`Edit ${product.name}`}
                                                        >
                                                            {imageUrl ? (
                                                                <img
                                                                    src={imageUrl}
                                                                    alt={primaryImage?.alt || product.name}
                                                                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                                                    loading="lazy"
                                                                />
                                                            ) : (
                                                                <ImageIcon className="h-4 w-4 text-muted-foreground/40" />
                                                            )}
                                                        </Link>
                                                    </td>
                                                    <td className="py-3">
                                                        <Link
                                                            href={`/admin/products/${product.id}/edit`}
                                                            className="font-medium hover:underline"
                                                        >
                                                            {product.name}
                                                        </Link>
                                                        {product.is_featured ? (
                                                            <Badge variant="secondary" className="ml-2">
                                                                Featured
                                                            </Badge>
                                                        ) : null}
                                                    </td>
                                                    <td className="text-muted-foreground py-3 font-mono text-xs">
                                                        {product.sku}
                                                    </td>
                                                    <td className="py-3">{product.brand?.name ?? '—'}</td>
                                                    <td className="py-3 text-right font-medium">
                                                        {formatCurrency(product.price)}
                                                    </td>
                                                    <td className="py-3 text-right">
                                                        <Badge
                                                            variant={
                                                                product.stock_quantity <= 5
                                                                    ? 'destructive'
                                                                    : 'secondary'
                                                            }
                                                        >
                                                            {product.stock_quantity}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3">
                                                        <Badge variant={product.is_active ? 'default' : 'outline'}>
                                                            {product.status}
                                                        </Badge>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {products.last_page > 1 ? (
                            <div className="mt-4 flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Page {products.current_page} of {products.last_page}
                                </span>
                                <div className="flex gap-2">
                                    {products.links.map((link, i) => (
                                        <Button
                                            key={i}
                                            variant={link.active ? 'default' : 'outline'}
                                            size="sm"
                                            disabled={!link.url}
                                            asChild={!!link.url}
                                        >
                                            {link.url ? (
                                                <Link href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
                                            ) : (
                                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                            )}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ProductsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Products', href: '/admin/products' },
    ],
};

void usePage;