import { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';

type ProductCardProps = {
    id: number;
    name: string;
    price: number;
    image?: string;
    badge?: string;
};

export default function ProductCard({ id, name, price, image, badge }: ProductCardProps) {
    const [isFavorite, setIsFavorite] = useState(false);

    return (
        <div className="bg-[#fcfaf5] rounded-[2rem] p-6 shadow-sm border border-white relative overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300">
            {badge && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold px-3 py-1 rounded-full z-20">
                    {badge}
                </div>
            )}
            <div className="flex justify-between items-start relative z-10 mb-8">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsFavorite(!isFavorite);
                    }}
                    className={`w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-colors ${isFavorite ? 'text-red-500' : 'text-black/60'}`}
                >
                    <Heart className="text-sm" fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
                <button className="w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center hover:bg-yellow-400 hover:text-black transition-colors text-black/60">
                    <ShoppingBag className="text-sm" />
                </button>
            </div>
            <div className="relative h-56 mb-8 flex items-center justify-center">
                <div className="absolute w-40 h-40 bg-gradient-to-br from-indigo-400 to-indigo-500 rounded-[2rem] rotate-[15deg] group-hover:rotate-45 transition-transform duration-700 opacity-90" />
                <div className="relative z-10 w-64 drop-shadow-2xl -rotate-[15deg] group-hover:scale-[1.15] group-hover:-rotate-[5deg] transition-all duration-700">
                    {image ? (
                        <img src={image} alt={name} className="w-full h-full object-cover mix-blend-multiply" />
                    ) : (
                        <div className="aspect-square bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-400 text-sm">Image</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="relative z-10 text-center pb-2">
                <h4 className="font-bold text-xl mb-2 text-black">{name}</h4>
                <p className="text-gray-700 font-bold text-lg">${price.toFixed(2)}</p>
            </div>
        </div>
    );
}
