import { usePage } from '@inertiajs/react';
import AppLayout from './app-layout';
import UserLayout from './user-layout';

export default function DynamicRoleLayout({ children }: { children: React.ReactNode }) {
    const { auth } = usePage().props as any;

    const isAdmin = auth?.user?.roles?.includes('admin');

    if (isAdmin) {
        return <AppLayout>{children}</AppLayout>;
    }

    return <UserLayout>{children}</UserLayout>;
}
