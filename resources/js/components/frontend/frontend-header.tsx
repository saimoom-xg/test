import { Link, router, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Check,
    ChevronDown,
    Equal,
    Loader2,
    Search,
    ShoppingCart,
    X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
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

const toBoolean = (val: any): boolean => {
    return val === true || val === 1 || val === '1' || val === 'true';
};

export default function FrontendHeader({
    title,
    subtitle,
    showSearch = true,
}: FrontendHeaderProps) {
    const pageUrl = usePage().url;
    const { auth, cart, siteSettings, title: pageTitle, subtitle: pageSubtitle } = usePage<any>().props;
    const { currencies, currentCurrency, switchCurrency, formatPrice } = useCurrency();
    const cartCount = cart?.count ?? cart?.item_count ?? 0;
    const user = auth?.user;
    const siteTitle = siteSettings?.site_title || 'StoreHub';
    const siteSlogan = siteSettings?.site_tagline;
    const isMainSiteTitle = !title && !pageTitle;
    const headerTitle = title || pageTitle || siteTitle;
    const headerSubtitle = subtitle || pageSubtitle;
    const logoUrl = siteSettings?.site_logo || siteSettings?.['general.site_logo'];
    const announcementEnabled = toBoolean(
        siteSettings?.header_announcement_enabled ?? siteSettings?.['layout.header_announcement_enabled']
    );
    const announcementText = siteSettings?.header_announcement_text ?? siteSettings?.['layout.header_announcement_text'];
    const announcementLink = siteSettings?.header_announcement_link ?? siteSettings?.['layout.header_announcement_link'];

    // Search state & suggestions
    const [searchQuery, setSearchQuery] = useState(() => {
        if (typeof window !== 'undefined') {
            return new URLSearchParams(window.location.search).get('search') || '';
        }
        return '';
    });
    const [suggestions, setSuggestions] = useState<Array<{
        id: number;
        name: string;
        slug: string;
        price: number;
        sale_price: number | null;
        brand?: string;
        image?: string;
    }>>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const mobileInputRef = useRef<HTMLInputElement>(null);

    // Sync with URL query parameter on navigation
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            setSearchQuery(params.get('search') || '');
        }
        setIsOpen(false);
        setIsMobileSearchOpen(false);
    }, [pageUrl]);

    // Debounced search autocomplete
    useEffect(() => {
        const term = searchQuery.trim();
        if (term.length < 2) {
            setSuggestions([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        const timer = setTimeout(async () => {
            try {
                const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(term)}`);
                if (res.ok) {
                    const data = await res.json();
                    setSuggestions(data.products || []);
                    setIsOpen(true);
                }
            } catch {
                // Ignore fetch errors
            } finally {
                setIsLoading(false);
            }
        }, 220);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Handle click outside & Escape key
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
                setIsMobileSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleSearchSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const term = searchQuery.trim();
        setIsOpen(false);
        setIsMobileSearchOpen(false);
        if (term) {
            router.get('/shop', { search: term });
        } else {
            router.get('/shop');
        }
    };

    const handleClear = () => {
        setSearchQuery('');
        setSuggestions([]);
        setIsOpen(false);
        searchInputRef.current?.focus();
    };

    const handleSelectProduct = (slug: string) => {
        setIsOpen(false);
        setIsMobileSearchOpen(false);
        router.get(`/products/${slug}`);
    };

    const toggleSidebar = () => {
        window.dispatchEvent(new Event('toggle-mobile-menu'));
    };

    return (
        <div className="w-full flex flex-col mb-6">
            {announcementEnabled && announcementText && (
                <div className="w-full bg-[#2a2b30] text-[#facc15] py-2 px-4 rounded-xl text-xs font-semibold text-center mb-4 flex items-center justify-center gap-2 shadow-xs transition-all">
                    {announcementLink ? (
                        <Link href={announcementLink} className="hover:underline flex items-center gap-1.5">
                            <span>{announcementText}</span>
                        </Link>
                    ) : (
                        <span>{announcementText}</span>
                    )}
                </div>
            )}
            <header className="w-full min-w-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center justify-between w-full md:w-auto gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <Link href="/" className="shrink-0 group cursor-pointer md:hidden" title="Home">
                            {logoUrl ? (
                                <img
                                    src={logoUrl}
                                    alt={headerTitle}
                                    className="w-10 h-10 object-contain transition-transform group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-xl bg-[#2a2b30] text-[#facc15] flex items-center justify-center font-black text-base">
                                    {headerTitle.charAt(0)}
                                </div>
                            )}
                        </Link>
                        <div className="min-w-0">
                            <h1 className="text-[18px] sm:text-[20px] font-bold tracking-tight text-[#2a2b30] truncate">
                                {headerTitle}
                            </h1>
                            {isMainSiteTitle && siteSlogan && (
                                <p className="hidden sm:block text-[#8e8d89] font-medium text-[11px] sm:text-[12px] truncate">
                                    {siteSlogan}
                                </p>
                            )}
                            {headerSubtitle && (
                                <p className="text-[#8e8d89] font-medium text-[11px] sm:text-[12px] truncate">{headerSubtitle}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 md:hidden">
                        {showSearch && (
                            <button
                                type="button"
                                onClick={() => {
                                    setIsMobileSearchOpen((prev) => !prev);
                                    setTimeout(() => mobileInputRef.current?.focus(), 100);
                                }}
                                className={`flex h-10 w-10 items-center justify-center rounded-full border border-black/5 shadow-sm transition-colors ${
                                    isMobileSearchOpen || searchQuery
                                        ? 'bg-[#2a2b30] text-[#facc15]'
                                        : 'bg-white text-[#2a2b30] hover:bg-gray-50'
                                }`}
                                aria-label="Search products"
                            >
                                <Search className="h-4 w-4" />
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={toggleSidebar}
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white border border-black/5 text-[#2a2b30] shadow-sm hover:bg-gray-50 transition-colors"
                            aria-label="Toggle menu"
                        >
                            <Equal className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Mobile Expandable Search Bar */}
                {showSearch && isMobileSearchOpen && (
                    <div className="w-full mt-2 md:hidden animate-in fade-in slide-in-from-top-2 duration-150 relative">
                        <form
                            onSubmit={handleSearchSubmit}
                            className="relative bg-white rounded-2xl shadow-sm border border-black/10 flex items-center px-4 py-2.5 w-full"
                        >
                            <Search className="text-gray-400 w-4 h-4 mr-2.5 shrink-0" />
                            <input
                                ref={mobileInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => {
                                    if (searchQuery.trim().length >= 2 && suggestions.length > 0) setIsOpen(true);
                                }}
                                placeholder="Search products..."
                                className="bg-transparent border-none outline-none w-full text-[13.5px] font-medium text-gray-700 placeholder:text-[#a8a7a2]"
                            />
                            {isLoading && (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400 shrink-0 mr-1.5" />
                            )}
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 mr-1.5"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                            <button
                                type="submit"
                                className="bg-[#2a2b30] text-white px-3 py-1 rounded-xl text-xs font-semibold hover:bg-black transition-colors shrink-0"
                            >
                                Search
                            </button>
                        </form>

                        {/* Mobile Live Suggestions Dropdown */}
                        {isOpen && searchQuery.trim().length >= 2 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-black/10 overflow-hidden z-50">
                                {isLoading && suggestions.length === 0 ? (
                                    <div className="p-4 flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
                                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                        <span>Searching catalog...</span>
                                    </div>
                                ) : suggestions.length > 0 ? (
                                    <div className="py-2">
                                        <div className="max-h-[260px] overflow-y-auto divide-y divide-gray-100">
                                            {suggestions.map((p) => (
                                                <button
                                                    key={p.id}
                                                    type="button"
                                                    onClick={() => handleSelectProduct(p.slug)}
                                                    className="w-full px-3.5 py-2 flex items-center gap-3 hover:bg-gray-50 text-left"
                                                >
                                                    {p.image ? (
                                                        <img
                                                            src={p.image}
                                                            alt={p.name}
                                                            className="w-9 h-9 rounded-lg object-cover shrink-0 border border-black/5"
                                                        />
                                                    ) : (
                                                        <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                                            <Search className="w-3.5 h-3.5 text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <p className="text-xs font-semibold text-gray-900 truncate">
                                                            {p.name}
                                                        </p>
                                                        <span className="text-xs font-bold text-gray-800">
                                                            {formatPrice(p.sale_price !== null && p.sale_price < p.price ? p.sale_price : p.price)}
                                                        </span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                        <div className="p-2 border-t border-gray-100 bg-gray-50">
                                            <button
                                                type="button"
                                                onClick={() => handleSearchSubmit()}
                                                className="w-full py-1.5 px-3 rounded-xl bg-gray-200 text-xs font-semibold text-gray-700 flex items-center justify-center gap-1"
                                            >
                                                <span>View all results for &ldquo;{searchQuery}&rdquo;</span>
                                                <ArrowRight className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-3 text-center text-xs text-gray-500">
                                        No products found. Press search to browse catalog.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                <div className="hidden md:flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    {showSearch && (
                        <div ref={searchContainerRef} className="relative w-full sm:w-[270px] lg:w-[320px]">
                            <form
                                onSubmit={handleSearchSubmit}
                                className={`relative bg-white rounded-[22px] shadow-xs border transition-all flex items-center px-4 py-2.5 w-full ${
                                    isOpen ? 'border-[#2a2b30] ring-2 ring-[#2a2b30]/5' : 'border-black/5 hover:border-black/15'
                                }`}
                            >
                                <Search className="text-gray-400 w-4 h-4 mr-2.5 shrink-0" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    name="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => {
                                        if (searchQuery.trim().length >= 2 && suggestions.length > 0) {
                                            setIsOpen(true);
                                        }
                                    }}
                                    placeholder="Search products..."
                                    className="bg-transparent border-none outline-none w-full text-[13.5px] font-medium text-gray-700 placeholder:text-[#a8a7a2]"
                                    autoComplete="off"
                                />
                                {isLoading && (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin text-gray-400 shrink-0 mr-1.5" />
                                )}
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={handleClear}
                                        className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 shrink-0 transition-colors"
                                        title="Clear search"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </form>

                            {/* Live Autocomplete Dropdown */}
                            {isOpen && searchQuery.trim().length >= 2 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-black/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                    {isLoading && suggestions.length === 0 ? (
                                        <div className="p-4 flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
                                            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                            <span>Searching catalog...</span>
                                        </div>
                                    ) : suggestions.length > 0 ? (
                                        <div className="py-2">
                                            <div className="px-3.5 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                                Matching Products ({suggestions.length})
                                            </div>
                                            <div className="max-h-[320px] overflow-y-auto divide-y divide-gray-100">
                                                {suggestions.map((p) => (
                                                    <button
                                                        key={p.id}
                                                        type="button"
                                                        onClick={() => handleSelectProduct(p.slug)}
                                                        className="w-full px-3.5 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left cursor-pointer group"
                                                    >
                                                        {p.image ? (
                                                            <img
                                                                src={p.image}
                                                                alt={p.name}
                                                                className="w-10 h-10 rounded-lg object-cover bg-gray-50 shrink-0 border border-black/5"
                                                            />
                                                        ) : (
                                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                                                <Search className="w-4 h-4 text-gray-400" />
                                                            </div>
                                                        )}
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-xs font-semibold text-gray-900 truncate group-hover:text-black">
                                                                {p.name}
                                                            </p>
                                                            {p.brand && (
                                                                <p className="text-[10.5px] text-gray-400 font-medium truncate">
                                                                    {p.brand}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            {p.sale_price !== null && p.sale_price < p.price ? (
                                                                <div className="flex flex-col items-end">
                                                                    <span className="text-xs font-bold text-red-600">
                                                                        {formatPrice(p.sale_price)}
                                                                    </span>
                                                                    <span className="text-[10px] text-gray-400 line-through">
                                                                        {formatPrice(p.price)}
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-xs font-bold text-gray-800">
                                                                    {formatPrice(p.price)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                            <div className="p-2 border-t border-gray-100 bg-gray-50/50">
                                                <button
                                                    type="button"
                                                    onClick={() => handleSearchSubmit()}
                                                    className="w-full py-1.5 px-3 rounded-xl bg-gray-100 hover:bg-[#2a2b30] hover:text-white transition-all text-xs font-semibold text-gray-700 flex items-center justify-center gap-1.5 cursor-pointer"
                                                >
                                                    <span>View all results for &ldquo;{searchQuery}&rdquo;</span>
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center">
                                            <p className="text-xs font-semibold text-gray-700">No products found</p>
                                            <p className="text-[11px] text-gray-400 mt-0.5">Try searching for other keywords.</p>
                                            <button
                                                type="button"
                                                onClick={() => handleSearchSubmit()}
                                                className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-gray-800 hover:underline"
                                            >
                                                Search in Shop catalog →
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

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

                <Link
                    href="/cart"
                    className="relative flex items-center justify-center w-[46px] h-[46px] bg-white rounded-full shadow-sm border border-black/5 text-[#2a2b30] hover:bg-gray-50 transition-colors shrink-0"
                    aria-label={`Cart with ${cartCount} items`}
                >
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                        <span className="absolute top-0 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-[18px] min-w-[18px] px-1 flex items-center justify-center shadow-sm border-2 border-white">
                            {cartCount > 99 ? '99+' : cartCount}
                        </span>
                    )}
                </Link>

                <Link
                    href={user ? '/dashboard' : '/login'}
                    className="bg-[#2a2b30] text-white px-7 py-3 rounded-[20px] font-bold text-[13px] hover:bg-black transition-colors shadow-sm capitalize inline-flex items-center justify-center shrink-0"
                >
                    {user ? `${user.role || 'User'} Panel` : 'Sign in'}
                </Link>
            </div>

            <div className="md:hidden w-full">
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
                        className="relative bg-white rounded-[20px] shadow-sm border border-black/5 flex items-center px-5 py-3 w-full"
                    >
                        <Search className="text-gray-400 w-4 h-4 mr-3 shrink-0" />
                        <input
                            type="text"
                            name="search"
                            placeholder="Search products..."
                            className="bg-transparent border-none outline-none w-full text-[13.5px] font-medium text-gray-700 placeholder:text-[#a8a7a2]"
                        />
                    </form>
                )}
            </div>
        </header>
        </div>
    );
}
