import { Head, Link } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type ContactMessage = {
    id: number;
    name: string;
    email: string;
    subject: string;
    status: 'new' | 'read' | 'replied' | 'closed';
    created_at: string;
};

type Paginated<T> = { data: T[] };
type Props = { messages: Paginated<ContactMessage> };

export default function ContactsIndex({ messages }: Props) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'replied': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'closed': return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200';
            default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
        }
    };

    return (
        <>
            <Head title="Contact Messages" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">Contact Messages</h1>
                        <p className="text-muted-foreground text-sm">View and reply to customer inquiries.</p>
                    </div>
                </div>

                <Card>
                    <CardContent className="p-0 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-muted-foreground border-b text-left text-xs uppercase">
                                    <th className="px-6 py-3 font-medium">Date</th>
                                    <th className="px-6 py-3 font-medium">Customer</th>
                                    <th className="px-6 py-3 font-medium">Subject</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {messages.data.map((message) => (
                                    <tr key={message.id} className="hover:bg-muted/40 border-b">
                                        <td className="px-6 py-3 text-muted-foreground whitespace-nowrap">
                                            {new Date(message.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="font-medium">{message.name}</div>
                                            <div className="text-muted-foreground text-xs">{message.email}</div>
                                        </td>
                                        <td className="px-6 py-3">{message.subject}</td>
                                        <td className="px-6 py-3">
                                            <Badge variant="secondary" className={getStatusColor(message.status)}>
                                                {message.status.toUpperCase()}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/admin/contacts/${message.id}`}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                                {messages.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-muted-foreground px-6 py-12 text-center text-sm">
                                            No messages found.
                                        </td>
                                    </tr>
                                ) : null}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

ContactsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Contact Messages', href: '/admin/contacts' },
    ],
};
