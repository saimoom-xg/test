import { Head, router, usePage } from '@inertiajs/react';
import OtpLoginController from '@/actions/App/Http/Controllers/Web/Auth/OtpLoginController';
import { LoaderCircle, Mail, Phone } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';

type Step = 'identifier' | 'code';

type OtpResponse = {
    identifier: string;
    channel: 'email' | 'phone';
    expires_at?: string;
    resend_cooldown: number;
    cooldown_active?: boolean;
};

type Props = {
    status?: string;
};

export default function OtpLogin({ status }: Props) {
    const { props } = usePage<{ otp?: OtpResponse }>();
    const initialOtp = props.otp;
    const [step, setStep] = useState<Step>(initialOtp ? 'code' : 'identifier');
    const [identifier, setIdentifier] = useState('');
    const [channel, setChannel] = useState<'email' | 'phone'>('email');
    const [code, setCode] = useState('');
    const [sending, setSending] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [cooldown, setCooldown] = useState(initialOtp?.resend_cooldown ?? 0);
    const [error, setError] = useState<string | null>(null);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        if (cooldown <= 0) {
            return;
        }
        timerRef.current = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
        return () => {
            if (timerRef.current) {
                window.clearTimeout(timerRef.current);
            }
        };
    }, [cooldown]);

    const detectChannel = (value: string): 'email' | 'phone' =>
        value.includes('@') ? 'email' : 'phone';

    const requestOtp = async (e?: React.FormEvent): Promise<void> => {
        e?.preventDefault();
        setError(null);
        setSending(true);

        const detected = detectChannel(identifier);
        setChannel(detected);

        router.post(
            OtpLoginController.requestOtp.url(),
            { identifier: identifier.trim(), channel: detected },
            {
                preserveScroll: true,
                onSuccess: (page) => {
                    const data = (page.props as { otp?: OtpResponse }).otp;
                    if (data) {
                        if (data.cooldown_active) {
                            setError('Please wait before requesting another code.');
                            setCooldown(data.resend_cooldown ?? 60);
                        } else {
                            if (data.identifier) {
                                setIdentifier(data.identifier);
                            }
                            if (data.channel) {
                                setChannel(data.channel);
                            }
                            setStep('code');
                            setCooldown(data.resend_cooldown ?? 60);
                        }
                    }
                },
                onError: (errors) => {
                    const first = Object.values(errors)[0] as string | undefined;
                    setError(first ?? 'Unable to send OTP.');
                },
                onFinish: () => setSending(false),
            },
        );
    };

    const verifyOtp = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setError(null);
        setVerifying(true);

        router.post(
            OtpLoginController.verifyOtp.url(),
            { identifier: identifier.trim(), channel, code },
            {
                onSuccess: (page) => {
                    const props = page.props as { errors?: Record<string, string[]> };
                    const codeErrors = props.errors?.code;
                    if (codeErrors && codeErrors.length > 0) {
                        setError(codeErrors[0]);
                        setVerifying(false);
                    }
                },
                onError: (errors) => {
                    const first = Object.values(errors)[0] as string | undefined;
                    setError(first ?? 'Invalid or expired code.');
                    setVerifying(false);
                },
                onFinish: () => setVerifying(false),
            },
        );
    };

    const resend = (): void => {
        if (cooldown > 0) {
            return;
        }
        setCode('');
        void requestOtp();
    };

    const Icon = channel === 'email' ? Mail : Phone;

    return (
        <>
            <Head title="Sign in" />

            <div className="flex flex-col gap-6 w-full">
                <div className="flex flex-col items-center text-center space-y-2 mb-2">
                    <h1 className="text-[28px] font-bold tracking-tight text-[#2a2b30]">
                        {step === 'identifier' ? 'Log in to your account' : 'Enter the code'}
                    </h1>
                    <p className="text-[14px] font-medium text-[#8e8d89]">
                        {step === 'identifier'
                            ? 'Enter your email or phone below to log in'
                            : `We sent a 6-digit code to ${identifier}. Enter it below.`}
                    </p>
                </div>

                {step === 'identifier' ? (
                    <form onSubmit={requestOtp} className="flex flex-col gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="identifier" className="text-[13px] font-bold text-[#2a2b30] ml-2">Email or phone</Label>
                            <Input
                                id="identifier"
                                autoFocus
                                autoComplete="username"
                                placeholder="you@example.com or +15551234567"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                required
                                className="bg-white rounded-[24px] shadow-sm border-none px-6 py-6 mt-2 text-[15px] font-medium text-gray-700 placeholder:text-[#a8a7a2] focus-visible:ring-2 focus-visible:ring-black/10"
                            />
                            <InputError message={error} />
                        </div>
                        
                        {status && (
                            <p className="text-sm font-medium text-emerald-600 mb-1">{status}</p>
                        )}
                        
                        <Button type="submit" disabled={sending || identifier.length < 3} className="w-full mt-2 bg-[#2a2b30] text-white rounded-[24px] font-bold text-[14px] py-6 hover:bg-black transition-colors shadow-sm">
                            {sending ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Send code
                        </Button>

                        <p className="text-[#8e8d89] font-medium text-center text-xs mt-4">
                            No account yet? We will create one automatically.
                        </p>
                    </form>
                ) : (
                    <form onSubmit={verifyOtp} className="flex flex-col gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="code" className="sr-only">6-digit code</Label>
                            <InputOTP
                                id="code"
                                maxLength={6}
                                value={code}
                                onChange={setCode}
                                autoFocus
                                containerClassName="justify-center"
                            >
                                <InputOTPGroup className="gap-2 sm:gap-3 w-full justify-center">
                                    <InputOTPSlot index={0} className="h-12 w-12 sm:h-14 sm:w-14 !rounded-[16px] bg-white !border-none shadow-sm text-xl font-bold text-[#2a2b30] focus-visible:ring-2 focus-visible:ring-black/10 ring-offset-0" />
                                    <InputOTPSlot index={1} className="h-12 w-12 sm:h-14 sm:w-14 !rounded-[16px] bg-white !border-none shadow-sm text-xl font-bold text-[#2a2b30] focus-visible:ring-2 focus-visible:ring-black/10 ring-offset-0" />
                                    <InputOTPSlot index={2} className="h-12 w-12 sm:h-14 sm:w-14 !rounded-[16px] bg-white !border-none shadow-sm text-xl font-bold text-[#2a2b30] focus-visible:ring-2 focus-visible:ring-black/10 ring-offset-0" />
                                    <InputOTPSlot index={3} className="h-12 w-12 sm:h-14 sm:w-14 !rounded-[16px] bg-white !border-none shadow-sm text-xl font-bold text-[#2a2b30] focus-visible:ring-2 focus-visible:ring-black/10 ring-offset-0" />
                                    <InputOTPSlot index={4} className="h-12 w-12 sm:h-14 sm:w-14 !rounded-[16px] bg-white !border-none shadow-sm text-xl font-bold text-[#2a2b30] focus-visible:ring-2 focus-visible:ring-black/10 ring-offset-0" />
                                    <InputOTPSlot index={5} className="h-12 w-12 sm:h-14 sm:w-14 !rounded-[16px] bg-white !border-none shadow-sm text-xl font-bold text-[#2a2b30] focus-visible:ring-2 focus-visible:ring-black/10 ring-offset-0" />
                                </InputOTPGroup>
                            </InputOTP>
                            <input type="hidden" name="code" value={code} />
                            <InputError message={error} />
                        </div>

                        <Button
                            type="submit"
                            disabled={verifying || code.length < 6}
                            className="w-full mt-4 bg-[#2a2b30] text-white rounded-[24px] font-bold text-[14px] py-6 hover:bg-black transition-colors shadow-sm"
                        >
                            {verifying ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Verify and continue
                        </Button>

                        <div className="flex flex-col items-center justify-center gap-3 text-[13px] font-medium mt-6">
                            <button
                                type="button"
                                onClick={resend}
                                disabled={cooldown > 0}
                                className="text-[#8e8d89] hover:text-[#2a2b30] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setStep('identifier');
                                    setCode('');
                                    setError(null);
                                }}
                                className="text-[#8e8d89] hover:text-[#2a2b30] transition-colors"
                            >
                                Use a different email or phone
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
}