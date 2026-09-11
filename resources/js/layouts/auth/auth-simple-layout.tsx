import { Link, usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { siteSettings, name } = usePage<any>().props;
    const siteTitle = siteSettings?.site_title || siteSettings?.['general.site_title'] || name || 'StoreHub';
    const siteLogo = siteSettings?.site_logo || siteSettings?.['general.site_logo'];

    return (
        <div className="bg-[#f3eee7] flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 font-sans text-[#2a2b30]">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium hover:opacity-85 transition-opacity group"
                        >
                            {/* Logo Area */}
                            <div className="flex items-center justify-center">
                                {siteLogo ? (
                                    <img
                                        src={siteLogo}
                                        alt={siteTitle}
                                        className="h-12 w-12 object-contain transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2a2b30] text-white shadow-xs">
                                        <AppLogoIcon className="size-6 fill-current" />
                                    </div>
                                )}
                            </div>
                            <span className="text-xl font-bold tracking-tight text-[#2a2b30]">
                                {siteTitle}
                            </span>
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
