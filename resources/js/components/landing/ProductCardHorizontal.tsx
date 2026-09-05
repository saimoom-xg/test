import { router } from '@inertiajs/react';
import { useState } from 'react';
import { FaStar } from 'react-icons/fa6';
import { toast } from 'sonner';
import { useCurrency } from '@/hooks/use-currency';

type ProductCardHorizontalProps = {
    id: number;
    name: string;
    price: number;
    image?: string;
    rating?: number;
};

export default function ProductCardHorizontal({ id, name, price, image, rating = 5 }: ProductCardHorizontalProps) {
    const { formatPrice } = useCurrency();
    const [isAdding, setIsAdding] = useState(false);

    const addToCart = (e: React.MouseEvent): void => {
        e.stopPropagation();
        if (isAdding) return;
        setIsAdding(true);

        router.post('/cart/items', {
            product_id: id,
            quantity: 1,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success(`${name} added to cart!`);
            },
            onError: () => {
                toast.error('Failed to add item to cart.');
            },
            onFinish: () => setIsAdding(false),
        });
    };

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
                <div className="flex text-brand-yellow text-xs mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar key={i} />
                    ))}
                </div>
                <h4 className="font-bold text-lg text-black mb-1">{name}</h4>
                <p className="text-brand-dark font-bold mb-3">{formatPrice(price)}</p>
                <button
                    onClick={addToCart}
                    disabled={isAdding}
                    className="text-sm font-bold border-b-2 border-black pb-1 hover:text-brand-yellow hover:border-brand-yellow transition-colors disabled:opacity-50"
                >
                    {isAdding ? 'Adding...' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
}
