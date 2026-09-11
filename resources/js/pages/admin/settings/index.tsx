import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertTriangle,
    BarChart3,
    Check,
    Clock,
    Code,
    Copy,
    CreditCard,
    DollarSign,
    ExternalLink,
    Eye,
    EyeOff,
    FileText,
    Globe,
    HelpCircle,
    Image as ImageIcon,
    Layout,
    Mail,
    MapPin,
    Megaphone,
    Phone,
    RefreshCw,
    Save,
    Search,
    Send,
    Share2,
    Shield,
    ShieldAlert,
    ShoppingBag,
    Trash2,
    UploadCloud,
} from 'lucide-react';
import React, { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

type Currency = {
    id: number;
    code: string;
    name: string;
    symbol: string;
    is_default?: boolean;
};

type Props = {
    settings: Record<string, any>;
    groupedSettings: Record<string, Record<string, any>>;
    currencies: Currency[];
    timezones: string[];
    locales: Record<string, string>;
    flash?: {
        success?: string;
        error?: string;
    };
};

type TabId =
    | 'general'
    | 'contact'
    | 'social'
    | 'localization'
    | 'layout'
    | 'maintenance'
    | 'analytics'
    | 'mail'
    | 'custom_code'
    | 'ecommerce';

interface TabItem {
    id: TabId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    badge?: string;
}

const toBoolean = (val: any): boolean => {
    return val === true || val === 1 || val === '1' || val === 'true';
};

const BOOLEAN_KEYS = new Set([
    'layout.header_announcement_enabled',
    'layout.footer_show_newsletter',
    'layout.footer_show_socials',
    'layout.footer_show_payment_methods',
    'system.maintenance_mode',
    'ecommerce.enable_guest_checkout',
    'ecommerce.cookie_consent_enabled',
]);

export default function AdminSettingsIndex({
    settings: initialSettings,
    currencies,
    timezones,
    locales,
    flash,
}: Props) {
    const [activeTab, setActiveTab] = useState<TabId>('general');
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState<Record<string, any>>(initialSettings);
    const [fileUploads, setFileUploads] = useState<{
        logo_file: File | null;
        logo_dark_file: File | null;
        favicon_file: File | null;
        og_image_file: File | null;
    }>({
        logo_file: null,
        logo_dark_file: null,
        favicon_file: null,
        og_image_file: null,
    });
    const [filePreviews, setFilePreviews] = useState<Record<string, string>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [testEmailAddress, setTestEmailAddress] = useState('');
    const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
    const [testEmailModalOpen, setTestEmailModalOpen] = useState(false);

    // File input refs
    const logoInputRef = useRef<HTMLInputElement>(null);
    const logoDarkInputRef = useRef<HTMLInputElement>(null);
    const faviconInputRef = useRef<HTMLInputElement>(null);
    const ogImageInputRef = useRef<HTMLInputElement>(null);

    // Check if form is dirty
    const isDirty = useMemo(() => {
        const hasFile = Object.values(fileUploads).some((f) => f !== null);
        if (hasFile) return true;
        for (const [key, val] of Object.entries(formData)) {
            if (BOOLEAN_KEYS.has(key)) {
                if (toBoolean(initialSettings[key]) !== toBoolean(val)) return true;
                continue;
            }
            if (initialSettings[key] !== val) return true;
        }
        return false;
    }, [formData, initialSettings, fileUploads]);

    const tabs: TabItem[] = [
        {
            id: 'general',
            label: 'General & Branding',
            icon: Globe,
            description: 'Site identity, logo, favicon, and copyright',
        },
        {
            id: 'contact',
            label: 'Contact & Location',
            icon: Phone,
            description: 'Phone, email, address, hours, and map location',
        },
        {
            id: 'social',
            label: 'Social Media',
            icon: Share2,
            description: 'Social network links and brand profiles',
        },
        {
            id: 'localization',
            label: 'Localization',
            icon: DollarSign,
            description: 'Currency, timezone, language, and date/time format',
        },
        {
            id: 'layout',
            label: 'Header & Footer',
            icon: Layout,
            description: 'Announcement bar, footer text, and layout options',
        },
        {
            id: 'maintenance',
            label: 'Maintenance Mode',
            icon: ShieldAlert,
            description: 'Store downtime, maintenance banner, and bypass key',
            badge: toBoolean(formData['system.maintenance_mode']) ? 'ACTIVE' : undefined,
        },
        {
            id: 'analytics',
            label: 'SEO & Tracking',
            icon: BarChart3,
            description: 'Google Analytics, GTM, Pixel, and search snippet',
        },
        {
            id: 'mail',
            label: 'SMTP & Email',
            icon: Mail,
            description: 'Mail server credentials and email testing',
        },
        {
            id: 'custom_code',
            label: 'Custom Code',
            icon: Code,
            description: 'Custom CSS, header scripts, and footer JS',
        },
        {
            id: 'ecommerce',
            label: 'Store & Checkout',
            icon: ShoppingBag,
            description: 'Guest checkout, pagination, and cookie banner',
        },
    ];

    const filteredTabs = useMemo(() => {
        if (!searchQuery.trim()) return tabs;
        const q = searchQuery.toLowerCase();
        return tabs.filter(
            (t) =>
                t.label.toLowerCase().includes(q) ||
                t.description.toLowerCase().includes(q)
        );
    }, [tabs, searchQuery]);

    const updateField = (key: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleFileChange = (
        type: 'logo_file' | 'logo_dark_file' | 'favicon_file' | 'og_image_file',
        file: File | null
    ) => {
        setFileUploads((prev) => ({ ...prev, [type]: file }));
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setFilePreviews((prev) => ({ ...prev, [type]: previewUrl }));
        } else {
            setFilePreviews((prev) => {
                const copy = { ...prev };
                delete copy[type];
                return copy;
            });
        }
    };

    const handleReset = () => {
        setFormData(initialSettings);
        setFileUploads({
            logo_file: null,
            logo_dark_file: null,
            favicon_file: null,
            og_image_file: null,
        });
        setFilePreviews({});
        toast.info('Changes reset to previously saved configuration.');
    };

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsSaving(true);

        const formPayload = new FormData();

        // Append all text/boolean settings
        for (const [k, v] of Object.entries(formData)) {
            if (BOOLEAN_KEYS.has(k) || typeof v === 'boolean') {
                formPayload.append(`settings[${k}]`, toBoolean(v) ? '1' : '0');
            } else if (v !== null && v !== undefined) {
                formPayload.append(`settings[${k}]`, v);
            }
        }

        // Append file uploads
        if (fileUploads.logo_file) {
            formPayload.append('logo_file', fileUploads.logo_file);
        }
        if (fileUploads.logo_dark_file) {
            formPayload.append('logo_dark_file', fileUploads.logo_dark_file);
        }
        if (fileUploads.favicon_file) {
            formPayload.append('favicon_file', fileUploads.favicon_file);
        }
        if (fileUploads.og_image_file) {
            formPayload.append('og_image_file', fileUploads.og_image_file);
        }

        router.post('/admin/settings', formPayload, {
            preserveScroll: true,
            onSuccess: () => {
                setIsSaving(false);
                setFileUploads({
                    logo_file: null,
                    logo_dark_file: null,
                    favicon_file: null,
                    og_image_file: null,
                });
                toast.success('Site configuration saved successfully!');
            },
            onError: (errors) => {
                setIsSaving(false);
                const firstError = Object.values(errors)[0];
                toast.error(typeof firstError === 'string' ? firstError : 'Failed to save settings.');
            },
        });
    };

    const handleSendTestEmail = (e: React.FormEvent) => {
        e.preventDefault();
        if (!testEmailAddress || !testEmailAddress.includes('@')) {
            toast.error('Please enter a valid recipient email address.');
            return;
        }

        setIsSendingTestEmail(true);
        router.post(
            '/admin/settings/test-mail',
            { recipient_email: testEmailAddress },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setIsSendingTestEmail(false);
                    setTestEmailModalOpen(false);
                    toast.success(`Test email sent to ${testEmailAddress}`);
                },
                onError: (err: any) => {
                    setIsSendingTestEmail(false);
                    const msg = err.error || err.recipient_email || 'Failed to send test email.';
                    toast.error(msg);
                },
            }
        );
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`Copied ${label} to clipboard!`);
    };

    // Live display values
    const currentLogo = filePreviews.logo_file || formData['general.site_logo'] || '';
    const currentFavicon = filePreviews.favicon_file || formData['general.site_favicon'] || '/favicon.ico';
    const currentOgImage = filePreviews.og_image_file || formData['general.site_og_image'] || '';
    const siteTitle = formData['general.site_title'] || 'StoreHub';
    const siteTagline = formData['general.site_tagline'] || 'Curated Fashion & Lifestyle Essentials';
    const siteDesc = formData['general.site_description'] || 'Your premier shopping destination.';
    const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ecommerce-latest.test';

    return (
        <>
            <Head title="Site Configuration - Admin Settings" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#2a2b30] dark:text-zinc-100">
                                Site Configuration
                            </h1>
                            {toBoolean(formData['system.maintenance_mode']) && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                    <AlertTriangle className="w-3 h-3" />
                                    Maintenance On
                                </span>
                            )}
                        </div>
                        <p className="text-muted-foreground text-sm mt-1">
                            Manage global website details, branding, localization, contact, tracking, and system rules.
                        </p>
                    </div>

                    {/* Quick action buttons */}
                    <div className="flex items-center gap-2.5">
                        {isDirty && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleReset}
                                disabled={isSaving}
                                className="text-xs"
                            >
                                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                                Reset
                            </Button>
                        )}
                        <Button
                            size="sm"
                            onClick={() => handleSubmit()}
                            disabled={isSaving}
                            className="bg-[#2a2b30] hover:bg-black text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
                        >
                            {isSaving ? (
                                <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                            ) : (
                                <Save className="w-3.5 h-3.5 mr-1.5" />
                            )}
                            Save Changes
                        </Button>
                    </div>
                </div>

                {/* Maintenance Mode Alert Banner if enabled */}
                {toBoolean(formData['system.maintenance_mode']) && (
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900 dark:text-amber-200">
                        <div className="flex items-center gap-3">
                            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                            <div>
                                <h4 className="text-sm font-semibold">Store Maintenance Mode is Currently Active</h4>
                                <p className="text-xs opacity-90">
                                    Public visitors see the maintenance screen. Admins and visitors with the bypass key can browse freely.
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setActiveTab('maintenance')}
                            className="border-amber-500/30 bg-amber-50 dark:bg-zinc-900 text-xs shrink-0"
                        >
                            Configure Bypass
                        </Button>
                    </div>
                )}

                {/* Main Layout: Left Navigation + Right Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Sidebar Navigation */}
                    <div className="lg:col-span-3 space-y-3">
                        {/* Search Filter Box */}
                        <div className="relative">
                            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                            <Input
                                placeholder="Search settings..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 h-9 text-xs bg-white dark:bg-zinc-900"
                            />
                        </div>

                        {/* Navigation List */}
                        <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none" aria-label="Settings Categories">
                            {filteredTabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-left text-xs sm:text-sm font-medium transition-all shrink-0 w-full cursor-pointer ${
                                            isActive
                                                ? 'bg-[#2a2b30] text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-900 font-semibold'
                                                : 'text-muted-foreground hover:text-[#2a2b30] hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <Icon className={`w-4 h-4 ${isActive ? 'text-[#facc15] dark:text-amber-500' : 'text-muted-foreground'}`} />
                                            <span>{tab.label}</span>
                                        </div>
                                        {tab.badge && (
                                            <span className="ml-2 text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-600 dark:text-amber-300">
                                                {tab.badge}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Right Content Area */}
                    <div className="lg:col-span-9 space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* ============================================================
                                TAB 1: GENERAL & BRANDING
                            ============================================================ */}
                            {activeTab === 'general' && (
                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Site Identity & Branding</CardTitle>
                                            <CardDescription>
                                                Configure primary website details, brand names, and search presentation.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <Label htmlFor="site_title">Site Title / Store Name</Label>
                                                    <Input
                                                        id="site_title"
                                                        value={formData['general.site_title'] || ''}
                                                        onChange={(e) => updateField('general.site_title', e.target.value)}
                                                        placeholder="e.g. StoreHub"
                                                    />
                                                    <p className="text-[11px] text-muted-foreground">Appears in header, emails, and browser tab titles.</p>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <Label htmlFor="site_tagline">Tagline</Label>
                                                    <Input
                                                        id="site_tagline"
                                                        value={formData['general.site_tagline'] || ''}
                                                        onChange={(e) => updateField('general.site_tagline', e.target.value)}
                                                        placeholder="e.g. Artisan Craftsmanship & Premium Quality"
                                                    />
                                                    <p className="text-[11px] text-muted-foreground">Short brand slogan or value proposition.</p>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="site_description">Short Description / Meta Summary</Label>
                                                <Textarea
                                                    id="site_description"
                                                    rows={3}
                                                    value={formData['general.site_description'] || ''}
                                                    onChange={(e) => updateField('general.site_description', e.target.value)}
                                                    placeholder="A concise summary of your store used in SEO search results and social previews."
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="copyright_text">Copyright Notice</Label>
                                                <Input
                                                    id="copyright_text"
                                                    value={formData['general.copyright_text'] || ''}
                                                    onChange={(e) => updateField('general.copyright_text', e.target.value)}
                                                    placeholder="© {year} StoreHub. All rights reserved."
                                                />
                                                <p className="text-[11px] text-muted-foreground">
                                                    Use <code className="text-amber-600 bg-amber-500/10 px-1 py-0.5 rounded font-mono">{"{year}"}</code> to automatically insert the current year.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Logos & Media Uploads */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Logos & Visual Assets</CardTitle>
                                            <CardDescription>
                                                Upload or link images for site header, favicon, and social card previews.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {/* Primary Logo */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 border rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50">
                                                <div className="space-y-1 md:col-span-1">
                                                    <h4 className="text-sm font-semibold">Primary Logo</h4>
                                                    <p className="text-xs text-muted-foreground">Recommended: Transparent PNG or SVG (height 40–60px).</p>
                                                    <div className="pt-2 flex items-center gap-3">
                                                        <div className="w-16 h-16 rounded-lg border bg-white flex items-center justify-center p-2 shadow-xs overflow-hidden">
                                                            {currentLogo ? (
                                                                <img src={currentLogo} alt="Logo preview" className="max-h-full max-w-full object-contain" />
                                                            ) : (
                                                                <ImageIcon className="w-6 h-6 text-muted-foreground" />
                                                            )}
                                                        </div>
                                                        {currentLogo && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-red-500 hover:text-red-600 text-xs h-7 px-2"
                                                                onClick={() => {
                                                                    handleFileChange('logo_file', null);
                                                                    updateField('general.site_logo', '');
                                                                }}
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5 mr-1" />
                                                                Remove
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-2 md:col-span-2">
                                                    <div className="flex gap-2">
                                                        <Input
                                                            type="text"
                                                            placeholder="Or paste image URL (https://...)"
                                                            value={formData['general.site_logo'] || ''}
                                                            onChange={(e) => updateField('general.site_logo', e.target.value)}
                                                            className="text-xs"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() => logoInputRef.current?.click()}
                                                            className="text-xs shrink-0"
                                                        >
                                                            <UploadCloud className="w-3.5 h-3.5 mr-1.5" />
                                                            Upload
                                                        </Button>
                                                        <input
                                                            type="file"
                                                            ref={logoInputRef}
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => handleFileChange('logo_file', e.target.files?.[0] || null)}
                                                        />
                                                    </div>
                                                    {fileUploads.logo_file && (
                                                        <p className="text-xs text-green-600 font-medium">
                                                            Ready to upload: {fileUploads.logo_file.name}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Favicon */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 border rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50">
                                                <div className="space-y-1 md:col-span-1">
                                                    <h4 className="text-sm font-semibold">Favicon</h4>
                                                    <p className="text-xs text-muted-foreground">Standard 32x32 ICO or PNG icon.</p>
                                                    <div className="pt-2 flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-md border bg-white flex items-center justify-center p-1.5 shadow-xs overflow-hidden">
                                                            {currentFavicon ? (
                                                                <img src={currentFavicon} alt="Favicon" className="w-6 h-6 object-contain" />
                                                            ) : (
                                                                <Globe className="w-5 h-5 text-muted-foreground" />
                                                            )}
                                                        </div>
                                                        <div className="text-[11px] text-muted-foreground font-mono truncate max-w-[120px]">
                                                            {currentFavicon}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 md:col-span-2">
                                                    <div className="flex gap-2">
                                                        <Input
                                                            type="text"
                                                            placeholder="Favicon path or URL (/favicon.ico)"
                                                            value={formData['general.site_favicon'] || ''}
                                                            onChange={(e) => updateField('general.site_favicon', e.target.value)}
                                                            className="text-xs"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() => faviconInputRef.current?.click()}
                                                            className="text-xs shrink-0"
                                                        >
                                                            <UploadCloud className="w-3.5 h-3.5 mr-1.5" />
                                                            Upload
                                                        </Button>
                                                        <input
                                                            type="file"
                                                            ref={faviconInputRef}
                                                            accept=".ico,.png,.svg"
                                                            className="hidden"
                                                            onChange={(e) => handleFileChange('favicon_file', e.target.files?.[0] || null)}
                                                        />
                                                    </div>
                                                    {fileUploads.favicon_file && (
                                                        <p className="text-xs text-green-600 font-medium">
                                                            Ready to upload: {fileUploads.favicon_file.name}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* OG Image */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 border rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50">
                                                <div className="space-y-1 md:col-span-1">
                                                    <h4 className="text-sm font-semibold">Social Share (OG) Image</h4>
                                                    <p className="text-xs text-muted-foreground">Dimensions: 1200 x 630 px for optimal preview on Twitter/Facebook.</p>
                                                    <div className="pt-2">
                                                        <div className="w-28 h-16 rounded-md border bg-zinc-100 flex items-center justify-center overflow-hidden shadow-xs">
                                                            {currentOgImage ? (
                                                                <img src={currentOgImage} alt="OG Card" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <Share2 className="w-6 h-6 text-muted-foreground" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-2 md:col-span-2">
                                                    <div className="flex gap-2">
                                                        <Input
                                                            type="text"
                                                            placeholder="OG Image URL (https://...)"
                                                            value={formData['general.site_og_image'] || ''}
                                                            onChange={(e) => updateField('general.site_og_image', e.target.value)}
                                                            className="text-xs"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={() => ogImageInputRef.current?.click()}
                                                            className="text-xs shrink-0"
                                                        >
                                                            <UploadCloud className="w-3.5 h-3.5 mr-1.5" />
                                                            Upload
                                                        </Button>
                                                        <input
                                                            type="file"
                                                            ref={ogImageInputRef}
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => handleFileChange('og_image_file', e.target.files?.[0] || null)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* ============================================================
                                TAB 2: CONTACT & LOCATION
                            ============================================================ */}
                            {activeTab === 'contact' && (
                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Customer Contact Channels</CardTitle>
                                            <CardDescription>
                                                Manage support email, phone numbers, WhatsApp, and physical atelier location.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <Label htmlFor="contact_email">Support Email Address</Label>
                                                    <Input
                                                        id="contact_email"
                                                        type="email"
                                                        value={formData['contact.contact_email'] || ''}
                                                        onChange={(e) => updateField('contact.contact_email', e.target.value)}
                                                        placeholder="hello@storehub.com"
                                                    />
                                                </div>

                                                <div className="space-y-1.5">
                                                    <Label htmlFor="contact_phone">Customer Service Phone</Label>
                                                    <Input
                                                        id="contact_phone"
                                                        value={formData['contact.contact_phone'] || ''}
                                                        onChange={(e) => updateField('contact.contact_phone', e.target.value)}
                                                        placeholder="+1 (555) 012-3456"
                                                    />
                                                </div>

                                                <div className="space-y-1.5">
                                                    <Label htmlFor="contact_whatsapp">WhatsApp Number</Label>
                                                    <Input
                                                        id="contact_whatsapp"
                                                        value={formData['contact.contact_whatsapp'] || ''}
                                                        onChange={(e) => updateField('contact.contact_whatsapp', e.target.value)}
                                                        placeholder="+15550123456"
                                                    />
                                                    <p className="text-[11px] text-muted-foreground">Include country code for direct wa.me chat integration.</p>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <Label htmlFor="contact_address">Physical Address / Atelier Location</Label>
                                                    <Input
                                                        id="contact_address"
                                                        value={formData['contact.contact_address'] || ''}
                                                        onChange={(e) => updateField('contact.contact_address', e.target.value)}
                                                        placeholder="128 Cocoa Lane, Suite 4, Brussels, BE 1000"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1.5 pt-2">
                                                <Label htmlFor="business_hours">Business & Tasting Room Hours</Label>
                                                <Textarea
                                                    id="business_hours"
                                                    rows={3}
                                                    value={formData['contact.business_hours'] || ''}
                                                    onChange={(e) => updateField('contact.business_hours', e.target.value)}
                                                    placeholder="Mon–Fri: 9:00 AM – 6:00 PM&#10;Sat: 10:00 AM – 4:00 PM&#10;Sun: Closed"
                                                />
                                                <p className="text-[11px] text-muted-foreground">One schedule per line. Displayed on the Contact Us page.</p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Google Maps Embed */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Google Maps Location</CardTitle>
                                            <CardDescription>
                                                Embed an interactive map on the contact and stores page.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="google_maps_embed_url">Google Maps Embed URL / Iframe Source</Label>
                                                <Input
                                                    id="google_maps_embed_url"
                                                    value={formData['contact.google_maps_embed_url'] || ''}
                                                    onChange={(e) => updateField('contact.google_maps_embed_url', e.target.value)}
                                                    placeholder="https://www.google.com/maps/embed?pb=..."
                                                />
                                                <p className="text-[11px] text-muted-foreground">
                                                    Paste the embed URL extracted from Google Maps &gt; Share &gt; Embed a map.
                                                </p>
                                            </div>

                                            {formData['contact.google_maps_embed_url'] && (
                                                <div className="pt-2">
                                                    <Label className="text-xs text-muted-foreground mb-1 block">Live Map Preview</Label>
                                                    <div className="h-56 w-full rounded-xl overflow-hidden border">
                                                        <iframe
                                                            src={formData['contact.google_maps_embed_url']}
                                                            width="100%"
                                                            height="100%"
                                                            style={{ border: 0 }}
                                                            loading="lazy"
                                                            title="Google Maps Preview"
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* ============================================================
                                TAB 3: SOCIAL MEDIA
                            ============================================================ */}
                            {activeTab === 'social' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Social Media Profiles</CardTitle>
                                        <CardDescription>
                                            Connect your brand social accounts to display active links across header and footer.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="social_facebook">Facebook URL</Label>
                                                <Input
                                                    id="social_facebook"
                                                    value={formData['social.facebook'] || ''}
                                                    onChange={(e) => updateField('social.facebook', e.target.value)}
                                                    placeholder="https://facebook.com/yourstore"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="social_instagram">Instagram URL</Label>
                                                <Input
                                                    id="social_instagram"
                                                    value={formData['social.instagram'] || ''}
                                                    onChange={(e) => updateField('social.instagram', e.target.value)}
                                                    placeholder="https://instagram.com/yourstore"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="social_twitter">Twitter / X URL</Label>
                                                <Input
                                                    id="social_twitter"
                                                    value={formData['social.twitter'] || ''}
                                                    onChange={(e) => updateField('social.twitter', e.target.value)}
                                                    placeholder="https://twitter.com/yourstore"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="social_youtube">YouTube Channel</Label>
                                                <Input
                                                    id="social_youtube"
                                                    value={formData['social.youtube'] || ''}
                                                    onChange={(e) => updateField('social.youtube', e.target.value)}
                                                    placeholder="https://youtube.com/@yourstore"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="social_linkedin">LinkedIn Company Page</Label>
                                                <Input
                                                    id="social_linkedin"
                                                    value={formData['social.linkedin'] || ''}
                                                    onChange={(e) => updateField('social.linkedin', e.target.value)}
                                                    placeholder="https://linkedin.com/company/yourstore"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="social_tiktok">TikTok URL</Label>
                                                <Input
                                                    id="social_tiktok"
                                                    value={formData['social.tiktok'] || ''}
                                                    onChange={(e) => updateField('social.tiktok', e.target.value)}
                                                    placeholder="https://tiktok.com/@yourstore"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="social_pinterest">Pinterest URL</Label>
                                                <Input
                                                    id="social_pinterest"
                                                    value={formData['social.pinterest'] || ''}
                                                    onChange={(e) => updateField('social.pinterest', e.target.value)}
                                                    placeholder="https://pinterest.com/yourstore"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* ============================================================
                                TAB 4: LOCALIZATION & REGIONAL
                            ============================================================ */}
                            {activeTab === 'localization' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Regional & Currency Settings</CardTitle>
                                        <CardDescription>
                                            Control default store currency, server timezone, language, and formatting.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Default Currency */}
                                            <div className="space-y-1.5">
                                                <Label htmlFor="default_currency">Default Currency</Label>
                                                <select
                                                    id="default_currency"
                                                    value={formData['localization.default_currency'] || 'USD'}
                                                    onChange={(e) => updateField('localization.default_currency', e.target.value)}
                                                    className="w-full bg-white dark:bg-zinc-900 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                                >
                                                    {currencies.map((c) => (
                                                        <option key={c.id} value={c.code}>
                                                            {c.code} - {c.name} ({c.symbol})
                                                        </option>
                                                    ))}
                                                </select>
                                                <p className="text-[11px] text-muted-foreground">
                                                    Manage exchange rates in <a href="/admin/settings/currencies" className="text-blue-600 underline">Currencies Settings</a>.
                                                </p>
                                            </div>

                                            {/* Timezone */}
                                            <div className="space-y-1.5">
                                                <Label htmlFor="timezone">Timezone</Label>
                                                <select
                                                    id="timezone"
                                                    value={formData['localization.timezone'] || 'UTC'}
                                                    onChange={(e) => updateField('localization.timezone', e.target.value)}
                                                    className="w-full bg-white dark:bg-zinc-900 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                                >
                                                    {timezones.slice(0, 150).map((tz) => (
                                                        <option key={tz} value={tz}>
                                                            {tz}
                                                        </option>
                                                    ))}
                                                </select>
                                                <p className="text-[11px] text-muted-foreground">Controls order dates, logs, and report aggregations.</p>
                                            </div>

                                            {/* Default Locale */}
                                            <div className="space-y-1.5">
                                                <Label htmlFor="default_locale">Primary Language / Locale</Label>
                                                <select
                                                    id="default_locale"
                                                    value={formData['localization.default_locale'] || 'en'}
                                                    onChange={(e) => updateField('localization.default_locale', e.target.value)}
                                                    className="w-full bg-white dark:bg-zinc-900 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                                >
                                                    {Object.entries(locales).map(([code, name]) => (
                                                        <option key={code} value={code}>
                                                            {name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Date Format */}
                                            <div className="space-y-1.5">
                                                <Label htmlFor="date_format">Date Format</Label>
                                                <select
                                                    id="date_format"
                                                    value={formData['localization.date_format'] || 'Y-m-d'}
                                                    onChange={(e) => updateField('localization.date_format', e.target.value)}
                                                    className="w-full bg-white dark:bg-zinc-900 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                                >
                                                    <option value="Y-m-d">YYYY-MM-DD (2026-09-11)</option>
                                                    <option value="m/d/Y">MM/DD/YYYY (09/11/2026)</option>
                                                    <option value="d/m/Y">DD/MM/YYYY (11/09/2026)</option>
                                                    <option value="F j, Y">Month Day, Year (September 11, 2026)</option>
                                                </select>
                                            </div>

                                            {/* Time Format */}
                                            <div className="space-y-1.5">
                                                <Label htmlFor="time_format">Time Format</Label>
                                                <select
                                                    id="time_format"
                                                    value={formData['localization.time_format'] || '12h'}
                                                    onChange={(e) => updateField('localization.time_format', e.target.value)}
                                                    className="w-full bg-white dark:bg-zinc-900 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                                >
                                                    <option value="12h">12-Hour (09:45 PM)</option>
                                                    <option value="24h">24-Hour (21:45)</option>
                                                </select>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* ============================================================
                                TAB 5: HEADER & FOOTER
                            ============================================================ */}
                            {activeTab === 'layout' && (
                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Top Header Announcement Bar</CardTitle>
                                            <CardDescription>
                                                Promote coupon offers, free shipping thresholds, or flash notices.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-center justify-between p-3 border rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="header_announcement_enabled" className="text-sm font-semibold">
                                                        Enable Announcement Bar
                                                    </Label>
                                                    <p className="text-xs text-muted-foreground">Shows a highlighted promo ribbon at the top of the storefront.</p>
                                                </div>
                                                <input
                                                    id="header_announcement_enabled"
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded text-black focus:ring-black cursor-pointer"
                                                    checked={toBoolean(formData['layout.header_announcement_enabled'])}
                                                    onChange={(e) => updateField('layout.header_announcement_enabled', e.target.checked)}
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="header_announcement_text">Announcement Message</Label>
                                                <Input
                                                    id="header_announcement_text"
                                                    value={formData['layout.header_announcement_text'] || ''}
                                                    onChange={(e) => updateField('layout.header_announcement_text', e.target.value)}
                                                    placeholder="Free nationwide shipping on orders above $75! Use code FREESHIP"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="header_announcement_link">Target Destination URL (Optional)</Label>
                                                <Input
                                                    id="header_announcement_link"
                                                    value={formData['layout.header_announcement_link'] || ''}
                                                    onChange={(e) => updateField('layout.header_announcement_link', e.target.value)}
                                                    placeholder="/shop or /flash-sales"
                                                />
                                            </div>

                                            {/* Live Preview */}
                                            {toBoolean(formData['layout.header_announcement_enabled']) && (
                                                <div className="pt-2">
                                                    <Label className="text-xs text-muted-foreground mb-1 block">Live Announcement Preview</Label>
                                                    <div className="bg-[#2a2b30] text-[#facc15] py-2 px-4 rounded-lg text-xs font-semibold text-center flex items-center justify-center gap-2 shadow-xs">
                                                        <Megaphone className="w-3.5 h-3.5" />
                                                        <span>{formData['layout.header_announcement_text'] || 'Free delivery promotion on all orders!'}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Footer Content & Badges</CardTitle>
                                            <CardDescription>
                                                Control footer bio text, newsletter form visibility, and trust badges.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="footer_about_text">Footer Brand Description</Label>
                                                <Textarea
                                                    id="footer_about_text"
                                                    rows={3}
                                                    value={formData['layout.footer_about_text'] || ''}
                                                    onChange={(e) => updateField('layout.footer_about_text', e.target.value)}
                                                    placeholder="Short paragraph describing your atelier in the footer column."
                                                />
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                                                <div className="flex items-center gap-2.5 p-3 border rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
                                                    <input
                                                        id="footer_show_newsletter"
                                                        type="checkbox"
                                                        className="w-4 h-4 rounded text-black focus:ring-black cursor-pointer"
                                                        checked={toBoolean(formData['layout.footer_show_newsletter'])}
                                                        onChange={(e) => updateField('layout.footer_show_newsletter', e.target.checked)}
                                                    />
                                                    <Label htmlFor="footer_show_newsletter" className="text-xs cursor-pointer">
                                                        Show Newsletter Form
                                                    </Label>
                                                </div>

                                                <div className="flex items-center gap-2.5 p-3 border rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
                                                    <input
                                                        id="footer_show_socials"
                                                        type="checkbox"
                                                        className="w-4 h-4 rounded text-black focus:ring-black cursor-pointer"
                                                        checked={toBoolean(formData['layout.footer_show_socials'])}
                                                        onChange={(e) => updateField('layout.footer_show_socials', e.target.checked)}
                                                    />
                                                    <Label htmlFor="footer_show_socials" className="text-xs cursor-pointer">
                                                        Show Social Icons
                                                    </Label>
                                                </div>

                                                <div className="flex items-center gap-2.5 p-3 border rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
                                                    <input
                                                        id="footer_show_payment_methods"
                                                        type="checkbox"
                                                        className="w-4 h-4 rounded text-black focus:ring-black cursor-pointer"
                                                        checked={toBoolean(formData['layout.footer_show_payment_methods'])}
                                                        onChange={(e) => updateField('layout.footer_show_payment_methods', e.target.checked)}
                                                    />
                                                    <Label htmlFor="footer_show_payment_methods" className="text-xs cursor-pointer">
                                                        Show Payment Badges
                                                    </Label>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* ============================================================
                                TAB 6: MAINTENANCE MODE
                            ============================================================ */}
                            {activeTab === 'maintenance' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Maintenance & Downtime Mode</CardTitle>
                                        <CardDescription>
                                            Take the storefront offline for maintenance while keeping admin management and preview bypass open.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-5">
                                        <div className="flex items-center justify-between p-4 border rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
                                            <div className="space-y-0.5">
                                                <div className="flex items-center gap-2">
                                                    <Label htmlFor="maintenance_mode" className="text-base font-bold">
                                                        Activate Maintenance Mode
                                                    </Label>
                                                    {toBoolean(formData['system.maintenance_mode']) ? (
                                                        <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                                            Live Interception Active
                                                        </span>
                                                    ) : (
                                                        <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                                                            Store is Public
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    When enabled, non-admin visitors will see your custom maintenance screen.
                                                </p>
                                            </div>
                                            <input
                                                id="maintenance_mode"
                                                type="checkbox"
                                                className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                                                checked={toBoolean(formData['system.maintenance_mode'])}
                                                onChange={(e) => updateField('system.maintenance_mode', e.target.checked)}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="maintenance_title">Maintenance Page Title</Label>
                                                <Input
                                                    id="maintenance_title"
                                                    value={formData['system.maintenance_title'] || ''}
                                                    onChange={(e) => updateField('system.maintenance_title', e.target.value)}
                                                    placeholder="Crafting Something Special"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="maintenance_bypass_key">Secret Bypass Key / Token</Label>
                                                <div className="flex gap-2">
                                                    <Input
                                                        id="maintenance_bypass_key"
                                                        value={formData['system.maintenance_bypass_key'] || ''}
                                                        onChange={(e) => updateField('system.maintenance_bypass_key', e.target.value)}
                                                        placeholder="e.g. preview-token-secret"
                                                        className="font-mono text-xs"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => {
                                                            const rand = 'secret-' + Math.random().toString(36).substring(2, 10);
                                                            updateField('system.maintenance_bypass_key', rand);
                                                        }}
                                                        className="text-xs shrink-0"
                                                    >
                                                        Generate
                                                    </Button>
                                                </div>
                                                <p className="text-[11px] text-muted-foreground">
                                                    Allows clients or reviewers to view the storefront using the bypass URL.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="maintenance_message">Public Message</Label>
                                            <Textarea
                                                id="maintenance_message"
                                                rows={3}
                                                value={formData['system.maintenance_message'] || ''}
                                                onChange={(e) => updateField('system.maintenance_message', e.target.value)}
                                                placeholder="We are currently upgrading our store experience. We will be back shortly!"
                                            />
                                        </div>

                                        {/* Bypass URL copy helper */}
                                        {formData['system.maintenance_bypass_key'] && (
                                            <div className="p-3.5 border rounded-lg bg-zinc-50 dark:bg-zinc-900 flex items-center justify-between gap-2">
                                                <div className="min-w-0">
                                                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                                                        Direct Bypass Link for Testing
                                                    </span>
                                                    <code className="text-xs font-mono text-zinc-700 dark:text-zinc-300 truncate block">
                                                        {appUrl}/?bypass={formData['system.maintenance_bypass_key']}
                                                    </code>
                                                </div>
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    variant="secondary"
                                                    className="text-xs shrink-0"
                                                    onClick={() =>
                                                        copyToClipboard(
                                                            `${appUrl}/?bypass=${formData['system.maintenance_bypass_key']}`,
                                                            'Bypass URL'
                                                        )
                                                    }
                                                >
                                                    <Copy className="w-3.5 h-3.5 mr-1" />
                                                    Copy
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            )}

                            {/* ============================================================
                                TAB 7: SEO & ANALYTICS
                            ============================================================ */}
                            {activeTab === 'analytics' && (
                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Tracking & Analytics Integrations</CardTitle>
                                            <CardDescription>
                                                Connect Google Analytics, Tag Manager, and Meta/Facebook Pixel tracking scripts.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <Label htmlFor="google_analytics_id">Google Analytics 4 (GA4) Measurement ID</Label>
                                                    <Input
                                                        id="google_analytics_id"
                                                        value={formData['analytics.google_analytics_id'] || ''}
                                                        onChange={(e) => updateField('analytics.google_analytics_id', e.target.value)}
                                                        placeholder="G-XXXXXXXXXX"
                                                        className="font-mono text-xs"
                                                    />
                                                    <p className="text-[11px] text-muted-foreground">Injected automatically into site &lt;head&gt;.</p>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <Label htmlFor="google_tag_manager_id">Google Tag Manager (GTM) Container ID</Label>
                                                    <Input
                                                        id="google_tag_manager_id"
                                                        value={formData['analytics.google_tag_manager_id'] || ''}
                                                        onChange={(e) => updateField('analytics.google_tag_manager_id', e.target.value)}
                                                        placeholder="GTM-XXXXXXX"
                                                        className="font-mono text-xs"
                                                    />
                                                    <p className="text-[11px] text-muted-foreground">Includes both head script and body noscript fallback.</p>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <Label htmlFor="facebook_pixel_id">Meta / Facebook Pixel ID</Label>
                                                    <Input
                                                        id="facebook_pixel_id"
                                                        value={formData['analytics.facebook_pixel_id'] || ''}
                                                        onChange={(e) => updateField('analytics.facebook_pixel_id', e.target.value)}
                                                        placeholder="e.g. 1234567890123456"
                                                        className="font-mono text-xs"
                                                    />
                                                </div>

                                                <div className="space-y-1.5">
                                                    <Label htmlFor="meta_author">Meta Author</Label>
                                                    <Input
                                                        id="meta_author"
                                                        value={formData['analytics.meta_author'] || ''}
                                                        onChange={(e) => updateField('analytics.meta_author', e.target.value)}
                                                        placeholder="e.g. StoreHub Atelier"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-1.5 pt-2">
                                                <Label htmlFor="meta_keywords">Default Meta Keywords</Label>
                                                <Input
                                                    id="meta_keywords"
                                                    value={formData['analytics.meta_keywords'] || ''}
                                                    onChange={(e) => updateField('analytics.meta_keywords', e.target.value)}
                                                    placeholder="artisan chocolates, gourmet gifts, online boutique"
                                                />
                                                <p className="text-[11px] text-muted-foreground">Comma-separated keywords for search indexing.</p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Live Google Search Snippet Preview */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Live Search Snippet & Social Previews</CardTitle>
                                            <CardDescription>
                                                Real-time visualization of how your store appears on Google and social media cards.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {/* Google Mockup */}
                                            <div>
                                                <span className="text-xs font-semibold text-muted-foreground mb-2 block">Google Search Result Mockup</span>
                                                <div className="p-4 border rounded-xl bg-white text-left max-w-xl shadow-xs">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center overflow-hidden border">
                                                            {currentFavicon ? (
                                                                <img src={currentFavicon} alt="" className="w-4 h-4 object-contain" />
                                                            ) : (
                                                                <Globe className="w-3.5 h-3.5 text-zinc-400" />
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-xs text-zinc-800 font-medium leading-none">{siteTitle}</span>
                                                            <span className="text-[10px] text-zinc-500 font-mono">{appUrl}</span>
                                                        </div>
                                                    </div>
                                                    <h3 className="text-blue-700 hover:underline text-lg font-medium cursor-pointer leading-snug">
                                                        {siteTitle} — {siteTagline}
                                                    </h3>
                                                    <p className="text-zinc-600 text-xs mt-1 leading-relaxed line-clamp-2">
                                                        {siteDesc}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Social Card Mockup */}
                                            <div>
                                                <span className="text-xs font-semibold text-muted-foreground mb-2 block">Facebook / Twitter Social Share Card</span>
                                                <div className="border rounded-2xl overflow-hidden max-w-md bg-white shadow-xs">
                                                    <div className="h-44 bg-zinc-100 flex items-center justify-center overflow-hidden border-b">
                                                        {currentOgImage ? (
                                                            <img src={currentOgImage} alt="OG Card" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="text-zinc-400 flex flex-col items-center">
                                                                <Share2 className="w-8 h-8 mb-1" />
                                                                <span className="text-xs">No OG Image Set</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="p-3.5 bg-zinc-50">
                                                        <span className="text-[10px] uppercase font-mono text-zinc-400 tracking-wider">
                                                            {appUrl.replace(/^https?:\/\//, '')}
                                                        </span>
                                                        <h4 className="text-sm font-bold text-zinc-900 mt-0.5 truncate">{siteTitle}</h4>
                                                        <p className="text-xs text-zinc-500 truncate mt-0.5">{siteDesc}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* ============================================================
                                TAB 8: SMTP & MAIL
                            ============================================================ */}
                            {activeTab === 'mail' && (
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle>SMTP & Outgoing Mail Settings</CardTitle>
                                            <CardDescription>
                                                Configure mail transport credentials for order receipts, password resets, and notifications.
                                            </CardDescription>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setTestEmailModalOpen(true)}
                                            className="text-xs shrink-0"
                                        >
                                            <Send className="w-3.5 h-3.5 mr-1.5" />
                                            Send Test Email
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="mail_mailer">Mail Driver</Label>
                                                <select
                                                    id="mail_mailer"
                                                    value={formData['mail.mail_mailer'] || 'smtp'}
                                                    onChange={(e) => updateField('mail.mail_mailer', e.target.value)}
                                                    className="w-full bg-white dark:bg-zinc-900 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                                >
                                                    <option value="smtp">SMTP</option>
                                                    <option value="sendmail">Sendmail</option>
                                                    <option value="log">Log (Testing Only)</option>
                                                </select>
                                            </div>

                                            <div className="space-y-1.5 md:col-span-2">
                                                <Label htmlFor="mail_host">SMTP Host Server</Label>
                                                <Input
                                                    id="mail_host"
                                                    value={formData['mail.mail_host'] || ''}
                                                    onChange={(e) => updateField('mail.mail_host', e.target.value)}
                                                    placeholder="smtp.mailtrap.io or smtp.gmail.com"
                                                    className="font-mono text-xs"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="mail_port">SMTP Port</Label>
                                                <Input
                                                    id="mail_port"
                                                    value={formData['mail.mail_port'] || ''}
                                                    onChange={(e) => updateField('mail.mail_port', e.target.value)}
                                                    placeholder="587 / 465 / 2525"
                                                    className="font-mono text-xs"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="mail_encryption">Encryption Protocol</Label>
                                                <select
                                                    id="mail_encryption"
                                                    value={formData['mail.mail_encryption'] || 'tls'}
                                                    onChange={(e) => updateField('mail.mail_encryption', e.target.value)}
                                                    className="w-full bg-white dark:bg-zinc-900 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                                >
                                                    <option value="tls">TLS (Port 587)</option>
                                                    <option value="ssl">SSL (Port 465)</option>
                                                    <option value="none">None / Plain</option>
                                                </select>
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="mail_username">SMTP Username</Label>
                                                <Input
                                                    id="mail_username"
                                                    value={formData['mail.mail_username'] || ''}
                                                    onChange={(e) => updateField('mail.mail_username', e.target.value)}
                                                    placeholder="smtp-user"
                                                    className="font-mono text-xs"
                                                />
                                            </div>

                                            <div className="space-y-1.5 md:col-span-2">
                                                <Label htmlFor="mail_password">SMTP Password</Label>
                                                <div className="relative">
                                                    <Input
                                                        id="mail_password"
                                                        type={showPassword ? 'text' : 'password'}
                                                        value={formData['mail.mail_password'] || ''}
                                                        onChange={(e) => updateField('mail.mail_password', e.target.value)}
                                                        placeholder="••••••••••••"
                                                        className="font-mono text-xs pr-9"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                                                    >
                                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <Separator className="my-2" />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="mail_from_address">From Email Address</Label>
                                                <Input
                                                    id="mail_from_address"
                                                    type="email"
                                                    value={formData['mail.mail_from_address'] || ''}
                                                    onChange={(e) => updateField('mail.mail_from_address', e.target.value)}
                                                    placeholder="noreply@storehub.com"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="mail_from_name">From Sender Name</Label>
                                                <Input
                                                    id="mail_from_name"
                                                    value={formData['mail.mail_from_name'] || ''}
                                                    onChange={(e) => updateField('mail.mail_from_name', e.target.value)}
                                                    placeholder="StoreHub Order Team"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* ============================================================
                                TAB 9: CUSTOM CODE (CSS / JS)
                            ============================================================ */}
                            {activeTab === 'custom_code' && (
                                <div className="space-y-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Custom Styling (CSS)</CardTitle>
                                            <CardDescription>
                                                Add custom CSS styles that will be loaded globally across all storefront pages.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="custom_css" className="font-mono text-xs">
                                                    Custom CSS Rules
                                                </Label>
                                                <Textarea
                                                    id="custom_css"
                                                    rows={6}
                                                    value={formData['custom_code.custom_css'] || ''}
                                                    onChange={(e) => updateField('custom_code.custom_css', e.target.value)}
                                                    placeholder="/* Example: body { font-family: 'Poppins', sans-serif; } */"
                                                    className="font-mono text-xs bg-zinc-900 text-zinc-100 dark:bg-black"
                                                />
                                                <p className="text-[11px] text-muted-foreground">
                                                    Do not include &lt;style&gt; tags. They are injected automatically into &lt;head&gt;.
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Custom Header & Footer JavaScript</CardTitle>
                                            <CardDescription>
                                                Embed tracking tags, live chat widgets, or marketing verification scripts.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="custom_header_js" className="font-mono text-xs">
                                                    Head Scripts (&lt;head&gt;)
                                                </Label>
                                                <Textarea
                                                    id="custom_header_js"
                                                    rows={5}
                                                    value={formData['custom_code.custom_header_js'] || ''}
                                                    onChange={(e) => updateField('custom_code.custom_header_js', e.target.value)}
                                                    placeholder="<!-- Injected before </head> -->"
                                                    className="font-mono text-xs bg-zinc-900 text-zinc-100 dark:bg-black"
                                                />
                                            </div>

                                            <div className="space-y-1.5 pt-2">
                                                <Label htmlFor="custom_footer_js" className="font-mono text-xs">
                                                    Body Scripts (before &lt;/body&gt;)
                                                </Label>
                                                <Textarea
                                                    id="custom_footer_js"
                                                    rows={5}
                                                    value={formData['custom_code.custom_footer_js'] || ''}
                                                    onChange={(e) => updateField('custom_code.custom_footer_js', e.target.value)}
                                                    placeholder="<!-- Injected before </body> -->"
                                                    className="font-mono text-xs bg-zinc-900 text-zinc-100 dark:bg-black"
                                                />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {/* ============================================================
                                TAB 10: STORE & CHECKOUT DEFAULTS
                            ============================================================ */}
                            {activeTab === 'ecommerce' && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Catalog & Checkout Rules</CardTitle>
                                        <CardDescription>
                                            Configure ordering rules, inventory thresholds, and privacy compliance.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-5">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="minimum_order_amount">Minimum Order Amount ($)</Label>
                                                <Input
                                                    id="minimum_order_amount"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={formData['ecommerce.minimum_order_amount'] ?? 0}
                                                    onChange={(e) =>
                                                        updateField('ecommerce.minimum_order_amount', parseFloat(e.target.value) || 0)
                                                    }
                                                />
                                                <p className="text-[11px] text-muted-foreground">Set to 0 to disable minimum checkout amount.</p>
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="order_id_prefix">Order ID Prefix</Label>
                                                <Input
                                                    id="order_id_prefix"
                                                    value={formData['ecommerce.order_id_prefix'] || 'SH-'}
                                                    onChange={(e) => updateField('ecommerce.order_id_prefix', e.target.value)}
                                                    placeholder="e.g. SH- or ORD-"
                                                    className="font-mono text-xs"
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="products_per_page">Products Displayed Per Page</Label>
                                                <select
                                                    id="products_per_page"
                                                    value={formData['ecommerce.products_per_page'] || 12}
                                                    onChange={(e) => updateField('ecommerce.products_per_page', parseInt(e.target.value, 10))}
                                                    className="w-full bg-white dark:bg-zinc-900 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                                                >
                                                    <option value={8}>8 products</option>
                                                    <option value={12}>12 products</option>
                                                    <option value={24}>24 products</option>
                                                    <option value={48}>48 products</option>
                                                </select>
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="inventory_low_stock_threshold">Low Stock Warning Threshold</Label>
                                                <Input
                                                    id="inventory_low_stock_threshold"
                                                    type="number"
                                                    min="0"
                                                    value={formData['ecommerce.inventory_low_stock_threshold'] ?? 5}
                                                    onChange={(e) =>
                                                        updateField('ecommerce.inventory_low_stock_threshold', parseInt(e.target.value, 10) || 0)
                                                    }
                                                />
                                                <p className="text-[11px] text-muted-foreground">Alerts inventory managers when stock drops below this count.</p>
                                            </div>
                                        </div>

                                        <Separator />

                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-3 border rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="enable_guest_checkout" className="text-sm font-semibold">
                                                        Allow Guest Checkout
                                                    </Label>
                                                    <p className="text-xs text-muted-foreground">
                                                        Customers can purchase without creating a registered account.
                                                    </p>
                                                </div>
                                                <input
                                                    id="enable_guest_checkout"
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded text-black focus:ring-black cursor-pointer"
                                                    checked={toBoolean(formData['ecommerce.enable_guest_checkout'])}
                                                    onChange={(e) => updateField('ecommerce.enable_guest_checkout', e.target.checked)}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between p-3 border rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
                                                <div className="space-y-0.5">
                                                    <Label htmlFor="cookie_consent_enabled" className="text-sm font-semibold">
                                                        Show Cookie Consent Banner
                                                    </Label>
                                                    <p className="text-xs text-muted-foreground">
                                                        Displays GDPR / privacy policy consent ribbon on first visit.
                                                    </p>
                                                </div>
                                                <input
                                                    id="cookie_consent_enabled"
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded text-black focus:ring-black cursor-pointer"
                                                    checked={toBoolean(formData['ecommerce.cookie_consent_enabled'])}
                                                    onChange={(e) => updateField('ecommerce.cookie_consent_enabled', e.target.checked)}
                                                />
                                            </div>

                                            {toBoolean(formData['ecommerce.cookie_consent_enabled']) && (
                                                <div className="space-y-1.5 pt-2">
                                                    <Label htmlFor="cookie_consent_message">Cookie Notice Message</Label>
                                                    <Input
                                                        id="cookie_consent_message"
                                                        value={formData['ecommerce.cookie_consent_message'] || ''}
                                                        onChange={(e) => updateField('ecommerce.cookie_consent_message', e.target.value)}
                                                        placeholder="We use cookies to deliver a tailored shopping experience."
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Sticky Save Bar (Floating when dirty) */}
                            {isDirty && (
                                <div className="sticky bottom-6 z-40 p-4 rounded-2xl bg-[#2a2b30] text-white shadow-xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                                        <span className="text-xs sm:text-sm font-semibold">
                                            You have unsaved site configuration changes.
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={handleReset}
                                            disabled={isSaving}
                                            className="text-white hover:text-white hover:bg-white/10 text-xs"
                                        >
                                            Discard
                                        </Button>
                                        <Button
                                            type="submit"
                                            size="sm"
                                            disabled={isSaving}
                                            className="bg-[#facc15] hover:bg-amber-400 text-black font-bold text-xs"
                                        >
                                            {isSaving ? (
                                                <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                            ) : (
                                                <Save className="w-3.5 h-3.5 mr-1.5" />
                                            )}
                                            Save Changes
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>

            {/* Test Email Modal */}
            {testEmailModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-zinc-900 border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Mail className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
                                <h3 className="text-base font-bold">Send Test Email</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setTestEmailModalOpen(false)}
                                className="text-muted-foreground hover:text-foreground text-sm font-bold"
                            >
                                ✕
                            </button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Enter an email address below. We will send a test message using your currently configured SMTP server to verify everything works.
                        </p>
                        <form onSubmit={handleSendTestEmail} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="test_recipient">Recipient Email</Label>
                                <Input
                                    id="test_recipient"
                                    type="email"
                                    required
                                    placeholder="your-email@example.com"
                                    value={testEmailAddress}
                                    onChange={(e) => setTestEmailAddress(e.target.value)}
                                    className="text-xs"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setTestEmailModalOpen(false)}
                                    disabled={isSendingTestEmail}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={isSendingTestEmail}
                                    className="bg-[#2a2b30] text-white hover:bg-black dark:bg-zinc-100 dark:text-zinc-900"
                                >
                                    {isSendingTestEmail ? (
                                        <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                                    ) : (
                                        <Send className="w-3.5 h-3.5 mr-1.5" />
                                    )}
                                    Send Email
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

AdminSettingsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/admin/dashboard' },
        { title: 'Settings', href: '/admin/settings' },
        { title: 'Site Configuration', href: '/admin/settings' },
    ],
};
