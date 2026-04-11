"use client";

import { Badge } from "@/components/ui/badge";
import { Check, Info, Zap, X, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export function PricingContent() {
    return (
        <>
            {/* Animated Background */}
            <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    backgroundSize: '80px 80px',
                    backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)'
                }}
            />
            <div className="fixed pointer-events-none inset-0 bg-background/60 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_100%)]" />

            {/* Morphing Gradient Orbs - Monochromatic */}
            <div className="absolute top-[-5%] left-[20%] w-[500px] h-[500px] md:w-[800px] md:h-[600px] bg-foreground/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
            <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] md:w-[600px] md:h-[500px] bg-foreground/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />

            <section className="pt-32 pb-20 relative z-10">
                <div className="container px-4 md:px-6 mx-auto">
                    {/* Header */}
                    <div className="flex flex-col items-center justify-center space-y-5 text-center mb-16">
                        <div>
                            <Badge variant="outline" className="border-border/50 text-foreground bg-muted/50 px-4 py-1.5 text-xs font-medium uppercase tracking-wider backdrop-blur-sm shadow-sm">
                                <Sparkles className="w-3 h-3 mr-1.5 inline" />
                                Simple & Transparent
                            </Badge>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-2">
                            Unlock Your{" "}
                            <span className="text-foreground/70">
                                Competitive Edge
                            </span>
                        </h1>

                        <p className="max-w-[600px] text-muted-foreground text-base md:text-lg font-light leading-relaxed">
                            No hidden fees. No complicated tiers. Just the raw power you need to win.
                        </p>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
                        {/* Starter Plan */}
                        <div className="flex flex-col p-8 rounded-3xl bg-card/10 backdrop-blur-md border border-border/40 hover:border-border hover:-translate-y-1 transition-all duration-500 relative group shadow-sm">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">Starter</h3>
                                    <p className="text-muted-foreground text-sm mt-1 font-medium">For individuals exploring the market.</p>
                                </div>
                                <div className="p-2.5 bg-muted/50 rounded-xl group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                                    <Info className="w-5 h-5 text-foreground/80" />
                                </div>
                            </div>

                            <div className="mb-8 flex items-baseline gap-1">
                                <span className="text-5xl font-black text-foreground tracking-tight">
                                    Free
                                </span>
                                <span className="text-muted-foreground text-sm font-medium">/forever</span>
                            </div>

                            <div className="h-px w-full bg-gradient-to-r from-border to-transparent mb-8" />

                            <ul className="space-y-4 mb-10 flex-1">
                                {[
                                    { text: "3 Competitor Analyses", included: true },
                                    { text: "Basic Conversion Scores", included: true },
                                    { text: "Standard Support", included: true },
                                    { text: "Deep Dive AI Analysis", included: false },
                                ].map((feature, i) => (
                                    <li
                                        key={i}
                                        className={`flex items-center gap-3 ${feature.included ? "text-foreground/90" : "text-muted-foreground"}`}
                                    >
                                        <div className={`p-0.5 rounded-full ${feature.included ? "bg-foreground/10 text-foreground" : "bg-muted text-muted-foreground"}`}>
                                            {feature.included ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                        </div>
                                        <span className={`text-sm ${!feature.included ? "line-through opacity-60" : ""}`}>{feature.text}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link href="/signup" className="w-full mt-auto">
                                <button className="w-full py-3.5 rounded-xl bg-muted/80 hover:bg-muted text-foreground font-semibold transition-all border border-border/50 text-sm group cursor-pointer active:scale-95">
                                    <span className="flex items-center justify-center gap-2">
                                        Get Started Free
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </button>
                            </Link>
                        </div>

                        {/* Pro Plan */}
                        <div className="flex flex-col p-8 rounded-3xl bg-card/30 backdrop-blur-xl border border-border relative shadow-[0_8px_30px_rgb(0,0,0,0.12)] group transition-all duration-500 hover:shadow-[0_8px_40px_rgb(0,0,0,0.2)] hover:-translate-y-1">
                            {/* Popular Badge */}
                            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-black px-4 py-1.5 rounded-full shadow-md tracking-wide uppercase z-20">
                                Most Popular
                            </div>

                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div>
                                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">Pro Master</h3>
                                    <p className="text-muted-foreground text-sm mt-1 font-medium">For serious growth hackers & teams.</p>
                                </div>
                                <div className="p-2.5 bg-foreground/10 rounded-xl border border-border group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300">
                                    <Zap className="w-5 h-5 text-foreground" />
                                </div>
                            </div>

                            <div className="mb-8 flex items-baseline gap-1 relative z-10">
                                <span className="text-5xl font-black text-foreground tracking-tight">
                                    $29
                                </span>
                                <span className="text-muted-foreground text-sm font-medium">/month</span>
                            </div>

                            <div className="h-px w-full bg-gradient-to-r from-border to-transparent mb-8" />

                            <ul className="space-y-4 mb-10 flex-1 relative z-10">
                                {[
                                    "Unlimited Analyses",
                                    "Deep Dive AI Analysis",
                                    "Full Tech Stack Reveal",
                                    "White-label PDF Reports",
                                    "24/7 Priority Support",
                                ].map((feature, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center gap-3 text-foreground"
                                    >
                                        <div className={`p-0.5 rounded-full ${i === 0 ? "bg-foreground/20 text-foreground ring-1 ring-border" : "bg-foreground/10 text-foreground"}`}>
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <span className={`text-sm ${i === 0 ? "font-bold text-foreground" : ""}`}>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link href={`/api/checkout?products=${process.env.NEXT_PUBLIC_POLAR_PRICE_ID_PRO}`} className="w-full mt-auto relative z-10">
                                <button className="w-full py-3.5 rounded-xl bg-foreground text-background font-bold text-sm shadow-xl hover:shadow-2xl transition-all relative overflow-hidden group cursor-pointer active:scale-95">
                                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    <span className="relative flex items-center justify-center gap-2">
                                        Unlock Everything
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1" />
                                    </span>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
