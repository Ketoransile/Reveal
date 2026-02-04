"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Check, Zap, Shield, Crown } from "lucide-react";
import { useState } from "react";

interface PricingModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PricingModal({ open, onOpenChange }: PricingModalProps) {
    const [loading, setLoading] = useState(false);

    const handleUpgrade = () => {
        setLoading(true);
        // Mock Stripe Checkout
        setTimeout(() => {
            setLoading(false);
            onOpenChange(false);
            window.alert("In a real app, this would redirect to Stripe Checkout.");
        }, 1000);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[900px] bg-slate-50 dark:bg-slate-900 p-0 overflow-hidden border-0 shadow-2xl">
                <div className="grid md:grid-cols-2">

                    {/* Free Plan (Left) */}
                    <div className="p-6 md:p-10 bg-white dark:bg-slate-950 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
                        <div>
                            <div className="inline-block p-2 rounded-lg bg-slate-100 text-slate-600 mb-4">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Starter</h3>
                            <p className="text-slate-500 mb-6">Perfect for trying out the tool.</p>
                            <div className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
                                Free<span className="text-base font-normal text-slate-500">/forever</span>
                            </div>

                            <ul className="space-y-4">
                                {[
                                    "3 Competitor Analyses",
                                    "Basic Conversion Scores",
                                    "Standard Support",
                                    "Community Access"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                                        <Check className="w-5 h-5 text-slate-300" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Button variant="outline" className="mt-8 w-full" disabled>
                            Current Plan
                        </Button>
                    </div>

                    {/* Pro Plan (Right - Highlighted) */}
                    <div className="p-6 md:p-10 bg-slate-900 dark:bg-slate-900 text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-32 bg-emerald-500/20 blur-[80px] rounded-full pointer-events-none" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="inline-block p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                    <Crown className="w-6 h-6" />
                                </div>
                                <div className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold tracking-wider uppercase">
                                    Recommended
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-white mb-2">Pro Business</h3>
                            <p className="text-slate-400 mb-6">Dominate your market.</p>
                            <div className="text-4xl font-bold text-white mb-8">
                                $29<span className="text-base font-normal text-slate-400">/month</span>
                            </div>

                            <ul className="space-y-4">
                                {[
                                    "Unlimited Comparisons",
                                    "Deep Dive AI Analysis",
                                    "Export to PDF",
                                    "Priority Email Support",
                                    "Strategy War Room Access"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-200">
                                        <div className="p-0.5 rounded-full bg-emerald-500 text-white">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <Button
                            onClick={handleUpgrade}
                            disabled={loading}
                            className="mt-8 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold h-12 relative z-10"
                        >
                            {loading ? "Processing..." : "Upgrade to Pro"}
                        </Button>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}
