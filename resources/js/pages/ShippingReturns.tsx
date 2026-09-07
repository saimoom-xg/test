import { Head, Link } from '@inertiajs/react';
import { type ComponentType, useState } from 'react';
import { ChevronDown, Clock, MapPin, PackageCheck, CalendarDays, Sparkles } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

type IconProp = ComponentType<{ className?: string }>;

type ShippingHighlight = {
    icon: IconProp;
    title: string;
    description: string;
};

type FaqItem = {
    question: string;
    answer: string; 
};

const shippingHighlights: ShippingHighlight[] = [
    {
        icon: PackageCheck,
        title: 'Premium Packaging',
        description: 'Every box is lined with compostable, cocoa-fibre tissue and a branded keepsake sleeve that doubles as a gift bag.',
    },
    {
        icon: MapPin,
        title: 'Worldwide Delivery',
        description: 'We ship to over 70 countries via tracked courier, with fully recyclable insulated packaging for heat-sensitive items.',
    },
    {
        icon: Clock,
        title: 'Swift Fulfillment',
        description: 'Orders placed before 2 PM local time ship the same day. Standard delivery arrives within 2–5 business days.',
    },
    {
        icon: CalendarDays,
        title: 'Scheduled Arrival',
        description: 'Choose a delivery date at checkout and we will hand-off your order to the carrier to arrive just in time.',
    },
];

const deliveryInfo = [
    {
        label: 'Standard (3–5 days)',
        detail: 'FREE on orders over $50, otherwise $6.95',
    },
    {
        label: 'Express (1–2 days)',
        detail: '$14.95 — order by 2 PM for same-day dispatch',
    },
    {
        label: 'Overnight',
        detail: '$29.95 — delivered by 10:30 AM next business day',
    },
    {
        label: 'Click & Collect',
        detail: 'FREE — collect in-store within 2 hours of ordering',
    },
];

const faqs: FaqItem[] = [
    {
        question: 'How long does delivery take?',
        answer:
            'Standard delivery arrives within 2–5 business days, express within 1–2 days. We ship worldwide with tracked courier service.',
    },
    {
        question: 'Do you offer gift wrapping?',
        answer:
            'Every order arrives in our signature cocoa-fibre wrapped box with a hand-written style card. Select "Gift Message" at checkout for a personalised note.',
    },
    {
        question: 'How do I track my order?',
        answer:
            'Once your order ships, you will receive a confirmation email with a tracking link. You can also track from your account dashboard.',
    },
    {
        question: 'What is your return policy?',
        answer:
            'You may return any unopened product within 30 days of receipt for a full refund or exchange. See the Returns section below for details.',
    },
    {
        question: 'Can I change or cancel my order?',
        answer:
            'Orders can be modified or cancelled within 1 hour of placement. After that, please contact us and we will do our best to accommodate.',
    },
    {
        question: 'Do you deliver to PO Boxes?',
        answer:
            'We recommend shipping to a residential or commercial address for insurance reasons. PO Box delivery is not available.',
    },
];

function FaqAccordionItem({ item, isOpen, onClick }: { item: FaqItem; isOpen: boolean; onClick: () => void }) {
    return (
        <Collapsible open={isOpen} onOpenChange={onClick}>
            <CollapsibleTrigger asChild>
                <button
                    type="button"
                    className="w-full flex items-center justify-between text-left bg-white border border-black/5 rounded-[18px] px-6 py-4 shadow-sm hover:shadow-md transition-all"
                >
                    <span className="text-[13.5px] font-bold text-[#2a2b30] pr-4">{item.question}</span>
                    <ChevronDown
                        className={`w-4 h-4 text-[#8e8d89] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-1">
                <div className="bg-white border border-black/5 rounded-[18px] px-6 py-4 shadow-sm">
                    <p className="text-[13px] font-medium text-[#8e8d89] leading-relaxed">{item.answer}</p>
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}

export default function ShippingReturns() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <>
            <Head title="Shipping & Returns - Chocolate Store">
                <meta
                    name="description"
                    content="Discover our worldwide shipping options, delivery times, and returns policy. Free returns within 30 days on all unopened chocolate orders."
                />
            </Head>

            <div className="flex-1 flex flex-col pb-12">
                {/* Premium Intro */}
                <section className="text-center max-w-2xl mx-auto mb-12">
                    <span className="inline-flex items-center gap-1.5 bg-white border border-black/5 shadow-xs rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#8e8d89]">
                        <PackageCheck className="w-3.5 h-3.5 text-[#facc15]" />
                        Care &amp; Delivery
                    </span>
                    <h2 className="mt-5 text-3xl sm:text-4xl font-bold tracking-tight text-[#2a2b30] leading-tight">
                        Carefully Crafted, Thoughtfully Delivered
                    </h2>
                    <p className="mt-4 text-[14.5px] font-medium text-[#8e8d89] leading-relaxed">
                        From our atelier to your door — every order is packaged to preserve the integrity of our
                        single-origin chocolates and arrives gift-ready.
                    </p>
                </section>

                {/* Shipping Highlights */}
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
                    {shippingHighlights.map((item) => (
                        <div
                            key={item.title}
                            className="bg-white rounded-[20px] border border-black/5 shadow-sm p-6 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="w-11 h-11 rounded-full bg-[#f8f6f2] border border-black/5 flex items-center justify-center text-[#2a2b30]">
                                <item.icon className="w-[18px] h-[18px]" />
                            </div>
                            <h3 className="text-[14px] font-bold text-[#2a2b30]">{item.title}</h3>
                            <p className="text-[12.5px] font-medium text-[#8e8d89] leading-relaxed">{item.description}</p>
                        </div>
                    ))}
                </section>

                {/* Delivery Options */}
                <section className="bg-white rounded-[24px] border border-black/5 shadow-sm px-6 sm:px-10 py-10 mb-12">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <span className="inline-flex items-center gap-1.5 bg-white border border-black/5 shadow-xs rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#8e8d89]">
                            <Clock className="w-3.5 h-3.5 text-[#facc15]" />
                            Delivery Options
                        </span>
                        <h3 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-[#2a2b30]">
                            Choose How You Receive It
                        </h3>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                            {deliveryInfo.map((option) => (
                                <div
                                    key={option.label}
                                    className="border border-black/5 rounded-[16px] bg-[#f8f6f2] px-5 py-4 flex flex-col"
                                >
                                    <span className="text-[13px] font-bold text-[#2a2b30] mb-1">{option.label}</span>
                                    <span className="text-[12px] font-medium text-[#8e8d89] leading-relaxed">{option.detail}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Returns & Refunds */}
                <section className="mb-12">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <span className="inline-flex items-center gap-1.5 bg-white border border-black/5 shadow-xs rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#8e8d89]">
                            <Sparkles className="w-3.5 h-3.5 text-[#facc15]" />
                            Hassle-Free Returns
                        </span>
                        <h3 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-[#2a2b30]">
                            Our Returns Promise
                        </h3>
                        <p className="mt-3 text-[13.5px] font-medium text-[#8e8d89] leading-relaxed">
                            If you are not completely satisfied, return your order within 30 days for a full refund or
                            exchange.
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="bg-white rounded-[20px] border border-black/5 shadow-sm p-6">
                                <h4 className="text-[14px] font-bold text-[#2a2b30] mb-2">How to Return</h4>
                                <ul className="space-y-2 text-[12.5px] font-medium text-[#8e8d89] leading-relaxed">
                                    <li>1. Contact us within 30 days of delivery.</li>
                                    <li>2. We will email a prepaid return label.</li>
                                    <li>3. Pack items in original packaging.</li>
                                    <li>4. Drop off at any courier location.</li>
                                </ul>
                            </div>
                            <div className="bg-white rounded-[20px] border border-black/5 shadow-sm p-6">
                                <h4 className="text-[14px] font-bold text-[#2a2b30] mb-2">Refund Timeline</h4>
                                <ul className="space-y-2 text-[12.5px] font-medium text-[#8e8d89] leading-relaxed">
                                    <li>• Inspection: 2–3 business days</li>
                                    <li>• Refund issued: 3–5 business days</li>
                                    <li>• Original payment method</li>
                                    <li>• No restocking fee</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Accordion */}
                <section className="mb-12">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <span className="inline-flex items-center gap-1.5 bg-white border border-black/5 shadow-xs rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#8e8d89]">
                            <Clock className="w-3.5 h-3.5 text-[#facc15]" />
                            FAQ
                        </span>
                        <h3 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-[#2a2b30]">
                            Frequently Asked Questions
                        </h3>
                        <p className="mt-3 text-[13.5px] font-medium text-[#8e8d89] leading-relaxed">
                            Everything you need to know about delivery and returns.
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-3">
                        {faqs.map((item, index) => (
                            <FaqAccordionItem
                                key={item.question}
                                item={item}
                                isOpen={openIndex === index}
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            />
                        ))}
                    </div>
                </section>

                {/* Contact CTA */}
                <section className="relative rounded-[28px] overflow-hidden border border-black/5 shadow-md bg-[#2a2b30] px-7 sm:px-12 py-12 text-center text-white">
                    <div
                        className="absolute inset-0 opacity-30"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle at 30% 20%, rgba(252,201,36,0.25), transparent 40%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.12), transparent 40%)',
                        }}
                        aria-hidden="true"
                    />
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">Still Have Questions?</h3>
                        <p className="mt-3 text-[13.5px] font-medium text-white/70 leading-relaxed">
                            Our chocolate care team is standing by to help with your order, delivery, or return query.
                        </p>
                        <Link
                            href="/contact"
                            className="mt-6 inline-flex items-center gap-2 bg-[#facc15] text-[#2a2b30] px-8 py-4 rounded-[16px] font-bold text-[13.5px] hover:brightness-95 transition-all shadow-sm active:scale-[0.98]"
                        >
                            Contact Us
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
}

ShippingReturns.layout = {
    title: 'Shipping & Returns',
    subtitle: 'Delivery options, worldwide shipping and our returns policy',
    showSearch: false,
};
