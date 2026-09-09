import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useEmbla from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';

type Category = {
    id: number;
    name: string;
    slug: string;
    products_count?: number;
    image?: string | null;
};

export default function CategoryBadgeList({ categories }: { categories: Category[] }) {
    const [emblaRef, emblaApi] = useEmbla({
        loop: false,
        align: 'start',
        dragFree: true,
        containScroll: 'trimSnaps',
    });

    const [showLeft, setShowLeft] = useState(false);
    const [showRight, setShowRight] = useState(false);

    const updateArrows = useCallback(() => {
        if (!emblaApi) return;
        setShowLeft(emblaApi.canScrollPrev());
        setShowRight(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on('select', updateArrows);
        emblaApi.on('scroll', updateArrows);
        emblaApi.on('reInit', updateArrows);
        updateArrows();
    }, [emblaApi, updateArrows]);

    if (!categories || categories.length === 0) return null;

    return (
        <div className="w-full mb-8">
            <div className="flex items-center gap-2 sm:gap-3">
                <button
                    type="button"
                    onClick={() => emblaApi?.scrollPrev()}
                    className={`shrink-0 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white border border-black/5 text-[#2a2b30] shadow-sm transition-all duration-200 ease-out ${
                        showLeft ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 -translate-x-2 pointer-events-none'
                    }`}
                    aria-label="Scroll categories left"
                >
                    <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>

                <div ref={emblaRef} className="flex-1 overflow-hidden min-w-0">
                    <div className="flex gap-2 sm:gap-3 items-center">
                        <Link
                            href="/shop"
                            className="shrink-0 bg-[#2a2b30] text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-[20px] text-[13px] sm:text-[13.5px] font-bold hover:bg-black transition-colors shadow-sm"
                        >
                            All
                        </Link>
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/shop?category=${category.slug}`}
                                className="shrink-0 bg-white text-[#2a2b30] pl-2.5 pr-4 py-2 sm:pl-3 sm:pr-5 sm:py-2 rounded-[20px] text-[13px] sm:text-[13.5px] font-bold hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2 sm:gap-2.5 border border-gray-100/50"
                            >
                                {category.image && (
                                    <img
                                        src={category.image.startsWith('http://') || category.image.startsWith('https://')
                                            ? category.image
                                            : `/storage/${category.image}`}
                                        alt={category.name}
                                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-cover"
                                    />
                                )}
                                <span>{category.name}</span>
                                {category.products_count !== undefined && (
                                    <span className="bg-[#f3eee7] text-[#8e8d89] text-[10px] sm:text-[11px] px-1.5 sm:px-2 h-[18px] sm:h-[20px] inline-flex items-center justify-center rounded-full font-bold leading-none">
                                        {category.products_count}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => emblaApi?.scrollNext()}
                    className={`shrink-0 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white border border-black/5 text-[#2a2b30] shadow-sm transition-all duration-200 ease-out ${
                        showRight ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 translate-x-2 pointer-events-none'
                    }`}
                    aria-label="Scroll categories right"
                >
                    <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>
            </div>
        </div>
    );
}
