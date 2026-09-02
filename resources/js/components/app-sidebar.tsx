import { Link } from '@inertiajs/react';
import {
    Boxes,
    CreditCard,
    DollarSign,
    FileText,
    LayoutDashboard,
    Mail,
    Package,
    Percent,
    ShoppingCart,
    Tag,
    Ticket,
    Truck,
    Undo2,
    Users,
    Zap,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Products',
        href: '#',
        icon: Package,
        items: [
            { title: 'Create Product', href: '/admin/products/create' },
            { title: 'Inventory', href: '/admin/products' },
            { title: 'Categories', href: '/admin/categories' },
            { title: 'Brands', href: '/admin/brands' },
            { title: 'Variants', href: '/admin/variants' },
            { title: 'Tags', href: '/admin/tags' },
            { title: 'Reviews', href: '/admin/reviews' },
            { title: 'Flash Sales', href: '/admin/flash-sales' },
            { title: 'Coupons', href: '/admin/coupons' },
            { title: 'Returns', href: '/admin/returns' },
        ],
    },
    {
        title: 'Reports',
        href: '#',
        icon: FileText,
        items: [
            { title: 'Sales Overview', href: '/admin/reports/sales' },
            { title: 'Orders Analytics', href: '/admin/reports/orders' },
            { title: 'Product Performance', href: '/admin/reports/products' },
            { title: 'Customer Insights', href: '/admin/reports/customers' },
            { title: 'Coupon Performance', href: '/admin/reports/coupons' },
            { title: 'Inventory Status', href: '/admin/reports/inventory' },
            { title: 'Payment Summary', href: '/admin/reports/payments' },
            { title: 'Tax Summary', href: '/admin/reports/taxes' },
        ],
    },
    {
        title: 'Orders',
        href: '/admin/orders',
        icon: ShoppingCart,
    },
    {
        title: 'Customers',
        href: '/admin/customers',
        icon: Users,
    },
    {
        title: 'Contact Us',
        href: '/admin/contacts',
        icon: Mail,
    },
    {
        title: 'Currencies',
        href: '/admin/settings/currencies',
        icon: DollarSign,
    },
    {
        title: 'Taxes',
        href: '/admin/settings/taxes',
        icon: Percent,
    },
    {
        title: 'Shipping',
        href: '/admin/settings/shipping',
        icon: Truck,
    },
    {
        title: 'Payments',
        href: '/admin/settings/payments',
        icon: CreditCard,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}