import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

export default function FrontendFooter() {
    return (
        <footer className="mt-auto pt-16 pb-8 border-t border-gray-200/60 text-[#2a2b30]">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Brand Info */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2.5 cursor-pointer">
                            <div className="grid grid-cols-2 gap-[3px]">
                                <div className="w-1.5 h-1.5 bg-[#2a2b30] rounded-full" />
                                <div className="w-1.5 h-1.5 bg-[#2a2b30] rounded-full" />
                                <div className="w-1.5 h-1.5 bg-[#2a2b30] rounded-full" />
                                <div className="w-1.5 h-1.5 bg-[#2a2b30] rounded-full" />
                            </div>
                            <span className="text-xl font-extrabold tracking-tight text-[#2a2b30]">StoreHub</span>
                        </div>
                        <p className="text-[13.5px] text-gray-500 font-medium leading-relaxed pr-2">
                            Your premier destination for curated fashion, accessories, and lifestyle essentials. Quality products with seamless delivery.
                        </p>
                        <div className="flex gap-2.5 pt-1">
                            <a
                                href="#"
                                className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-700 hover:bg-[#2a2b30] hover:text-[#facc15] hover:border-[#2a2b30] transition-all shadow-xs"
                                aria-label="Facebook"
                            >
                                <FaFacebookF className="text-xs" />
                            </a>
                            <a
                                href="#"
                                className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-700 hover:bg-[#2a2b30] hover:text-[#facc15] hover:border-[#2a2b30] transition-all shadow-xs"
                                aria-label="Twitter"
                            >
                                <FaTwitter className="text-xs" />
                            </a>
                            <a
                                href="#"
                                className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-700 hover:bg-[#2a2b30] hover:text-[#facc15] hover:border-[#2a2b30] transition-all shadow-xs"
                                aria-label="Instagram"
                            >
                                <FaInstagram className="text-xs" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-sm tracking-wide uppercase text-[#2a2b30] mb-4">Quick Links</h4>
                        <ul className="space-y-2.5 text-[13.5px] font-medium text-gray-500">
                            <li>
                                <Link href="/" className="hover:text-black transition-colors flex items-center gap-1.5">
                                    <ChevronRight className="w-3 h-3 text-gray-400" /> Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/shop" className="hover:text-black transition-colors flex items-center gap-1.5">
                                    <ChevronRight className="w-3 h-3 text-gray-400" /> Shop Catalog
                                </Link>
                            </li>
                            <li>
                                <Link href="/cart" className="hover:text-black transition-colors flex items-center gap-1.5">
                                    <ChevronRight className="w-3 h-3 text-gray-400" /> Shopping Cart
                                </Link>
                            </li>
                            <li>
                                <Link href="/dashboard" className="hover:text-black transition-colors flex items-center gap-1.5">
                                    <ChevronRight className="w-3 h-3 text-gray-400" /> Account Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/settings/profile" className="hover:text-black transition-colors flex items-center gap-1.5">
                                    <ChevronRight className="w-3 h-3 text-gray-400" /> Profile & Settings
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Care */}
                    <div>
                        <h4 className="font-bold text-sm tracking-wide uppercase text-[#2a2b30] mb-4">Customer Care</h4>
                        <ul className="space-y-2.5 text-[13.5px] font-medium text-gray-500">
                            <li>
                                <a href="#" className="hover:text-black transition-colors flex items-center gap-1.5">
                                    <ChevronRight className="w-3 h-3 text-gray-400" /> Help Center
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-black transition-colors flex items-center gap-1.5">
                                    <ChevronRight className="w-3 h-3 text-gray-400" /> Returns & Refunds
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-black transition-colors flex items-center gap-1.5">
                                    <ChevronRight className="w-3 h-3 text-gray-400" /> Shipping & Delivery
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-black transition-colors flex items-center gap-1.5">
                                    <ChevronRight className="w-3 h-3 text-gray-400" /> Order Tracking
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold text-sm tracking-wide uppercase text-[#2a2b30] mb-4">Newsletter</h4>
                        <p className="text-[13.5px] text-gray-500 font-medium mb-3">
                            Subscribe to receive insider updates, seasonal promotions, and early access.
                        </p>
                        <div className="relative flex items-center">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="w-full bg-white border border-black/10 rounded-full pl-4 pr-24 py-2 text-[13px] outline-none focus:border-black font-medium shadow-xs"
                            />
                            <button
                                type="button"
                                className="absolute right-1 top-1 bottom-1 bg-[#2a2b30] text-white px-3.5 rounded-full text-xs font-bold hover:bg-black transition-colors"
                            >
                                Join
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-200/60 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-medium text-gray-400">
                    <p>&copy; {new Date().getFullYear()} StoreHub. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-gray-600 transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-gray-600 transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
