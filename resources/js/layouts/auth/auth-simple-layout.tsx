import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="bg-[#f3eee7] flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 font-sans text-[#2a2b30]">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center font-medium hover:opacity-80 transition-opacity"
                        >
                            {/* Logo Area */}
                            <div className="flex flex-col items-center justify-center pt-1 pb-1">
                                {/* <div className="w-6 h-6 flex flex-wrap gap-[2px] items-center justify-center rotate-45 mb-2">
                                <div className="w-2.5 h-2.5 bg-[#2a2b30] rounded-[2px]"></div>
                                <div className="w-2.5 h-2.5 bg-[#2a2b30] rounded-[2px]"></div>
                                <div className="w-2.5 h-2.5 bg-[#2a2b30] rounded-[2px]"></div>
                                <div className="w-2.5 h-2.5 bg-[#2a2b30] rounded-[2px] opacity-0"></div>
                                </div> */}
                                <img src="https://static.vecteezy.com/system/resources/previews/034/994/756/non_2x/illustration-of-threads-logo-free-png.png" alt="" className="w-10 h-10 object-contain" />
                                {/* <span className="font-extrabold text-[11px] tracking-wide text-[#2a2b30]">Store</span> */}
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        {(title || description) && (
                            <div className="space-y-2 text-center hidden">
                                {title && <h1 className="text-xl font-medium">{title}</h1>}
                                {description && (
                                    <p className="text-muted-foreground text-center text-sm">
                                        {description}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
