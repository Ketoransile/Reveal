"use client";

import { motion } from "framer-motion";
import { Search, Globe, Zap, Layout, Code, BarChart3, Lock, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";

export const AnalysisPreview = () => {
    const [scanActive, setScanActive] = useState(false);

    useEffect(() => {
        setScanActive(true);
    }, []);

    const revealVariants = {
        hidden: { opacity: 0, x: 20, scale: 0.9 },
        visible: (custom: number) => ({
            opacity: 1,
            x: 0,
            scale: 1,
            transition: { delay: custom * 0.8, duration: 0.5 }
        })
    };

    const leftRevealVariants = {
        hidden: { opacity: 0, x: -20, scale: 0.9 },
        visible: (custom: number) => ({
            opacity: 1,
            x: 0,
            scale: 1,
            transition: { delay: custom * 0.8, duration: 0.5 }
        })
    };

    return (
        <div className="relative w-full h-full rounded-3xl bg-slate-950/80 backdrop-blur-md overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center p-8 md:p-12 perspective-1000">

            {/* Ambient Base Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-emerald-500/5" />

            {/* Scanning Line Animation */}
            <motion.div
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-1 bg-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.5)] z-20"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400 to-transparent blur-sm" />
            </motion.div>

            {/* Central Target: The Competitor Website Wireframe */}
            <div className="relative w-full max-w-lg aspect-[3/4] md:aspect-[4/3] bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col z-10">
                {/* Fake Browser Header */}
                <div className="h-8 bg-slate-800 border-b border-slate-700 flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    <div className="ml-4 h-4 w-32 bg-slate-700 rounded-full opacity-50 text-[10px] flex items-center justify-center text-slate-400">competitor.com</div>
                </div>

                {/* Wireframe Content */}
                <div className="flex-1 p-6 flex flex-col space-y-6 relative">
                    {/* Hero Section */}
                    <div className="space-y-3">
                        <div className="h-8 w-3/4 bg-slate-800 rounded-lg animate-pulse" />
                        <div className="h-4 w-1/2 bg-slate-800/60 rounded-lg" />
                    </div>

                    {/* Hero Image / Content */}
                    <div className="h-32 w-full bg-gradient-to-br from-slate-800 to-slate-800/50 rounded-xl border border-slate-700/50 flex items-center justify-center relative overflow-hidden group">
                        <Globe className="text-slate-700 w-12 h-12 opacity-20" />

                        {/* Insight Node: Tech Stack */}
                        <motion.div
                            custom={2}
                            variants={revealVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="absolute top-4 right-4"
                        >
                            <div className="relative">
                                <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping absolute inset-0" />
                                <div className="w-3 h-3 bg-blue-500 rounded-full relative z-10 cursor-pointer hover:scale-125 transition-transform" />
                            </div>
                        </motion.div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-24 rounded-lg bg-slate-800/50 border border-slate-700/30 p-3 space-y-2 relative">
                            <div className="w-8 h-8 rounded bg-slate-700/50" />
                            <div className="w-full h-2 bg-slate-700/30 rounded" />
                            <div className="w-2/3 h-2 bg-slate-700/30 rounded" />

                            {/* Insight Node: SEO */}
                            <motion.div
                                custom={3}
                                variants={leftRevealVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="absolute -left-2 top-1/2 -translate-y-1/2"
                            >
                                <div className="relative">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping absolute inset-0" />
                                    <div className="w-3 h-3 bg-emerald-500 rounded-full relative z-10" />
                                </div>
                            </motion.div>
                        </div>
                        <div className="h-24 rounded-lg bg-slate-800/50 border border-slate-700/30 p-3 space-y-2 relative">
                            <div className="w-8 h-8 rounded bg-slate-700/50" />
                            <div className="w-full h-2 bg-slate-700/30 rounded" />
                            <div className="w-2/3 h-2 bg-slate-700/30 rounded" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Insight Cards (Connecting to nodes via absolute positioning visual hack) */}

            {/* Card 1: Traffic Source (Top Right) */}
            <motion.div
                custom={1}
                variants={revealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="absolute top-[20%] right-[10%] md:right-[15%] z-30"
            >
                <div className="glass-card-strong p-4 rounded-xl border border-blue-500/30 flex items-center gap-3 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Traffic Secret</div>
                        <div className="text-sm font-bold text-white">Top Source: LinkedIn Ads</div>
                    </div>
                    {/* Connecting Line (Visual) */}
                    <div className="absolute top-1/2 -left-8 w-8 h-px bg-gradient-to-l from-blue-500/50 to-transparent hidden md:block" />
                </div>
            </motion.div>

            {/* Card 2: Tech Stack (Middle Right) */}
            <motion.div
                custom={2}
                variants={revealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="absolute top-[45%] right-[5%] md:right-[8%] z-30"
            >
                <div className="glass-card-strong p-4 rounded-xl border border-purple-500/30 flex items-center gap-3 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                        <Code className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                        <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Tech Detected</div>
                        <div className="text-sm font-bold text-white">Next.js + Segment</div>
                    </div>
                    <div className="absolute top-1/2 -left-12 w-12 h-px bg-gradient-to-l from-purple-500/50 to-transparent hidden md:block" />
                </div>
            </motion.div>

            {/* Card 3: SEO Gap (Bottom Left) */}
            <motion.div
                custom={3}
                variants={leftRevealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="absolute bottom-[25%] left-[5%] md:left-[10%] z-30"
            >
                <div className="glass-card-strong p-4 rounded-xl border border-emerald-500/30 flex items-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <Search className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">SEO Opportunity</div>
                        <div className="text-sm font-bold text-white">Missed Keyword: "AI CRM"</div>
                    </div>
                    <div className="absolute top-1/2 -right-8 w-8 h-px bg-gradient-to-r from-emerald-500/50 to-transparent hidden md:block" />
                </div>
            </motion.div>

            {/* Card 4: UX (Top Left) */}
            <motion.div
                custom={1.5}
                variants={leftRevealVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="absolute top-[30%] left-[8%] md:left-[12%] z-30"
            >
                <div className="glass-card-strong p-4 rounded-xl border border-amber-500/30 flex items-center gap-3 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                        <Layout className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                        <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">UX Friction</div>
                        <div className="text-sm font-bold text-white">Low Contrast CTA</div>
                    </div>
                    <div className="absolute top-1/2 -right-12 w-12 h-px bg-gradient-to-r from-amber-500/50 to-transparent hidden md:block" />
                </div>
            </motion.div>

            {/* Central Analysis HUD */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center z-40">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 2.5, duration: 0.8 }}
                    className="flex items-center gap-4 px-6 py-3 rounded-full bg-slate-900/90 border border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.3)] backdrop-blur-xl"
                >
                    <div className="flex items-center gap-2 border-r border-white/10 pr-4">
                        <div className="relative">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
                        </div>
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Live Analysis</span>
                    </div>
                    <div>
                        <span className="text-slate-400 text-xs mr-2">Competitive Gap:</span>
                        <span className="text-emerald-400 font-black text-lg">Found 12 Weaknesses</span>
                    </div>
                </motion.div>
            </div>

        </div>
    );
};
