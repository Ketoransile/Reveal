"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, Shield } from "lucide-react";
import { FeaturesSection } from "@/components/landing/features-section";
import { AnalysisPreview } from "@/components/landing/analysis-preview";
import { HowItWorks } from "@/components/landing/how-it-works";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: (custom: number) => ({
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut", delay: custom * 0.1 }
        })
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 overflow-hidden relative selection:bg-emerald-500/30">

            {/* Background Grid & Ambient Lighting */}
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

            {/* Dynamic Colored Blobs with Animation */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen opacity-50 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />

            <main className="pt-36 pb-24 px-6 lg:px-12 max-w-7xl mx-auto relative z-10">
                {/* Hero Section - Enhanced */}
                <div className="text-center max-w-4xl mx-auto mb-48">

                    {/* Animated Badge */}
                    <motion.div
                        custom={0}
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/20 text-xs font-semibold text-blue-200 mb-8 backdrop-blur-md hover:border-blue-500/40 hover:from-blue-900/60 hover:to-purple-900/60 transition-all cursor-default shadow-[0_0_30px_rgba(59,130,246,0.15)] group"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                        <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent group-hover:from-blue-200 group-hover:to-purple-200 transition-all">New: AI-Powered Competitor Deep Dive</span>
                    </motion.div>

                    {/* Hero Title - Growth Hook */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight mb-8 leading-[1.1] selection:text-white">
                        <motion.span
                            custom={1}
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            className="block bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-200 drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                        >
                            Are you ready to turn your
                        </motion.span>
                        <motion.span
                            custom={2}
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 mt-2"
                        >
                            traffic into revenue?
                        </motion.span>
                    </h1>

                    {/* Subtitle - Scaling Solution */}
                    <motion.p
                        custom={3}
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="text-base lg:text-xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed"
                    >
                        Your product is ready to scale. Now let's fix the only thing holding it back: <span className="text-blue-400 font-semibold">your landing page</span>. Our AI reveals the exact changes needed to unlock your <span className="text-slate-200 font-semibold">next stage of growth</span>.
                    </motion.p>

                    {/* CTA Buttons - Enhanced */}
                    <motion.div
                        custom={4}
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
                    >
                        <Button
                            onClick={handleAnalyzeClick}
                            disabled={isCheckingAuth}
                            variant="default"
                            size="lg"
                            className="h-14 px-8 text-base w-full sm:w-auto rounded-xl font-bold tracking-tight shadow-[0_0_50px_rgba(16,185,129,0.4)] hover:shadow-[0_0_70px_rgba(16,185,129,0.6)] transition-all duration-500 relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 hover:from-emerald-500 hover:via-teal-400 hover:to-emerald-500 text-white border-0 group"
                        >
                            <span className="relative flex items-center gap-2">
                                Analyze My Competitor
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Button>
                        {/* <Button variant="ghost" size="lg" className="h-14 px-6 text-slate-300 hover:text-white w-full sm:w-auto rounded-xl border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all backdrop-blur-sm group">
                            <span className="flex items-center gap-2 text-base">
                                <TrendingUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                View Sample Report
                            </span>
                        </Button> */}
                    </motion.div>

                    {/* Trust Indicators */}
                    <motion.div
                        custom={5}
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium"
                    >
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Analyzed 10,000+ Market Battles</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="w-3.5 h-3.5 text-blue-500" />
                            <span>Data-Backed Roadmap</span>
                        </div>
                    </motion.div>
                </div>

                {/* Visual Battle Mockup - Enhanced */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={sectionVariants}
                    className="relative mx-auto max-w-6xl aspect-[16/9] mb-40 z-10"
                >
                    <AnalysisPreview />
                </motion.div>

                {/* How It Works Section */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={sectionVariants}
                >
                    <HowItWorks />
                </motion.div>

                {/* Social Proof - Enhanced */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={sectionVariants}
                    className="text-center mb-40"
                >
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.25em] mb-12 flex items-center justify-center gap-2">
                        <span className="h-px w-12 bg-gradient-to-r from-transparent to-slate-700"></span>
                        Trusted by growth teams at
                        <span className="h-px w-12 bg-gradient-to-l from-transparent to-slate-700"></span>
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-16 lg:gap-28 opacity-40 grayscale hover:grayscale-0 transition-all duration-700 hover:opacity-100">
                        <h3 className="text-2xl font-black text-slate-100 tracking-tight hover:text-emerald-300 transition-colors cursor-default">Shopify</h3>
                        <h3 className="text-2xl font-bold text-slate-100 tracking-tight hover:text-purple-300 transition-colors cursor-default">Stripe</h3>
                        <h3 className="text-2xl font-bold text-slate-100 tracking-tight hover:text-blue-300 transition-colors cursor-default">Notion</h3>
                        <h3 className="text-2xl font-bold text-slate-100 tracking-tight hover:text-pink-300 transition-colors cursor-default">Figma</h3>
                    </div>
                </motion.div>

                {/* Expanded Sections */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={sectionVariants}
                >
                    <FeaturesSection />
                </motion.div>
            </main>
        </div>
    );
}
