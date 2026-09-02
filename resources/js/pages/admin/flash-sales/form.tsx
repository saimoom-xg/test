import { Head, router, useForm } from '@inertiajs/react';
import { Plus, Trash2, Save } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Product = {
    id: number;
    name: string;
    price: number;
};

type FlashSaleProduct = {
    product_id: number;
    discount_price: number;
    allocated_quantity: number;
    sold_quantity?: number;
};

type FlashSale = {
    id: number;
    title: string;
    starts_at: string;
    ends_at: string;
    is_active: boolean;
    products: {
        product_id: number;
        discount_price: number;
        allocated_quantity: number;
        sold_quantity: number;
    }[];
};

type Props = {
    sale?: FlashSale;
    products: Product[];
};

export default function FlashSaleForm({ sale, products }: Props) {
    const isEditing = !!sale;

    const form = useForm({
        title: sale?.title || '',
        starts_at: sale?.starts_at ? new Date(sale.starts_at).toISOString().slice(0, 16) : '',
        ends_at: sale?.ends_at ? new Date(sale.ends_at).toISOString().slice(0, 16) : '',
        is_active: sale?.is_active ?? true,
        products: sale?.products.map(p => ({
            product_id: p.product_id,
            discount_price: p.discount_price,
            allocated_quantity: p.allocated_quantity,
        })) || [] as FlashSaleProduct[],
    });

    const addProduct = () => {
        form.setData('products', [
            ...form.data.products,
            { product_id: 0, discount_price: 0, allocated_quantity: 1 }
        ]);
    };

    const removeProduct = (index: number) => {
        const newProducts = [...form.data.products];
        newProducts.splice(index, 1);
        form.setData('products', newProducts);
    };

    const updateProduct = (index: number, field: keyof FlashSaleProduct, value: number) => {
        const newProducts = [...form.data.products];
        newProducts[index] = { ...newProducts[index], [field]: value };
        form.setData('products', newProducts);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isEditing) {
            form.put(`/admin/flash-sales/${sale.id}`);
        } else {
            form.post('/admin/flash-sales');
        }
    };

    return (
        <>
            <Head title={isEditing ? 'Edit Flash Sale' : 'New Flash Sale'} />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-5xl mx-auto w-full">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">{isEditing ? 'Edit Flash Sale' : 'New Flash Sale'}</h1>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sale Details</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="title">Title (e.g. Summer Blowout)</Label>
                                <Input
                                    id="title"
                                    value={form.data.title}
                                    onChange={(e) => form.setData('title', e.target.value)}
                                    required
                                />
                                <InputError message={form.errors.title} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="starts_at">Starts At</Label>
                                <Input
                                    id="starts_at"
                                    type="datetime-local"
                                    value={form.data.starts_at}
                                    onChange={(e) => form.setData('starts_at', e.target.value)}
                                    required
                                />
                                <InputError message={form.errors.starts_at} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="ends_at">Ends At</Label>
                                <Input
                                    id="ends_at"
                                    type="datetime-local"
                                    value={form.data.ends_at}
                                    onChange={(e) => form.setData('ends_at', e.target.value)}
                                    required
                                />
                                <InputError message={form.errors.ends_at} />
                            </div>
                            <div className="flex items-center gap-2 md:col-span-2 mt-2">
                                <input
                                    id="is_active"
                                    type="checkbox"
                                    checked={form.data.is_active}
                                    onChange={(e) => form.setData('is_active', e.target.checked)}
                                />
                                <Label htmlFor="is_active">Active</Label>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <div>
                                <CardTitle>Included Products</CardTitle>
                                <CardDescription>Allocate inventory specifically for this flash sale.</CardDescription>
                            </div>
                            <Button type="button" onClick={addProduct} variant="outline" size="sm">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Product
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <InputError message={form.errors.products} className="mb-4" />
                            
                            <div className="space-y-4">
                                {form.data.products.map((p, index) => (
                                    <div key={index} className="flex flex-col md:flex-row gap-4 items-end bg-muted/20 p-4 rounded-lg border">
                                        <div className="flex-1 w-full space-y-2">
                                            <Label>Product</Label>
                                            <Select
                                                value={p.product_id ? p.product_id.toString() : undefined}
                                                onValueChange={(val) => updateProduct(index, 'product_id', parseInt(val))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select product..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {products.map(prod => (
                                                        <SelectItem key={prod.id} value={prod.id.toString()}>
                                                            {prod.name} (${prod.price})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <InputError message={form.errors[`products.${index}.product_id` as keyof typeof form.errors]} />
                                        </div>
                                        <div className="w-full md:w-32 space-y-2">
                                            <Label>Flash Price ($)</Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={p.discount_price}
                                                onChange={(e) => updateProduct(index, 'discount_price', parseFloat(e.target.value) || 0)}
                                            />
                                            <InputError message={form.errors[`products.${index}.discount_price` as keyof typeof form.errors]} />
                                        </div>
                                        <div className="w-full md:w-32 space-y-2">
                                            <Label>Allocated Qty</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={p.allocated_quantity}
                                                onChange={(e) => updateProduct(index, 'allocated_quantity', parseInt(e.target.value) || 1)}
                                            />
                                            <InputError message={form.errors[`products.${index}.allocated_quantity` as keyof typeof form.errors]} />
                                        </div>
                                        <Button 
                                            type="button" 
                                            variant="ghost" 
                                            size="icon" 
                                            className="text-destructive"
                                            onClick={() => removeProduct(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {form.data.products.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                                        No products added to this flash sale yet.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="ghost" onClick={() => router.get('/admin/flash-sales')}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            <Save className="mr-2 h-4 w-4" />
                            Save Flash Sale
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

FlashSaleForm.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Flash Sales', href: '/admin/flash-sales' },
        { title: 'Form', href: '#' },
    ],
};
