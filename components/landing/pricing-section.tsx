import { Badge } from "@/components/ui/badge";
import { Check, Info, Shield, Zap, TrendingUp, BarChart3, Users } from "lucide-react";

export const PricingSection = () => {
    return (
        <section id="pricing" className="py-24 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-slate-950 -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 px-4 py-1.5 text-sm uppercase tracking-wider backdrop-blur-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                        Simple & Transparent
                    </Badge>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                        Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Winning Edge</span>
                    </h2>
                    <p className="max-w-[700px] text-slate-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed font-light leading-relaxed">
                        Stop guessing and start dominating. Select the plan that fits your growth stage.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
                    {/* Starter Plan - Clean Glass */}
                    <div className="flex flex-col p-8 rounded-3xl bg-slate-900/40 backdrop-blur-md border border-white/5 hover:border-white/10 transition-all duration-300 relative group shadow-xl">
                        <div className="mb-8 p-4 bg-slate-800/30 rounded-2xl w-fit">
                            <Info className="w-8 h-8 text-slate-300" />
                        </div>
                        <div className="mb-2">
                            <h3 className="text-2xl font-bold text-slate-100">Starter</h3>
                            <p className="text-slate-400 text-sm mt-2 font-medium">For individuals exploring the market.</p>
                        </div>
                        <div className="my-8 flex items-baseline gap-1">
                            <span className="text-5xl font-black text-white tracking-tight">Free</span>
                            <span className="text-slate-500 font-medium">/forever</span>
                        </div>
                        <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent mb-8"></div>
                        <ul className="space-y-5 mb-8 flex-1">
                            <li className="flex items-center gap-3 text-slate-300">
                                <div className="p-1 rounded-full bg-slate-800"><Check className="w-3.5 h-3.5 text-white" /></div>
                                <span className="text-sm font-medium">3 Competitor Analyses/mo</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                                <div className="p-1 rounded-full bg-slate-800"><Check className="w-3.5 h-3.5 text-white" /></div>
                                <span className="text-sm font-medium">Basic Traffic Insights</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-300">
                                <div className="p-1 rounded-full bg-slate-800"><Check className="w-3.5 h-3.5 text-white" /></div>
                                <span className="text-sm font-medium">UX/UI Teardown</span>
                            </li>
                            <li className="flex items-center gap-3 text-slate-500">
                                <div className="p-1 rounded-full bg-slate-900/50"><Info className="w-3.5 h-3.5 text-slate-600" /></div>
                                <span className="text-sm">No Tech Stack Reveal</span>
                            </li>
                        </ul>
                        <button className="w-full py-4 rounded-xl bg-slate-800/80 text-white font-semibold hover:bg-slate-700 transition-all border border-white/5 hover:border-white/10 shadow-lg mt-auto">
                            Get Started Free
                        </button>
                    </div>

                    {/* Pro Plan - Premium Gradient */}
                    <div className="flex flex-col p-1 rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-600 relative shadow-[0_0_50px_rgba(16,185,129,0.2)] md:-mt-8 z-10 group transition-transform hover:-translate-y-1 duration-500">
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 text-xs font-black px-6 py-2 rounded-full shadow-xl tracking-wide uppercase">
                            Most Popular
                        </div>
                        <div className="flex flex-col p-8 h-full rounded-[20px] bg-slate-950 relative overflow-hidden">
                            {/* Subtle internal glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none"></div>

                            <div className="mb-8 p-4 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-2xl w-fit border border-emerald-500/30">
                                <Zap className="w-8 h-8 text-emerald-400" />
                            </div>

                            <div className="mb-2 relative z-10">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                    Pro Master
                                </h3>
                                <p className="text-emerald-100/70 text-sm mt-2 font-medium">For serious growth hackers & teams.</p>
                            </div>
                            <div className="my-8 flex items-baseline gap-1 relative z-10">
                                <span className="text-6xl font-black text-white tracking-tight">$29</span>
                                <span className="text-slate-400 font-medium">/month</span>
                            </div>
                            <div className="h-px w-full bg-gradient-to-r from-emerald-500/30 to-transparent mb-8"></div>

                            <ul className="space-y-5 mb-8 flex-1 relative z-10">
                                <li className="flex items-center gap-3 text-white">
                                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-1 rounded-full shadow-lg shadow-emerald-500/20"><Check className="w-3.5 h-3.5 text-white" /></div>
                                    <span className="text-sm font-bold">Unlimited Analyses</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-200">
                                    <div className="bg-emerald-500/20 p-1 rounded-full"><Check className="w-3.5 h-3.5 text-emerald-400" /></div>
                                    <span className="text-sm font-medium">Deep Traffic & Keyword Data</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-200">
                                    <div className="bg-emerald-500/20 p-1 rounded-full"><Check className="w-3.5 h-3.5 text-emerald-400" /></div>
                                    <span className="text-sm font-medium">Full Tech Stack Reveal</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-200">
                                    <div className="bg-emerald-500/20 p-1 rounded-full"><Check className="w-3.5 h-3.5 text-emerald-400" /></div>
                                    <span className="text-sm font-medium">Prioritized Action Checklist</span>
                                </li>
                                <li className="flex items-center gap-3 text-slate-200">
                                    <div className="bg-emerald-500/20 p-1 rounded-full"><Check className="w-3.5 h-3.5 text-emerald-400" /></div>
                                    <span className="text-sm font-medium">Export to PDF/CSV</span>
                                </li>
                            </ul>

                            <button className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg shadow-[0_4px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_4px_30px_rgba(16,185,129,0.4)] transition-all transform hover:scale-[1.02] mt-auto relative z-10">
                                Start Free Trial
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
