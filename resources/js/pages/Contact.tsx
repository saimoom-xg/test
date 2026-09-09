import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEvent } from 'react';
import {
    ArrowRight,
    Clock,
    Facebook,
    Headset,
    Instagram,
    Loader2,
    Mail,
    MapPin,
    Phone,
    Send,
    Sparkles,
    Twitter,
    Youtube,
} from 'lucide-react';
import { toast } from 'sonner';
import InputError from '@/components/input-error';

type ContactForm = {
    name: string;
    email: string;
    subject: string;
    message: string;
};

const contactChannels = [
    {
        icon: MapPin,
        title: 'Visit the Atelier',
        lines: ['128 Cocoa Lane, Suite 4', 'Brussels, BE 1000'],
    },
    {
        icon: Phone,
        title: 'Call Us',
        lines: ['+1 (555) 012-3456', 'Mon–Fri, 9am–6pm'],
    },
    {
        icon: Mail,
        title: 'Email Us',
        lines: ['hello@chocolatstore.com', 'Replies within 24 hours'],
    },
    {
        icon: Clock,
        title: 'Tasting Room Hours',
        lines: ['Mon–Sat: 9:00 – 19:00', 'Sunday: 10:00 – 16:00'],
    },
];

const socials = [
    { icon: Facebook, label: 'Facebook' },
    { icon: Instagram, label: 'Instagram' },
    { icon: Twitter, label: 'Twitter' },
    { icon: Youtube, label: 'YouTube' },
];

const inputClasses =
    'w-full bg-white border border-black/10 rounded-[14px] px-4 py-3 text-[13.5px] font-medium text-[#2a2b30] placeholder:text-[#a8a7a2] outline-none focus:border-[#2a2b30] focus:ring-4 focus:ring-[#2a2b30]/5 transition-all';

export default function Contact() {
    const form = useForm<ContactForm>({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const submit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        form.post('/contact', {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Message sent. Our chocolate care team will be in touch soon.');
                form.reset();
            },
        });
    };

    return (
        <>
            <Head title="Contact Us - Premium Chocolate Store">
                <meta
                    name="description"
                    content="Get in touch with our chocolate care team. Visit the atelier, call, email or send us a message — we reply within 24 hours."
                />
            </Head>

            <div className="flex-1 flex flex-col pb-12">
                {/* Premium Intro */}
                <section className="text-center max-w-2xl mx-auto mb-12">
                    <span className="inline-flex items-center gap-1.5 bg-white border border-black/5 shadow-xs rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#8e8d89]">
                        <Sparkles className="w-3.5 h-3.5 text-[#facc15]" />
                        Chocolate Care Team
                    </span>
                    <h2 className="mt-5 text-3xl sm:text-4xl font-bold tracking-tight text-[#2a2b30] leading-tight">
                        Let&apos;s Talk Chocolate
                    </h2>
                    <p className="mt-4 text-[14.5px] font-medium text-[#8e8d89] leading-relaxed">
                        A question about an order, a gift to curate, or a tasting to plan —
                        our connoisseurs are always one message away.
                    </p>
                </section>

                {/* Contact Information Cards */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
                    {contactChannels.map((channel) => (
                        <div
                            key={channel.title}
                            className="bg-white rounded-[20px] border border-black/5 shadow-sm p-6 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="w-11 h-11 rounded-full bg-[#f8f6f2] border border-black/5 flex items-center justify-center text-[#2a2b30]">
                                <channel.icon className="w-[18px] h-[18px]" />
                            </div>
                            <div>
                                <h3 className="text-[14px] font-bold text-[#2a2b30]">{channel.title}</h3>
                                {channel.lines.map((line) => (
                                    <p key={line} className="text-[12.5px] font-medium text-[#8e8d89] mt-1 leading-relaxed">
                                        {line}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>

                {/* Social Links */}
                <section className="bg-white rounded-[20px] border border-black/5 shadow-sm px-6 py-5 mb-12 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="text-[14px] font-bold text-[#2a2b30]">Follow the Ritual</h3>
                        <p className="text-[12.5px] font-medium text-[#8e8d89] mt-0.5">
                            Behind-the-scenes pours, new releases and tasting notes.
                        </p>
                    </div>
                    <div className="flex gap-2.5">
                        {socials.map((social) => (
                            <a
                                key={social.label}
                                href="#"
                                aria-label={social.label}
                                title={social.label}
                                className="w-10 h-10 bg-[#f8f6f2] border border-black/5 rounded-full flex items-center justify-center text-[#2a2b30] hover:bg-[#2a2b30] hover:text-[#facc15] hover:border-[#2a2b30] transition-all"
                            >
                                <social.icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </section>

                {/* Contact Form + Support Sidebar */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-[24px] border border-black/5 shadow-sm p-6 sm:p-8">
                        <h3 className="text-xl font-bold tracking-tight text-[#2a2b30]">Send a Message</h3>
                        <p className="text-[13px] font-medium text-[#8e8d89] mt-1 mb-6">
                            Fill in the form below and we will get back to you within one business day.
                        </p>

                        <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4" noValidate>
                            <div className="sm:col-span-1">
                                <label htmlFor="contact-name" className="block text-[12px] font-bold text-[#2a2b30] mb-1.5 uppercase tracking-wide">
                                    Your Name
                                </label>
                                <input
                                    id="contact-name"
                                    type="text"
                                    name="name"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    placeholder="Jane Doe"
                                    autoComplete="name"
                                    className={inputClasses}
                                />
                                <InputError message={form.errors.name} className="mt-1.5" />
                            </div>

                            <div className="sm:col-span-1">
                                <label htmlFor="contact-email" className="block text-[12px] font-bold text-[#2a2b30] mb-1.5 uppercase tracking-wide">
                                    Email Address
                                </label>
                                <input
                                    id="contact-email"
                                    type="email"
                                    name="email"
                                    value={form.data.email}
                                    onChange={(e) => form.setData('email', e.target.value)}
                                    placeholder="jane@example.com"
                                    autoComplete="email"
                                    className={inputClasses}
                                />
                                <InputError message={form.errors.email} className="mt-1.5" />
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="contact-subject" className="block text-[12px] font-bold text-[#2a2b30] mb-1.5 uppercase tracking-wide">
                                    Subject
                                </label>
                                <input
                                    id="contact-subject"
                                    type="text"
                                    name="subject"
                                    value={form.data.subject}
                                    onChange={(e) => form.setData('subject', e.target.value)}
                                    placeholder="Order question, gifting, wholesale..."
                                    className={inputClasses}
                                />
                                <InputError message={form.errors.subject} className="mt-1.5" />
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="contact-message" className="block text-[12px] font-bold text-[#2a2b30] mb-1.5 uppercase tracking-wide">
                                    Message
                                </label>
                                <textarea
                                    id="contact-message"
                                    name="message"
                                    value={form.data.message}
                                    onChange={(e) => form.setData('message', e.target.value)}
                                    placeholder="Tell us how we can help..."
                                    rows={5}
                                    className={`${inputClasses} resize-none`}
                                />
                                <InputError message={form.errors.message} className="mt-1.5" />
                            </div>

                            <div className="sm:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                                <p className="text-[11.5px] font-medium text-[#a8a7a2] leading-relaxed">
                                    By sending, you agree to our{' '}
                                    <Link href="/privacy-policy" className="underline hover:text-[#2a2b30] transition-colors">Privacy Policy</Link>.
                                </p>
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="inline-flex items-center justify-center gap-2 bg-[#2a2b30] text-white px-7 py-3.5 rounded-[16px] font-bold text-[13px] hover:bg-black transition-all shadow-sm active:scale-[0.98] disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer shrink-0"
                                >
                                    {form.processing ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            <span>Send Message</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Support CTA Sidebar */}
                    <div className="flex flex-col gap-6">
                        <div className="bg-[#2a2b30] rounded-[24px] p-7 text-white flex-1 flex flex-col justify-between relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-[#facc15]/10 blur-2xl" aria-hidden="true" />
                            <div>
                                <div className="w-11 h-11 rounded-full bg-white/10 border border-white/10 flex items-center justify-center mb-5">
                                    <Headset className="w-5 h-5 text-[#facc15]" />
                                </div>
                                <h3 className="text-lg font-bold tracking-tight">Need a faster answer?</h3>
                                <p className="text-[13px] font-medium text-white/60 mt-2 leading-relaxed">
                                    Browse shipping times, returns and FAQs — most answers live there.
                                </p>
                            </div>
                            <Link
                                href="/shipping-returns"
                                className="mt-6 inline-flex items-center justify-center gap-2 bg-[#facc15] text-[#2a2b30] px-5 py-3 rounded-[14px] font-bold text-[12.5px] hover:brightness-95 transition-all active:scale-[0.98]"
                            >
                                Shipping &amp; Returns
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="bg-white rounded-[24px] border border-black/5 shadow-sm p-7">
                            <h3 className="text-[15px] font-bold text-[#2a2b30]">Wholesale &amp; Events</h3>
                            <p className="text-[12.5px] font-medium text-[#8e8d89] mt-2 leading-relaxed">
                                Planning corporate gifting or a private tasting? Write to us with the subject
                                &ldquo;Wholesale&rdquo; and our atelier will craft a proposal.
                            </p>
                            <a
                                href="mailto:hello@chocolatstore.com"
                                className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#2a2b30] hover:gap-2.5 transition-all"
                            >
                                hello@chocolatstore.com
                                <ArrowRight className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

Contact.layout = {
    title: 'Contact Us',
    subtitle: 'Questions, gifting or wholesale — our chocolate care team is here',
    showSearch: false,
};
