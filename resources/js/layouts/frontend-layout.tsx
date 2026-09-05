import { ReactNode } from 'react';
import FrontendFooter from '@/components/frontend/frontend-footer';
import FrontendHeader from '@/components/frontend/frontend-header';
import FrontendSidebar from '@/components/frontend/frontend-sidebar';

export type FrontendLayoutProps = {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    showSidebar?: boolean;
    showHeader?: boolean;
    showFooter?: boolean;
    showSearch?: boolean;
    [key: string]: any;
};

export default function FrontendLayout({
    children,
    title,
    subtitle,
    showSidebar = true,
    showHeader = true,
    showFooter = true,
    showSearch = true,
}: FrontendLayoutProps) {
    return (
        <div className="min-h-screen bg-[#f3eee7] p-4 sm:p-5 lg:p-6 flex flex-col font-sans text-[#2a2b30] overflow-x-hidden">
            {showSidebar && <FrontendSidebar />}

            <div className={`flex-1 flex flex-col min-w-0 ${showSidebar ? 'md:pl-[76px] pb-16 md:pb-0' : ''}`}>
                {showHeader && (
                    <FrontendHeader
                        title={title}
                        subtitle={subtitle}
                        showSearch={showSearch}
                    />
                )}

                <main className="flex-1 flex flex-col min-w-0">
                    {children}
                </main>

                {showFooter && <FrontendFooter />}
            </div>
        </div>
    );
}
