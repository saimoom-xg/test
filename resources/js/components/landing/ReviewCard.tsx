import { Star } from 'lucide-react';

type ReviewCardProps = {
    name: string;
    text: string;
    rating?: number;
};

export default function ReviewCard({ name, text, rating = 5 }: ReviewCardProps) {
    return (
        <div className="bg-white/70 backdrop-blur-md rounded-[2rem] p-8 border border-white shadow-sm hover:-translate-y-1 transition-transform">
            <div className="flex text-yellow-400 text-sm mb-4">
                {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} />
                ))}
            </div>
            <p className="text-black font-medium leading-relaxed mb-6">"{text}"</p>
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-gray-300" />
                </div>
                <div>
                    <h5 className="font-bold text-black text-sm">{name}</h5>
                    <p className="text-xs text-gray-500 font-bold">Verified Buyer</p>
                </div>
            </div>
        </div>
    );
}
