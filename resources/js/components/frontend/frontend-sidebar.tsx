import { Link, router, usePage } from '@inertiajs/react';
import { FaArrowRightFromBracket, FaBagShopping, FaBell, FaCartShopping, FaFolder, FaGauge, FaGear, FaHeart, FaHouse, FaRightToBracket } from 'react-icons/fa6';
import { dashboard, login } from '@/routes';

export default function FrontendSidebar() {
    const { url } = usePage();
    const { auth, cart, wishlist } = usePage<any>().props;
    const user = auth?.user;
    const cartCount = cart?.count ?? cart?.item_count ?? 0;
    const wishlistCount = wishlist?.count ?? (Array.isArray(wishlist?.productIds) ? wishlist.productIds.length : 0);

    const isHome = url === '/' || url === '';
    const isShop = url.startsWith('/shop');
    const isWishlist = url.startsWith('/user/wishlist');
    const isCart = url.startsWith('/cart');
    const isDashboard = (url.startsWith('/dashboard') || url.startsWith('/user') || url.startsWith('/admin')) && !isWishlist;
    const isSettings = url.startsWith('/settings');

    const handleLogout = (): void => {
        router.post('/logout');
    };

    return (
        <>
            {/* Desktop Left Floating Sidebar */}
            <aside className="hidden md:flex w-[64px] flex-col justify-between fixed top-6 bottom-4 left-4 z-50">
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
                            title="Home"
                            className={`w-[42px] h-[42px] rounded-full flex items-center justify-center transition-all ${
                                isHome
                                    ? 'bg-[#2a2b30] text-[#facc15] shadow-xs'
                                    : 'text-[#8e8d89] hover:text-[#2a2b30] hover:bg-gray-50'
                            }`}
                        >
                            <FaHouse className="text-[16px]" />
                        </Link>

                        {/* Products / Catalog */}
                        <Link
                            href="/shop"
                            title="Shop Catalog"
                            className={`w-[42px] h-[42px] rounded-full flex items-center justify-center transition-all ${
                                isShop
                                    ? 'bg-[#2a2b30] text-[#facc15] shadow-xs'
                                    : 'text-[#8e8d89] hover:text-[#2a2b30] hover:bg-gray-50'
                            }`}
                        >
                            <FaBagShopping className="text-[16px]" />
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
                                    <FaHeart className="text-[16px]" />
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
                            <FaBell className="text-[16px]" />
                            <span className="absolute top-[9px] right-[10px] w-1.5 h-1.5 bg-red-500 rounded-full" />
                        </button>

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
                                <FaArrowRightFromBracket className="text-[16px]" />
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
                            href={login()}
                            title="Sign in"
                            className="w-[42px] h-[42px] rounded-full text-[#8e8d89] hover:text-[#2a2b30] hover:bg-gray-50 flex items-center justify-center transition-colors"
                        >
                            <FaRightToBracket className="text-[16px]" />
                        </Link>
                    )}
                </div>
            </aside>

            {/* Mobile Bottom Navigation Bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-gray-200/80 px-4 py-2.5 flex justify-around items-center shadow-lg">
                <Link
                    href="/"
                    className={`flex flex-col items-center gap-1 text-xs font-semibold ${
                        isHome ? 'text-[#2a2b30]' : 'text-gray-400'
                    }`}
                >
                    <FaHouse className="text-[18px]" />
                    <span>Home</span>
                </Link>

                <Link
                    href="/shop"
                    className={`flex flex-col items-center gap-1 text-xs font-semibold ${
                        isShop ? 'text-[#2a2b30]' : 'text-gray-400'
                    }`}
                >
                    <FaFolder className="text-[18px]" />
                    <span>Shop</span>
                </Link>

                {user && (
                    <Link
                        href="/user/wishlist"
                        className={`flex flex-col items-center gap-1 text-xs font-semibold relative ${
                            isWishlist ? 'text-[#2a2b30]' : 'text-gray-400'
                        }`}
                    >
                        <div className="relative">
                            <FaHeart className="text-[18px]" />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                            )}
                        </div>
                        <span>Wishlist</span>
                    </Link>
                )}

                <Link
                    href="/cart"
                    className={`flex flex-col items-center gap-1 text-xs font-semibold relative ${
                        isCart ? 'text-[#2a2b30]' : 'text-gray-400'
                    }`}
                >
                    <div className="relative">
                        <FaCartShopping className="text-[18px]" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                        )}
                    </div>
                    <span>Cart</span>
                </Link>

                <Link
                    href={user ? dashboard() : login()}
                    className={`flex flex-col items-center gap-1 text-xs font-semibold ${
                        isDashboard ? 'text-[#2a2b30]' : 'text-gray-400'
                    }`}
                >
                    <FaGauge className="text-[18px]" />
                    <span>Dashboard</span>
                </Link>
            </div>
        </>
    );
}
