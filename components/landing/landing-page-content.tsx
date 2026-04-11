"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, Shield, Zap, Target, Eye } from "lucide-react";
import { FeaturesSection } from "@/components/landing/features-section";
import { AnalysisPreview } from "@/components/landing/analysis-preview";
import { HowItWorks } from "@/components/landing/how-it-works";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

/* ─── Animated Counter ─── */
const AnimatedCounter = ({ target, suffix = "", duration = 2 }: { target: number; suffix?: string; duration?: number }) => {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    let start = 0;
                    const step = target / (duration * 60);
                    const timer = setInterval(() => {
                        start += step;
                        if (start >= target) {
                            setCount(target);
                            clearInterval(timer);
                        } else {
                            setCount(Math.floor(start));
                        }
                    }, 1000 / 60);
                }
            },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, duration, hasAnimated]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

export function LandingPageContent() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setIsLoggedIn(!!user);
            setIsCheckingAuth(false);
        };
        checkAuth();
    }, []);

    const handleAnalyzeClick = () => {
        if (isLoggedIn) {
            router.push('/dashboard/analysis');
        } else {
            router.push('/login');
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden relative selection:bg-foreground/20">

            {/* Grid Overlay */}
            <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    backgroundSize: '80px 80px',
                    backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)'
                }}
            />
            <div className="fixed pointer-events-none inset-0 bg-background/60 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_100%)]" />

            {/* Morphing Gradient Orbs - Monochromatic (Optimized for Mobile) */}
            <div className="hidden md:block absolute top-[-10%] left-[30%] w-[900px] h-[700px] bg-foreground/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />
            <div className="hidden md:block absolute bottom-[10%] right-[-5%] w-[700px] h-[600px] bg-foreground/5 rounded-full blur-[130px] pointer-events-none mix-blend-screen" />
            <div className="absolute top-[50%] left-[-10%] w-[250px] h-[250px] md:w-[500px] md:h-[500px] bg-foreground/5 rounded-full blur-2xl md:blur-[120px] pointer-events-none mix-blend-screen" />

            {/* ─── HERO SECTION ─── */}
            <div>
                <main className="pt-36 md:pt-44 pb-24 px-6 lg:px-12 max-w-7xl mx-auto relative z-10">
                    <div className="text-center max-w-5xl mx-auto mb-32 md:mb-48">

                        {/* Badge */}
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-muted/50 border border-border/50 text-xs font-semibold text-foreground mb-10 backdrop-blur-xl cursor-default shadow-sm hover:border-foreground/20 hover:shadow-md transition-all duration-500">
                            <Sparkles className="w-3.5 h-3.5 text-foreground" />
                            <span className="text-foreground">
                                AI-Powered Competitor Deep Dive
                            </span>
                        </div>

                        {/* Hero Title */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight mb-8 leading-[1.08] text-foreground">
                            <span className="block text-foreground drop-shadow-sm">
                                Find the revenue leak
                            </span>
                            <span className="block text-foreground mt-2 opacity-80">
                                in your landing page.
                            </span>
                        </h1>

                        {/* Subtitle */}
                        <p className="text-base lg:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
                            Your product is ready to scale, but your competitors are stealing your customers.
                            Our AI analyzes their winning strategies to give you a step-by-step roadmap to{" "}
                            <span className="text-foreground font-semibold relative" style={{
                                backgroundImage: "linear-gradient(to right, #ffffff, #aaaaaa)",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "0 100%",
                                backgroundSize: "100% 2px",
                            }}>
                                outsell them
                            </span>.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
                            <Button
                                onClick={handleAnalyzeClick}
                                disabled={isCheckingAuth}
                                variant="default"
                                size="lg"
                                className="h-14 px-8 text-base w-full sm:w-auto rounded-xl font-bold tracking-tight bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 relative overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-0.5 group cursor-pointer border border-border/10"
                            >
                                {/* Shimmer overlay */}
                                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                <span className="relative flex items-center gap-2">
                                    Reveal Why They Win
                                    <ArrowRight className="w-4 h-4" />
                                </span>
                            </Button>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap items-center justify-center gap-8 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                            {[
                                { icon: <TrendingUp className="w-4 h-4 text-foreground/80" />, text: "Analyzed 10k+ Battles" },
                                { icon: <Shield className="w-4 h-4 text-foreground/80" />, text: "Data-Backed Roadmap" },
                                { icon: <Zap className="w-4 h-4 text-foreground/80" />, text: "Results in 30 Seconds" },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2.5 group cursor-default">
                                    {item.icon}
                                    <span className="group-hover:text-foreground transition-colors">{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            {/* ─── ANALYSIS PREVIEW ─── */}
            <div className="relative mx-auto max-w-6xl aspect-[16/9] mb-32 md:mb-48 z-10 px-6">
                <AnalysisPreview />
            </div>

            {/* ─── STATS SECTION ─── */}
            <div className="relative z-10 max-w-5xl mx-auto mb-32 md:mb-48 px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {[
                        { value: 100, suffix: "+", label: "Analyses Run" },
                        { value: 97, suffix: "%", label: "Accuracy Rate" },
                        { value: 30, suffix: "s", label: "Avg. Scan Time" },
                        { value: 50, suffix: "+", label: "Growth Teams" },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="text-center p-6 rounded-3xl bg-card/40 border border-border/40 backdrop-blur-md hover:border-border hover:bg-card/60 transition-all duration-500 group shadow-sm hover:-translate-y-1"
                        >
                            <div className="text-3xl md:text-4xl font-black text-foreground mb-2 tracking-tighter">
                                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                            </div>
                            <div className="text-xs md:text-sm text-muted-foreground font-bold tracking-widest uppercase group-hover:text-foreground transition-colors">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ─── HOW IT WORKS ─── */}
            <HowItWorks />

            {/* ─── SOCIAL PROOF ─── */}
            <div className="text-center mb-32 md:mb-48 relative z-10 px-6 overflow-hidden">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em] mb-14 flex items-center justify-center gap-3">
                    <span className="h-px w-16 bg-gradient-to-r from-transparent to-border" />
                    Trusted by growth teams at
                    <span className="h-px w-16 bg-gradient-to-l from-transparent to-border" />
                </p>

                {/* Logo list */}
                <div className="relative w-full overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
                    <div className="flex items-center gap-20 whitespace-nowrap justify-center flex-wrap">
                        {["Shopify", "Polar", "Notion", "Figma", "Linear", "Vercel"].map((name, i) => (
                            <span
                                key={i}
                                className="text-2xl font-black tracking-tight text-foreground/20 hover:text-foreground/80 transition-colors duration-500 cursor-default select-none"
                            >
                                {name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── FEATURES SECTION ─── */}
            <FeaturesSection />

            {/* ─── FINAL CTA SECTION ─── */}
            <div className="relative z-10 max-w-4xl mx-auto text-center py-32 md:py-40 px-6">
                {/* CTA Glow Background */}
                <div className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none">
                    <div className="w-[500px] h-[500px] bg-foreground/5 rounded-full blur-[120px]" />
                </div>

                <div className="relative">
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-foreground">
                        Ready to{" "}
                        <span className="opacity-70">
                            outsmart
                        </span>
                        {" "}your competition?
                    </h2>
                    <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto font-medium">
                        Join thousands of growth teams using Reveal to decode their competitors strategy and win more customers.
                    </p>
                    <Button
                        onClick={handleAnalyzeClick}
                        disabled={isCheckingAuth}
                        size="lg"
                        className="h-14 px-10 text-base rounded-xl font-bold bg-foreground text-background hover:bg-foreground/90 transition-all duration-300 relative overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-0.5 group cursor-pointer border border-border/10"
                    >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        <span className="relative flex items-center gap-2">
                            Start Your Free Analysis
                            <ArrowRight className="w-4 h-4" />
                        </span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
