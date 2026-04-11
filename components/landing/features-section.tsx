"use client";

import { Badge } from "@/components/ui/badge";
import { BarChart3, Zap, Lock, Search, MousePointerClick, FileText, Sparkles } from "lucide-react";

const features = [
    {
        icon: <Sparkles className="w-7 h-7" />,
        title: "AI Competitor Comparison",
        description: "Get an objective, side-by-side analysis of your landing page vs. your top competitor. See exactly who wins and why.",
        iconColor: "text-foreground group-hover:text-foreground/80",
        bgColor: "bg-foreground/5",
        hoverBorder: "hover:border-foreground/20",
        glowColor: "hover:shadow-md",
    },
    {
        icon: <MousePointerClick className="w-7 h-7" />,
        title: "Conversion Gap Analysis",
        description: "Identify specific features and psychological triggers your competitor is using to convert users that you are missing.",
        iconColor: "text-foreground group-hover:text-foreground/80",
        bgColor: "bg-foreground/5",
        hoverBorder: "hover:border-foreground/20",
        glowColor: "hover:shadow-md",
    },
    {
        icon: <FileText className="w-7 h-7" />,
        title: "Actionable Copy Fixes",
        description: "Don't just get data—get solutions. Our AI rewrites your headlines and CTAs to match the persuasion level of market leaders.",
        iconColor: "text-foreground group-hover:text-foreground/80",
        bgColor: "bg-foreground/5",
        hoverBorder: "hover:border-foreground/20",
        glowColor: "hover:shadow-md",
    },
    {
        icon: <Zap className="w-7 h-7" />,
        title: "Strategic SWOT Analysis",
        description: "Understand the strengths and weaknesses of both pages. Leverage your strengths and fix your weaknesses to dominate.",
        iconColor: "text-foreground group-hover:text-foreground/80",
        bgColor: "bg-foreground/5",
        hoverBorder: "hover:border-foreground/20",
        glowColor: "hover:shadow-md",
    },
    {
        icon: <Lock className="w-7 h-7" />,
        title: "Trust & Authority Check",
        description: "Analyze how your competitor builds trust through testimonials, logos, and guarantees, and how you can do it better.",
        iconColor: "text-foreground group-hover:text-foreground/80",
        bgColor: "bg-foreground/5",
        hoverBorder: "hover:border-foreground/20",
        glowColor: "hover:shadow-md",
    },
    {
        icon: <BarChart3 className="w-7 h-7" />,
        title: "AI Chatbot Analyst",
        description: "Have follow-up questions? Chat directly with the AI analyst to get deeper insights and custom advice for your specific situation.",
        iconColor: "text-foreground group-hover:text-foreground/80",
        bgColor: "bg-foreground/5",
        hoverBorder: "hover:border-foreground/20",
        glowColor: "hover:shadow-md",
    },
];

export const FeaturesSection = () => {
    return (
        <section id="features" className="py-24 relative overflow-hidden bg-background">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-foreground/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-foreground/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                {/* Section Header */}
                <div className="flex flex-col items-center justify-center space-y-5 text-center mb-20">
                    <Badge variant="outline" className="border-border/50 text-foreground bg-muted/50 px-4 py-1.5 text-sm uppercase tracking-wider backdrop-blur-sm">
                        Powerful Features
                    </Badge>

                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
                        Complete Intelligence{" "}
                        <span className="text-foreground/70">Toolkit</span>
                    </h2>

                    <p className="max-w-[700px] text-muted-foreground font-medium md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Everything you need to dissect your competitor&apos;s strategy and build a better one.
                    </p>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`group p-8 rounded-3xl bg-card border border-border/40 ${feature.hoverBorder} transition-all duration-500 hover:bg-muted/10 ${feature.glowColor} relative overflow-hidden cursor-default hover:-translate-y-2`}
                        >
                            {/* Card hover gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl" />

                            <div className={`w-14 h-14 rounded-2xl ${feature.bgColor} border border-border/50 flex items-center justify-center mb-6 relative z-10 transition-transform duration-500 group-hover:scale-110`}>
                                <div className={feature.iconColor}>
                                    {feature.icon}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-foreground mb-3 relative z-10 transition-colors">{feature.title}</h3>
                            <p className="text-muted-foreground font-medium leading-relaxed relative z-10 group-hover:text-foreground/80 transition-colors duration-300">{feature.description}</p>
                        </div>
                    ))}
                </div>

                {/* Coming Soon Feature */}
                <div className="mt-16 max-w-7xl mx-auto px-2 md:px-4">
                    <div className="relative group p-5 md:p-10 rounded-3xl bg-card border border-border/50 hover:border-foreground/20 transition-all duration-500 hover:shadow-lg overflow-hidden hover:-translate-y-1">
                        {/* Animated Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        {/* Coming Soon Badge */}
                        <div className="absolute top-6 right-6">
                            <Badge className="bg-foreground text-background border-0 px-3 py-1 text-[10px] font-black uppercase tracking-wider shadow-md animate-pulse">
                                <Sparkles className="w-3 h-3 mr-1 inline" />
                                Coming Soon
                            </Badge>
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                            {/* Icon */}
                            <div className="w-16 h-16 rounded-2xl bg-foreground/10 border border-border flex items-center justify-center shrink-0">
                                <Search className="w-8 h-8 text-foreground transition-colors" />
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <h3 className="text-2xl md:text-3xl font-black text-foreground mb-4">
                                    Auto-Competitor Discovery & Multi-Analysis
                                </h3>
                                <p className="text-muted-foreground font-medium text-lg leading-relaxed mb-4 max-w-3xl">
                                    Just paste your website URL and our AI will automatically discover all top competitors across the internet. We&apos;ll analyze each one and show you exactly why they&apos;re converting better than you.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    {[
                                        { text: "Automatic competitor detection" },
                                        { text: "Multi-site comparison" },
                                        { text: "Conversion gap analysis" },
                                    ].map((item, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-2 text-sm text-foreground/80 font-bold"
                                        >
                                            <div className="w-1.5 h-1.5 rounded-full bg-foreground" />
                                            <span>{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
