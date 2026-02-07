import { Badge } from "@/components/ui/badge";
import { Check, Info, Zap, X } from "lucide-react";
import Link from "next/link";

export const PricingSection = () => {
    return (
        <section id="pricing" className="py-24 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-slate-950 -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[800px] md:h-[800px] bg-emerald-500/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider backdrop-blur-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                        Simple & Transparent
                    </Badge>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-2">
                        Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Winning Edge</span>
                    </h2>
                    <p className="max-w-[600px] text-slate-400 text-base md:text-lg font-light leading-relaxed">
                        Stop guessing and start dominating. Select the plan that fits your growth stage.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto items-stretch">
                    {/* Starter Plan - Clean Glass */}
                    <div className="flex flex-col p-6 rounded-2xl bg-slate-900/60 backdrop-blur-sm border border-white/5 hover:border-emerald-500/20 transition-all duration-300 relative group shadow-lg hover:shadow-xl">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-slate-100">Starter</h3>
                                <p className="text-slate-400 text-sm mt-1 font-medium">For individuals exploring.</p>
                            </div>
                            <div className="p-2 bg-slate-800/50 rounded-lg">
                                <Info className="w-5 h-5 text-slate-300" />
                            </div>
                        </div>

                        <div className="mb-6 flex items-baseline gap-1">
                            <span className="text-4xl font-black text-white tracking-tight">Free</span>
                            <span className="text-slate-500 text-sm font-medium">/forever</span>
                        </div>

                        <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent mb-6"></div>

                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center gap-3 text-slate-300">
                                <div className="p-0.5 rounded-full bg-slate-800/80 text-emerald-400"><Check className="w-4 h-4" /></div>
                                <span className="text-sm">3 Competitor Analyses/mo</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                                <div className="p-0.5 rounded-full bg-slate-800/80 text-emerald-400"><Check className="w-4 h-4" /></div>
                                <span className="text-sm">Basic Traffic Insights</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                                <div className="p-0.5 rounded-full bg-slate-800/80 text-emerald-400"><Check className="w-4 h-4" /></div>
                                <span className="text-sm">UX/UI Teardown</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-500">
                                <div className="p-0.5 rounded-full bg-slate-800/30 text-slate-600"><X className="w-4 h-4" /></div>
                                <span className="text-sm line-through">No Tech Stack Reveal</span>
                            </li>
                        </ul>

                        <Link href="/signup" className="w-full mt-auto">
                            <button className="w-full py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all border border-white/5 hover:border-white/10 text-sm">
                                Get Started Free
                            </button>
                        </Link>
                    </div>

                    {/* Pro Plan - Premium Glow */}
                    <div className="flex flex-col p-6 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-emerald-500/50 relative shadow-[0_0_30px_rgba(16,185,129,0.15)] group transition-all hover:shadow-[0_0_40px_rgba(16,185,129,0.25)] hover:-translate-y-1 duration-300">
                        {/* Popular Badge */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full shadow-lg tracking-wide uppercase z-20">
                            Most Popular
                        </div>

                        {/* Gradient overlay/glow */}
                        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent rounded-2xl pointer-events-none" />

                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    Pro Master
                                </h3>
                                <p className="text-emerald-100/70 text-sm mt-1 font-medium">For serious growth hackers.</p>
                            </div>
                            <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg border border-emerald-500/30">
                                <Zap className="w-5 h-5 text-emerald-400" />
                            </div>
                        </div>

                        <div className="mb-6 flex items-baseline gap-1 relative z-10">
                            <span className="text-4xl font-black text-white tracking-tight">$29</span>
                            <span className="text-slate-400 text-sm font-medium">/month</span>
                        </div>

                        <div className="h-px w-full bg-gradient-to-r from-emerald-500/30 to-transparent mb-6"></div>

                        <ul className="space-y-4 mb-8 flex-1 relative z-10">
                            <li className="flex items-center gap-3 text-white">
                                <div className="p-0.5 rounded-full bg-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]"><Check className="w-4 h-4" /></div>
                                <span className="text-sm font-medium">Unlimited Analyses</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-200">
                                <div className="p-0.5 rounded-full bg-emerald-500/10 text-emerald-400"><Check className="w-4 h-4" /></div>
                                <span className="text-sm">Deep Traffic & Keyword Data</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-200">
                                <div className="p-0.5 rounded-full bg-emerald-500/10 text-emerald-400"><Check className="w-4 h-4" /></div>
                                <span className="text-sm">Full Tech Stack Reveal</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-200">
                                <div className="p-0.5 rounded-full bg-emerald-500/10 text-emerald-400"><Check className="w-4 h-4" /></div>
                                <span className="text-sm">Prioritized Action Checklist</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-200">
                                <div className="p-0.5 rounded-full bg-emerald-500/10 text-emerald-400"><Check className="w-4 h-4" /></div>
                                <span className="text-sm">Export to PDF/CSV</span>
                            </li>
                        </ul>

                        <Link href={`/api/checkout?products=${process.env.NEXT_PUBLIC_POLAR_PRICE_ID_PRO}`} className="w-full mt-auto relative z-10">
                            <button className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm shadow-[0_4px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_4px_30px_rgba(16,185,129,0.4)] transition-all transform hover:scale-[1.02]">
                                Start Free Trial
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};
