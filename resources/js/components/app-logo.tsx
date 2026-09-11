import { usePage } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    const { siteSettings, name } = usePage<any>().props;
    const siteTitle = siteSettings?.site_title || siteSettings?.['general.site_title'] || name || 'StoreHub';
    const siteLogo = siteSettings?.site_logo || siteSettings?.['general.site_logo'];

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md overflow-hidden shrink-0">
                {siteLogo ? (
                    <img
                        src={siteLogo}
                        alt={siteTitle}
                        className="size-8 object-contain"
                    />
                ) : (
                    <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                        <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
                    </div>
                )}
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm group-data-[collapsible=icon]:hidden">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {siteTitle}
                </span>
            </div>
        </>
    );
}

