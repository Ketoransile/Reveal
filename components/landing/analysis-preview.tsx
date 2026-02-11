"use client";

import { motion } from "framer-motion";
import { Search, Globe, Zap, Layout, BarChart3, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";

export const AnalysisPreview = () => {
    const [scanActive, setScanActive] = useState(false);

    useEffect(() => {
        setScanActive(true);
    }, []);

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.85 },
        visible: (custom: number) => ({
            opacity: 1,
            scale: 1,
            transition: { delay: custom * 0.6 + 0.5, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
        })
    };

    const leftCardVariants = {
        hidden: { opacity: 0, x: -40, scale: 0.9 },
        visible: (custom: number) => ({
            opacity: 1,
            x: 0,
            scale: 1,
            transition: { delay: custom * 0.6 + 0.5, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
        })
    };

    const rightCardVariants = {
        hidden: { opacity: 0, x: 40, scale: 0.9 },
        visible: (custom: number) => ({
            opacity: 1,
            x: 0,
            scale: 1,
            transition: { delay: custom * 0.6 + 0.5, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
        })
    };

    const insightCards = [
        {
            icon: <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />,
            label: "Traffic Secret",
            value: "Top Source: LinkedIn Ads",
            borderColor: "border-blue-500/30",
            shadowColor: "shadow-[0_0_30px_rgba(59,130,246,0.15)]",
            bgColor: "bg-blue-500/20",
        },
        {
            icon: <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-purple-400" />,
            label: "Strategic Angle",
            value: "Value Prop: Speed",
            borderColor: "border-purple-500/30",
            shadowColor: "shadow-[0_0_30px_rgba(168,85,247,0.15)]",
            bgColor: "bg-purple-500/20",
        },
        {
            icon: <Search className="w-4 h-4 md:w-5 md:h-5 text-emerald-400" />,
            label: "SEO Opportunity",
            value: 'Missed Keyword: "AI CRM"',
            borderColor: "border-emerald-500/30",
            shadowColor: "shadow-[0_0_30px_rgba(16,185,129,0.15)]",
            bgColor: "bg-emerald-500/20",
        },
        {
            icon: <Layout className="w-4 h-4 md:w-5 md:h-5 text-amber-400" />,
            label: "UX Friction",
            value: "Low Contrast CTA",
            borderColor: "border-amber-500/30",
            shadowColor: "shadow-[0_0_30px_rgba(245,158,11,0.15)]",
            bgColor: "bg-amber-500/20",
        },
    ];

    return (
        <div className="relative w-full h-full rounded-3xl bg-slate-950/80 backdrop-blur-md overflow-hidden border border-white/10 shadow-2xl flex flex-col md:block items-center justify-center p-4 md:p-12">

            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-emerald-500/5" />

            {/* Animated Scan Line */}
            <motion.div
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 right-0 h-[2px] z-20 pointer-events-none"
                style={{
                    background: "linear-gradient(90deg, transparent, rgba(16,185,129,0.6), rgba(59,130,246,0.6), transparent)",
                    boxShadow: "0 0 20px rgba(16,185,129,0.4), 0 0 60px rgba(16,185,129,0.2)"
                }}
            />

            {/* Orbiting Ring (Desktop) */}
            <div className="hidden md:block absolute inset-0 pointer-events-none z-0">
                <motion.div
                    className="absolute top-1/2 left-1/2 w-[350px] h-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/5 animate-spin-slow"
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.03] animate-spin-reverse"
                />
            </div>

            {/* Central Browser Wireframe */}
            <div className="relative w-full max-w-lg aspect-[3/4] md:aspect-[4/3] bg-slate-900/90 rounded-xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col z-10 md:mx-auto">
                {/* Browser Header */}
                <div className="h-8 bg-slate-800/80 border-b border-slate-700 flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    <div className="ml-4 h-4 w-32 bg-slate-700 rounded-full opacity-50 text-[10px] flex items-center justify-center text-slate-400">competitor.com</div>
                </div>

                {/* Wireframe Body */}
                <div className="flex-1 p-6 flex flex-col space-y-6 relative">
                    {/* Hero Block */}
                    <div className="space-y-3">
                        <motion.div
                            className="h-8 w-3/4 bg-slate-800 rounded-lg"
                            animate={{ opacity: [0.4, 0.7, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <motion.div
                            className="h-4 w-1/2 bg-slate-800/60 rounded-lg"
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                        />
                    </div>

                    {/* Hero Image area */}
                    <div className="h-32 w-full bg-gradient-to-br from-slate-800/80 to-slate-800/40 rounded-xl border border-slate-700/50 flex items-center justify-center relative overflow-hidden">
                        <Globe className="text-slate-700 w-12 h-12 opacity-20" />

                        {/* Pulsing dots */}
                        <motion.div
                            custom={1}
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="absolute top-3 right-3"
                        >
                            <div className="relative">
                                <div className="w-3 h-3 bg-purple-500 rounded-full animate-ping absolute inset-0 opacity-75" />
                                <div className="w-3 h-3 bg-purple-500 rounded-full relative z-10" />
                            </div>
                        </motion.div>

                        <motion.div
                            custom={2}
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="absolute bottom-3 left-3"
                        >
                            <div className="relative">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping absolute inset-0 opacity-75" />
                                <div className="w-3 h-3 bg-emerald-500 rounded-full relative z-10" />
                            </div>
                        </motion.div>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {[0, 1].map(idx => (
                            <div key={idx} className="h-24 rounded-lg bg-slate-800/50 border border-slate-700/30 p-3 space-y-2 relative">
                                <motion.div
                                    className="w-8 h-8 rounded bg-slate-700/50"
                                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                                    transition={{ duration: 3, repeat: Infinity, delay: idx * 0.5 }}
                                />
                                <div className="w-full h-2 bg-slate-700/30 rounded" />
                                <div className="w-2/3 h-2 bg-slate-700/30 rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── Mobile Insight Cards (Stacked below) ─── */}
            <div className="md:hidden w-full mt-6 space-y-3 z-30">
                {insightCards.map((card, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.15, duration: 0.5 }}
                        viewport={{ once: true }}
                        className={`glass-card-strong p-3 rounded-xl ${card.borderColor} flex items-center gap-3 ${card.shadowColor} bg-slate-900/60 backdrop-blur-sm`}
                    >
                        <div className={`p-2 ${card.bgColor} rounded-lg`}>{card.icon}</div>
                        <div>
                            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{card.label}</div>
                            <div className="text-sm font-bold text-white">{card.value}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* ─── Desktop Floating Insight Cards ─── */}
            <div className="hidden md:block">
                {/* Top Right */}
                <motion.div
                    custom={1}
                    variants={rightCardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="absolute top-[18%] right-[8%] z-30"
                    whileHover={{ scale: 1.05, y: -3 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    <div className={`glass-card-strong p-4 rounded-xl ${insightCards[0].borderColor} flex items-center gap-3 ${insightCards[0].shadowColor}`}>
                        <div className={`p-2 ${insightCards[0].bgColor} rounded-lg`}>{insightCards[0].icon}</div>
                        <div>
                            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">{insightCards[0].label}</div>
                            <div className="text-sm font-bold text-white">{insightCards[0].value}</div>
                        </div>
                        <div className="absolute top-1/2 -left-8 w-8 h-px bg-gradient-to-l from-blue-500/50 to-transparent" />
                    </div>
                </motion.div>

                {/* Middle Right */}
                <motion.div
                    custom={2}
                    variants={rightCardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="absolute top-[45%] right-[5%] z-30"
                    whileHover={{ scale: 1.05, y: -3 }}
                >
                    <div className={`glass-card-strong p-4 rounded-xl ${insightCards[1].borderColor} flex items-center gap-3 ${insightCards[1].shadowColor}`}>
                        <div className={`p-2 ${insightCards[1].bgColor} rounded-lg`}>{insightCards[1].icon}</div>
                        <div>
                            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">{insightCards[1].label}</div>
                            <div className="text-sm font-bold text-white">{insightCards[1].value}</div>
                        </div>
                        <div className="absolute top-1/2 -left-12 w-12 h-px bg-gradient-to-l from-purple-500/50 to-transparent" />
                    </div>
                </motion.div>

                {/* Bottom Left */}
                <motion.div
                    custom={3}
                    variants={leftCardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="absolute bottom-[22%] left-[6%] z-30"
                    whileHover={{ scale: 1.05, y: -3 }}
                >
                    <div className={`glass-card-strong p-4 rounded-xl ${insightCards[2].borderColor} flex items-center gap-3 ${insightCards[2].shadowColor}`}>
                        <div className={`p-2 ${insightCards[2].bgColor} rounded-lg`}>{insightCards[2].icon}</div>
                        <div>
                            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">{insightCards[2].label}</div>
                            <div className="text-sm font-bold text-white">{insightCards[2].value}</div>
                        </div>
                        <div className="absolute top-1/2 -right-8 w-8 h-px bg-gradient-to-r from-emerald-500/50 to-transparent" />
                    </div>
                </motion.div>

                {/* Top Left */}
                <motion.div
                    custom={1.5}
                    variants={leftCardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="absolute top-[28%] left-[7%] z-30"
                    whileHover={{ scale: 1.05, y: -3 }}
                >
                    <div className={`glass-card-strong p-4 rounded-xl ${insightCards[3].borderColor} flex items-center gap-3 ${insightCards[3].shadowColor}`}>
                        <div className={`p-2 ${insightCards[3].bgColor} rounded-lg`}>{insightCards[3].icon}</div>
                        <div>
                            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">{insightCards[3].label}</div>
                            <div className="text-sm font-bold text-white">{insightCards[3].value}</div>
                        </div>
                        <div className="absolute top-1/2 -right-12 w-12 h-px bg-gradient-to-r from-amber-500/50 to-transparent" />
                    </div>
                </motion.div>
            </div>

            {/* Central HUD - Desktop */}
            <div className="absolute bottom-6 left-0 right-0 justify-center z-40 hidden md:flex">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 2, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                    viewport={{ once: true }}
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

            {/* Central HUD - Mobile */}
            <div className="mt-6 w-full flex justify-center z-40 md:hidden">
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/90 border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)] backdrop-blur-xl">
                    <div className="flex items-center gap-2 border-r border-white/10 pr-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Live</span>
                    </div>
                    <span className="text-emerald-400 font-bold text-sm">12 Weaknesses Found</span>
                </div>
            </div>
        </div>
    );
};
