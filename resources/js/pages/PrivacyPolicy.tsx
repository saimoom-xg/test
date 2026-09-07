import { Head, Link } from '@inertiajs/react';
import { CalendarDays } from 'lucide-react';

const sections: Array<{ id: string; title: string; children: string }> = [
    {
        id: 'introduction',
        title: '1. Introduction',
        children: 'At Chocolate Store, we are committed to protecting the privacy of everyone who visits our website and engages with our services. This Privacy Policy explains what information we collect, how we use it, and the choices you have regarding your data. Please read it carefully before using our services.',
    },
    {
        id: 'information-we-collect',
        title: '2. Information We Collect',
        children: 'We collect information you provide directly to us, such as when you create an account, place an order, sign up for our newsletter or contact us. This includes your name, email address, shipping and billing address, phone number, payment information and any details you add to your profile. We also automatically receive certain information from your device, including IP address, browser type, operating system, referral URL, access times and pages visited, via cookies and similar technologies.',
    },
    {
        id: 'how-we-use-information',
        title: '3. How We Use Your Information',
        children: 'We use the information we collect to provide, maintain and improve our services; to process and fulfill your orders, including shipping and billing; to communicate with you about your order, account or promotional offers (only if you have opted in); to personalize your experience; to detect and prevent fraud; and to comply with our legal obligations.',
    },
    {
        id: 'cookies-and-tracking',
        title: '4. Cookies and Similar Technologies',
        children: 'We use cookies and similar tracking technologies to enhance your experience, analyze usage and serve personalized content. You can set your browser to refuse all or some cookies; however, this may limit your ability to use certain features of our website. For more options see our Cookie Preference center linked in the footer.',
    },
    {
        id: 'sharing-your-info',
        title: '5. How We Share Your Information',
        children: 'We do not sell your personal data. We share information only with trusted third parties who assist us in operating our website, conducting our business and serving you — such as payment processors, shipping carriers and email providers — and only to the extent necessary to provide our services. We may also disclose information when required by law or to protect our rights, property or safety, or that of others.',
    },
    {
        id: 'data-security',
        title: '6. Data Security',
        children: 'We take the security of your personal information seriously and use administrative, technical and physical safeguards designed to protect your data. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.',
    },
    {
        id: 'retention',
        title: '7. Data Retention',
        children: 'We retain the information we collect for as long as necessary to provide our services and fulfill the purposes described in this Privacy Policy, or for as long as needed to comply with our legal obligations, resolve disputes and enforce our agreements.',
    },
    {
        id: 'your-rights',
        title: '8. Your Rights',
        children: 'You have the right to access, correct, delete or restrict the processing of your personal data, and to object to its processing. You may also withdraw any consent you have given at any time without affecting the lawfulness of the processing before withdrawal. To exercise these rights, please contact us using the details below.',
    },
    {
        id: 'children',
        title: '9. Children',
        children: 'Our services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children. If we discover that we have collected such information, we will promptly delete it.',
    },
    {
        id: 'changes',
        title: '10. Changes to This Privacy Policy',
        children: 'We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated" date at the top of this page and, where required, notify you. We encourage you to review this page periodically for any changes.',
    }
];

export default function PrivacyPolicy() {
    return (
        <>
            <Head title="Privacy Policy - Chocolate Store">
                <meta
                    name="description"
                    content="Read our Privacy Policy to understand what data we collect, how we use cookies, share information, and protect your personal details."
                />
            </Head>

            <div className="flex-1 flex flex-col pb-16">
                <header className="text-center max-w-2xl mx-auto mb-12">
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#2a2b30] leading-tight">
                        Privacy Policy
                    </h1>
                    <p className="mt-3 text-[13.5px] font-medium text-[#8e8d89] leading-relaxed">
                        How we collect, use and protect your personal information.
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
                                    href={'#' + section.id}
                                    className="text-[#8e8d89] hover:text-[#2a2b30] underline underline-offset-2 transition-colors"
                                >
                                    {section.title.split('. ')[1]}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="max-w-3xl mx-auto w-full space-y-10">
                    <section key="introduction" id="introduction">
                        <h2 className="text-xl font-bold tracking-tight text-[#2a2b30] mb-3">
                            1. Introduction
                        </h2>
                        <p className="text-[13.5px] font-medium text-[#8e8d89] leading-relaxed">
                            At Chocolate Store, we are committed to protecting the privacy of everyone who visits our website and engages with our services. This Privacy Policy explains what information we collect, how we use it, and the choices you have regarding your data. Please read it carefully before using our services.
                        </p>
                    </section>
                    <section key="information-we-collect" id="information-we-collect">
                        <h2 className="text-xl font-bold tracking-tight text-[#2a2b30] mb-3">
                            2. Information We Collect
                        </h2>
                        <p className="text-[13.5px] font-medium text-[#8e8d89] leading-relaxed">
                            We collect information you provide directly to us, such as when you create an account, place an order, sign up for our newsletter or contact us. This includes your name, email address, shipping and billing address, phone number, payment information and any details you add to your profile. We also automatically receive certain information from your device, including IP address, browser type, operating system, referral URL, access times and pages visited, via cookies and similar technologies.
                        </p>
                    </section>
                    <section key="how-we-use-information" id="how-we-use-information">
                        <h2 className="text-xl font-bold tracking-tight text-[#2a2b30] mb-3">
                            3. How We Use Your Information
                        </h2>
                        <p className="text-[13.5px] font-medium text-[#8e8d89] leading-relaxed">
                            We use the information we collect to provide, maintain and improve our services; to process and fulfill your orders, including shipping and billing; to communicate with you about your order, account or promotional offers (only if you have opted in); to personalize your experience; to detect and prevent fraud; and to comply with our legal obligations.
                        </p>
                    </section>
                    <section key="cookies-and-tracking" id="cookies-and-tracking">
                        <h2 className="text-xl font-bold tracking-tight text-[#2a2b30] mb-3">
                            4. Cookies and Similar Technologies
                        </h2>
                        <p className="text-[13.5px] font-medium text-[#8e8d89] leading-relaxed">
                            We use cookies and similar tracking technologies to enhance your experience, analyze usage and serve personalized content. You can set your browser to refuse all or some cookies; however, this may limit your ability to use certain features of our website. For more options see our Cookie Preference center linked in the footer.
                        </p>
                    </section>
                    <section key="sharing-your-info" id="sharing-your-info">
                        <h2 className="text-xl font-bold tracking-tight text-[#2a2b30] mb-3">
                            5. How We Share Your Information
                        </h2>
                        <p className="text-[13.5px] font-medium text-[#8e8d89] leading-relaxed">
                            We do not sell your personal data. We share information only with trusted third parties who assist us in operating our website, conducting our business and serving you — such as payment processors, shipping carriers and email providers — and only to the extent necessary to provide our services. We may also disclose information when required by law or to protect our rights, property or safety, or that of others.
                        </p>
                    </section>
                    <section key="data-security" id="data-security">
                        <h2 className="text-xl font-bold tracking-tight text-[#2a2b30] mb-3">
                            6. Data Security
                        </h2>
                        <p className="text-[13.5px] font-medium text-[#8e8d89] leading-relaxed">
                            We take the security of your personal information seriously and use administrative, technical and physical safeguards designed to protect your data. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.
                        </p>
                    </section>
                    <section key="retention" id="retention">
                        <h2 className="text-xl font-bold tracking-tight text-[#2a2b30] mb-3">
                            7. Data Retention
                        </h2>
                        <p className="text-[13.5px] font-medium text-[#8e8d89] leading-relaxed">
                            We retain the information we collect for as long as necessary to provide our services and fulfill the purposes described in this Privacy Policy, or for as long as needed to comply with our legal obligations, resolve disputes and enforce our agreements.
                        </p>
                    </section>
                    <section key="your-rights" id="your-rights">
                        <h2 className="text-xl font-bold tracking-tight text-[#2a2b30] mb-3">
                            8. Your Rights
                        </h2>
                        <p className="text-[13.5px] font-medium text-[#8e8d89] leading-relaxed">
                            You have the right to access, correct, delete or restrict the processing of your personal data, and to object to its processing. You may also withdraw any consent you have given at any time without affecting the lawfulness of the processing before withdrawal. To exercise these rights, please contact us using the details below.
                        </p>
                    </section>
                    <section key="children" id="children">
                        <h2 className="text-xl font-bold tracking-tight text-[#2a2b30] mb-3">
                            9. Children
                        </h2>
                        <p className="text-[13.5px] font-medium text-[#8e8d89] leading-relaxed">
                            Our services are not directed to individuals under the age of 16. We do not knowingly collect personal information from children. If we discover that we have collected such information, we will promptly delete it.
                        </p>
                    </section>
                    <section key="changes" id="changes">
                        <h2 className="text-xl font-bold tracking-tight text-[#2a2b30] mb-3">
                            10. Changes to This Privacy Policy
                        </h2>
                        <p className="text-[13.5px] font-medium text-[#8e8d89] leading-relaxed">
                            We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated" date at the top of this page and, where required, notify you. We encourage you to review this page periodically for any changes.
                        </p>
                    </section>

                    <section className="border-t border-black/5 pt-10">
                        <h2 className="text-xl font-bold tracking-tight text-[#2a2b30] mb-3">11. Contact Us</h2>
                        <p className="text-[13.5px] font-medium text-[#8e8d89] leading-relaxed">
                            Questions about this Privacy Policy or your data? Reach our Data Protection Officer at{' '}
                            <a
                                href="mailto:privacy@chocolatstore.com"
                                className="inline text-[#2a2b50] underline hover:text-[#2a2b30] transition-colors"
                            >
                                privacy@chocolatstore.com
                            </a>{' '}
                            or visit our <Link href="/contact" className="underline hover:text-[#2a2b30] transition-colors">Contact</Link> page.
                        </p>
                    </section>
                </div>
            </div>
        </>
    );
}

PrivacyPolicy.layout = {
    title: 'Privacy Policy',
    subtitle: 'How we collect, use and protect your data',
    showSearch: false,
};
