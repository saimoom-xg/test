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

interface CategoryBadgeListProps {
    categories: Category[];
    activeSlug?: string;
}

export default function CategoryBadgeList({ categories, activeSlug }: CategoryBadgeListProps) {
    const [emblaRef, emblaApi] = useEmbla({
        loop: false,
        align: 'start',
        dragFree: true,
        containScroll: 'trimSnaps',
        slidesToScroll: 'auto',
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

        updateArrows();
        emblaApi.on('select', updateArrows);
        emblaApi.on('scroll', updateArrows);
        emblaApi.on('reInit', updateArrows);

        const handleResize = () => {
            emblaApi.reInit();
            updateArrows();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            emblaApi.off('select', updateArrows);
            emblaApi.off('scroll', updateArrows);
            emblaApi.off('reInit', updateArrows);
            window.removeEventListener('resize', handleResize);
        };
    }, [emblaApi, updateArrows]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.reInit();
        updateArrows();
    }, [emblaApi, categories, updateArrows]);

    if (!categories || categories.length === 0) return null;

    const isAllActive = !activeSlug;

    return (
        <div className="relative w-full mb-6 group">
            {/* Left navigation arrow button with seamless gradient backdrop */}
            <div
                className={`absolute left-0 top-0 bottom-0 z-10 flex items-center pr-6 sm:pr-8 bg-gradient-to-r from-[#f3eee7] via-[#f3eee7]/90 to-transparent transition-all duration-200 pointer-events-none ${
                    showLeft ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'
                }`}
            >
                <button
                    type="button"
                    onClick={() => emblaApi?.scrollPrev()}
                    disabled={!showLeft}
                    tabIndex={showLeft ? 0 : -1}
                    aria-label="Scroll categories left"
                    className="pointer-events-auto flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white border border-black/5 text-[#2a2b30] shadow-md hover:bg-black hover:text-white hover:border-black transition-all duration-200 active:scale-95 cursor-pointer disabled:pointer-events-none"
                >
                    <ChevronLeft className="h-4 w-4 shrink-0" />
                </button>
            </div>

            {/* Slider carousel viewport */}
            <div ref={emblaRef} className="w-full overflow-hidden cursor-grab active:cursor-grabbing">
                <div className="flex gap-2 sm:gap-3 items-center py-1">
                    <Link
                        href="/shop"
                        className={`shrink-0 select-none px-4 py-2 sm:px-5 sm:py-2.5 rounded-[20px] text-[13px] sm:text-[13.5px] font-bold transition-colors shadow-sm ${
                            isAllActive
                                ? 'bg-[#2a2b30] text-white hover:bg-black'
                                : 'bg-white text-[#2a2b30] hover:bg-gray-50 border border-gray-100/50'
                        }`}
                    >
                        All
                    </Link>

                    {categories.map((category) => {
                        const isActive = activeSlug === category.slug;
                        return (
                            <Link
                                key={category.id}
                                href={`/shop?category=${category.slug}`}
                                className={`shrink-0 select-none pl-2.5 pr-4 py-2 sm:pl-3 sm:pr-5 sm:py-2 rounded-[20px] text-[13px] sm:text-[13.5px] font-bold transition-colors shadow-sm flex items-center gap-2 sm:gap-2.5 border ${
                                    isActive
                                        ? 'bg-[#2a2b30] text-white border-transparent hover:bg-black'
                                        : 'bg-white text-[#2a2b30] border-gray-100/50 hover:bg-gray-50'
                                }`}
                            >
                                {category.image && (
                                    <img
                                        src={
                                            category.image.startsWith('http://') || category.image.startsWith('https://')
                                                ? category.image
                                                : `/storage/${category.image}`
                                        }
                                        alt={category.name}
                                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-full object-cover shrink-0"
                                        draggable={false}
                                        onLoad={() => {
                                            emblaApi?.reInit();
                                            updateArrows();
                                        }}
                                    />
                                )}
                                <span className="whitespace-nowrap">{category.name}</span>
                                {category.products_count !== undefined && (
                                    <span
                                        className={`text-[10px] sm:text-[11px] px-1.5 sm:px-2 h-[18px] sm:h-[20px] inline-flex items-center justify-center rounded-full font-bold leading-none shrink-0 ${
                                            isActive
                                                ? 'bg-white/20 text-white'
                                                : 'bg-[#f3eee7] text-[#8e8d89]'
                                        }`}
                                    >
                                        {category.products_count}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Right navigation arrow button with seamless gradient backdrop */}
            <div
                className={`absolute right-0 top-0 bottom-0 z-10 flex items-center pl-6 sm:pl-8 bg-gradient-to-l from-[#f3eee7] via-[#f3eee7]/90 to-transparent transition-all duration-200 pointer-events-none ${
                    showRight ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-3'
                }`}
            >
                <button
                    type="button"
                    onClick={() => emblaApi?.scrollNext()}
                    disabled={!showRight}
                    tabIndex={showRight ? 0 : -1}
                    aria-label="Scroll categories right"
                    className="pointer-events-auto flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white border border-black/5 text-[#2a2b30] shadow-md hover:bg-black hover:text-white hover:border-black transition-all duration-200 active:scale-95 cursor-pointer disabled:pointer-events-none"
                >
                    <ChevronRight className="h-4 w-4 shrink-0" />
                </button>
            </div>
        </div>
    );
}
