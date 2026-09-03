import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';
import { ChevronRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

type FooterProps = {
    brandName?: string;
    description?: string;
    quickLinks?: string[];
    customerServiceLinks?: string[];
};

export default function Footer({
    brandName = 'shophub',
    description = 'Your one-stop destination for premium sneakers and athletic wear. Step into comfort and style with our curated collections.',
    quickLinks = ['Home', 'Shop', 'About Us', 'Contact'],
    customerServiceLinks = ['Help Center', 'Returns & Refunds', 'Shipping Info', 'Track Order'],
}: FooterProps) {
    return (
        <footer className="relative z-10 bg-white/40 backdrop-blur-md border-t border-white/60 pt-20 pb-10 mt-10 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
            <div className="max-w-7xl mx-auto px-4 lg:px-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3 cursor-pointer">
                            <div className="grid grid-cols-2 gap-[3px]">
                                <div className="w-1.5 h-1.5 bg-black rounded-full" />
                                <div className="w-1.5 h-1.5 bg-black rounded-full" />
                                <div className="w-1.5 h-1.5 bg-black rounded-full" />
                                <div className="w-1.5 h-1.5 bg-black rounded-full" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-black">{brandName}</span>
                        </div>
                        <p className="text-[15px] font-medium text-gray-500 leading-relaxed pr-4">{description}</p>
                        <div className="flex gap-4">
                            <a href="#" className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-black hover:bg-yellow-400 transition-all shadow-sm hover:shadow-md"><FaFacebookF /></a>
                            <a href="#" className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-black hover:bg-yellow-400 transition-all shadow-sm hover:shadow-md"><FaTwitter /></a>
                            <a href="#" className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-black hover:bg-yellow-400 transition-all shadow-sm hover:shadow-md"><FaInstagram /></a>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-bold text-xl text-black mb-8">Quick Links</h4>
                        <ul className="space-y-4 text-[15px] font-medium text-gray-500">
                            {quickLinks.map((item) => (
                                <li key={item}>
                                    <Link href="#" className="hover:text-black transition-colors flex items-center gap-2">
                                        <ChevronRight className="text-xs" /> {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-xl text-black mb-8">Customer Service</h4>
                        <ul className="space-y-4 text-[15px] font-medium text-gray-500">
                            {customerServiceLinks.map((item) => (
                                <li key={item}>
                                    <Link href="#" className="hover:text-black transition-colors flex items-center gap-2">
                                        <ChevronRight className="text-xs" /> {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-xl text-black mb-8">Newsletter</h4>
                        <p className="text-[15px] font-medium text-gray-500 mb-6">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
                        <div className="relative">
                            <input type="email" placeholder="Enter your email" className="w-full bg-white border border-white/50 rounded-full pl-6 pr-32 py-[14px] text-[15px] outline-none focus:border-yellow-400 shadow-sm font-medium transition-colors" />
                            <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-black text-white px-6 rounded-full text-[15px] font-bold hover:bg-yellow-400 hover:text-black transition-colors shadow-md">Subscribe</button>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-300/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[15px] font-medium text-gray-500">&copy; 2026 {brandName}. All rights reserved.</p>
                    <div className="flex gap-8 text-[15px] font-medium text-gray-500">
                        <Link href="#" className="hover:text-black transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-black transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
