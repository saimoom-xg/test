import { Head, Link, router } from '@inertiajs/react';
import {
    Check,
    ChevronDown,
    Filter,
    Heart,
    Loader2,
    RotateCcw,
    Search,
    ShoppingBag,
    SlidersHorizontal,
    Tag,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useCurrency } from '@/hooks/use-currency';
import { useWishlist } from '@/hooks/use-wishlist';

type Product = {
    id: number;
    name: string;
    slug: string;
    price: number;
    sale_price: number | null;
    stock_quantity: number;
    stock_status: string;
    is_featured: boolean;
    brand: { id: number; name: string; slug: string } | null;
    categories: Array<{ id: number; name: string; slug: string }>;
    images: Array<{ id: number; path: string; is_primary: boolean }>;
};

type Category = {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    products_count: number;
};

type Brand = {
    id: number;
    name: string;
    slug: string;
    logo: string | null;
    products_count: number;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedProducts = {
    data: Product[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
    from: number | null;
    to: number | null;
    per_page: number;
};

type Filters = {
    search: string;
    category: string;
    brand: string;
    min_price: string | number;
    max_price: string | number;
    in_stock: boolean;
    sort: string;
};

type Props = {
    products: PaginatedProducts;
    categories: Category[];
    brands: Brand[];
    priceRange: { min: number; max: number };
    filters: Filters;
};

export default function Shop({
    products,
    categories,
    brands,
    priceRange,
    filters,
}: Props) {
    const { currentCurrency, formatPrice } = useCurrency();
    const { isWishlisted, toggleWishlist } = useWishlist();
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [minPrice, setMinPrice] = useState(filters.min_price || '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price || '');
    const [addingId, setAddingId] = useState<number | null>(null);
    const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

    const applyFilter = (newFilters: Partial<Filters>) => {
        const query: Record<string, any> = {
            ...filters,
            ...newFilters,
            page: 1,
        };

        // Clean out empty and default values
        Object.keys(query).forEach((key) => {
            if (
                query[key] === '' ||
                query[key] === null ||
                query[key] === undefined ||
                query[key] === false
            ) {
                delete query[key];
            }
        });

        router.get('/shop', query, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setMobileDrawerOpen(false),
        });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilter({ search: searchQuery.trim() });
    };

    const handlePriceApply = (e: React.FormEvent) => {
        e.preventDefault();
        applyFilter({ min_price: minPrice, max_price: maxPrice });
    };

    const handlePricePreset = (min: number | '', max: number | '') => {
        setMinPrice(min);
        setMaxPrice(max);
        applyFilter({ min_price: min, max_price: max });
    };

    const clearAllFilters = () => {
        setSearchQuery('');
        setMinPrice('');
        setMaxPrice('');
        router.get('/shop', {}, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setMobileDrawerOpen(false),
        });
    };

    const removeFilterKey = (key: keyof Filters) => {
        if (key === 'search') setSearchQuery('');
        if (key === 'min_price' || key === 'max_price') {
            setMinPrice('');
            setMaxPrice('');
            applyFilter({ min_price: '', max_price: '' });
            return;
        }
        applyFilter({ [key]: '' });
    };

    const addToCart = (product: Product) => {
        if (addingId !== null) return;
        setAddingId(product.id);

        router.post(
            '/cart/items',
            { product_id: product.id, quantity: 1 },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(`${product.name} added to cart!`);
                },
                onError: () => {
                    toast.error('Failed to add item to cart.');
                },
                onFinish: () => setAddingId(null),
            }
        );
    };

    // Calculate active filter count for badge
    const activeFiltersCount = [
        Boolean(filters.search),
        Boolean(filters.category),
        Boolean(filters.brand),
        Boolean(filters.min_price || filters.max_price),
        Boolean(filters.in_stock),
    ].filter(Boolean).length;

    const defaultPlaceholder =
        'https://media.istockphoto.com/id/908259584/photo/various-chocolate-pralines.jpg?s=612x612&w=0&k=20&c=Nqv-2Foy0yFJ7OrlO-PrLa0bkh_HEFcIeCY2Dg8JL5I=';

    const getProductImage = (product: Product) => {
        if (product.images && product.images.length > 0) {
            const primary =
                product.images.find((img) => img.is_primary) ||
                product.images[0];
            if (primary && primary.path) {
                return primary.path.startsWith('http://') || primary.path.startsWith('https://')
                    ? primary.path
                    : `/storage/${primary.path}`;
            }
        }
        return defaultPlaceholder;
    };

    // Sidebar Content Component (reused on Desktop and Mobile Sheet)
    const FilterPanel = () => (
        <div className="space-y-6">
            {/* Search within catalog */}
            <div className="bg-white rounded-[24px] p-5 shadow-xs border border-black/5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#2a2b30] mb-3">
                    Search Products
                </h3>
                <form onSubmit={handleSearchSubmit} className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search keyword..."
                        className="w-full bg-[#f8f6f2] border border-gray-200/80 rounded-xl px-3.5 py-2.5 pl-9 text-xs font-medium text-[#2a2b30] placeholder:text-gray-400 focus:outline-none focus:border-[#2a2b30]"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearchQuery('');
                                applyFilter({ search: '' });
                            }}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-black"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </form>
            </div>

            {/* Categories Filter */}
            <div className="bg-white rounded-[24px] p-5 shadow-xs border border-black/5">
                <div className="flex items-center justify-between mb-3.5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#2a2b30]">
                        Categories
                    </h3>
                    {filters.category && (
                        <button
                            type="button"
                            onClick={() => applyFilter({ category: '' })}
                            className="text-[11px] font-semibold text-gray-400 hover:text-red-500 transition-colors"
                        >
                            Reset
                        </button>
                    )}
                </div>
                <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                    <button
                        type="button"
                        onClick={() => applyFilter({ category: '' })}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                            !filters.category
                                ? 'bg-[#2a2b30] text-[#facc15] shadow-xs'
                                : 'text-gray-600 hover:bg-[#f8f6f2] hover:text-[#2a2b30]'
                        }`}
                    >
                        <span>All Categories</span>
                    </button>
                    {categories.map((cat) => {
                        const isSelected = filters.category === cat.slug || filters.category === String(cat.id);
                        return (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() =>
                                    applyFilter({
                                        category: isSelected ? '' : cat.slug,
                                    })
                                }
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                                    isSelected
                                        ? 'bg-[#2a2b30] text-[#facc15] shadow-xs'
                                        : 'text-gray-600 hover:bg-[#f8f6f2] hover:text-[#2a2b30]'
                                }`}
                            >
                                <span className="truncate">{cat.name}</span>
                                <span
                                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                                        isSelected
                                            ? 'bg-[#3b3d44] text-[#facc15]'
                                            : 'bg-gray-100 text-gray-500'
                                    }`}
                                >
                                    {cat.products_count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Price Range Filter */}
            <div className="bg-white rounded-[24px] p-5 shadow-xs border border-black/5">
                <div className="flex items-center justify-between mb-3.5">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#2a2b30]">
                        Price Range
                    </h3>
                    {(filters.min_price || filters.max_price) && (
                        <button
                            type="button"
                            onClick={() => {
                                setMinPrice('');
                                setMaxPrice('');
                                applyFilter({ min_price: '', max_price: '' });
                            }}
                            className="text-[11px] font-semibold text-gray-400 hover:text-red-500 transition-colors"
                        >
                            Reset
                        </button>
                    )}
                </div>

                {/* Quick Presets */}
                <div className="grid grid-cols-2 gap-1.5 mb-3.5">
                    <button
                        type="button"
                        onClick={() => handlePricePreset('', 25)}
                        className="text-[11px] font-medium py-1.5 px-2 rounded-lg bg-[#f8f6f2] hover:bg-gray-200 text-gray-700 transition-colors"
                    >
                        Under {currentCurrency.symbol}25
                    </button>
                    <button
                        type="button"
                        onClick={() => handlePricePreset(25, 50)}
                        className="text-[11px] font-medium py-1.5 px-2 rounded-lg bg-[#f8f6f2] hover:bg-gray-200 text-gray-700 transition-colors"
                    >
                        {currentCurrency.symbol}25 - {currentCurrency.symbol}50
                    </button>
                    <button
                        type="button"
                        onClick={() => handlePricePreset(50, 100)}
                        className="text-[11px] font-medium py-1.5 px-2 rounded-lg bg-[#f8f6f2] hover:bg-gray-200 text-gray-700 transition-colors"
                    >
                        {currentCurrency.symbol}50 - {currentCurrency.symbol}100
                    </button>
                    <button
                        type="button"
                        onClick={() => handlePricePreset(100, '')}
                        className="text-[11px] font-medium py-1.5 px-2 rounded-lg bg-[#f8f6f2] hover:bg-gray-200 text-gray-700 transition-colors"
                    >
                        {currentCurrency.symbol}100 & Above
                    </button>
                </div>

                {/* Custom Min / Max Form */}
                <form onSubmit={handlePriceApply} className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <span className="absolute left-2.5 top-2 text-xs font-semibold text-gray-400">
                                {currentCurrency.symbol}
                            </span>
                            <input
                                type="number"
                                min={priceRange.min}
                                max={priceRange.max}
                                placeholder="Min"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="w-full bg-[#f8f6f2] border border-gray-200/80 rounded-xl pl-6 pr-2 py-1.5 text-xs font-medium text-[#2a2b30] focus:outline-none focus:border-[#2a2b30]"
                            />
                        </div>
                        <span className="text-gray-400 text-xs font-bold">-</span>
                        <div className="relative flex-1">
                            <span className="absolute left-2.5 top-2 text-xs font-semibold text-gray-400">
                                {currentCurrency.symbol}
                            </span>
                            <input
                                type="number"
                                min={priceRange.min}
                                max={priceRange.max}
                                placeholder="Max"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="w-full bg-[#f8f6f2] border border-gray-200/80 rounded-xl pl-6 pr-2 py-1.5 text-xs font-medium text-[#2a2b30] focus:outline-none focus:border-[#2a2b30]"
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#2a2b30] hover:bg-black text-white text-xs font-bold py-2 rounded-xl transition-colors shadow-xs"
                    >
                        Apply Price
                    </button>
                </form>
            </div>

            {/* Brands Filter */}
            {brands.length > 0 && (
                <div className="bg-white rounded-[24px] p-5 shadow-xs border border-black/5">
                    <div className="flex items-center justify-between mb-3.5">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[#2a2b30]">
                            Brands
                        </h3>
                        {filters.brand && (
                            <button
                                type="button"
                                onClick={() => applyFilter({ brand: '' })}
                                className="text-[11px] font-semibold text-gray-400 hover:text-red-500 transition-colors"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                    <div className="space-y-1.5 max-h-[190px] overflow-y-auto pr-1">
                        {brands.map((b) => {
                            const isSelected = filters.brand === b.slug || filters.brand === String(b.id);
                            return (
                                <button
                                    key={b.id}
                                    type="button"
                                    onClick={() =>
                                        applyFilter({
                                            brand: isSelected ? '' : b.slug,
                                        })
                                    }
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                                        isSelected
                                            ? 'bg-[#2a2b30] text-[#facc15] shadow-xs'
                                            : 'text-gray-600 hover:bg-[#f8f6f2] hover:text-[#2a2b30]'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        <div
                                            className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                                                isSelected
                                                    ? 'bg-[#facc15] border-[#facc15] text-[#2a2b30]'
                                                    : 'border-gray-300 bg-white'
                                            }`}
                                        >
                                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                        </div>
                                        <span className="truncate">{b.name}</span>
                                    </div>
                                    <span
                                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                                            isSelected
                                                ? 'bg-[#3b3d44] text-[#facc15]'
                                                : 'bg-gray-100 text-gray-500'
                                        }`}
                                    >
                                        {b.products_count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Availability Filter */}
            <div className="bg-white rounded-[24px] p-5 shadow-xs border border-black/5">
                <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-xs font-bold text-[#2a2b30]">
                        In Stock Only
                    </span>
                    <input
                        type="checkbox"
                        checked={filters.in_stock}
                        onChange={(e) => applyFilter({ in_stock: e.target.checked })}
                        className="w-4 h-4 text-[#2a2b30] bg-gray-100 border-gray-300 rounded focus:ring-[#2a2b30] cursor-pointer"
                    />
                </label>
            </div>

            {/* Clear All Button */}
            {activeFiltersCount > 0 && (
                <button
                    type="button"
                    onClick={clearAllFilters}
                    className="w-full flex items-center justify-center gap-2 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 text-gray-700 hover:text-red-600 text-xs font-bold py-3 rounded-2xl transition-all shadow-xs"
                >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset All Filters
                </button>
            )}
        </div>
    );

    return (
        <>
            <Head title="Shop - Curated Catalog" />

            <div className="flex-1 flex flex-col pb-16">
                {/* Top Control Bar */}
                <div className="bg-white rounded-[24px] p-4 sm:p-5 shadow-xs border border-black/5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    {/* Left: Breadcrumbs & Results Info */}
                    <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-1">
                            <Link href="/" className="hover:text-[#2a2b30] transition-colors">
                                Home
                            </Link>
                            <span>/</span>
                            <span className="text-[#2a2b30]">Shop Catalog</span>
                        </div>
                        <p className="text-sm font-bold text-[#2a2b30]">
                            {products.total > 0 ? (
                                <>
                                    Showing{' '}
                                    <span className="text-black font-extrabold">
                                        {products.from}–{products.to}
                                    </span>{' '}
                                    of{' '}
                                    <span className="text-black font-extrabold">
                                        {products.total}
                                    </span>{' '}
                                    products
                                </>
                            ) : (
                                'No products found'
                            )}
                        </p>
                    </div>

                    {/* Right: Mobile Filter Trigger & Sort Dropdown */}
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        {/* Mobile Filter Drawer Trigger */}
                        <div className="lg:hidden">
                            <Sheet open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
                                <SheetTrigger asChild>
                                    <button
                                        type="button"
                                        className="flex items-center gap-2 bg-[#f8f6f2] hover:bg-gray-200 border border-gray-200 px-4 py-2.5 rounded-xl text-xs font-bold text-[#2a2b30] transition-colors relative"
                                    >
                                        <Filter className="w-3.5 h-3.5" />
                                        <span>Filters</span>
                                        {activeFiltersCount > 0 && (
                                            <span className="ml-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-extrabold">
                                                {activeFiltersCount}
                                            </span>
                                        )}
                                    </button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-[310px] sm:w-[350px] overflow-y-auto p-6 bg-[#f3eee7]">
                                    <SheetHeader className="mb-4 text-left">
                                        <SheetTitle className="text-lg font-bold text-[#2a2b30] flex items-center gap-2">
                                            <SlidersHorizontal className="w-4 h-4" />
                                            Filter Catalog
                                        </SheetTitle>
                                    </SheetHeader>
                                    <FilterPanel />
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-gray-500 hidden sm:inline">
                                Sort by:
                            </span>
                            <div className="relative">
                                <select
                                    value={filters.sort || 'featured'}
                                    onChange={(e) => applyFilter({ sort: e.target.value })}
                                    aria-label="Sort products"
                                    className="appearance-none bg-[#f8f6f2] hover:bg-gray-200 border border-gray-200/80 rounded-xl px-4 py-2.5 pr-8 text-xs font-bold text-[#2a2b30] focus:outline-none focus:border-[#2a2b30] cursor-pointer transition-colors"
                                >
                                    <option value="featured">Featured First</option>
                                    <option value="newest">Newest Arrivals</option>
                                    <option value="price_asc">Price: Low to High</option>
                                    <option value="price_desc">Price: High to Low</option>
                                    <option value="name_asc">Name: A to Z</option>
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-gray-500 absolute right-3 top-3.5 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Filter Badges Bar */}
                {activeFiltersCount > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        <span className="text-xs font-bold text-gray-400 mr-1 flex items-center gap-1">
                            <Tag className="w-3 h-3" /> Active:
                        </span>

                        {filters.search && (
                            <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1 rounded-full text-xs font-semibold text-[#2a2b30] shadow-2xs">
                                Search: &ldquo;{filters.search}&rdquo;
                                <button
                                    type="button"
                                    onClick={() => removeFilterKey('search')}
                                    className="hover:text-red-500"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}

                        {filters.category && (
                            <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1 rounded-full text-xs font-semibold text-[#2a2b30] shadow-2xs capitalize">
                                Category: {categories.find((c) => c.slug === filters.category || String(c.id) === filters.category)?.name || filters.category}
                                <button
                                    type="button"
                                    onClick={() => removeFilterKey('category')}
                                    className="hover:text-red-500"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}

                        {filters.brand && (
                            <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1 rounded-full text-xs font-semibold text-[#2a2b30] shadow-2xs capitalize">
                                Brand: {brands.find((b) => b.slug === filters.brand || String(b.id) === filters.brand)?.name || filters.brand}
                                <button
                                    type="button"
                                    onClick={() => removeFilterKey('brand')}
                                    className="hover:text-red-500"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}

                        {(filters.min_price || filters.max_price) && (
                            <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1 rounded-full text-xs font-semibold text-[#2a2b30] shadow-2xs">
                                Price: {currentCurrency.symbol}{filters.min_price || 0} – {currentCurrency.symbol}{filters.max_price || '∞'}
                                <button
                                    type="button"
                                    onClick={() => removeFilterKey('min_price')}
                                    className="hover:text-red-500"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}

                        {filters.in_stock && (
                            <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 px-3 py-1 rounded-full text-xs font-semibold text-[#2a2b30] shadow-2xs">
                                In Stock Only
                                <button
                                    type="button"
                                    onClick={() => applyFilter({ in_stock: false })}
                                    className="hover:text-red-500"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}

                        <button
                            type="button"
                            onClick={clearAllFilters}
                            className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline ml-2"
                        >
                            Clear all
                        </button>
                    </div>
                )}

                {/* Main Content Layout: Sidebar + Product Grid */}
                <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
                    {/* Desktop Filter Sidebar */}
                    <aside className="hidden lg:block w-[260px] xl:w-[280px] shrink-0 sticky top-6">
                        <FilterPanel />
                    </aside>

                    {/* Catalog Grid Area */}
                    <div className="flex-1 min-w-0 w-full">
                        {products.data.length > 0 ? (
                            <>
                                {/* Product Cards Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                                    {products.data.map((product) => {
                                        const isAdding = addingId === product.id;
                                        const mainImage = getProductImage(product);
                                        const favorited = isWishlisted(product.id);
                                        const currentPrice = parseFloat(String(product.sale_price || product.price)).toFixed(2);
                                        const originalPrice = product.sale_price ? parseFloat(String(product.price)).toFixed(2) : null;

                                        return (
                                            <div key={product.id} className="relative w-full max-w-[320px] sm:max-w-none mx-auto">
                                                {/* Favorite Button */}
                                                <div className="absolute top-[10px] right-[10px] flex gap-2 z-20">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleWishlist(product)}
                                                        className="shadow-sm w-[36px] h-[36px] rounded-full bg-[#2a2b30] border border-[#35363c] text-gray-400 flex items-center justify-center hover:bg-gray-700 transition-colors group cursor-pointer"
                                                        title={favorited ? 'Remove from Wishlist' : 'Save to Wishlist'}
                                                        aria-label={favorited ? `Remove ${product.name} from Wishlist` : `Save ${product.name} to Wishlist`}
                                                    >
                                                        <Heart
                                                            className={`w-[16px] h-[16px] transition-colors ${
                                                                favorited
                                                                    ? 'fill-red-500 text-red-500'
                                                                    : 'text-gray-400 group-hover:text-red-400'
                                                            }`}
                                                        />
                                                    </button>
                                                </div>

                                                {/* Card Container */}
                                                <div className="relative">
                                                    {/* Tab */}
                                                    <div className="bg-white w-[calc(100%-56px)] h-[56px] rounded-tl-[24px] rounded-tr-[24px] relative z-10 flex items-center px-5">
                                                        <div className="flex items-baseline gap-2 min-w-0">
                                                            <div className="text-[18px] font-bold text-black tracking-tight shrink-0">
                                                                {formatPrice(product.sale_price || product.price)}
                                                            </div>
                                                            {product.sale_price && (
                                                                <span className="text-xs text-gray-400 line-through font-semibold shrink-0">
                                                                    {formatPrice(product.price)}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {/* Concave curve transition using precise vector SVG with subpixel anti-gap overlap */}
                                                        <svg
                                                            className="absolute -bottom-[1px] w-[25px] h-[25px] pointer-events-none text-white fill-current z-10"
                                                            style={{ left: 'calc(100% - 1px)' }}
                                                            viewBox="0 0 25 25"
                                                        >
                                                            <path d="M 1 0 C 1 13.25 11.75 24 25 24 V 25 H 0 V 0 Z" />
                                                        </svg>
                                                    </div>

                                                    {/* Main Card Body */}
                                                    <div className="bg-white w-full rounded-b-[24px] rounded-tr-[24px] px-5 pt-3 pb-5 relative z-0 shadow-xs">
                                                        {/* Product Image */}
                                                        <Link
                                                            href={`/products/${product.slug}`}
                                                            className="block w-full h-[160px] bg-[#f4f4f4] rounded-[16px] mb-4 flex items-center justify-center overflow-hidden relative group cursor-pointer"
                                                        >
                                                            <img
                                                                src={mainImage}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover mix-blend-multiply drop-shadow-md scale-[1.1] transition-transform duration-500 group-hover:scale-[1.2]"
                                                            />
                                                            {/* Badges */}
                                                            {product.sale_price ? (
                                                                <div className="absolute top-3 left-3 bg-red-500/90 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase text-white shadow-xs">
                                                                    Sale
                                                                </div>
                                                            ) : product.is_featured ? (
                                                                <div className="absolute top-3 left-3 bg-[#2a2b30]/90 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase text-[#facc15] shadow-xs">
                                                                    Featured
                                                                </div>
                                                            ) : null}
                                                        </Link>

                                                        {/* Product Info */}
                                                        <div className="flex justify-between items-start mb-2 gap-3">
                                                            <div className="flex-1 min-w-0">
                                                                <Link href={`/products/${product.slug}`}>
                                                                    <h2 className="text-[15px] font-bold text-[#2a2b30] leading-tight truncate hover:underline">
                                                                        {product.name}
                                                                    </h2>
                                                                </Link>
                                                                <p className="text-[12px] font-medium text-gray-400 mt-0.5 truncate">
                                                                    {product.brand?.name || (product.categories[0]?.name ?? 'Curated')}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Add to Cart Button */}
                                                        <button
                                                            type="button"
                                                            onClick={() => addToCart(product)}
                                                            disabled={isAdding}
                                                            className="w-full mt-3 bg-[#2a2b30] text-white h-[42px] rounded-[14px] font-bold text-[13px] flex items-center justify-center gap-2 hover:bg-black hover:shadow-xs transition-all active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                                                        >
                                                            {isAdding ? (
                                                                <>
                                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                                    <span>Adding...</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <ShoppingBag className="w-4 h-4" />
                                                                    <span>Add to Cart</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Pagination Controls */}
                                {products.last_page > 1 && (
                                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-[24px] p-4 px-6 shadow-xs border border-black/5">
                                        <span className="text-xs font-semibold text-gray-500">
                                            Page {products.current_page} of {products.last_page}
                                        </span>
                                        <div className="flex items-center gap-1.5 flex-wrap justify-center">
                                            {products.links.map((link, idx) => {
                                                const isPrevious = link.label.includes('Previous');
                                                const isNext = link.label.includes('Next');

                                                if (!link.url) {
                                                    return (
                                                        <span
                                                            key={idx}
                                                            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-300 pointer-events-none"
                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                        />
                                                    );
                                                }

                                                return (
                                                    <Link
                                                        key={idx}
                                                        href={link.url}
                                                        preserveScroll
                                                        preserveState
                                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                                            link.active
                                                                ? 'bg-[#2a2b30] text-[#facc15] shadow-xs'
                                                                : 'text-gray-600 hover:bg-[#f8f6f2] hover:text-[#2a2b30]'
                                                        } ${isPrevious || isNext ? 'px-3.5' : ''}`}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            /* Empty State when no products match filters */
                            <div className="flex flex-col items-center justify-center rounded-[32px] bg-white p-16 text-center shadow-xs border border-black/5">
                                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#f3eee7] text-gray-400">
                                    <ShoppingBag className="h-10 w-10 text-[#2a2b30]" />
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight text-[#2a2b30]">
                                    No products found
                                </h2>
                                <p className="mt-2 max-w-md text-sm text-gray-500 font-medium">
                                    We couldn&apos;t find any items matching your selected criteria. Try adjusting your search query, price range, or clearing some filters.
                                </p>
                                <button
                                    type="button"
                                    onClick={clearAllFilters}
                                    className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#2a2b30] px-7 py-3 text-xs font-bold text-white shadow-xs hover:bg-black transition-all active:scale-[0.98]"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

Shop.layout = {
    title: 'Shop Catalog',
    subtitle: 'Browse our complete collection of curated goods',
    showSearch: false,
};
