"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Loader2, Zap, Globe, Search, CheckCircle2, Wifi, ScanSearch, Brain, FileText, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { PricingModal } from "@/components/pricing-modal";
import { toast } from "sonner";

const ANALYSIS_STEPS = [
    { id: 1, label: "Connecting to websites", icon: Wifi, duration: 3000 },
    { id: 2, label: "Scanning your website", icon: ScanSearch, duration: 6000 },
    { id: 3, label: "Scanning competitor site", icon: Search, duration: 6000 },
    { id: 4, label: "AI deep-diving differences", icon: Brain, duration: 12000 },
    { id: 5, label: "Generating your report", icon: FileText, duration: 8000 },
];

export default function AnalysisPage() {
    const [yourWebsite, setYourWebsite] = useState("");
    const [competitorWebsite, setCompetitorWebsite] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPricing, setShowPricing] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [progressPercent, setProgressPercent] = useState(0);
    const router = useRouter();

    // Auto-advance progress steps while loading
    useEffect(() => {
        if (!loading) {
            setCurrentStep(0);
            setProgressPercent(0);
            return;
        }

        // Calculate cumulative durations for step transitions
        let totalElapsed = 0;
        const stepTimers: NodeJS.Timeout[] = [];

        ANALYSIS_STEPS.forEach((step, index) => {
            const timer = setTimeout(() => {
                setCurrentStep(index);
            }, totalElapsed);
            stepTimers.push(timer);
            totalElapsed += step.duration;
        });

        // Smooth progress bar animation
        const totalDuration = ANALYSIS_STEPS.reduce((sum, s) => sum + s.duration, 0);
        const progressInterval = setInterval(() => {
            setProgressPercent(prev => {
                if (prev >= 95) {
                    clearInterval(progressInterval);
                    return 95; // Hold at 95% until actually done
                }
                return prev + (95 / (totalDuration / 200)); // Smooth increment
            });
        }, 200);

        return () => {
            stepTimers.forEach(t => clearTimeout(t));
            clearInterval(progressInterval);
        };
    }, [loading]);

    const handleAnalysis = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setCurrentStep(0);
        setProgressPercent(0);

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    yourUrl: yourWebsite,
                    competitorUrl: competitorWebsite,
                }),
            });

            const data = await response.json();

            if (response.status === 403 || data.code === 'INSUFFICIENT_CREDITS' || (data.error && data.error.includes("credits"))) {
                setShowPricing(true);
                setLoading(false);
                return;
            }

            if (!response.ok) {
                toast.error("Unable to start analysis");
                setLoading(false);
                return;
            }

            // Complete the progress
            setProgressPercent(100);
            setCurrentStep(ANALYSIS_STEPS.length - 1);

            // Brief pause to show 100% before navigating
            await new Promise(resolve => setTimeout(resolve, 600));

            router.push('/dashboard');
            router.refresh();

        } catch (err) {
            toast.error("Connection Error", {
                description: "Unable to connect to the server. Please try again.",
            });
            setLoading(false);
        }
    };

    const activeStep = ANALYSIS_STEPS[currentStep] || ANALYSIS_STEPS[0];

    return (
        <div className="w-full max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <PricingModal open={showPricing} onOpenChange={setShowPricing} />
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
                    Start New Analysis
                </h1>
                <p className="text-muted-foreground text-sm">
                    See exactly why they are winning in just 30 seconds.
                </p>
            </div>

            <Card className="bg-card border-border shadow-lg">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-emerald-600" />
                        </div>
                        AI Comparison Engine
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                        Our agents will browse both sites, analyzing design, copy, technical performance, and SEO.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <form onSubmit={handleAnalysis} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Your Website */}
                            <div className="space-y-3">
                                <label htmlFor="your-website" className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-muted-foreground" />
                                    Your Website
                                </label>
                                <Input
                                    id="your-website"
                                    type="url"
                                    placeholder="https://yoursite.com"
                                    value={yourWebsite}
                                    onChange={(e) => setYourWebsite(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="bg-background border-input focus-visible:ring-emerald-500 focus-visible:border-emerald-500 h-11 rounded-lg text-foreground placeholder:text-muted-foreground disabled:opacity-50"
                                />
                                <p className="text-xs text-muted-foreground">
                                    The site you want to improve.
                                </p>
                            </div>

                            {/* Competitor Website */}
                            <div className="space-y-3">
                                <label htmlFor="competitor-website" className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    <Search className="w-4 h-4 text-muted-foreground" />
                                    Competitor's Website
                                </label>
                                <Input
                                    id="competitor-website"
                                    type="url"
                                    placeholder="https://competitor.com"
                                    value={competitorWebsite}
                                    onChange={(e) => setCompetitorWebsite(e.target.value)}
                                    required
                                    disabled={loading}
                                    className="bg-background border-input focus-visible:ring-emerald-500 focus-visible:border-emerald-500 h-11 rounded-lg text-foreground placeholder:text-muted-foreground disabled:opacity-50"
                                />
                                <p className="text-xs text-muted-foreground">
                                    The winner you want to overtake.
                                </p>
                            </div>
                        </div>

                        {/* Progress Section */}
                        <AnimatePresence>
                            {loading && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10 p-5 space-y-4">
                                        {/* Progress bar */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-muted-foreground font-medium">Analysis Progress</span>
                                                <span className="text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">
                                                    {Math.round(progressPercent)}%
                                                </span>
                                            </div>
                                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                                                    initial={{ width: "0%" }}
                                                    animate={{ width: `${progressPercent}%` }}
                                                    transition={{ duration: 0.3, ease: "easeOut" }}
                                                />
                                            </div>
                                        </div>

                                        {/* Steps */}
                                        <div className="space-y-2.5">
                                            {ANALYSIS_STEPS.map((step, index) => {
                                                const StepIcon = step.icon;
                                                const isActive = index === currentStep;
                                                const isCompleted = index < currentStep;
                                                const isPending = index > currentStep;

                                                return (
                                                    <motion.div
                                                        key={step.id}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: index * 0.08, duration: 0.3 }}
                                                        className={`flex items-center gap-3 py-1.5 px-3 rounded-lg transition-all duration-300 ${isActive
                                                                ? "bg-emerald-500/10 dark:bg-emerald-500/15"
                                                                : ""
                                                            }`}
                                                    >
                                                        {/* Step indicator */}
                                                        <div className="relative shrink-0">
                                                            {isCompleted ? (
                                                                <motion.div
                                                                    initial={{ scale: 0 }}
                                                                    animate={{ scale: 1 }}
                                                                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                                                >
                                                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                                                </motion.div>
                                                            ) : isActive ? (
                                                                <div className="relative">
                                                                    <StepIcon className="w-5 h-5 text-emerald-500" />
                                                                    <motion.div
                                                                        className="absolute -inset-1 rounded-full border-2 border-emerald-500/40"
                                                                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                                                                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <StepIcon className="w-5 h-5 text-muted-foreground/40" />
                                                            )}
                                                        </div>

                                                        {/* Step label */}
                                                        <span
                                                            className={`text-sm font-medium transition-colors duration-300 ${isCompleted
                                                                    ? "text-emerald-600 dark:text-emerald-400"
                                                                    : isActive
                                                                        ? "text-foreground"
                                                                        : "text-muted-foreground/50"
                                                                }`}
                                                        >
                                                            {step.label}
                                                        </span>

                                                        {/* Active dots animation */}
                                                        {isActive && (
                                                            <div className="ml-auto flex gap-1">
                                                                {[0, 1, 2].map(dot => (
                                                                    <motion.div
                                                                        key={dot}
                                                                        className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                                                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                                                        transition={{
                                                                            duration: 1,
                                                                            repeat: Infinity,
                                                                            delay: dot * 0.2,
                                                                        }}
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}

                                                        {isCompleted && (
                                                            <span className="ml-auto text-xs text-emerald-500/70 font-medium">Done</span>
                                                        )}
                                                    </motion.div>
                                                );
                                            })}
                                        </div>

                                        {/* Tip */}
                                        <motion.p
                                            className="text-xs text-muted-foreground text-center pt-1 flex items-center justify-center gap-1.5"
                                            animate={{ opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                        >
                                            <Sparkles className="w-3 h-3" />
                                            This usually takes 25–40 seconds
                                        </motion.p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Button
                            type="submit"
                            disabled={loading}
                            size="lg"
                            className="w-full h-12 text-base rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-md font-semibold disabled:opacity-80"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    {activeStep.label}...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-5 h-5 mr-2" />
                                    Start Competitive Analysis
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: "Deep Traffic Scan" },
                    { label: "UX/UI Teardown" },
                    { label: "Conversion Tactics" },
                    { label: "Keywords Gap" },
                ].map((item, i) => (
                    <div key={i} className="flex items-center justify-center p-3 rounded-lg bg-card border border-border text-xs font-medium text-muted-foreground shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
                        {item.label}
                    </div>
                ))}
            </div>
        </div>
    );
}
