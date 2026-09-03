import { ArrowLeft, ArrowRight } from 'lucide-react';

type HorizontalScrollProps = {
    children: React.ReactNode;
    title: string;
    showArrows?: boolean;
};

export default function HorizontalScroll({ children, title, showArrows = true }: HorizontalScrollProps) {
    return (
        <div className="mb-20">
            <div className="flex justify-between items-end mb-10">
                <h3 className="text-2xl font-bold text-black">{title}</h3>
                {showArrows && (
                    <div className="flex gap-3">
                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors shadow-sm">
                            <ArrowLeft />
                        </button>
                        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-yellow-400 transition-colors shadow-sm">
                            <ArrowRight />
                        </button>
                    </div>
                )}
            </div>
            <div className="flex overflow-x-auto gap-8 pb-8" style={{ scrollbarWidth: 'none' }}>
                {children}
            </div>
        </div>
    );
}
