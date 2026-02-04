import { Badge } from "@/components/ui/badge";
import { Check, Info, Zap } from "lucide-react";
import { NavBar } from "@/components/shared/NavBar";
import Link from "next/link";
import { Footer } from "@/components/shared/Footer";

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 overflow-hidden relative selection:bg-emerald-500/30">

            {/* Reused Ambient Lighting & Logic from Home Page */}
            <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    backgroundSize: '100px 100px',
                    backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)'
                }}
            />
            <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    backgroundSize: '20px 20px',
                    backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)'
                }}
            />
            <div className="fixed pointer-events-none inset-0 flex items-center justify-center bg-slate-950/80 [mask-image:radial-gradient(ellipse_at_center,transparent_0%,black_100%)]" />

            <NavBar />

            <section className="pt-36 pb-24 relative z-10">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 px-4 py-1.5 text-sm uppercase tracking-wider backdrop-blur-sm">
                            Simple Pricing
                        </Badge>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4">
                            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Winning Edge</span>
                        </h1>
                        <p className="max-w-[700px] text-slate-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            Stop guessing and start dominating. Select the plan that fits your growth stage.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto items-start animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
                        {/* Starter Plan */}
                        <div className="flex flex-col p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors relative group">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-slate-100">Starter</h3>
                                <p className="text-slate-400 text-sm mt-2">For solopreneurs testing the waters.</p>
                            </div>
                            <div className="mb-6 flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">Free</span>
                                <span className="text-slate-500">/forever</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-sm text-slate-300">
                                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                                    3 Competitor Analyses
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-300">
                                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                                    Basic Conversion Scores
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-300">
                                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                                    Standard Support
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-500">
                                    <Info className="w-4 h-4 text-slate-600 shrink-0" />
                                    No Deep Dive AI
                                </li>
                            </ul>
                            <Link href="/login" className="w-full">
                                <button className="w-full py-3 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors border border-slate-700">
                                    Get Started
                                </button>
                            </Link>
                        </div>

                        {/* Pro Plan (Best Value) */}
                        <div className="flex flex-col p-8 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-900 border border-emerald-500/30 relative shadow-2xl shadow-emerald-900/10 md:-mt-8 z-10 group">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                                MOST POPULAR
                            </div>
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    Pro <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                                </h3>
                                <p className="text-emerald-100/70 text-sm mt-2">For growth teams ready to scale.</p>
                            </div>
                            <div className="mb-6 flex items-baseline gap-1">
                                <span className="text-5xl font-bold text-white">$29</span>
                                <span className="text-slate-500">/month</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-sm text-slate-200">
                                    <div className="bg-emerald-500/20 p-1 rounded-full"><Check className="w-3 h-3 text-emerald-400" /></div>
                                    <span className="font-medium">Unlimited Analyses</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-200">
                                    <div className="bg-emerald-500/20 p-1 rounded-full"><Check className="w-3 h-3 text-emerald-400" /></div>
                                    <span className="font-medium">Deep Dive AI Analysis</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-200">
                                    <div className="bg-emerald-500/20 p-1 rounded-full"><Check className="w-3 h-3 text-emerald-400" /></div>
                                    <span className="font-medium">Full Tech Stack Reveal</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-200">
                                    <div className="bg-emerald-500/20 p-1 rounded-full"><Check className="w-3 h-3 text-emerald-400" /></div>
                                    <span className="font-medium">Export to PDF</span>
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-200">
                                    <div className="bg-emerald-500/20 p-1 rounded-full"><Check className="w-3 h-3 text-emerald-400" /></div>
                                    <span className="font-medium">Priority Support</span>
                                </li>
                            </ul>
                            <Link href="/login" className="w-full">
                                <button className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all transform hover:scale-[1.02]">
                                    Upgrade Now
                                </button>
                            </Link>
                        </div>

                        {/* Agency Plan */}
                        <div className="flex flex-col p-8 rounded-3xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors relative group">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-slate-100">Agency</h3>
                                <p className="text-slate-400 text-sm mt-2">For agencies managing multiple clients.</p>
                            </div>
                            <div className="mb-6 flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">$99</span>
                                <span className="text-slate-500">/month</span>
                            </div>
                            <ul className="space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-sm text-slate-300">
                                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                                    Everything in Pro
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-300">
                                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                                    White-label Reports
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-300">
                                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                                    API Access
                                </li>
                                <li className="flex items-center gap-3 text-sm text-slate-300">
                                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                                    Dedicated Account Manager
                                </li>
                            </ul>
                            <Link href="/login" className="w-full">
                                <button className="w-full py-3 rounded-xl bg-slate-800 text-white font-medium hover:bg-slate-700 transition-colors border border-slate-700">
                                    Contact Sales
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
