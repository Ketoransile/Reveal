"use client";

import { Search, Globe, Zap, Layout, BarChart3, ShieldCheck } from "lucide-react";

export const AnalysisPreview = () => {
    const insightCards = [
        {
            icon: <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-foreground" />,
            label: "Traffic Secret",
            value: "Top Source: LinkedIn Ads",
            borderColor: "border-border/50",
            shadowColor: "shadow-lg",
            bgColor: "bg-muted/50",
        },
        {
            icon: <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-foreground" />,
            label: "Strategic Angle",
            value: "Value Prop: Speed",
            borderColor: "border-border/50",
            shadowColor: "shadow-lg",
            bgColor: "bg-muted/50",
        },
        {
            icon: <Search className="w-4 h-4 md:w-5 md:h-5 text-foreground" />,
            label: "SEO Opportunity",
            value: 'Missed Keyword: "AI CRM"',
            borderColor: "border-border/50",
            shadowColor: "shadow-lg",
            bgColor: "bg-muted/50",
        },
        {
            icon: <Layout className="w-4 h-4 md:w-5 md:h-5 text-foreground" />,
            label: "UX Friction",
            value: "Low Contrast CTA",
            borderColor: "border-border/50",
            shadowColor: "shadow-lg",
            bgColor: "bg-muted/50",
        },
    ];

    return (
        <div className="relative w-full h-full rounded-3xl bg-card border border-border/40 shadow-2xl flex flex-col md:block items-center justify-center p-4 md:p-12 overflow-hidden">

            {/* Ambient Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/[0.02] via-transparent to-foreground/[0.01]" />

            {/* Animated Scan Line */}
            <div
                className="hidden md:block absolute left-0 right-0 h-[2px] z-20 pointer-events-none animate-scan"
                style={{
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), rgba(255,255,255,0.4), transparent)",
                    boxShadow: "0 0 20px rgba(255,255,255,0.1), 0 0 60px rgba(255,255,255,0.1)"
                }}
            />

            {/* Orbiting Ring (Desktop) */}
            <div className="hidden md:block absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-1/2 left-1/2 w-[350px] h-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-border/30 animate-spin-slow" />
                <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-border/20 animate-spin-reverse" />
            </div>

            {/* Central Browser Wireframe */}
            <div className="relative w-full max-w-lg aspect-[3/4] md:aspect-[4/3] bg-background rounded-xl border border-border shadow-xl overflow-hidden flex flex-col z-10 md:mx-auto">
                {/* Browser Header */}
                <div className="h-8 bg-muted/30 border-b border-border flex items-center px-4 gap-2">
                    <div className="w-3 h-3 rounded-full bg-border/80" />
                    <div className="w-3 h-3 rounded-full bg-border/80" />
                    <div className="w-3 h-3 rounded-full bg-border/80" />
                    <div className="ml-4 h-4 w-32 bg-muted rounded-full opacity-50 text-[10px] flex items-center justify-center text-muted-foreground">competitor.com</div>
                </div>

                {/* Wireframe Body */}
                <div className="flex-1 p-6 flex flex-col space-y-6 relative">
                    {/* Hero Block */}
                    <div className="space-y-3">
                        <div className="h-8 w-3/4 bg-muted/80 rounded-lg animate-pulse" />
                        <div className="h-4 w-1/2 bg-muted/40 rounded-lg animate-pulse" />
                    </div>

                    {/* Hero Image area */}
                    <div className="h-32 w-full bg-gradient-to-br from-muted to-muted/40 rounded-xl border border-border/50 flex items-center justify-center relative overflow-hidden">
                        <Globe className="text-foreground w-12 h-12 opacity-10" />

                        {/* Pulsing dots (Disabled on mobile to save CPU) */}
                        <div className="absolute top-3 right-3 hidden md:block">
                            <div className="relative">
                                <div className="w-3 h-3 bg-foreground rounded-full animate-ping absolute inset-0 opacity-40" />
                                <div className="w-3 h-3 bg-foreground rounded-full relative z-10" />
                            </div>
                        </div>

                        <div className="absolute bottom-3 left-3 hidden md:block">
                            <div className="relative">
                                <div className="w-3 h-3 bg-foreground rounded-full animate-ping absolute inset-0 opacity-40" />
                                <div className="w-3 h-3 bg-foreground rounded-full relative z-10" />
                            </div>
                        </div>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {[0, 1].map(idx => (
                            <div key={idx} className="h-24 rounded-lg bg-muted/30 border border-border/30 p-3 space-y-2 relative">
                                <div className="w-8 h-8 rounded bg-muted animate-pulse" />
                                <div className="w-full h-2 bg-border/30 rounded" />
                                <div className="w-2/3 h-2 bg-border/20 rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── Mobile Insight Cards (Stacked below) ─── */}
            <div className="md:hidden w-full mt-6 space-y-3 z-30">
                {insightCards.map((card, i) => (
                    <div
                        key={i}
                        className={`p-3 rounded-xl border ${card.borderColor} flex items-center gap-3 ${card.shadowColor} bg-background`}
                    >
                        <div className={`p-2 ${card.bgColor} rounded-lg`}>{card.icon}</div>
                        <div>
                            <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{card.label}</div>
                            <div className="text-sm font-bold text-foreground">{card.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ─── Desktop Floating Insight Cards ─── */}
            <div className="hidden md:block">
                {/* Top Right */}
                <div className="absolute top-[18%] right-[8%] z-30 hover:scale-105 hover:-translate-y-1 transition-transform duration-300">
                    <div className={`p-4 rounded-xl bg-background border ${insightCards[0].borderColor} flex items-center gap-3 ${insightCards[0].shadowColor}`}>
                        <div className={`p-2 ${insightCards[0].bgColor} rounded-lg`}>{insightCards[0].icon}</div>
                        <div>
                            <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{insightCards[0].label}</div>
                            <div className="text-sm font-bold text-foreground">{insightCards[0].value}</div>
                        </div>
                        <div className="absolute top-1/2 -left-8 w-8 h-px bg-gradient-to-l from-border to-transparent" />
                    </div>
                </div>

                {/* Middle Right */}
                <div className="absolute top-[45%] right-[5%] z-30 hover:scale-105 hover:-translate-y-1 transition-transform duration-300">
                    <div className={`p-4 rounded-xl bg-background border ${insightCards[1].borderColor} flex items-center gap-3 ${insightCards[1].shadowColor}`}>
                        <div className={`p-2 ${insightCards[1].bgColor} rounded-lg`}>{insightCards[1].icon}</div>
                        <div>
                            <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{insightCards[1].label}</div>
                            <div className="text-sm font-bold text-foreground">{insightCards[1].value}</div>
                        </div>
                        <div className="absolute top-1/2 -left-12 w-12 h-px bg-gradient-to-l from-border to-transparent" />
                    </div>
                </div>

                {/* Bottom Left */}
                <div className="absolute bottom-[22%] left-[6%] z-30 hover:scale-105 hover:-translate-y-1 transition-transform duration-300">
                    <div className={`p-4 rounded-xl bg-background border ${insightCards[2].borderColor} flex items-center gap-3 ${insightCards[2].shadowColor}`}>
                        <div className={`p-2 ${insightCards[2].bgColor} rounded-lg`}>{insightCards[2].icon}</div>
                        <div>
                            <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{insightCards[2].label}</div>
                            <div className="text-sm font-bold text-foreground">{insightCards[2].value}</div>
                        </div>
                        <div className="absolute top-1/2 -right-8 w-8 h-px bg-gradient-to-r from-border to-transparent" />
                    </div>
                </div>

                {/* Top Left */}
                <div className="absolute top-[28%] left-[7%] z-30 hover:scale-105 hover:-translate-y-1 transition-transform duration-300">
                    <div className={`p-4 rounded-xl bg-background border ${insightCards[3].borderColor} flex items-center gap-3 ${insightCards[3].shadowColor}`}>
                        <div className={`p-2 ${insightCards[3].bgColor} rounded-lg`}>{insightCards[3].icon}</div>
                        <div>
                            <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{insightCards[3].label}</div>
                            <div className="text-sm font-bold text-foreground">{insightCards[3].value}</div>
                        </div>
                        <div className="absolute top-1/2 -right-12 w-12 h-px bg-gradient-to-r from-border to-transparent" />
                    </div>
                </div>
            </div>

            {/* Central HUD - Desktop */}
            <div className="absolute bottom-6 left-0 right-0 justify-center z-40 hidden md:flex">
                <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-background border border-border shadow-md backdrop-blur-xl">
                    <div className="flex items-center gap-2 border-r border-border pr-4">
                        <div className="relative">
                            <div className="w-3 h-3 bg-foreground rounded-full animate-pulse" />
                            <div className="absolute inset-0 bg-foreground rounded-full animate-ping opacity-40" />
                        </div>
                        <span className="text-[10px] font-black text-foreground uppercase tracking-widest">Live Analysis</span>
                    </div>
                    <div>
                        <span className="text-muted-foreground font-medium text-xs mr-2">Competitive Gap:</span>
                        <span className="text-foreground font-black text-sm tracking-tight">Found 12 Weaknesses</span>
                    </div>
                </div>
            </div>

            {/* Central HUD - Mobile */}
            <div className="mt-6 w-full flex justify-center z-40 md:hidden">
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-background border border-border shadow-md backdrop-blur-xl">
                    <div className="flex items-center gap-2 border-r border-border pr-3">
                        <div className="w-2 h-2 bg-foreground rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-foreground uppercase tracking-widest">Live</span>
                    </div>
                    <span className="text-foreground font-black text-sm tracking-tight">12 Weaknesses Found</span>
                </div>
            </div>
        </div>
    );
};
