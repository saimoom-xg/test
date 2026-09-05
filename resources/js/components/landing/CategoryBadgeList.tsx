import { Link } from '@inertiajs/react';

type Category = {
    id: number;
    name: string;
    slug: string;
    products_count?: number;
    image?: string | null;
};

export default function CategoryBadgeList({ categories }: { categories: Category[] }) {
    if (!categories || categories.length === 0) return null;

    return (
        <div className="flex flex-wrap items-center gap-3 w-full mb-8">
            <Link 
                href="/shop" 
                className="bg-[#2a2b30] text-white px-5 py-2.5 rounded-[20px] text-[13.5px] font-bold hover:bg-black transition-colors shadow-sm"
            >
                All
            </Link>
            {categories.map((category) => (
                <Link
                    key={category.id}
                    href={`/shop?category=${category.slug}`}
                    className="bg-white text-[#2a2b30] pl-3 pr-5 py-2 rounded-[20px] text-[13.5px] font-bold hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2.5 border border-gray-100/50"
                >
                    {category.image && (
                        <img 
                            src={category.image.startsWith('http://') || category.image.startsWith('https://')
                                ? category.image
                                : `/storage/${category.image}`} 
                            alt={category.name} 
                            className="w-5 h-5 rounded-full object-cover"
                        />
                    )}
                    <span>{category.name}</span>
                    {category.products_count !== undefined && (
                        <span className="bg-[#f3eee7] text-[#8e8d89] text-[11px] px-2 h-[20px] inline-flex items-center justify-center rounded-full font-bold leading-none">
                            {category.products_count}
                        </span>
                    )}
                </Link>
            ))}
        </div>
    );
}
