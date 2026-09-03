import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';

type NewArrivalsCardProps = {
    id: number;
    name: string;
    price: number;
    image?: string;
};

export default function NewArrivalsCard({ id, name, price, image }: NewArrivalsCardProps) {
    return (
        <div className="min-w-[280px] bg-white/50 backdrop-blur-sm rounded-[2rem] p-5 shadow-sm border border-white hover:-translate-y-2 transition-transform cursor-pointer">
            <div className="bg-gray-100 rounded-2xl h-48 mb-4 flex items-center justify-center relative overflow-hidden">
                {image ? (
                    <img src={image} alt={name} className="w-3/4 mix-blend-multiply drop-shadow-xl" />
                ) : (
                    <div className="w-3/4 aspect-square bg-gray-200 rounded-full" />
                )}
            </div>
            <div className="flex justify-between items-center">
                <div>
                    <h4 className="font-bold text-black">{name}</h4>
                    <p className="text-sm font-bold text-gray-500">${price.toFixed(2)}</p>
                </div>
                <button className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center">
                    <Plus className="text-xs" />
                </button>
            </div>
        </div>
    );
}
