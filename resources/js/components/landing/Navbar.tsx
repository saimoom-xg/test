import { Link, usePage } from '@inertiajs/react';
import { ShoppingBag } from 'lucide-react';

type NavbarProps = {
    cartCount?: number;
    subtotal?: number;
};

export default function Navbar({ cartCount, subtotal }: NavbarProps) {
    const page = usePage<any>();
    const sharedCart = page.props.cart;
    const resolvedCount = cartCount ?? sharedCart?.count ?? 0;
    const resolvedSubtotal = subtotal ?? sharedCart?.subtotal ?? 0;

    return (
        <nav className="flex justify-between items-center mb-10">
            <Link href="/" className="flex items-center gap-3 cursor-pointer">
                <div className="grid grid-cols-2 gap-[3px]">
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                    <div className="w-1.5 h-1.5 bg-black rounded-full" />
                </div>
                <span className="text-2xl font-bold tracking-tight text-black">shophub</span>
            </Link>
            <div className="hidden md:flex items-center gap-10 font-bold text-sm">
                <Link href="/" className="text-brand-yellow bg-black/5 px-4 py-1 rounded-full">Home</Link>
                <Link href="/products" className="text-black hover:text-white transition-colors">Shop</Link>
                <Link href="/blog" className="text-black hover:text-white transition-colors">Blog</Link>
                <Link href="/contact" className="text-black hover:text-white transition-colors">Contact</Link>
            </div>
            <div className="flex items-center gap-6">
                {resolvedSubtotal > 0 && (
                    <span className="font-bold text-lg hidden sm:block">${resolvedSubtotal.toFixed(2)}</span>
                )}
                <Link
                    href="/cart"
                    className="relative w-12 h-12 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white/60 transition-colors border border-white/50"
                    aria-label={`View cart with ${resolvedCount} items`}
                >
                    <ShoppingBag className="text-gray-900 w-5 h-5" />
                    {resolvedCount > 0 && (
                        <span className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 min-w-6 h-6 px-1.5 bg-brand-yellow text-black text-xs font-bold rounded-full flex items-center justify-center shadow-sm border border-brand-yellow">
                            {resolvedCount > 99 ? '99+' : resolvedCount}
                        </span>
                    )}
                </Link>
            </div>
        </nav>
    );
}

