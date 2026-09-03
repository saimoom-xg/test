import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

type BreadcrumbProps = {
    items: { label: string; href?: string }[];
};

export default function Breadcrumb({ items }: BreadcrumbProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
            <div className="flex flex-col gap-2">
                <div className="text-sm font-bold text-black/60">
                    {items.map((item, index) => (
                        <span key={index}>
                            {item.href ? (
                                <Link href={item.href} className="hover:text-black transition-colors">
                                    {item.label}
                                </Link>
                            ) : (
                                item.label
                            )}
                            {index < items.length - 1 && <span className="mx-1">/</span>}
                        </span>
                    ))}
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-black mt-2">{items[items.length - 1]?.label}</h1>
            </div>
        </div>
    );
}
