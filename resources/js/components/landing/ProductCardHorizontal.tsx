type ProductCardHorizontalProps = {
    id: number;
    name: string;
    price: number;
    image?: string;
    rating?: number;
};

export default function ProductCardHorizontal({ id, name, price, image, rating = 5 }: ProductCardHorizontalProps) {
    return (
        <div className="bg-white/60 backdrop-blur-md rounded-[2rem] p-6 shadow-sm border border-white flex items-center gap-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                {image ? (
                    <img src={image} alt={name} className="w-24 h-24 object-contain mix-blend-multiply" />
                ) : (
                    <div className="w-24 aspect-square bg-gray-200 rounded-full" />
                )}
            </div>
            <div className="flex-grow">
                <div className="flex text-yellow-400 text-xs mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>★</span>
                    ))}
                </div>
                <h4 className="font-bold text-lg text-black mb-1">{name}</h4>
                <p className="text-gray-700 font-bold mb-3">${price.toFixed(2)}</p>
                <button className="text-sm font-bold border-b-2 border-black pb-1 hover:text-yellow-400 hover:border-yellow-400 transition-colors">Add to Cart</button>
            </div>
        </div>
    );
}
