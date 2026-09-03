type CategoryCardProps = {
    id: number;
    name: string;
    productCount: number;
    image?: string;
};

export default function CategoryCard({ id, name, productCount, image }: CategoryCardProps) {
    return (
        <div className="bg-white/80 backdrop-blur rounded-[2rem] p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:-translate-y-2 transition-transform border border-white">
            <div className="w-24 h-24 rounded-full bg-orange-100 mb-6 flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden">
                {image ? (
                    <img src={image} alt={name} className="w-16 h-16 object-cover mix-blend-multiply -rotate-12" />
                ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-full" />
                )}
            </div>
            <h4 className="font-bold text-lg text-black mb-1">{name}</h4>
            <p className="text-sm font-bold text-gray-500">{productCount} Products</p>
        </div>
    );
}
