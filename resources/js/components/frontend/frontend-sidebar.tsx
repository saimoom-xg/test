import { Link, router, usePage } from '@inertiajs/react';
import {
    Bell,
    Heart,
    Home,
    Info,
    LogOut,
    MessageSquare,
    ShoppingBag,
    ShoppingCart,
    User,
    X,
} from 'lucide-react';
import { dashboard, login } from '@/routes';
import { useState, useEffect } from 'react';

export default function FrontendSidebar() {
    const { url } = usePage();
    const { auth, cart, wishlist } = usePage<any>().props;
    const user = auth?.user;
    const cartCount = cart?.count ?? cart?.item_count ?? 0;
    const wishlistCount = wishlist?.count ?? (Array.isArray(wishlist?.productIds) ? wishlist.productIds.length : 0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isHome = url === '/' || url === '';
    const isShop = url.startsWith('/shop');
    const isAbout = url.startsWith('/about');
    const isContact = url.startsWith('/contact');
    const isWishlist = url.startsWith('/user/wishlist');
    const isCart = url.startsWith('/cart');
    const isDashboard = (url.startsWith('/dashboard') || url.startsWith('/user') || url.startsWith('/admin')) && !isWishlist;
    const isSettings = url.startsWith('/settings');

    const handleLogout = (): void => {
        router.post('/logout');
    };

    useEffect(() => {
        const handleToggle = () => setMobileMenuOpen((prev) => !prev);
        window.addEventListener('toggle-mobile-menu', handleToggle);
        return () => window.removeEventListener('toggle-mobile-menu', handleToggle);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
    }, [url]);

    const bottomNavItems = [
        { href: '/', icon: Home, label: 'Home', active: isHome, show: true },
        { href: '/shop', icon: ShoppingBag, label: 'Shop', active: isShop, show: true },
        { href: '/cart', icon: ShoppingCart, label: 'Cart', active: isCart, show: true, badge: cartCount },
        { href: '/contact', icon: MessageSquare, label: 'Contact', active: isContact, show: true },
        { href: user ? '/dashboard' : '/login', icon: User, label: user ? 'Account' : 'Sign In', active: isDashboard, show: true },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Desktop Left Floating Sidebar */}
            <aside className={`hidden md:flex w-[64px] flex-col justify-between fixed top-6 bottom-4 left-4 z-50 transition-transform duration-300 ${mobileMenuOpen ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`}>
                {/* Top Section: Logo + Main Nav */}
                <div className="flex flex-col gap-3 min-h-0">
                    {/* Logo Area */}
                    <Link href="/" className="flex flex-col items-center justify-center pt-0.5 pb-0.5 group cursor-pointer shrink-0">
                        <img
                            src="https://static.vecteezy.com/system/resources/previews/034/994/756/non_2x/illustration-of-threads-logo-free-png.png"
                            alt="Logo"
                            className="w-8 h-8 object-contain transition-transform group-hover:scale-105"
                        />
                        <span className="font-extrabold text-[10.5px] tracking-wide text-[#2a2b30] mt-0.5">Store</span>
                    </Link>

                    {/* Main Nav Pill */}
                    <nav className="bg-white rounded-[30px] flex flex-col items-center py-2 px-1.5 gap-1.5 shadow-xs border border-black/5 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" aria-label="Main Navigation">
                        {/* Home */}
                        <Link
                            href="/"
                            prefetch
                            title="Home"
                            className={`w-[42px] h-[42px] rounded-full flex items-center justify-center transition-all ${
                                isHome
                                    ? 'bg-[#2a2b30] text-[#facc15] shadow-xs'
                                    : 'text-[#8e8d89] hover:text-[#2a2b30] hover:bg-gray-50'
                            }`}
                        >
                            <Home className="w-[18px] h-[18px]" />
                        </Link>

                        {/* Products / Catalog */}
                        <Link
                            href="/shop"
                            prefetch
                            title="Shop Catalog"
                            className={`w-[42px] h-[42px] rounded-full flex items-center justify-center transition-all ${
                                isShop
                                    ? 'bg-[#2a2b30] text-[#facc15] shadow-xs'
                                    : 'text-[#8e8d89] hover:text-[#2a2b30] hover:bg-gray-50'
                            }`}
                        >
                            <ShoppingBag className="w-[18px] h-[18px]" />
                        </Link>

                        {/* Wishlist (Shown in left bar only when user is logged in) */}
                        {user && (
                            <Link
                                href="/user/wishlist"
                                title="My Wishlist"
                                className={`w-[42px] h-[42px] rounded-full flex items-center justify-center transition-all relative ${
                                    isWishlist
                                        ? 'bg-[#2a2b30] text-[#facc15] shadow-xs'
                                        : 'text-[#8e8d89] hover:text-[#2a2b30] hover:bg-gray-50'
                                }`}
                            >
                                <div className="relative">
                                    <Heart className="w-[18px] h-[18px]" />
                                    {wishlistCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-red-500 rounded-full" aria-hidden="true" />
                                    )}
                                </div>
                            </Link>
                        )}

                        {/* Notifications */}
                        <button
                            type="button"
                            title="Notifications"
                            onClick={() => {}}
                            className="w-[42px] h-[42px] rounded-full text-[#8e8d89] hover:text-[#2a2b30] hover:bg-gray-50 flex items-center justify-center transition-colors relative"
                        >
                            <Bell className="w-[18px] h-[18px]" />
                            <span className="absolute top-[9px] right-[10px] w-1.5 h-1.5 bg-red-500 rounded-full" />
                        </button>

                        {/* About */}
                        <Link
                            href="/about"
                            prefetch
                            title="About Us"
                            className={`w-[42px] h-[42px] rounded-full flex items-center justify-center transition-all ${
                                isAbout
                                    ? 'bg-[#2a2b30] text-[#facc15] shadow-xs'
                                    : 'text-[#8e8d89] hover:text-[#2a2b30] hover:bg-gray-50'
                            }`}
                        >
                            <Info className="w-[18px] h-[18px]" />
                        </Link>

                        {/* Contact */}
                        <Link
                            href="/contact"
                            prefetch
                            title="Contact"
                            className={`w-[42px] h-[42px] rounded-full flex items-center justify-center transition-all ${
                                isContact
                                    ? 'bg-[#2a2b30] text-[#facc15] shadow-xs'
                                    : 'text-[#8e8d89] hover:text-[#2a2b30] hover:bg-gray-50'
                            }`}
                        >
                            <MessageSquare className="w-[18px] h-[18px]" />
                        </Link>

                    </nav>
                </div>

                {/* Bottom User/Logout Pill - Stuck to Bottom */}
                <div className="bg-white rounded-[30px] flex flex-col items-center py-2 px-1.5 gap-1.5 shadow-xs border border-black/5 shrink-0 mt-auto">
                    {user ? (
                        <>
                            <button
                                type="button"
                                onClick={handleLogout}
                                title="Sign out"
                                className="w-[42px] h-[42px] rounded-full text-[#8e8d89] hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors"
                            >
                                <LogOut className="w-[18px] h-[18px]" />
                            </button>
                            <Link
                                href="/settings/profile"
                                title="My Profile"
                                className="w-[38px] h-[38px] rounded-full overflow-hidden border border-gray-100 shadow-2xs hover:opacity-90 transition-opacity p-[2px] bg-white flex items-center justify-center"
                            >
                                <img
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8Ko1YCURBO1IUZuN6dyMpxrshbMtwhjQr0noR0_0XDg&s=10"
                                    alt={user.name || 'User'}
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </Link>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            title="Sign in"
                            className="w-[42px] h-[42px] rounded-full text-[#8e8d89] hover:text-[#2a2b30] hover:bg-gray-50 flex items-center justify-center transition-colors"
                        >
                            <User className="w-[18px] h-[18px]" />
                        </Link>
                    )}
                </div>
            </aside>

            {/* Mobile Slide-out Sidebar */}
            <div className={`fixed inset-y-0 left-0 w-[280px] bg-white z-[60] transform transition-transform duration-300 md:hidden ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-black/5">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="grid grid-cols-2 gap-[3px]">
                                <div className="w-1.5 h-1.5 bg-black rounded-full" />
                                <div className="w-1.5 h-1.5 bg-black rounded-full" />
                                <div className="w-1.5 h-1.5 bg-black rounded-full" />
                                <div className="w-1.5 h-1.5 bg-black rounded-full" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-black">Store</span>
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                    <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                        {bottomNavItems.filter(item => item.show).map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${
                                    item.active
                                        ? 'bg-[#2a2b30] text-white'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#2a2b30]'
                                }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                        {user && (
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Sign out</span>
                            </button>
                        )}
                    </nav>
                </div>
            </div>

            {/* Mobile Bottom Navigation Bar */}
            <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50 flex justify-center" aria-label="Mobile navigation">
                <div className="flex items-center gap-1 sm:gap-2 bg-[#2a2b30] rounded-full px-2 py-2 sm:px-4 sm:py-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.35)] border border-white/10 w-full max-w-lg">
                    {bottomNavItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative flex flex-col items-center justify-center gap-1 flex-1 min-w-0 py-1 transition-colors ${
                                item.active ? 'text-white' : 'text-gray-400'
                            }`}
                            aria-label={item.label}
                        >
                            <div className="relative">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                                    item.active ? 'bg-[#facc15] text-[#2a2b30]' : 'bg-transparent text-gray-400'
                                }`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                {item.badge !== undefined && item.badge > 0 && (
                                    <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-[#2a2b30]">
                                        {item.badge > 99 ? '99+' : item.badge}
                                    </span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </nav>
        </>
    );
}
