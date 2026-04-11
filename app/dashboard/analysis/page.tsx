"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Loader2, Zap, Globe, Search, CheckCircle2, Wifi, ScanSearch, Brain, FileText, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

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
        <div className="w-full max-w-5xl space-y-8">
            <PricingModal open={showPricing} onOpenChange={setShowPricing} />

            <div className="pb-8 border-b border-border">
                <h1 className="text-3xl md:text-4xl font-semibold font-display tracking-tight text-foreground mb-2">
                    Start New Analysis
                </h1>
                <p className="text-muted-foreground text-sm font-medium">
                    See exactly why they are winning in just 30 seconds.
                </p>
            </div>

            <Card className="bg-card border-border">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                            <Zap className="w-4 h-4 text-muted-foreground" />
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
                                    className="bg-background border-input h-11 rounded-lg text-foreground placeholder:text-muted-foreground disabled:opacity-50"
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
                                    className="bg-background border-input h-11 rounded-lg text-foreground placeholder:text-muted-foreground disabled:opacity-50"
                                />
                                <p className="text-xs text-muted-foreground">
                                    The winner you want to overtake.
                                </p>
                            </div>
                        </div>

                        {/* Progress Section */}
                        {loading && (
                            <div className="overflow-hidden">
                                <div className="rounded-lg border border-border bg-muted/30 p-5 space-y-4">
                                    {/* Progress bar */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-muted-foreground font-medium">Analysis Progress</span>
                                            <span className="text-foreground font-semibold tabular-nums">
                                                {Math.round(progressPercent)}%
                                            </span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-foreground/70 rounded-full transition-all duration-300 ease-out"
                                                style={{ width: `${progressPercent}%` }}
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
                                                <div
                                                    key={step.id}
                                                    className={`flex items-center gap-3 py-1.5 px-3 rounded-lg ${isActive
                                                            ? "bg-accent"
                                                            : ""
                                                        }`}
                                                >
                                                    {/* Step indicator */}
                                                    <div className="relative shrink-0">
                                                        {isCompleted ? (
                                                            <CheckCircle2 className="w-5 h-5 text-foreground" />
                                                        ) : isActive ? (
                                                            <div className="relative">
                                                                <StepIcon className="w-5 h-5 text-foreground" />
                                                            </div>
                                                        ) : (
                                                            <StepIcon className="w-5 h-5 text-muted-foreground/40" />
                                                        )}
                                                    </div>

                                                    {/* Step label */}
                                                    <span
                                                        className={`text-sm font-medium ${isCompleted
                                                                ? "text-foreground dark:text-foreground"
                                                                : isActive
                                                                    ? "text-foreground"
                                                                    : "text-muted-foreground/50"
                                                            }`}
                                                    >
                                                        {step.label}
                                                    </span>

                                                    {/* Active dots */}
                                                    {isActive && (
                                                        <div className="ml-auto flex gap-1">
                                                            {[0, 1, 2].map(dot => (
                                                                <div
                                                                    key={dot}
                                                                    className="w-1.5 h-1.5 rounded-full bg-foreground/50 animate-pulse"
                                                                />
                                                            ))}
                                                        </div>
                                                    )}

                                                    {isCompleted && (
                                                        <span className="ml-auto text-xs text-foreground font-medium">Done</span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Tip */}
                                    <p className="text-xs text-muted-foreground text-center pt-1 flex items-center justify-center gap-1.5">
                                        <Sparkles className="w-3 h-3" />
                                        This usually takes 25–40 seconds
                                    </p>
                                </div>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading}
                            size="lg"
                            className="w-full h-12 text-base rounded-lg font-semibold disabled:opacity-80"
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
                    <div key={i} className="flex items-center justify-center p-3 rounded-lg bg-card border border-border text-xs font-medium text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-foreground/30 mr-2" />
                        {item.label}
                    </div>
                ))}
            </div>
        </div>
    );
}
