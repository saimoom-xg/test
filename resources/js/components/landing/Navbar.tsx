import { Link } from '@inertiajs/react';
import { ShoppingBag } from 'lucide-react';

type NavbarProps = {
    cartCount?: number;
};

export default function Navbar({ cartCount = 3 }: NavbarProps) {
    return (
        <nav className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-3 cursor-pointer">
                <div className="grid grid-cols-2 gap-[3px]">
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-black">shophub</span>
            </div>
            <div className="hidden md:flex items-center gap-10 font-bold text-sm">
                <Link href="/" className="text-yellow-400 bg-black/5 px-4 py-1 rounded-full">Home</Link>
                <Link href="/products" className="text-black hover:text-white transition-colors">Shop</Link>
                <Link href="/blog" className="text-black hover:text-white transition-colors">Blog</Link>
                <Link href="/contact" className="text-black hover:text-white transition-colors">Contact</Link>
            </div>
            <div className="flex items-center gap-6">
                <span className="font-bold text-lg hidden sm:block">$239:00</span>
                <div className="relative w-12 h-12 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:bg-white/60 transition-colors border border-white/50">
                    <ShoppingBag className="text-gray-900 text-lg" />
                    <span className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 w-6 h-6 bg-yellow-400 text-black text-xs font-bold rounded-full flex items-center justify-center shadow-sm border border-yellow-400">{cartCount}</span>
                </div>
            </div>
        </nav>
    );
}
