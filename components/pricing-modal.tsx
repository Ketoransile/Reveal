"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Check, Shield, Crown, X } from "lucide-react";
import { useState } from "react";

interface PricingModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PricingModal({ open, onOpenChange }: PricingModalProps) {
    const [loading, setLoading] = useState(false);

    const handleUpgrade = () => {
        setLoading(true);
        // Redirect to Polar generic checkout
        window.location.href = `/api/checkout?products=${process.env.NEXT_PUBLIC_POLAR_PRICE_ID_PRO}`;
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[850px] bg-white dark:bg-slate-950 p-0 overflow-hidden border-0 shadow-2xl rounded-2xl gap-0">
                <div className="grid md:grid-cols-2">

                    {/* Free Plan (Left) */}
                    <div className="p-6 md:p-8 bg-slate-50 dark:bg-slate-950/50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 dark:border-white/5 relative">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Starter</h3>
                                    <p className="text-slate-500 text-xs font-medium">Perfect for trying out the tool.</p>
                                </div>
                            </div>

                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-3xl font-black text-slate-900 dark:text-white">Free</span>
                                <span className="text-sm text-slate-500 font-medium">/forever</span>
                            </div>

                            <div className="h-px w-full bg-slate-200 dark:bg-white/5 mb-6"></div>

                            <ul className="space-y-3">
                                {[
                                    { text: "3 Competitor Analyses", included: true },
                                    { text: "Basic Conversion Scores", included: true },
                                    { text: "Standard Support", included: true },
                                    { text: "Deep Dive AI Analysis", included: false }
                                ].map((item, i) => (
                                    <li key={i} className={`flex items-center gap-3 text-sm ${item.included ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 dark:text-slate-600'}`}>
                                        {item.included ? (
                                            <Check className="w-4 h-4 text-emerald-500" />
                                        ) : (
                                            <X className="w-4 h-4" />
                                        )}
                                        <span className={!item.included ? "line-through" : ""}>{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Button variant="outline" className="mt-8 w-full border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300" disabled>
                            Current Plan
                        </Button>
                    </div>

                    {/* Pro Plan (Right - Highlighted) */}
                    <div className="p-6 md:p-8 bg-slate-900 dark:bg-slate-900 text-white flex flex-col justify-between relative overflow-hidden group">
                        {/* Background Effects */}
                        <div className="absolute top-0 right-0 p-32 bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-50" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30">
                                        <Crown className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Pro Master</h3>
                                        <p className="text-emerald-100/60 text-xs font-medium">Dominate your market.</p>
                                    </div>
                                </div>
                                <div className="px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-bold tracking-wider uppercase shadow-lg shadow-emerald-500/20">
                                    Popular
                                </div>
                            </div>

                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-3xl font-black text-white">$29</span>
                                <span className="text-sm text-slate-400 font-medium">/month</span>
                            </div>

                            <div className="h-px w-full bg-gradient-to-r from-emerald-500/30 to-transparent mb-6"></div>

                            <ul className="space-y-3">
                                {[
                                    "Unlimited Comparisons",
                                    "Deep Dive AI Analysis",
                                    "Export to PDF",
                                    "Priority Email Support",
                                    "Strategy War Room Access"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-200">
                                        <div className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400">
                                            <Check className="w-3.5 h-3.5" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <Button
                            onClick={handleUpgrade}
                            disabled={loading}
                            className="mt-8 w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold h-11 shadow-lg shadow-emerald-900/20 relative z-10 transition-all hover:scale-[1.02]"
                        >
                            {loading ? "Processing..." : "Upgrade to Pro"}
                        </Button>
                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}
