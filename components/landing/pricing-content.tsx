"use client";

import { Badge } from "@/components/ui/badge";
import { Check, Info, Zap, X, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
    }
};

const featureVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.08, duration: 0.4 }
    })
};

export function PricingContent() {
    return (
        <>
            {/* Animated Background */}
            <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    backgroundSize: '80px 80px',
                    backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)'
                }}
            />
            <div className="fixed pointer-events-none inset-0 bg-slate-950/60 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_100%)]" />

            {/* Morphing Gradient Orbs */}
            <motion.div
                className="absolute top-[-5%] left-[20%] w-[500px] h-[500px] md:w-[800px] md:h-[600px] bg-gradient-to-br from-emerald-600/20 via-teal-500/15 to-cyan-600/15 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-morph"
                animate={{ x: [0, 30, -20, 0], y: [0, -20, 15, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] md:w-[600px] md:h-[500px] bg-gradient-to-tl from-blue-600/10 via-indigo-500/10 to-purple-600/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-morph"
                animate={{ x: [0, -25, 15, 0], y: [0, 20, -15, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            />

            {/* Floating Particles */}
            {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-white/15 pointer-events-none"
                    style={{
                        width: Math.random() * 3 + 1,
                        height: Math.random() * 3 + 1,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [-15, -40, -15],
                        opacity: [0.1, 0.4, 0.1],
                    }}
                    transition={{
                        duration: Math.random() * 8 + 8,
                        delay: Math.random() * 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}

            <section className="pt-32 pb-20 relative z-10">
                <div className="container px-4 md:px-6 mx-auto">
                    {/* Header */}
                    <div className="flex flex-col items-center justify-center space-y-5 text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium uppercase tracking-wider backdrop-blur-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                                <Sparkles className="w-3 h-3 mr-1.5 inline" />
                                Simple & Transparent
                            </Badge>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.15 }}
                            className="text-3xl md:text-5xl font-black tracking-tight text-white mb-2"
                        >
                            Unlock Your{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                                Competitive Edge
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="max-w-[600px] text-slate-400 text-base md:text-lg font-light leading-relaxed"
                        >
                            No hidden fees. No complicated tiers. Just the raw power you need to win.
                        </motion.p>
                    </div>

                    {/* Pricing Cards */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch"
                    >
                        {/* Starter Plan */}
                        <motion.div
                            variants={cardVariants}
                            whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                            className="flex flex-col p-8 rounded-3xl bg-slate-900/60 backdrop-blur-sm border border-white/5 hover:border-emerald-500/20 transition-all duration-500 relative group shadow-lg hover:shadow-[0_0_40px_rgba(16,185,129,0.1)]"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-100">Starter</h3>
                                    <p className="text-slate-400 text-sm mt-1 font-medium">For individuals exploring the market.</p>
                                </div>
                                <motion.div
                                    className="p-2.5 bg-slate-800/50 rounded-xl"
                                    whileHover={{ rotate: 10, scale: 1.1 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Info className="w-5 h-5 text-slate-300" />
                                </motion.div>
                            </div>

                            <div className="mb-8 flex items-baseline gap-1">
                                <motion.span
                                    className="text-5xl font-black text-white tracking-tight"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
                                >
                                    Free
                                </motion.span>
                                <span className="text-slate-500 text-sm font-medium">/forever</span>
                            </div>

                            <div className="h-px w-full bg-gradient-to-r from-white/10 to-transparent mb-8" />

                            <ul className="space-y-4 mb-10 flex-1">
                                {[
                                    { text: "3 Competitor Analyses", included: true },
                                    { text: "Basic Conversion Scores", included: true },
                                    { text: "Standard Support", included: true },
                                    { text: "Deep Dive AI Analysis", included: false },
                                ].map((feature, i) => (
                                    <motion.li
                                        key={i}
                                        custom={i}
                                        variants={featureVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className={`flex items-center gap-3 ${feature.included ? "text-slate-300" : "text-slate-500"}`}
                                    >
                                        <div className={`p-0.5 rounded-full ${feature.included ? "bg-slate-800/80 text-emerald-400" : "bg-slate-800/30 text-slate-600"}`}>
                                            {feature.included ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                        </div>
                                        <span className={`text-sm ${!feature.included ? "line-through" : ""}`}>{feature.text}</span>
                                    </motion.li>
                                ))}
                            </ul>

                            <Link href="/signup" className="w-full mt-auto">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all border border-white/5 hover:border-white/15 text-sm group cursor-pointer"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        Get Started Free
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </motion.button>
                            </Link>
                        </motion.div>

                        {/* Pro Plan */}
                        <motion.div
                            variants={cardVariants}
                            whileHover={{ y: -6, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                            className="flex flex-col p-8 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-emerald-500/50 relative shadow-[0_0_40px_rgba(16,185,129,0.15)] group transition-all duration-500 hover:shadow-[0_0_60px_rgba(16,185,129,0.25)]"
                        >
                            {/* Popular Badge */}
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.8 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
                                className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-[10px] font-black px-4 py-1.5 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] tracking-wide uppercase z-20"
                            >
                                Most Popular
                            </motion.div>

                            {/* Gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-transparent rounded-3xl pointer-events-none" />

                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">Pro Master</h3>
                                    <p className="text-emerald-100/70 text-sm mt-1 font-medium">For serious growth hackers & teams.</p>
                                </div>
                                <motion.div
                                    className="p-2.5 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-500/30"
                                    whileHover={{ rotate: 10, scale: 1.1 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Zap className="w-5 h-5 text-emerald-400" />
                                </motion.div>
                            </div>

                            <div className="mb-8 flex items-baseline gap-1 relative z-10">
                                <motion.span
                                    className="text-5xl font-black text-white tracking-tight"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.7, duration: 0.5, type: "spring" }}
                                >
                                    $29
                                </motion.span>
                                <span className="text-slate-400 text-sm font-medium">/month</span>
                            </div>

                            <div className="h-px w-full bg-gradient-to-r from-emerald-500/30 to-transparent mb-8" />

                            <ul className="space-y-4 mb-10 flex-1 relative z-10">
                                {[
                                    "Unlimited Analyses",
                                    "Deep Dive AI Analysis",
                                    "Full Tech Stack Reveal",
                                    "White-label PDF Reports",
                                    "24/7 Priority Support",
                                ].map((feature, i) => (
                                    <motion.li
                                        key={i}
                                        custom={i}
                                        variants={featureVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="flex items-center gap-3 text-slate-200"
                                    >
                                        <div className={`p-0.5 rounded-full ${i === 0 ? "bg-emerald-500/20 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]" : "bg-emerald-500/10 text-emerald-400"}`}>
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <span className={`text-sm ${i === 0 ? "font-medium text-white" : ""}`}>{feature}</span>
                                    </motion.li>
                                ))}
                            </ul>

                            <Link href={`/api/checkout?products=${process.env.NEXT_PUBLIC_POLAR_PRICE_ID_PRO}`} className="w-full mt-auto relative z-10">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm shadow-[0_4px_20px_rgba(16,185,129,0.25)] hover:shadow-[0_4px_40px_rgba(16,185,129,0.4)] transition-all relative overflow-hidden group cursor-pointer"
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                    <span className="relative flex items-center justify-center gap-2">
                                        Unlock Everything
                                        <motion.span
                                            animate={{ x: [0, 4, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                        >
                                            <ArrowRight className="w-4 h-4" />
                                        </motion.span>
                                    </span>
                                </motion.button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
