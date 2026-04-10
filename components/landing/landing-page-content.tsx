"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles, TrendingUp, Shield, Zap, Target, Eye } from "lucide-react";
import { FeaturesSection } from "@/components/landing/features-section";
import { AnalysisPreview } from "@/components/landing/analysis-preview";
import { HowItWorks } from "@/components/landing/how-it-works";
import { motion, Variants, useScroll, useTransform } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

/* ─── Animated Word Reveal ─── */
const AnimatedWords = ({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) => {
    const words = text.split(" ");
    return (
        <span className="block">
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                        duration: 0.5,
                        delay: delay + i * 0.08,
                        ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className={`inline-block mr-[0.3em] ${className || ""}`}
                >
                    {word}
                </motion.span>
            ))}
        </span>
    );
};

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

/* ─── Floating Particles ─── */
const FloatingParticles = () => {
    const particles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        size: Math.random() * 3 + 1,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5,
    }));

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-foreground/10"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                    }}
                    animate={{
                        y: [-20, -60, -20],
                        x: [-10, 15, -10],
                        opacity: [0.1, 0.5, 0.1],
                    }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
};

export function LandingPageContent() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const heroRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });
    const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.95]);
    const heroY = useTransform(scrollYProgress, [0, 0.6], [0, 80]);

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

    const sectionVariants: Variants = {
        hidden: { opacity: 0, y: 60 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }
        }
    };

    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.1 }
        }
    };

    const staggerItem: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden relative selection:bg-foreground/20">

            {/* ─── ANIMATED BACKGROUND ─── */}
            <FloatingParticles />

            {/* Grid Overlay */}
            <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    backgroundSize: '80px 80px',
                    backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)'
                }}
            />
            <div className="fixed pointer-events-none inset-0 bg-background/60 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_100%)]" />

            {/* Morphing Gradient Orbs - Monochromatic */}
            <motion.div
                className="absolute top-[-10%] left-[30%] w-[500px] h-[500px] md:w-[900px] md:h-[700px] bg-foreground/5 rounded-full blur-[100px] md:blur-[150px] pointer-events-none mix-blend-screen animate-morph"
                animate={{ x: [0, 30, -20, 0], y: [0, -20, 15, 0] }}
                transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] md:w-[700px] md:h-[600px] bg-foreground/5 rounded-full blur-[80px] md:blur-[130px] pointer-events-none mix-blend-screen animate-morph"
                animate={{ x: [0, -25, 15, 0], y: [0, 20, -15, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
            <motion.div
                className="absolute top-[50%] left-[-10%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-foreground/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none mix-blend-screen"
                animate={{ x: [0, 20, -15, 0], y: [0, -30, 20, 0], scale: [1, 1.1, 0.95, 1] }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 4 }}
            />

            {/* ─── HERO SECTION ─── */}
            <motion.div ref={heroRef} style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}>
                <main className="pt-36 md:pt-44 pb-24 px-6 lg:px-12 max-w-7xl mx-auto relative z-10">
                    <div className="text-center max-w-5xl mx-auto mb-32 md:mb-48">

                        {/* Animated Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-muted/50 border border-border/50 text-xs font-semibold text-foreground mb-10 backdrop-blur-xl cursor-default shadow-sm hover:border-foreground/20 hover:shadow-md transition-all duration-500"
                        >
                            <motion.div
                                animate={{ rotate: [0, 15, -15, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Sparkles className="w-3.5 h-3.5 text-foreground" />
                            </motion.div>
                            <span className="text-foreground">
                                AI-Powered Competitor Deep Dive
                            </span>
                        </motion.div>

                        {/* Hero Title with Word-by-Word Animation */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight mb-8 leading-[1.08] text-foreground">
                            <AnimatedWords
                                text="Find the revenue leak"
                                className="block text-foreground drop-shadow-sm"
                                delay={0.3}
                            />
                            <AnimatedWords
                                text="in your landing page."
                                className="block text-foreground mt-2 opacity-80"
                                delay={0.8}
                            />
                        </h1>

                        {/* Subtitle with fade-in */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 1.3, ease: "easeOut" }}
                            className="text-base lg:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
                        >
                            Your product is ready to scale, but your competitors are stealing your customers.
                            Our AI analyzes their winning strategies to give you a step-by-step roadmap to{" "}
                            <motion.span
                                className="text-foreground font-semibold relative"
                                initial={{ backgroundSize: "0% 2px" }}
                                animate={{ backgroundSize: "100% 2px" }}
                                transition={{ duration: 0.8, delay: 2.2 }}
                                style={{
                                    backgroundImage: "linear-gradient(to right, #ffffff, #aaaaaa)",
                                    backgroundRepeat: "no-repeat",
                                    backgroundPosition: "0 100%",
                                }}
                            >
                                outsell them
                            </motion.span>.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 1.6 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14"
                        >
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
                                    <motion.span
                                        animate={{ x: [0, 4, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </motion.span>
                                </span>
                            </Button>
                        </motion.div>

                        {/* Trust Indicators with stagger */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="flex flex-wrap items-center justify-center gap-8 text-xs text-muted-foreground font-semibold uppercase tracking-wider"
                        >
                            {[
                                { icon: <TrendingUp className="w-4 h-4 text-foreground/80" />, text: "Analyzed 10k+ Battles" },
                                { icon: <Shield className="w-4 h-4 text-foreground/80" />, text: "Data-Backed Roadmap" },
                                { icon: <Zap className="w-4 h-4 text-foreground/80" />, text: "Results in 30 Seconds" },
                            ].map((item, i) => (
                                <motion.div key={i} variants={staggerItem} className="flex items-center gap-2.5 group cursor-default">
                                    <motion.div whileHover={{ scale: 1.2, rotate: 10 }} transition={{ type: "spring", stiffness: 300 }}>
                                        {item.icon}
                                    </motion.div>
                                    <span className="group-hover:text-foreground transition-colors">{item.text}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </main>
            </motion.div>

            {/* ─── ANALYSIS PREVIEW ─── */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={sectionVariants}
                className="relative mx-auto max-w-6xl aspect-[16/9] mb-32 md:mb-48 z-10 px-6"
            >
                <AnalysisPreview />
            </motion.div>

            {/* ─── STATS SECTION ─── */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={staggerContainer}
                className="relative z-10 max-w-5xl mx-auto mb-32 md:mb-48 px-6"
            >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {[
                        { value: 100, suffix: "+", label: "Analyses Run" },
                        { value: 97, suffix: "%", label: "Accuracy Rate" },
                        { value: 30, suffix: "s", label: "Avg. Scan Time" },
                        { value: 50, suffix: "+", label: "Growth Teams" },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            variants={staggerItem}
                            className="text-center p-6 rounded-3xl bg-card/40 border border-border/40 backdrop-blur-md hover:border-border hover:bg-card/60 transition-all duration-500 group shadow-sm"
                            whileHover={{ y: -5, transition: { duration: 0.3 } }}
                        >
                            <div className="text-3xl md:text-4xl font-black text-foreground mb-2 tracking-tighter">
                                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                            </div>
                            <div className="text-xs md:text-sm text-muted-foreground font-bold tracking-widest uppercase group-hover:text-foreground transition-colors">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* ─── HOW IT WORKS ─── */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={sectionVariants}
            >
                <HowItWorks />
            </motion.div>

            {/* ─── SOCIAL PROOF ─── */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={sectionVariants}
                className="text-center mb-32 md:mb-48 relative z-10 px-6 overflow-hidden"
            >
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em] mb-14 flex items-center justify-center gap-3">
                    <motion.span
                        className="h-px w-16 bg-gradient-to-r from-transparent to-border"
                        initial={{ width: 0 }}
                        whileInView={{ width: 64 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    />
                    Trusted by growth teams at
                    <motion.span
                        className="h-px w-16 bg-gradient-to-l from-transparent to-border"
                        initial={{ width: 0 }}
                        whileInView={{ width: 64 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    />
                </p>

                {/* Marquee-style logos */}
                <div className="relative w-full overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
                    <motion.div
                        className="flex items-center gap-20 whitespace-nowrap"
                        animate={{ x: ["0%", "-50%"] }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    >
                        {["Shopify", "Polar", "Notion", "Figma", "Linear", "Vercel", "Shopify", "Polar", "Notion", "Figma", "Linear", "Vercel"].map((name, i) => (
                            <span
                                key={i}
                                className="text-2xl font-black tracking-tight text-foreground/20 hover:text-foreground/80 transition-colors duration-500 cursor-default select-none"
                            >
                                {name}
                            </span>
                        ))}
                    </motion.div>
                </div>
            </motion.div>

            {/* ─── FEATURES SECTION ─── */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={sectionVariants}
            >
                <FeaturesSection />
            </motion.div>

            {/* ─── FINAL CTA SECTION ─── */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={sectionVariants}
                className="relative z-10 max-w-4xl mx-auto text-center py-32 md:py-40 px-6"
            >
                {/* CTA Glow Background */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[500px] h-[500px] bg-foreground/5 rounded-full blur-[120px] animate-breathe" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
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
                            <motion.span
                                animate={{ x: [0, 4, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <ArrowRight className="w-4 h-4" />
                            </motion.span>
                        </span>
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
}
