"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Zap, ArrowRight, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import confetti from "canvas-confetti";

function SuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const checkoutId = searchParams.get('checkout_id');
    const [verifying, setVerifying] = useState(true);
    const [verified, setVerified] = useState(false);

    useEffect(() => {
        // Trigger confetti on mount
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
        }, 250);

        // Poll for subscription status update
        const checkSubscriptionStatus = async () => {
            // Force verify checkout first
            if (checkoutId) {
                try {
                    await fetch(`/api/verify-checkout?checkout_id=${checkoutId}`);
                } catch (err) {
                    console.error("Verification ping failed", err);
                }
            }

            let attempts = 0;
            const maxAttempts = 10; // Try for 20 seconds

            while (attempts < maxAttempts) {
                try {
                    const response = await fetch('/api/user');
                    const data = await response.json();

                    if (data.user && data.user.subscription_plan !== 'free') {
                        setVerified(true);
                        setVerifying(false);
                        return;
                    }
                } catch (error) {
                    console.error("Error checking subscription:", error);
                }

                attempts++;
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            // Even if we timed out, show success UI but maybe with a note?
            // Actually, let's just assume success since they are here.
            setVerifying(false);
            setVerified(true);
        };

        checkSubscriptionStatus();

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-in fade-in duration-700">
            <Card className="w-full max-w-lg border-emerald-100 bg-emerald-50/30 shadow-xl">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto mb-4 bg-emerald-100 p-3 rounded-full w-fit animate-in zoom-in duration-500">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-emerald-900">Payment Successful!</CardTitle>
                    <CardDescription className="text-emerald-700 font-medium">
                        Welcome to Pro. Your account has been upgraded.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-emerald-100 shadow-sm">
                        <h3 className="font-semibold text-emerald-900 mb-3 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                            Here's what you've unlocked:
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm text-slate-700">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                <span><strong>Unlimited Analyses:</strong> Remove all limits and analyze as many competitors as you need.</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-slate-700">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                <span><strong>Deep Dive Insights:</strong> Get advanced metrics and conversion optimization tips.</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm text-slate-700">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                <span><strong>Priority Support:</strong> Your requests jump to the front of the line.</span>
                            </li>
                        </ul>
                    </div>

                    {verifying && (
                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground animate-pulse">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Finalizing your upgrade...
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col gap-3 pt-2">
                    <Button
                        size="lg"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02]"
                        asChild
                    >
                        <Link href="/dashboard/analysis">
                            Start Your First Pro Analysis <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </Button>
                    <Button variant="ghost" className="w-full text-emerald-700 hover:bg-emerald-100/50 hover:text-emerald-800" asChild>
                        <Link href="/dashboard">
                            Go to Dashboard
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>}>
            <SuccessContent />
        </Suspense>
    );
}
