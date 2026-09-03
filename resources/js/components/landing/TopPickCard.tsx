type TopPickCardProps = {
    id: number;
    name: string;
    price: number;
    image?: string;
};

export default function TopPickCard({ id, name, price, image }: TopPickCardProps) {
    return (
        <div className="bg-white/60 backdrop-blur-sm rounded-[2rem] p-5 shadow-sm border border-white hover:shadow-md transition-shadow cursor-pointer group">
            <div className="bg-gray-100 rounded-2xl h-48 mb-4 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                {image ? (
                    <img src={image} alt={name} className="w-3/4 mix-blend-multiply drop-shadow-xl relative z-10 group-hover:scale-110 transition-transform" />
                ) : (
                    <div className="w-3/4 aspect-square bg-gray-200 rounded-full relative z-10 group-hover:scale-110 transition-transform" />
                )}
            </div>
            <div className="text-center">
                <h4 className="font-bold text-black mb-1">{name}</h4>
                <p className="text-sm font-bold text-gray-500">${price.toFixed(2)}</p>
            </div>
        </div>
    );
}
