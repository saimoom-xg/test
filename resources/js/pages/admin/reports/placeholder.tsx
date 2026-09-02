import { Head } from '@inertiajs/react';
import { Construction } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type Props = { title: string };

export default function ReportPlaceholder({ title }: Props) {
    return (
        <>
            <Head title={title} />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                        <p className="text-muted-foreground text-sm">This report is currently under development.</p>
                    </div>
                </div>

                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-24 text-center">
                        <Construction className="h-16 w-16 text-muted-foreground/30 mb-6" />
                        <h2 className="text-xl font-medium mb-2">Coming Soon</h2>
                        <p className="text-muted-foreground max-w-md">
                            We are actively working on the <strong>{title}</strong> report to provide you with deeper insights and better analytics. Check back soon!
                        </p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ReportPlaceholder.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Reports', href: '#' },
    ],
};
