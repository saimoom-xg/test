import { Zap } from 'lucide-react';

type FlashSaleProps = {
    title: string;
    description: string;
    discount?: string;
    endDate?: string;
    productImage?: string;
    originalPrice?: number;
    salePrice?: number;
};

export default function FlashSale({
    title = 'Up to 50% Off',
    description = "Grab the best deals on our top-rated sneakers before they're gone forever.",
    discount = '50%',
    endDate = '2026-09-05',
    productImage,
    originalPrice = 290,
    salePrice = 145,
}: FlashSaleProps) {
    const days = '02';
    const hours = '14';
    const mins = '45';
    const secs = '12';

    return (
        <div className="mb-20 bg-white/80 backdrop-blur rounded-[2rem] p-8 lg:p-10 border border-white relative overflow-hidden shadow-xl flex flex-col lg:flex-row items-center gap-12">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }} />
            <div className="w-full lg:w-1/2 relative z-10 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-full font-bold text-sm mb-6 border border-red-200">
                    <Zap className="w-4 h-4" /> Flash Sale
                </div>
                <h3 className="text-3xl lg:text-4xl font-bold text-black leading-tight mb-6">
                    {title}
                </h3>
                <p className="text-gray-500 font-medium mb-10 max-w-sm mx-auto lg:mx-0">{description}</p>
                <div className="flex gap-4 justify-center lg:justify-start">
                    {[days, hours, mins, secs].map((num, i) => (
                        <div key={i} className="w-16 h-16 bg-white rounded-2xl flex flex-col items-center justify-center shadow-sm border border-gray-100">
                            <span className="text-xl font-bold text-black">{num}</span>
                            <span className="text-[10px] font-bold text-gray-500 uppercase">{['Days', 'Hours', 'Mins', 'Secs'][i]}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="w-full lg:w-1/2 relative z-10 flex justify-center">
                <div className="relative">
                    <div className="absolute inset-0 bg-yellow-400 rounded-full blur-3xl opacity-30" />
                    <div className="relative z-10 w-80 drop-shadow-2xl -rotate-[15deg] hover:scale-110 transition-transform duration-500">
                        {productImage ? (
                            <img src={productImage} alt="Flash Sale" className="w-full h-auto object-contain" />
                        ) : (
                            <div className="aspect-square bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-gray-400">Sale Product</span>
                            </div>
                        )}
                    </div>
                    <div className="absolute top-1/2 -right-4 bg-black text-white px-6 py-3 rounded-2xl shadow-xl rotate-12 z-20">
                        <p className="text-xs font-bold text-gray-400 line-through">${originalPrice.toFixed(2)}</p>
                        <p className="text-xl font-bold">${salePrice.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
