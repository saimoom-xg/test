import { ChevronRight } from 'lucide-react';
import { Link } from '@inertiajs/react';

type SectionHeaderProps = {
    title: string;
    linkHref?: string;
    linkText?: string;
    align?: 'left' | 'center';
};

export default function SectionHeader({ title, linkHref = '#', linkText = 'View All', align = 'left' }: SectionHeaderProps) {
    return (
        <div className={`flex justify-between items-end mb-10 ${align === 'center' ? 'flex-col md:flex-row text-center md:text-left' : ''}`}>
            <h3 className="text-2xl font-bold text-black">{title}</h3>
            {linkHref && (
                <Link href={linkHref} className="text-sm font-bold text-black hover:text-yellow-400 transition-colors">
                    {linkText} <ChevronRight className="text-xs ml-1 inline" />
                </Link>
            )}
        </div>
    );
}
