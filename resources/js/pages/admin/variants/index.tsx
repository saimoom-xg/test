import { Head, Link, router } from '@inertiajs/react';
import { PackageSearch, Settings2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type ProductVariant = {
    id: number;
    product_id: number;
    sku: string;
    name: string | null;
    price: string | null;
    stock_quantity: number;
    is_active: boolean;
    product: {
        id: number;
        name: string;
        price: string;
    };
};

type Paginated<T> = { data: T[] };
type Props = { variants: Paginated<ProductVariant> };

export default function VariantsIndex({ variants }: Props) {
    return (
        <>
            <Head title="Product Variants" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Product Variants</h1>
                        <p className="text-muted-foreground text-sm">Global overview of all product variations in your store.</p>
                    </div>
                </div>

                <Card>
                    <CardContent className="p-0 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-muted-foreground border-b text-left text-xs uppercase">
                                    <th className="px-6 py-3 font-medium">SKU</th>
                                    <th className="px-6 py-3 font-medium">Variant Name</th>
                                    <th className="px-6 py-3 font-medium">Parent Product</th>
                                    <th className="px-6 py-3 text-right font-medium">Price</th>
                                    <th className="px-6 py-3 text-right font-medium">Stock</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 text-right font-medium">Manage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {variants.data.map((variant) => (
                                    <tr key={variant.id} className="hover:bg-muted/40 border-b">
                                        <td className="px-6 py-3 font-medium font-mono text-xs">{variant.sku}</td>
                                        <td className="px-6 py-3">{variant.name || 'Default Variant'}</td>
                                        <td className="px-6 py-3">
                                            <Link href={`/admin/products/${variant.product_id}`} className="text-primary hover:underline">
                                                {variant.product?.name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-3 text-right font-mono">
                                            ${variant.price || variant.product?.price}
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <Badge variant={variant.stock_quantity > 0 ? "outline" : "destructive"}>
                                                {variant.stock_quantity}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-3">
                                            {variant.is_active ? (
                                                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Active</Badge>
                                            ) : (
                                                <Badge variant="secondary">Inactive</Badge>
                                            )}
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <Button variant="ghost" size="sm" asChild>
                                                <Link href={`/admin/products/${variant.product_id}/edit?tab=variants`}>
                                                    <Settings2 className="mr-2 h-4 w-4" /> Edit
                                                </Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {variants.data.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-muted-foreground px-6 py-12 text-center text-sm">
                                            <PackageSearch className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                                            No variants found in the store.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

VariantsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Products', href: '/admin/products' },
        { title: 'Variants', href: '/admin/variants' },
    ],
};
