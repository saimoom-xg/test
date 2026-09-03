import { Head } from '@inertiajs/react';
import { useState } from 'react';

import Breadcrumb from '@/components/landing/Breadcrumb';
import CategoryCard from '@/components/landing/CategoryCard';
import CollectionCard from '@/components/landing/CollectionCard';
import FeatureCard from '@/components/landing/FeatureCard';
import FlashSaleSection from '@/components/landing/FlashSaleSection';
import Footer from '@/components/landing/Footer';
import HorizontalScroll from '@/components/landing/HorizontalScroll';
import Navbar from '@/components/landing/Navbar';
import NewArrivalsCard from '@/components/landing/NewArrivalsCard';
import PaymentTrust from '@/components/landing/PaymentTrust';
import ProductCard from '@/components/landing/ProductCard';
import ProductCardHorizontal from '@/components/landing/ProductCardHorizontal';
import ReviewCard from '@/components/landing/ReviewCard';
import SectionHeader from '@/components/landing/SectionHeader';
import TopPickCard from '@/components/landing/TopPickCard';

type Product = {
    id: number;
    name: string;
    slug: string;
    price: number;
    sale_price: number | null;
    brand: { name: string } | null;
    categories: { name: string }[];
    images: { path: string }[];
};

type Category = {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    products_count: number;
};

type FlashSale = {
    id: number;
    title: string;
    ends_at: string;
    products: Product[];
};

type HomeProps = {
    featuredProducts: Product[];
    newArrivals: Product[];
    bestSellers: Product[];
    categories: Category[];
    flashSale: FlashSale | null;
    topPicks: Product[];
    collections: Category[];
};

export default function Home({
    featuredProducts,
    newArrivals,
    bestSellers,
    categories,
    flashSale,
    topPicks,
    collections,
}: HomeProps) {
    const [activeTab, setActiveTab] = useState('All');

    const tabs = ['All', 'Lifestyle', 'Running', 'Basketball'];

    return (
        <>
            <Head title="Shophub - Home" />
            <div className="min-h-screen bg-[#fdf3e1] text-gray-800 font-sans overflow-x-hidden">
                {/* Fixed Side Elements */}
                <div className="fixed left-4 lg:left-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-6 z-30">
                    <span className="text-xs font-semibold tracking-widest text-gray-800 uppercase" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Scroll to down</span>
                    <div className="h-24 w-[2px] bg-gray-800" />
                </div>
                <div className="fixed right-4 lg:right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-6 z-30">
                    <span className="text-xs font-semibold tracking-widest text-gray-800 uppercase" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>Follow - Fb. / In. / Tw.</span>
                </div>
                <div className="fixed right-6 bottom-6 z-30 w-12 h-12 bg-[#ffedcc] rounded-full shadow flex items-center justify-center cursor-pointer hover:bg-yellow-400 transition-colors border border-white">
                    <div className="w-3 h-3 bg-black rounded-full" />
                </div>

                {/* Header Yellow Gradient Background */}
                <div className="absolute top-0 left-0 right-0 h-[450px] bg-gradient-to-r from-[#ffc824] to-[#ffaf00] rounded-b-[4rem] z-0 overflow-hidden shadow-inner">
                    <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full border-[1px] border-white/20" />
                    <div className="absolute top-[0%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full border-[1px] border-white/20" />
                    <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full border-[1px] border-white/20 bg-white/5 blur-2xl" />
                </div>

                {/* Main Content Wrapper */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 lg:px-16 pt-8 pb-20">
                    <Navbar />

                    <Breadcrumb items={['Home', 'Product details']} />

                    {/* Main Product Card */}
                    <div className="bg-white/80 backdrop-blur rounded-[2rem] p-6 lg:p-10 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden mb-20 shadow-2xl">
                        <div className="w-full lg:w-[30%] z-10 flex flex-col">
                            <h2 className="text-2xl lg:text-2xl font-bold text-gray-700 leading-tight mb-5">Nike Air Max 270<br />to Chuck Taylors</h2>
                            <p className="text-gray-500 text-sm font-medium leading-relaxed mb-12 max-w-[280px]">Nike's Air Force 1s were among the most popular sneakers this year.</p>
                            <div className="flex gap-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className={`w-16 h-16 rounded-[1rem] shadow-sm flex items-center justify-center cursor-pointer border-2 ${i === 2 ? 'bg-yellow-400 border-yellow-400' : 'bg-white border-transparent hover:border-yellow-400'} transition-colors relative overflow-hidden`}>
                                        <div className="w-12 h-12 bg-gray-200 rounded mix-blend-multiply group-hover:scale-110 transition-transform" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="w-full lg:w-[40%] flex flex-col items-center justify-center relative z-10 min-h-[400px]">
                            <div className="absolute w-[320px] h-[320px] lg:w-[450px] lg:h-[450px] border border-orange-200/60 rounded-full z-0" />
                            <div className="absolute w-[220px] h-[220px] lg:w-[320px] lg:h-[320px] border border-orange-200/80 rounded-full z-0 bg-gradient-to-tr from-white/30 to-transparent" />
                            <div className="relative z-10 w-full max-w-md drop-shadow-2xl scale-100 lg:scale-[1.1] -rotate-[15deg] transform hover:scale-[1.4] transition-transform duration-700">
                                <div className="aspect-square bg-gray-200 rounded-full flex items-center justify-center">
                                    <span className="text-gray-400">Product Image</span>
                                </div>
                            </div>
                            <div className="mt-14 text-[2rem] font-bold text-gray-700 relative z-10 bg-white/70 px-8 py-2 rounded-full backdrop-blur-md shadow-sm">$290.00</div>
                        </div>
                        <div className="w-full lg:w-[30%] z-10 flex flex-col lg:pl-16">
                            <div className="flex items-center gap-3 mb-8">
                                <span className="font-bold text-sm text-black">Review:</span>
                                <div className="text-yellow-400 text-[13px] flex gap-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <span key={i}>★</span>
                                    ))}
                                </div>
                                <span className="text-sm font-medium text-gray-500">4.5 (60)</span>
                            </div>
                            <div className="flex items-center gap-5 mb-8">
                                <span className="font-bold text-sm text-black">Color:</span>
                                <div className="flex gap-3">
                                    {['#3ae0f5', '#ff7b30', '#ffc824', '#bfae9c'].map((color, i) => (
                                        <div key={i} className={`w-8 h-8 rounded-full cursor-pointer shadow-md hover:scale-110 transition-transform ${i === 1 ? 'border-[3px] border-[#fdfaf2] ring-2 ring-[#ff7b30] -ml-1' : ''}`} style={{ backgroundColor: color }} />
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-start gap-6 mb-10">
                                <span className="font-bold text-sm text-black mt-3">Size:</span>
                                <div className="grid grid-cols-3 gap-3 w-full max-w-[210px]">
                                    {[37, 38, 39, 40, 41, 42].map((size) => (
                                        <div key={size} className={`w-full h-11 rounded-[10px] flex items-center justify-center font-bold text-[15px] shadow-sm cursor-pointer hover:bg-white transition-colors ${size === 38 ? 'bg-yellow-400 text-black' : 'bg-white/80 text-gray-500 hover:text-black'}`}>{size}</div>
                                    ))}
                                </div>
                            </div>
                            <button className="bg-black text-white px-10 py-[18px] rounded-[20px] font-bold text-[15px] hover:bg-gray-800 transition-all shadow-xl w-max hover:-translate-y-1">Add to cart</button>
                        </div>
                    </div>

                    {/* CATEGORIES */}
                    <div className="mb-20">
                        <SectionHeader title="Shop by Category" linkHref="/categories" linkText="View All" />
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {categories.map((cat) => (
                                <CategoryCard key={cat.id} id={cat.id} name={cat.name} productCount={cat.products_count} image={cat.image ?? undefined} />
                            ))}
                        </div>
                    </div>

                    {/* FLASH SALE */}
                    {flashSale && (
                        <FlashSaleSection
                            title={flashSale.title}
                            description="Grab the best deals on our top-rated sneakers before they are gone forever."
                            productImage={flashSale.products[0]?.images[0]?.path ?? undefined}
                        />
                    )}

                    {/* FEATURED PRODUCTS */}
                    <div className="mb-20">
                        <SectionHeader title="Featured Products" linkHref="/products" linkText="All Features" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    name={product.name}
                                    price={product.price}
                                    image={product.images[0]?.path}
                                />
                            ))}
                        </div>
                    </div>

                    {/* PROMOTIONAL BANNER */}
                    <div className="mb-20 relative rounded-[2rem] overflow-hidden min-h-[400px] flex items-center bg-gray-700 group shadow-2xl">
                        <div className="absolute inset-0 z-0">
                            <div className="w-full h-full bg-gray-300" />
                            <div className="absolute inset-0 bg-gradient-to-r from-[#1e1b4b] via-[#1e1b4b]/90 to-transparent" />
                        </div>
                        <div className="relative z-10 px-10 lg:px-20 w-full lg:w-2/3">
                            <span className="inline-block text-yellow-400 font-bold uppercase tracking-widest text-sm mb-4">Limited Time Offer</span>
                            <h2 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-6">Elevate Your Game.<br />Exclusive Streetwear Drop.</h2>
                            <p className="text-gray-300 font-medium mb-10 max-w-md">Discover the intersection of performance and culture. The new collection is available for early access.</p>
                            <button className="bg-yellow-400 text-black px-8 py-[16px] rounded-[18px] font-bold text-[15px] hover:bg-white transition-all shadow-lg hover:-translate-y-1">Explore Collection</button>
                        </div>
                    </div>

                    {/* NEW ARRIVALS */}
                    <HorizontalScroll title="New Arrivals">
                        {newArrivals.map((product) => (
                            <NewArrivalsCard key={product.id} id={product.id} name={product.name} price={product.price} image={product.images[0]?.path} />
                        ))}
                    </HorizontalScroll>

                    {/* BEST SELLERS */}
                    <div className="mb-20">
                        <SectionHeader title="Best Sellers" linkHref="/products" linkText="See All" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {bestSellers.map((product) => (
                                <ProductCardHorizontal key={product.id} id={product.id} name={product.name} price={product.price} image={product.images[0]?.path} />
                            ))}
                        </div>
                    </div>

                    {/* SHOP BY COLLECTION */}
                    <div className="mb-20">
                        <SectionHeader title="Shop by Collection" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {collections.map((col) => (
                                <CollectionCard key={col.id} id={col.id} name={col.name} image={col.image ?? undefined} />
                            ))}
                        </div>
                    </div>

                    {/* TOP PICKS FOR YOU */}
                    <div className="mb-20">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                            <h3 className="text-2xl font-bold text-black">Top Picks For You</h3>
                            <div className="flex gap-4 bg-white/50 backdrop-blur p-2 rounded-full border border-white/50 shadow-sm">
                                {tabs.map((tab) => (
                                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-full font-bold text-sm ${activeTab === tab ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-black transition-colors'}`}>{tab}</button>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {topPicks.map((product) => (
                                <TopPickCard key={product.id} id={product.id} name={product.name} price={product.price} image={product.images[0]?.path} />
                            ))}
                        </div>
                        <div className="text-center mt-12">
                            <button className="bg-white border-2 border-black text-black px-8 py-3 rounded-full font-bold text-sm hover:bg-black hover:text-white transition-colors">Load More Products</button>
                        </div>
                    </div>

                    {/* WHY SHOP WITH US */}
                    <div className="mb-20">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FeatureCard icon="truck" title="Free Shipping" description="Enjoy free and fast delivery on all orders above $100. Delivered right to your doorstep safely." />
                            <FeatureCard icon="shield" title="100% Secure Payment" description="Your payment information is processed securely. We use the latest encryption protocols." />
                            <FeatureCard icon="return" title="30 Days Return" description="Not completely satisfied? Return it within 30 days for a full refund or exchange." />
                        </div>
                    </div>

                    {/* CUSTOMER REVIEWS */}
                    <div className="mb-20">
                        <SectionHeader title="Loved by Customers" align="center" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { name: 'Sarah Jenkins', text: 'Absolutely love my new sneakers! The shipping was incredibly fast, and the quality is exactly as described. Will definitely be shopping here again.' },
                                { name: 'Michael Chen', text: 'The best selection of premium footwear I found online. The website is easy to use, and customer service was very helpful when I had a sizing question.' },
                                { name: 'Emily Rodriguez', text: 'The packaging was pristine, and the shoes look amazing. I have been recommending Shophub to all my friends. Great deals on exclusive drops!' },
                            ].map((review) => (
                                <ReviewCard key={review.name} name={review.name} text={review.text} />
                            ))}
                        </div>
                    </div>

                    <PaymentTrust />
                </div>

                <Footer />
            </div>
        </>
    );
}
