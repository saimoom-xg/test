import { Head, Link } from '@inertiajs/react';
import { CalendarDays } from 'lucide-react';

const sections: Array<{ id: string; title: string; children: string }> = [
    {
        id: 'acceptance',
        title: '1. Acceptance of Terms',
        children:
            'By accessing or using the Chocolate Store website and services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services. We may update these terms from time to time; continued use after changes constitutes acceptance of the updated terms.',
    },
    {
        id: 'accounts',
        title: '2. Accounts',
        children:
            'To place an order you may need to create an account. You are responsible for keeping your account credentials confidential, for all activity under your account, and for ensuring the information you provide is accurate. We reserve the right to suspend accounts that violate these terms or are used for fraudulent activity.',
    },
    {
        id: 'pricing-and-payment',
        title: '3. Pricing and Payment',
        children:
            'All prices are shown in the currency selected at checkout and are inclusive of applicable taxes where required. We accept the payment methods displayed at checkout. By placing an order you authorise us to charge your selected payment method for the full amount, including any applicable taxes and shipping fees.',
    },
    {
        id: 'orders-and-shipping',
        title: '4. Orders and Shipping',
        children:
            'We will use reasonable efforts to ship orders within the estimated delivery window. Shipping times are estimates only and we are not liable for delays beyond our control. Risk in the goods passes to you upon delivery to the carrier or at the shipping address.',
    },
    {
        id: 'returns-and-refunds',
        title: '5. Returns and Refunds',
        children:
            'Returns are governed by our separate Returns Policy, available on the Shipping & Returns page. Products must be returned in original, undamaged packaging within the applicable return window. Refunds are processed to the original payment method within a reasonable time after we receive and inspect the returned goods.',
    },
    {
        id: 'intellectual-property',
        title: '6. Intellectual Property',
        children:
            'All content on this website, including text, images, logos, product designs, recipes and software, is owned by or licensed to Chocolate Store and is protected by intellectual property laws. You may not reproduce, distribute or create derivative works from any content without our prior written consent.',
    },
    {
        id: 'user-conduct',
        title: '7. User Conduct',
        children:
            'You agree to use our services only for lawful purposes and in a manner that does not infringe the rights of others or restrict or inhibit anyone else from using the services. You must not attempt to gain unauthorised access to any part of our systems, interfere with the operation of the website, or transmit harmful code.',
    },
    {
        id: 'disclaimers',
        title: '8. Disclaimers',
        children:
            'Our services and products are provided on an "as is" and "as available" basis. To the fullest extent permitted by law, we disclaim all warranties, express or implied, including any implied warranties of merchantability and fitness for a particular purpose. We do not warrant that the website will be uninterrupted or error free.',
    },
    {
        id: 'liability',
        title: '9. Liability',
        children:
            'To the fullest extent permitted by applicable law, Chocolate Store shall not be liable for any indirect, incidental, special, consequential or punitive damages arising out of or in connection with your use of our services. Our total liability shall not exceed the amount you paid us for the relevant goods or services.',
    },
    {
        id: 'governing-law',
        title: '10. Governing Law',
        children:
            'These Terms and Conditions are governed by and construed in accordance with the laws of the jurisdiction in which Chocolate Store is established, without regard to its conflict of law provisions. You submit to the exclusive jurisdiction of the courts in that location for any dispute arising from these terms.',
    },
    {
        id: 'contact',
        title: '11. Contact',
        children:
            'For questions about these Terms and Conditions, please contact our legal team at legal@chocolatstore.com or visit our Contact page. We will aim to respond within five business days.',
    },
];

export default function TermsConditions() {
    return (
        <>
                <Head title="Terms & Conditions - Chocolate Store">
                    <meta
                        name="description"
                        content="Review the terms and conditions for using Chocolate Store, covering accounts, payments, orders, returns, intellectual property and liability."
                    />
                </Head>

                <div className="flex-1 flex flex-col pb-16">
                    <header className="text-center max-w-2xl mx-auto mb-12">
                        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#2a2b30] leading-tight">
                            Terms &amp; Conditions
                        </h1>
                        <p className="mt-3 text-[13.5px] font-medium text-[#8e8d89] leading-relaxed">
                            The legal rules that govern your use of our store.
                        </p>
                        <div className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-medium text-[#8e8d89]">
                            <CalendarDays className="w-3.5 h-3.5" />
                            Last updated: September 2026
                        </div>
                    </header>

                    <nav className="mb-10 text-center">
                        <ul className="inline-flex flex-wrap justify-center gap-2 text-[12.5px] font-medium">
                            {sections.map((section) => (
                                <li key={section.id}>
                                    <a
                                        href={`#${section.id}`}
                                        className="text-[#8e8d89] hover:text-[#2a2b30] underline underline-offset-2 transition-colors"
                                    >
                                        {section.title.split('. ')[1]}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="max-w-3xl mx-auto w-full space-y-10">
                        {sections.map((section) => (
                            <section key={section.id} id={section.id}>
                                <h2 className="text-xl font-bold tracking-tight text-[#2a2b30] mb-3">
                                    {section.title}
                                </h2>
                                <p className="text-[13.5px] font-medium text-[#8e8d89] leading-relaxed">
                                    {section.children}
                                </p>
                            </section>
                        ))}

                        <section className="border-t border-black/5 pt-10">
                            <h2 className="text-xl font-bold tracking-tight text-[#2a2b30] mb-3">12. Questions?</h2>
                            <p className="text-[13.5px] font-medium text-[#8e8d89] leading-relaxed">
                                If you have any questions about these terms, contact our legal team at{' '}
                                <a
                                    href="mailto:legal@chocolatstore.com"
                                    className="inline text-[#2a2b50] underline hover:text-[#2a2b30] transition-colors"
                                >
                                    legal@chocolatstore.com
                                </a>{' '}
                                or visit our <Link href="/contact" className="underline hover:text-[#2a2b30] transition-colors">Contact</Link> page.
                            </p>
                        </section>
                    </div>
                </div>
            </>
        );
    }

    TermsConditions.layout = {
        title: 'Terms & Conditions',
        subtitle: 'The legal rules governing your use of our store',
        showSearch: false,
    };