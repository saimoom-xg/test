import { Head, router, useForm } from '@inertiajs/react';
import { Send, CheckCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

type Reply = {
    id: number;
    message: string;
    created_at: string;
    user: {
        name: string;
    };
};

type ContactMessage = {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'new' | 'read' | 'replied' | 'closed';
    created_at: string;
    order_id: number | null;
    replies: Reply[];
};

type Props = { contact: ContactMessage };

export default function ContactsShow({ contact }: Props) {
    const form = useForm({
        message: '',
    });

    const submitReply = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(`/admin/contacts/${contact.id}/reply`, {
            preserveScroll: true,
            onSuccess: () => form.reset('message'),
        });
    };

    const closeTicket = () => {
        router.post(`/admin/contacts/${contact.id}/close`, {}, { preserveScroll: true });
    };

    return (
        <>
            <Head title={`Message from ${contact.name}`} />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 max-w-4xl mx-auto w-full">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight">{contact.subject}</h1>
                        <p className="text-muted-foreground text-sm">
                            From {contact.name} ({contact.email}) on {new Date(contact.created_at).toLocaleString()}
                        </p>
                    </div>
                    {contact.status !== 'closed' && (
                        <Button variant="outline" onClick={closeTicket}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Close Ticket
                        </Button>
                    )}
                </div>

                <div className="space-y-6">
                    {/* Original Message */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-base">Customer Message</CardTitle>
                                <Badge variant="outline">{contact.status.toUpperCase()}</Badge>
                            </div>
                            {contact.order_id && (
                                <CardDescription>
                                    Regarding Order #{contact.order_id}
                                </CardDescription>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="whitespace-pre-wrap bg-muted/30 p-4 rounded-md text-sm">
                                {contact.message}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Replies */}
                    {contact.replies.map((reply) => (
                        <Card key={reply.id} className="ml-8 border-primary/20">
                            <CardHeader className="py-3 bg-primary/5">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium">Support Reply ({reply.user.name})</CardTitle>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(reply.created_at).toLocaleString()}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <div className="whitespace-pre-wrap text-sm">
                                    {reply.message}
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Reply Form */}
                    {contact.status !== 'closed' && (
                        <Card className="mt-8">
                            <CardHeader>
                                <CardTitle className="text-base">Send Reply</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={submitReply} className="space-y-4">
                                    <div>
                                        <Textarea
                                            value={form.data.message}
                                            onChange={(e) => form.setData('message', e.target.value)}
                                            placeholder="Type your reply here..."
                                            className="min-h-[120px]"
                                            required
                                        />
                                        <InputError message={form.errors.message} />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button type="submit" disabled={form.processing}>
                                            <Send className="mr-2 h-4 w-4" />
                                            Send Reply
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}

ContactsShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Contact Messages', href: '/admin/contacts' },
        { title: 'View Message', href: '#' },
    ],
};
