"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ArrowLeft,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CheckCircle2,
    Target,
    Lightbulb,
    BarChart3,
    FileText,
    Award,
    Zap,
    ArrowRight,
    Trophy,
    LayoutDashboard,
    Globe,
    ChevronDown,
    Sparkles
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AnalysisChat } from "@/components/analysis-chat";
import { motion } from "framer-motion";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";

// Custom Circular Progress Component - Refined
const CircularScore = ({ score, label, color, delay = 0 }: { score: number, label: string, color: string, delay?: number }) => {
    const circumference = 2 * Math.PI * 46; // radius slightly larger
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center space-y-3 group cursor-default">
            <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Glow Effect */}
                <div className={`absolute inset-0 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 ${color.replace('text-', 'bg-')}`}></div>

                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90 drop-shadow-sm">
                    <circle
                        cx="80"
                        cy="80"
                        r="46"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-muted/20"
                    />
                    {/* Progress Circle */}
                    <motion.circle
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut", delay }}
                        cx="80"
                        cy="80"
                        r="46"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeLinecap="round"
                        className={`${color}`}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: delay + 0.5 }}
                        className={`text-4xl font-black tracking-tight ${color.replace('text-', 'text-')}`}
                    >
                        {score}
                    </motion.span>
                </div>
            </div>
            <span className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">{label}</span>
        </div>
    );
};

export default function ReportPage() {
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            if (!params.id) return;

            try {
                const { data: analysis, error: analysisError } = await supabase
                    .from('analyses')
                    .select('*')
                    .eq('id', params.id)
                    .single();

                if (analysisError) throw analysisError;

                const { data: report, error: reportError } = await supabase
                    .from('reports')
                    .select('*')
                    .eq('analysis_id', params.id)
                    .maybeSingle();

                if (reportError) console.error("Error fetching report details:", reportError);

                setData({ ...analysis, reports: report ? [report] : [] });
            } catch (err: any) {
                console.error("Error fetching report:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id, supabase]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-border"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
                </div>
                <p className="text-lg font-medium text-muted-foreground animate-pulse tracking-wide">Loading Analysis...</p>
            </div>
        );
    }

    if (error || !data || !data.reports?.[0]) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="p-8 bg-muted rounded-3xl shadow-sm">
                <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto" />
                <h2 className="text-xl font-bold text-foreground mt-4">Report Not Found</h2>
                <p className="text-muted-foreground mt-2 max-w-xs mx-auto">We couldn't retrieve this analysis report details.</p>
            </div>
            <Link href="/dashboard"><Button variant="outline" className="rounded-full px-6">Return to Dashboard</Button></Link>
        </div>
    );

    const report = data.reports[0];
    const deepAnalysis = report.deep_analysis || {};
    const yourScore = report.conversion_score || 0;
    const scores = deepAnalysis.scores || { yours: yourScore, competitor: 0 };
    const competitorScore = scores.competitor || (report.winner === 'competitor' ? yourScore + 10 : yourScore - 10);
    const isWinner = report.winner === 'yours';
    const verdict = deepAnalysis.verdict || "Analysis complete.";
    const rewrites = report.actionable_fixes || [];
    const gapAnalysis = deepAnalysis.gap_analysis || [];

    const yourHost = new URL(data.your_url).hostname.replace('www.', '');
    const compHost = new URL(data.competitor_url).hostname.replace('www.', '');

    const scoreDifference = Math.abs(yourScore - competitorScore);

    return (
        <div className="w-full max-w-[1400px] mx-auto space-y-8 pb-32 px-4 sm:px-6">
            {/* Minimal Header */}
            <div className="flex items-center justify-between py-4">
                <Link href="/dashboard" className="group">
                    <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <div className="p-2 rounded-full bg-card shadow-sm ring-1 ring-slate-100 group-hover:ring-slate-300 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">Dashboard</span>
                    </div>
                </Link>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
                        Analyzed {new Date().toLocaleDateString()}
                    </span>
                </div>
            </div>

            {/* Hero Battle Arena - Modern & Borderless */}
            <div className="grid lg:grid-cols-5 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-3 relative overflow-hidden bg-card rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-12 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-500"
                >
                    {/* Background Gradients */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 dark:bg-emerald-900/20 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-muted rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/3"></div>

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-2">
                                    {isWinner ? "You're Leading!" : "Opportunity Ahead"}
                                </h1>
                                <p className="text-muted-foreground font-medium text-lg">
                                    {isWinner ? "Your strategy is effectively outperforming the competition." : "Your competitor has a slight edge in conversion alignment."}
                                </p>
                            </div>
                            <div className={`hidden sm:flex px-4 py-2 rounded-full text-sm font-bold tracking-wide shadow-sm items-center gap-2 ${isWinner ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-800'}`}>
                                {isWinner ? <CheckCircle2 className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                                {isWinner ? 'MARKET LEADER' : 'GROWTH MODE'}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 py-8">
                            <CircularScore score={yourScore} label="Your Score" color="text-emerald-500" delay={0.2} />

                            <div className="flex flex-col items-center">
                                <div className="text-4xl font-black text-slate-200 select-none">VS</div>
                                {scoreDifference > 0 && (
                                    <Badge variant="secondary" className="mt-2 bg-muted text-muted-foreground border-none font-bold px-3">
                                        +{scoreDifference} pts
                                    </Badge>
                                )}
                            </div>

                            <CircularScore score={competitorScore} label="Competitor" color="text-muted-foreground" delay={0.4} />
                        </div>

                        <div className="mt-auto bg-muted/80 backdrop-blur-sm rounded-2xl p-5 border border-border/50">
                            <div className="flex items-start gap-4">
                                <Sparkles className="w-5 h-5 text-indigo-500 mt-1 shrink-0" />
                                <p className="text-foreground leading-relaxed font-medium">
                                    "{verdict}"
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right: Key Stats - Bento Grid Style */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 space-y-6"
                >
                    {/* Modern Stat Cards */}
                    <div className="grid grid-cols-1 gap-4 h-full">
                        <div className="bg-card rounded-3xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border-none flex flex-col justify-center">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                                    <BarChart3 className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-sm font-semibold uppercase tracking-wider">Potential Gain</p>
                                    <p className="text-2xl font-bold text-foreground">+15% Conversion</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card rounded-3xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border-none flex flex-col justify-center">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-600">
                                    <Target className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-sm font-semibold uppercase tracking-wider">Missing Features</p>
                                    <p className="text-2xl font-bold text-foreground">{gapAnalysis.length} Key Gaps</p>
                                </div>
                            </div>
                        </div>

                        {/* Collapsible Deep Dive Analysis - Floating Card */}
                        <div className="bg-card rounded-3xl p-0 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border-none overflow-hidden">
                            <Accordion type="single" collapsible className="w-full">
                                {/* Trust Factors - First for variety */}
                                <AccordionItem value="trust-analysis" className="border-b border-border px-6">
                                    <AccordionTrigger className="hover:no-underline py-5 group">
                                        <div className="flex items-center gap-3 w-full">
                                            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 group-hover:scale-110 transition-transform">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                            <span className="font-semibold text-foreground">Trust Factors</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-6 px-1">
                                        <div className="p-4 bg-purple-50/50 dark:bg-purple-900/20 rounded-2xl">
                                            <p className="text-foreground leading-relaxed font-medium">
                                                {deepAnalysis.trust_analysis || "No trust analysis available."}
                                            </p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Headline Analysis */}
                                <AccordionItem value="headline-analysis" className="border-b border-border px-6">
                                    <AccordionTrigger className="hover:no-underline py-5 group">
                                        <div className="flex items-center gap-3 w-full">
                                            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 group-hover:scale-110 transition-transform">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <span className="font-semibold text-foreground">Headline Check</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-6 px-1">
                                        <div className="p-4 bg-blue-50/50 dark:bg-blue-900/20 rounded-2xl">
                                            <p className="text-foreground leading-relaxed font-medium">
                                                {deepAnalysis.hook_critique || "No headline analysis available."}
                                            </p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Missing Features */}
                                <AccordionItem value="missing-features" className="border-none px-6">
                                    <AccordionTrigger className="hover:no-underline py-5 group">
                                        <div className="flex items-center gap-3 w-full">
                                            <div className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 group-hover:scale-110 transition-transform">
                                                <AlertTriangle className="w-4 h-4" />
                                            </div>
                                            <span className="font-semibold text-foreground">Feature Gaps</span>
                                            <span className="ml-auto bg-muted text-muted-foreground text-xs font-bold px-2 py-1 rounded-lg">
                                                {gapAnalysis.length}
                                            </span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-6 px-1">
                                        <div className="space-y-2">
                                            {gapAnalysis.map((gap: string, i: number) => (
                                                <div key={i} className="flex items-start gap-3 p-3 bg-red-50/30 dark:bg-red-900/10 rounded-xl">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0"></div>
                                                    <span className="text-foreground font-medium text-sm">{gap}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Action Plan Section - Clean & Floating */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600">
                            <Lightbulb className="w-6 h-6" />
                        </div>
                        Action Plan
                    </h2>
                    <span className="text-muted-foreground font-medium">{rewrites.length} opportunities found</span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {rewrites.length > 0 ? rewrites.map((fix: any, index: number) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (index * 0.1) }}
                            className="bg-card rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 border border-border flex flex-col h-full"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-lg text-foreground leading-tight">
                                        {fix.element || fix.title || "Optimization Update"}
                                    </h3>
                                    {fix.reason && (
                                        <p className="text-sm text-muted-foreground">{fix.reason}</p>
                                    )}
                                </div>
                                <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-2xl bg-muted text-foreground font-black text-lg border border-border">
                                    {index + 1}
                                </div>
                            </div>

                            <div className="space-y-4 flex-1">
                                {/* Before */}
                                <div className="group relative">
                                    <div className="absolute left-0 top-3 bottom-3 w-1 bg-red-200 rounded-full group-hover:bg-red-400 transition-colors"></div>
                                    <div className="pl-4">
                                        <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">Current</p>
                                        <p className="text-muted-foreground text-sm leading-relaxed opacity-80 decoration-slate-300">
                                            {fix.current}
                                        </p>
                                    </div>
                                </div>

                                {/* After */}
                                <div className="group relative">
                                    <div className="absolute left-0 top-3 bottom-0 w-1 bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                                    <div className="pl-4 py-2 bg-emerald-50/30 dark:bg-emerald-900/10 rounded-r-xl">
                                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1 flex items-center gap-2">
                                            Suggested <Sparkles className="w-3 h-3" />
                                        </p>
                                        <p className="text-foreground font-medium text-base leading-relaxed">
                                            {fix.suggested || fix.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="col-span-full py-12 text-center bg-card rounded-[2rem] shadow-sm border border-border">
                            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Award className="w-10 h-10 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground">Perfection Achieved!</h3>
                            <p className="text-muted-foreground mt-2">No major issues found. You are crushing it.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* AI Chat */}
            <AnalysisChat analysisId={params.id as string} />
        </div>
    );
}