"use client";

import { Monitor, Zap, FileText, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
    {
        icon: <Monitor className="w-8 h-8 text-blue-400" />,
        title: "1. Enter URLs",
        description: "Input your website and your top competitor's URL. That's all we need to start.",
        color: "blue"
    },
    {
        icon: <Zap className="w-8 h-8 text-amber-400" />,
        title: "2. AI Scans Deep",
        description: "Our agents simulate a user journey, analyzing content, structure, and persuasion techniques hidden from plain sight.",
        color: "amber"
    },
    {
        icon: <FileText className="w-8 h-8 text-emerald-400" />,
        title: "3. Get Your Roadmap",
        description: "Receive a prioritized 'Victory Plan' showing exactly what to fix to steal their traffic.",
        color: "emerald"
    }
];

export const HowItWorks = () => {
    return (
        <section id="how-it-works" className="py-32 relative z-10">
            <div className="container mx-auto px-6 max-w-7xl">

                <div className="text-center mb-20 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                        How We <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Expose</span> Their Secrets
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Three simple steps to go from "guessing" to "knowing exactly what to do."
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-12 relative">
                    {/* Connecting Line (Desktop Only) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-500/30 via-amber-500/30 to-emerald-500/30 z-0" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2, duration: 0.6 }}
                            viewport={{ once: true }}
                            className="relative z-10 flex flex-col items-center text-center group"
                        >
                            {/* Icon Circle */}
                            <div className={`w-24 h-24 rounded-3xl bg-slate-900 border border-white/10 flex items-center justify-center mb-8 shadow-2xl relative transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2 group-hover:border-${step.color}-500/50`}>
                                <div className={`absolute inset-0 bg-${step.color}-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                                {step.icon}

                                {/* Step Number Badge */}
                                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                                    {index + 1}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                            <p className="text-slate-400 leading-relaxed max-w-xs">{step.description}</p>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};
