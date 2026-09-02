import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { UserSidebar } from '@/components/user-sidebar';

export default function UserLayout({ children }: { children: React.ReactNode }) {
    const breadcrumbs = [
        { title: 'My Account', href: '/user/dashboard' },
    ];

    return (
        <AppShell variant="sidebar">
            <UserSidebar />
            <AppContent variant="sidebar" className="min-w-0 overflow-x-clip">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
