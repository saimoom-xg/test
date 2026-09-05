import { Link, router, usePage } from '@inertiajs/react';
import { FiSearch, FiShoppingCart } from 'react-icons/fi';
import { Check, ChevronDown } from 'lucide-react';
import { dashboard, login } from '@/routes';
import { useCurrency } from '@/hooks/use-currency';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type FrontendHeaderProps = {
    title?: string;
    subtitle?: string;
    showSearch?: boolean;
};

export default function FrontendHeader({
    title = 'Ecommerce Store',
    subtitle = "Let's take a look at your activity today",
    showSearch = true,
}: FrontendHeaderProps) {
    const { auth, cart, title: pageTitle, subtitle: pageSubtitle } = usePage<any>().props;
    const { currencies, currentCurrency, switchCurrency } = useCurrency();
    const cartCount = cart?.count ?? cart?.item_count ?? 0;
    const user = auth?.user;
    const headerTitle = title || pageTitle || 'Ecommerce Store';
    const headerSubtitle = subtitle || pageSubtitle;

    return (
        <header className="w-full min-w-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
                <h1 className="text-[22px] font-bold tracking-tight text-[#2a2b30]">{headerTitle}</h1>
                {headerSubtitle && (
                    <p className="text-[#8e8d89] font-medium text-[13px]">{headerSubtitle}</p>
                )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                {showSearch && (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const form = e.currentTarget;
                            const input = form.elements.namedItem('search') as HTMLInputElement;
                            if (input && input.value.trim()) {
                                router.get('/shop', { search: input.value.trim() });
                            }
                        }}
                        className="relative bg-white rounded-[20px] shadow-sm border border-black/5 flex items-center px-5 py-2.5 w-full sm:w-[260px]"
                    >
                        <FiSearch className="text-gray-400 text-[17px] mr-2.5 shrink-0" />
                        <input
                            type="text"
                            name="search"
                            placeholder="Search products..."
                            className="bg-transparent border-none outline-none w-full text-[13.5px] font-medium text-gray-700 placeholder:text-[#a8a7a2]"
                        />
                    </form>
                )}

                {/* Currency Selector (Before Cart Button) */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className="flex items-center gap-1.5 h-[46px] px-3.5 bg-white rounded-full shadow-sm border border-black/5 text-[#2a2b30] hover:bg-gray-50 transition-colors shrink-0 outline-none cursor-pointer group"
                            aria-label="Select Currency"
                            title={`Current Currency: ${currentCurrency.name} (${currentCurrency.symbol})`}
                        >
                            <span className="font-extrabold text-[14px] text-[#2a2b30]">{currentCurrency.symbol}</span>
                            <span className="font-bold text-[12px] text-gray-700 uppercase tracking-tight">{currentCurrency.code}</span>
                            <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 transition-transform" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[190px] rounded-2xl p-1.5 shadow-lg border border-black/5 bg-white z-50">
                        <div className="px-2.5 py-1 text-[10.5px] font-bold text-gray-400 uppercase tracking-wider">
                            Choose Currency
                        </div>
                        {currencies.map((c) => {
                            const isActive = c.code === currentCurrency.code;
                            return (
                                <DropdownMenuItem
                                    key={c.code}
                                    onClick={() => switchCurrency(c.code)}
                                    className={`flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-semibold cursor-pointer ${
                                        isActive ? 'bg-[#f8f6f2] text-[#2a2b30]' : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gray-100 font-extrabold text-[13px] text-[#2a2b30]">
                                            {c.symbol}
                                        </span>
                                        <div className="text-left">
                                            <p className="font-bold text-xs leading-none text-[#2a2b30]">{c.code}</p>
                                            <p className="text-[10px] text-gray-400 font-normal leading-tight mt-0.5 truncate max-w-[90px]">{c.name}</p>
                                        </div>
                                    </div>
                                    {isActive && <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />}
                                </DropdownMenuItem>
                            );
                        })}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Shopping Cart Button */}
                <Link
                    href="/cart"
                    className="relative flex items-center justify-center w-[46px] h-[46px] bg-white rounded-full shadow-sm border border-black/5 text-[#2a2b30] hover:bg-gray-50 transition-colors shrink-0"
                    aria-label={`Cart with ${cartCount} items`}
                >
                    <FiShoppingCart className="text-[18px]" />
                    {cartCount > 0 && (
                        <span className="absolute top-0 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-[18px] min-w-[18px] px-1 flex items-center justify-center shadow-sm border-2 border-white">
                            {cartCount > 99 ? '99+' : cartCount}
                        </span>
                    )}
                </Link>

                {/* Sign In / Dashboard Button */}
                <Link
                    href={user ? dashboard() : login()}
                    className="bg-[#2a2b30] text-white px-7 py-3 rounded-[20px] font-bold text-[13px] hover:bg-black transition-colors shadow-sm capitalize inline-flex items-center justify-center shrink-0"
                >
                    {user ? `${user.role || 'User'} Panel` : 'Sign in'}
                </Link>
            </div>
        </header>
    );
}
