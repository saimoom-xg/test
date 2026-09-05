import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, Package, MapPin, Heart, Settings } from 'lucide-react';
import AppLogo from './app-logo';

const userNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/user/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'My Orders',
        href: '#',
        icon: Package,
    },
    {
        title: 'Addresses',
        href: '#',
        icon: MapPin,
    },
    {
        title: 'Wishlist',
        href: '/user/wishlist',
        icon: Heart,
    },
    {
        title: 'Settings',
        href: '/settings/profile',
        icon: Settings,
    },
];

export function UserSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/user/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={userNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
