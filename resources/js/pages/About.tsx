import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Award,
    Cake,
    Gem,
    Globe2,
    Hand,
    Heart,
    Leaf,
    Sparkles,
    Briefcase,
    Gift,
} from 'lucide-react';

type BrandValue = {
    icon: typeof Leaf;
    title: string;
    description: string;
};

type Occasion = {
    icon: typeof Gift;
    title: string;
    description: string;
    gradient: string;
};

const stats = [
    { value: '27+', label: 'Years of Craft' },
    { value: '12', label: 'Single Origins' },
    { value: '40k', label: 'Happy Customers' },
    { value: '98%', label: 'Five-Star Reviews' },
];

const brandValues: BrandValue[] = [
    {
        icon: Leaf,
        title: 'Single-Origin Purity',
        description:
            'Rare Criollo and Trinitario beans sourced from twelve smallholder estates, each lot traced from pod to bar.',
    },
    {
        icon: Hand,
        title: 'Handcrafted in Small Batches',
        description:
            'Every ganache is piped, enrobed and finished by hand in our atelier — never more than 200 pieces per batch.',
    },
    {
        icon: Globe2,
        title: 'Ethical & Direct Trade',
        description:
            'We pay two to three times the commodity cocoa price, investing directly in the farming communities we partner with.',
    },
    {
        icon: Award,
        title: 'Award-Winning Recipes',
        description:
            'Over 30 international gold medals for our pralines, truffles and single-origin bars — and still counting.',
    },
];

const occasions: Occasion[] = [
    {
        icon: Cake,
        title: 'Birthdays',
        description: 'Personalised boxes with hand-piped monograms and candles made of cocoa butter.',
        gradient: 'from-[#5d4037] to-[#2a2b30]',
    },
    {
        icon: Heart,
        title: 'Weddings & Anniversaries',
        description: 'Bespoke favours and tiered ganache towers, curated with your event planner.',
        gradient: 'from-[#7a5c46] to-[#3d2b23]',
    },
    {
        icon: Briefcase,
        title: 'Corporate Gifting',
        description: 'Branded luxury boxes with handwritten notes — from 25 to 2,500 recipients.',
        gradient: 'from-[#3b3572] to-[#2a2b30]',
    },
    {
        icon: Gift,
        title: 'Seasonal Holidays',
        description: 'Limited-edition collections for Christmas, Valentine&rsquo;s and Easter, released each season.',
        gradient: 'from-[#8a6d3b] to-[#4a3a28]',
    },
];

export default function About() {
    return (
        <>
            <Head title="Our Story - Premium Chocolate Store">
                <meta
                    name="description"
                    content="Discover our story — 27 years of handcrafted, single-origin chocolate. Meet the values, people and rituals behind every bar and praline."
                />
            </Head>

            <div className="flex-1 flex flex-col pb-12">
                {/* Hero with Chocolate Visual */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-14">
                    <div>
                        <span className="inline-flex items-center gap-1.5 bg-white border border-black/5 shadow-xs rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#8e8d89]">
                            <Sparkles className="w-3.5 h-3.5 text-[#facc15]" />
                            Since 1998 · Grand Cru Heritage
                        </span>
                        <h2 className="mt-5 text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[#2a2b30] leading-[1.15]">
                            Crafted by Hand.
                            <br />
                            Perfected by Time.
                        </h2>
                        <p className="mt-5 text-[14.5px] font-medium text-[#8e8d89] leading-relaxed max-w-lg">
                            What began as a two-person workshop above a Brussels bakery is now a
                            house of chocolate devoted to one obsession: capturing the soul of the
                            cocoa bean in every bite.
                        </p>
                        <div className="mt-7 flex flex-wrap items-center gap-3">
                            <Link
                                href="/shop"
                                className="inline-flex items-center gap-2 bg-[#2a2b30] text-white px-7 py-3.5 rounded-[16px] font-bold text-[13px] hover:bg-black transition-all shadow-sm active:scale-[0.98]"
                            >
                                Explore the Collection
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <a
                                href="#values"
                                className="inline-flex items-center gap-2 bg-white text-[#2a2b30] px-7 py-3.5 rounded-[16px] font-bold text-[13px] border border-black/5 hover:bg-[#f8f6f2] transition-all shadow-sm active:scale-[0.98]"
                            >
                                Our Values
                            </a>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="rounded-[28px] overflow-hidden border border-black/5 shadow-md bg-gradient-to-br from-[#4a342a] to-[#2a2b30] aspect-[4/3]">
                            <img
                                src="https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=1200&q=80"
                                alt="Stack of handcrafted single-origin chocolate bars"
                                loading="lazy"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-5 -left-3 sm:left-6 bg-white rounded-[18px] border border-black/5 shadow-md px-5 py-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#facc15]/20 border border-[#facc15]/40 flex items-center justify-center">
                                <Gem className="w-4.5 h-4.5 text-[#8a6d3b]" />
                            </div>
                            <div>
                                <p className="text-[13px] font-bold text-[#2a2b30] leading-none">Grand Cru Grade</p>
                                <p className="text-[11px] font-medium text-[#8e8d89] mt-1">Top 2% of world cocoa</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Strip */}
                <section className="bg-white rounded-[24px] border border-black/5 shadow-sm px-6 sm:px-10 py-8 mb-14 grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <p className="text-3xl font-bold tracking-tight text-[#2a2b30]">{stat.value}</p>
                            <p className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-[#8e8d89] mt-1.5">{stat.label}</p>
                        </div>
                    ))}
                </section>

                {/* Brand Values */}
                <section id="values" className="mb-14">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <span className="inline-flex items-center gap-1.5 bg-white border border-black/5 shadow-xs rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#8e8d89]">
                            <Gem className="w-3.5 h-3.5 text-[#facc15]" />
                            Our Values
                        </span>
                        <h3 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-[#2a2b30]">
                            The Principles Behind Every Piece
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {brandValues.map((value) => (
                            <div
                                key={value.title}
                                className="bg-white rounded-[20px] border border-black/5 shadow-sm p-6 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className="w-11 h-11 rounded-full bg-[#f8f6f2] border border-black/5 flex items-center justify-center text-[#2a2b30]">
                                    <value.icon className="w-[18px] h-[18px]" />
                                </div>
                                <h4 className="text-[15px] font-bold text-[#2a2b30]">{value.title}</h4>
                                <p className="text-[12.5px] font-medium text-[#8e8d89] leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Gifting & Occasions */}
                <section className="mb-14">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <span className="inline-flex items-center gap-1.5 bg-white border border-black/5 shadow-xs rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#8e8d89]">
                            <Gift className="w-3.5 h-3.5 text-[#facc15]" />
                            Gifting &amp; Occasions
                        </span>
                        <h3 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-[#2a2b30]">
                            Made for Every Celebration
                        </h3>
                        <p className="mt-3 text-[13.5px] font-medium text-[#8e8d89] leading-relaxed">
                            From birthdays to corporate gifting, our atelier crafts chocolate moments
                            tailored to the occasion.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {occasions.map((occasion) => (
                            <div
                                key={occasion.title}
                                className="relative rounded-[20px] overflow-hidden border border-black/5 shadow-sm group min-h-[200px] flex flex-col justify-end p-6 bg-white"
                            >
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br ${occasion.gradient} opacity-90 transition-opacity group-hover:opacity-100`}
                                    aria-hidden="true"
                                />
                                <div className="relative z-10 text-white">
                                    <div className="w-11 h-11 rounded-full bg-white/15 border border-white/25 flex items-center justify-center mb-3 backdrop-blur-sm">
                                        <occasion.icon className="w-5 h-5 text-[#facc15]" />
                                    </div>
                                    <h4 className="text-[15px] font-bold tracking-tight">{occasion.title}</h4>
                                    <p className="text-[12px] font-medium text-white/80 mt-1 leading-relaxed">
                                        {occasion.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Shop CTA */}
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
                        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
                            Taste the Story in Every Bite
                        </h3>
                        <p className="mt-3 text-[13.5px] font-medium text-white/70 leading-relaxed">
                            Browse our single-origin bars, praline boxes and seasonal releases.
                        </p>
                        <Link
                            href="/shop"
                            className="mt-6 inline-flex items-center gap-2 bg-[#facc15] text-[#2a2b30] px-8 py-4 rounded-[16px] font-bold text-[13.5px] hover:brightness-95 transition-all shadow-sm active:scale-[0.98]"
                        >
                            Shop the Collection
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </section>
            </div>
        </>
    );
}

About.layout = {
    title: 'Our Story',
    subtitle: '27 years of handcrafted, single-origin chocolate',
    showSearch: false,
};
