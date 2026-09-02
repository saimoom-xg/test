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

                        return;
                    }

                    router.visit('/admin');
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

            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Icon className="h-5 w-5" />
                        {step === 'identifier' ? 'Sign in or create an account' : 'Enter the code'}
                    </CardTitle>
                    <CardDescription>
                        {step === 'identifier'
                            ? 'Passwordless sign-in. Enter your email or phone and we will send you a one-time code.'
                            : `We sent a 6-digit code to ${identifier}. Enter it below to continue.`}
                    </CardDescription>
                </CardHeader>

                    {step === 'identifier' ? (
                        <form onSubmit={requestOtp}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="identifier">Email or phone</Label>
                                    <Input
                                        id="identifier"
                                        autoFocus
                                        autoComplete="username"
                                        placeholder="you@example.com or +15551234567"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        required
                                    />
                                    <InputError message={error} />
                                </div>
                                <p className="text-muted-foreground text-xs">
                                    No account yet? We will create one automatically — no separate sign-up needed.
                                </p>
                                {status ? (
                                    <p className="text-sm font-medium text-emerald-600">{status}</p>
                                ) : null}
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={sending || identifier.length < 3} className="w-full">
                                    {sending ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Send code
                                </Button>
                            </CardFooter>
                        </form>
                    ) : (
                        <form onSubmit={verifyOtp}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="code">6-digit code</Label>
                                    <InputOTP
                                        id="code"
                                        maxLength={6}
                                        value={code}
                                        onChange={setCode}
                                        autoFocus
                                    >
                                        <InputOTPGroup className="w-full justify-between gap-2">
                                            <InputOTPSlot index={0} className="h-12 w-12 text-lg" />
                                            <InputOTPSlot index={1} className="h-12 w-12 text-lg" />
                                            <InputOTPSlot index={2} className="h-12 w-12 text-lg" />
                                            <InputOTPSlot index={3} className="h-12 w-12 text-lg" />
                                            <InputOTPSlot index={4} className="h-12 w-12 text-lg" />
                                            <InputOTPSlot index={5} className="h-12 w-12 text-lg" />
                                        </InputOTPGroup>
                                    </InputOTP>
                                    <input type="hidden" name="code" value={code} />
                                    <InputError message={error} />
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setStep('identifier');
                                            setCode('');
                                            setError(null);
                                        }}
                                        className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
                                    >
                                        Use a different email/phone
                                    </button>

                                    <button
                                        type="button"
                                        onClick={resend}
                                        disabled={cooldown > 0}
                                        className="text-muted-foreground hover:text-foreground underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend code'}
                                    </button>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    type="submit"
                                    disabled={verifying || code.length < 6}
                                    className="w-full"
                                >
                                    {verifying ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    Verify and continue
                                </Button>
                            </CardFooter>
                        </form>
                    )}
                </Card>
        </>
    );
}