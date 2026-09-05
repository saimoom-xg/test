type CategoryCardProps = {
    id: number;
    name: string;
    productCount: number;
    image?: string;
};

const bgColors = ['bg-orange-100', 'bg-blue-100', 'bg-green-100', 'bg-gray-200'];

export default function CategoryCard({ id, name, productCount, image }: CategoryCardProps) {
    const bgColor = bgColors[id % bgColors.length];

    return (
        <div className="glass-card rounded-[2rem] p-8 flex flex-col items-center justify-center text-center group cursor-pointer hover:-translate-y-2 transition-transform border border-white">
            <div className={`w-24 h-24 rounded-full ${bgColor} mb-6 flex items-center justify-center group-hover:scale-110 transition-transform overflow-hidden`}>
                {image ? (
                    <img src={image} alt={name} className="w-16 h-16 object-cover mix-blend-multiply -rotate-12" />
                ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-full" />
                )}
            </div>
            <h4 className="font-bold text-lg text-black mb-1">{name}</h4>
            <p className="text-sm font-bold text-brand-gray">{productCount} Products</p>
        </div>
    );
}
