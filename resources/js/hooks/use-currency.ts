import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export type Currency = {
    id: number;
    code: string;
    name: string;
    symbol: string;
    exchange_rate: number;
    is_default?: boolean;
};

const DEFAULT_CURRENCY: Currency = {
    id: 1,
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    exchange_rate: 1.0,
    is_default: true,
};

// Global reactive listener set to instantly synchronize all useCurrency hook instances
const listeners = new Set<(code: string) => void>();

function notifyCurrencyChange(code: string): void {
    listeners.forEach((listener) => listener(code));
}

export function useCurrency() {
    const { currencies, currentCurrency } = usePage<any>().props;

    const availableCurrencies: Currency[] = currencies?.length ? currencies : [DEFAULT_CURRENCY];
    const serverCurrency: Currency = currentCurrency || DEFAULT_CURRENCY;

    // Local state enables instant reactive changes before server roundtrip
    const [selectedCode, setSelectedCode] = useState<string>(() => {
        if (typeof window !== 'undefined') {
            try {
                const stored = localStorage.getItem('selected_currency');
                if (stored && availableCurrencies.some((c) => c.code === stored)) {
                    return stored;
                }
            } catch (_) {
                // Ignore storage errors
            }
        }
        return serverCurrency.code;
    });

    // Keep in sync when Inertia delivers new server props
    useEffect(() => {
        if (serverCurrency?.code && serverCurrency.code !== selectedCode) {
            setSelectedCode(serverCurrency.code);
            try {
                localStorage.setItem('selected_currency', serverCurrency.code);
            } catch (_) {}
        }
    }, [serverCurrency?.code]);

    // Listen to currency changes made by other components on the page
    useEffect(() => {
        const handler = (code: string) => {
            setSelectedCode(code);
        };
        listeners.add(handler);
        return () => {
            listeners.delete(handler);
        };
    }, []);

    const activeCurrency: Currency =
        availableCurrencies.find((c) => c.code === selectedCode) || serverCurrency || DEFAULT_CURRENCY;

    const convertPrice = (amount: number | string | null | undefined): number => {
        if (amount === null || amount === undefined || isNaN(Number(amount))) {
            return 0;
        }
        const numeric = Number(amount);
        const rate = Number(activeCurrency.exchange_rate) > 0 ? Number(activeCurrency.exchange_rate) : 1.0;
        return numeric * rate;
    };

    const formatPrice = (amount: number | string | null | undefined): string => {
        const converted = convertPrice(amount);
        const symbol = activeCurrency.symbol || '$';
        const formatted = converted.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        return `${symbol}${formatted}`;
    };

    const switchCurrency = (currencyCode: string) => {
        if (currencyCode === activeCurrency.code) return;

        // 1. Instant client update across all components
        setSelectedCode(currencyCode);
        notifyCurrencyChange(currencyCode);

        // 2. Set document cookie immediately for subsequent requests
        if (typeof document !== 'undefined') {
            document.cookie = `selected_currency=${currencyCode}; path=/; max-age=31536000; SameSite=Lax`;
        }
        try {
            localStorage.setItem('selected_currency', currencyCode);
        } catch (_) {}

        // 3. Post to backend so session and server-side state are preserved
        router.post(
            '/currency',
            { currency: currencyCode },
            {
                preserveScroll: true,
                preserveState: false,
            },
        );
    };

    return {
        currencies: availableCurrencies,
        currentCurrency: activeCurrency,
        formatPrice,
        convertPrice,
        switchCurrency,
    };
}
