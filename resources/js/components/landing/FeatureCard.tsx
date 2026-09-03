import { Truck, ShieldCheck, RotateCcw } from 'lucide-react';

type FeatureCardProps = {
    icon: 'truck' | 'shield' | 'return';
    title: string;
    description: string;
};

const iconMap = {
    truck: Truck,
    shield: ShieldCheck,
    return: RotateCcw,
};

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
    const Icon = iconMap[icon];

    return (
        <div className="bg-white/80 backdrop-blur rounded-[2rem] p-8 text-center border border-white flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 text-2xl text-yellow-500">
                <Icon />
            </div>
            <h4 className="font-bold text-xl text-black mb-3">{title}</h4>
            <p className="text-gray-500 font-medium text-sm leading-relaxed">{description}</p>
        </div>
    );
}
