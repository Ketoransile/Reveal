"use client";

import { Monitor, Zap, FileText, ArrowRight, CheckCircle } from "lucide-react";
import { motion, Variants } from "framer-motion";

const steps = [
    {
        icon: <Monitor className="w-7 h-7 md:w-8 md:h-8 text-foreground/80 group-hover:text-foreground transition-colors" />,
        title: "Enter URLs",
        description: "Input your website and your top competitor's URL. That's all we need to start.",
        textColor: "text-foreground",
        bgClass: "bg-muted/30 group-hover:bg-muted/60",
    },
    {
        icon: <Zap className="w-7 h-7 md:w-8 md:h-8 text-foreground/80 group-hover:text-foreground transition-colors" />,
        title: "AI Scans Deep",
        description: "Our agents simulate a user journey, analyzing content, structure, and persuasion techniques hidden from plain sight.",
        textColor: "text-foreground",
        bgClass: "bg-muted/30 group-hover:bg-muted/60",
    },
    {
        icon: <FileText className="w-7 h-7 md:w-8 md:h-8 text-foreground/80 group-hover:text-foreground transition-colors" />,
        title: "Get Your Roadmap",
        description: "Receive a prioritized 'Victory Plan' showing exactly what to fix to steal their traffic.",
        textColor: "text-foreground",
        bgClass: "bg-muted/30 group-hover:bg-muted/60",
    }
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.25, delayChildren: 0.2 }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
    }
};

export const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-32 relative z-10 bg-background">
            <div className="container mx-auto px-6 max-w-7xl">

                {/* Section Header */}
                <div className="text-center mb-20 space-y-5">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted/50 border border-border/50 text-xs font-semibold text-foreground backdrop-blur-sm"
                    >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Simple 3-Step Process
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-3xl md:text-5xl font-black text-foreground tracking-tight"
                    >
                        How We{" "}
                        <span className="text-foreground/60">
                            Expose
                        </span>{" "}
                        Their Secrets
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-muted-foreground font-medium max-w-2xl mx-auto text-lg"
                    >
                        Three simple steps to go from &ldquo;guessing&rdquo; to &ldquo;knowing exactly what to do.&rdquo;
                    </motion.p>
                </div>

                {/* Steps */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid md:grid-cols-3 gap-8 md:gap-12 relative"
                >
                    {/* Animated Connecting Line (Desktop Only) */}
                    <motion.div
                        className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px z-0"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                        style={{ transformOrigin: "left" }}
                    >
                        <div className="w-full h-full bg-gradient-to-r from-border/10 via-border to-border/10" />
                    </motion.div>

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className={`relative z-10 flex flex-col items-center text-center group cursor-default`}
                            whileHover={{ y: -8 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                            {/* Icon Container */}
                            <div className={`w-24 h-24 md:w-28 md:h-28 rounded-3xl ${step.bgClass} border border-border/50 flex items-center justify-center mb-8 shadow-sm relative transition-all duration-500`}>
                                {/* Subtle bg glow on hover */}
                                <div className="absolute inset-0 rounded-3xl bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <motion.div
                                    whileHover={{ rotate: [0, -10, 10, 0] }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {step.icon}
                                </motion.div>

                                {/* Step Number Badge */}
                                <motion.div
                                    className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-background border border-border/60 flex items-center justify-center text-sm font-bold text-foreground shadow-sm"
                                    whileHover={{ scale: 1.15 }}
                                >
                                    {index + 1}
                                </motion.div>

                                {/* Ripple on hover */}
                                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-border/30 group-hover:scale-110 transition-all duration-700 pointer-events-none" />
                            </div>

                            <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
                            <p className="text-muted-foreground font-medium leading-relaxed max-w-xs group-hover:text-foreground/80 transition-colors duration-300">{step.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
