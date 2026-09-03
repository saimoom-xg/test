import { ChevronRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

type CollectionCardProps = {
    id: number;
    name: string;
    image?: string;
    ctaText?: string;
};

export default function CollectionCard({ id, name, image, ctaText = 'Shop Now' }: CollectionCardProps) {
    return (
        <div className="relative h-[300px] rounded-[2rem] overflow-hidden group cursor-pointer shadow-xl border border-white">
            <div className="absolute inset-0 bg-gray-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-10 left-10 z-10">
                <span className="text-yellow-400 font-bold uppercase tracking-widest text-xs mb-2 block">New Season</span>
                <h4 className="text-2xl font-bold text-white mb-4">{name}</h4>
                <button className="bg-white/20 backdrop-blur text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-white hover:text-black transition-colors border border-white/40">
                    {ctaText}
                </button>
            </div>
        </div>
    );
}
