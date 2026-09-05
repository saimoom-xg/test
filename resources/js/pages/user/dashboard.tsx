import { Head, Link, usePage } from '@inertiajs/react';
import UserLayout from '@/layouts/user-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Package, MapPin, Heart } from 'lucide-react';

export default function UserDashboard() {
    const { auth } = usePage().props as any;

    return (
        <UserLayout>
            <Head title="User Dashboard" />
            
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-7xl mx-auto w-full">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome back, {auth?.user?.name}!</h1>
                    <p className="text-muted-foreground mt-2">Manage your orders, addresses, and account settings from your personal dashboard.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xl font-semibold">My Orders</CardTitle>
                            <Package className="h-6 w-6 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Track, return, or buy things again.</CardDescription>
                        </CardContent>
                    </Card>

                    <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xl font-semibold">Addresses</CardTitle>
                            <MapPin className="h-6 w-6 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Edit addresses for orders and gifts.</CardDescription>
                        </CardContent>
                    </Card>

                    <Link href="/user/wishlist" className="block">
                        <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-xl font-semibold">Wishlist</CardTitle>
                                <Heart className="h-6 w-6 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <CardDescription>View and manage your saved items.</CardDescription>
                            </CardContent>
                        </Card>
                    </Link>
                </div>

                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                            <p>You have no recent activity.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </UserLayout>
    );
}
