import { useCurrency } from '@/hooks/use-currency';

type TopPickCardProps = {
    id: number;
    name: string;
    price: number;
    image?: string;
};

const bgColors = [
    { bg: 'bg-gray-100', gradient: 'from-gray-200 to-gray-100' },
    { bg: 'bg-orange-50', gradient: 'from-orange-100 to-orange-50' },
    { bg: 'bg-blue-50', gradient: 'from-blue-100 to-blue-50' },
    { bg: 'bg-green-50', gradient: 'from-green-100 to-green-50' },
];

export default function TopPickCard({ id, name, price, image }: TopPickCardProps) {
    const { formatPrice } = useCurrency();
    const { bg, gradient } = bgColors[id % bgColors.length];

    return (
        <div className="bg-white/60 backdrop-blur-sm rounded-[2rem] p-5 shadow-sm border border-white hover:shadow-md transition-shadow cursor-pointer group">
            <div className={`${bg} rounded-2xl h-48 mb-4 flex items-center justify-center relative overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                {image ? (
                    <img src={image} alt={name} className="w-3/4 mix-blend-multiply drop-shadow-xl relative z-10 group-hover:scale-110 transition-transform" />
                ) : (
                    <div className="w-3/4 aspect-square bg-gray-200 rounded-full relative z-10 group-hover:scale-110 transition-transform" />
                )}
            </div>
            <div className="text-center">
                <h4 className="font-bold text-black mb-1">{name}</h4>
                <p className="text-sm font-bold text-brand-gray">{formatPrice(price)}</p>
            </div>
        </div>
    );
}
