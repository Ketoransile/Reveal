"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, AlertTriangle, AlertCircle, ArrowRight, CheckCircle2, Target, MessageSquare, X } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AnalysisChat } from "@/components/analysis-chat";
import { motion } from "framer-motion";

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
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-200 opacity-20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
                </div>
                <p className="text-lg font-medium text-slate-600 animate-pulse">Analyzing comparison...</p>
            </div>
        );
    }

    if (error || !data || !data.reports?.[0]) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in fade-in duration-500">
            <div className="p-6 bg-red-50 rounded-full">
                <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">Report Not Found</h2>
                <p className="text-muted-foreground mt-2 max-w-md">We couldn't retrieve this analysis.</p>
            </div>
            <Link href="/dashboard"><Button size="lg" className="rounded-full px-8">Return Home</Button></Link>
        </div>
    );

    const report = data.reports[0];
    const deepAnalysis = report.deep_analysis || {};
    const yourScore = report.conversion_score || 0;
    const scores = deepAnalysis.scores || { yours: yourScore, competitor: 0 };
    const competitorScore = scores.competitor || (report.winner === 'competitor' ? yourScore + 10 : yourScore - 10);

    // Determine winner logic
    const isWinner = report.winner === 'yours';
    const verdict = deepAnalysis.verdict || "No clear verdict provided.";

    // Fixes & Gaps
    const rewrites = report.actionable_fixes || [];
    const gapAnalysis = deepAnalysis.gap_analysis || [];

    // URLs
    const yourHost = new URL(data.your_url).hostname;
    const compHost = new URL(data.competitor_url).hostname;

    // Animation Variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 50 } }
    };

    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="w-full max-w-7xl mx-auto space-y-8 pb-32"
        >
            {/* Minimal Header */}
            <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
                <Link href="/dashboard" className="inline-block group">
                    <div className="flex items-center gap-2 text-slate-500 group-hover:text-slate-900 transition-colors">
                        <div className="p-1.5 rounded-full bg-slate-100 group-hover:bg-slate-200 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-sm">Dashboard</span>
                    </div>
                </Link>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-mono text-slate-400 bg-slate-50 border-slate-200">
                        ID: {Array.isArray(params.id) ? params.id[0].slice(0, 8) : params?.id?.slice(0, 8)}
                    </Badge>
                </div>
            </motion.div>

            {/* Comparison Result Card */}
            <motion.div variants={item} className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl ring-1 ring-white/10">
                <div className="absolute top-0 right-0 p-32 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 p-32 bg-blue-600/20 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative z-10 p-8 md:p-12">
                    <div className="flex flex-col lg:flex-row gap-12 items-start lg:items-center justify-between">

                        {/* Verdict Text */}
                        <div className="space-y-6 max-w-2xl">
                            <div className="flex items-center gap-3">
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-white/10 border border-white/20 backdrop-blur-md ${isWinner ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {isWinner ? "Stronger" : "Needs Improvement"}
                                </span>
                                <span className="flex items-center gap-2 text-xs font-medium text-slate-400">
                                    Analysis Result
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                {isWinner ? "Your Website is Performing Better." : "Competitor's Website is Stronger."}
                            </h1>

                            <p className="text-lg text-slate-300 leading-relaxed font-light border-l-2 border-slate-700 pl-6 italic">
                                "{verdict}"
                            </p>
                        </div>

                        {/* Visual Scoreboard */}
                        <div className="w-full lg:w-96 bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 space-y-6">
                            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Performance Score</span>
                            </div>

                            <div className="space-y-5">
                                {/* Your Score */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-sm font-medium text-white">{yourHost}</span>
                                        </div>
                                        <span className="text-2xl font-bold text-white">{yourScore}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-700/50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${yourScore}%` }}
                                            className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                                            transition={{ duration: 1.5, delay: 0.5 }}
                                        />
                                    </div>
                                </div>

                                {/* Comp Score */}
                                <div className="space-y-2 relative opacity-80">
                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-slate-500" />
                                            <span className="text-sm font-medium text-slate-400">{compHost}</span>
                                        </div>
                                        <span className="text-2xl font-bold text-slate-400">{competitorScore}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-700/50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${competitorScore}%` }}
                                            className="h-full bg-slate-400 rounded-full"
                                            transition={{ duration: 1.5, delay: 0.7 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">

                {/* Left Column: Improvements (2/3 width) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Proposed Improvements */}
                    <motion.div variants={item}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                    <MessageSquare className="w-5 h-5" />
                                </div>
                                Proposed Improvements
                            </h2>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">
                                {rewrites.length} Recommendations
                            </span>
                        </div>

                        <div className="space-y-6">
                            {rewrites.map((fix: any, index: number) => (
                                <Card key={index} className="overflow-hidden border-0 shadow-lg shadow-slate-200/50 ring-1 ring-slate-100 rounded-2xl group transition-all hover:shadow-xl hover:ring-slate-200">
                                    <div className="bg-gradient-to-r from-slate-50 to-white border-b p-4 flex items-center justify-between">
                                        <div className="font-semibold text-slate-800 flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-600 font-bold">{index + 1}</span>
                                            {fix.element || fix.title || "Subject"}
                                        </div>
                                        {fix.reason && <span className="text-xs text-slate-500 hidden sm:block italic max-w-xs text-right truncate">{fix.reason}</span>}
                                    </div>

                                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                                        {/* Current / Weak */}
                                        <div className="p-5 bg-red-50/30 group-hover:bg-red-50/50 transition-colors">
                                            <div className="flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-wider mb-3">
                                                <X className="w-3 h-3" /> Current Text
                                            </div>
                                            <p className="text-sm text-slate-600 leading-relaxed font-serif italic max-h-40 overflow-y-auto">
                                                "{fix.current || "No current text found"}"
                                            </p>
                                        </div>

                                        {/* Suggested / Strong */}
                                        <div className="p-5 bg-emerald-50/30 group-hover:bg-emerald-50/50 transition-colors">
                                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3">
                                                <CheckCircle2 className="w-3 h-3" /> Suggested Improvement
                                            </div>
                                            <p className="text-green-900 font-medium text-sm leading-relaxed relative max-h-40 overflow-y-auto">
                                                <span className="absolute -left-3 top-0 bottom-0 w-0.5 bg-emerald-400 rounded-full" />
                                                "{fix.suggested || fix.description}"
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </motion.div>

                </div>

                {/* Right Column: Stats & Gaps (1/3 width) */}
                <div className="space-y-8">

                    {/* Missing Features */}
                    <motion.div variants={item}>
                        <Card className="overflow-hidden border-0 shadow-xl shadow-slate-200/50 ring-1 ring-slate-100 rounded-3xl bg-white/80 backdrop-blur-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Target className="w-5 h-5 text-red-500" />
                                    Missing Features
                                </CardTitle>
                                <CardDescription>Things they have that you don't</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {gapAnalysis.length > 0 ? gapAnalysis.map((gap: string, i: number) => (
                                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-md hover:scale-[1.02]">
                                        <div className="p-1.5 bg-red-100 rounded-md text-red-600 mt-0.5 shrink-0">
                                            <AlertTriangle className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="text-sm text-slate-700 font-medium leading-snug">{gap}</span>
                                    </div>
                                )) : (
                                    <div className="text-center p-6 text-slate-500 text-sm bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                        No major gaps detected. Good job!
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Detailed Analysis Accordion */}
                    <motion.div variants={item}>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Detailed Analysis</h3>
                        <div className="space-y-3">
                            {[
                                {
                                    title: "Headline Analysis",
                                    icon: Target,
                                    color: "text-purple-500 bg-purple-50",
                                    content: deepAnalysis.hook_critique,
                                    id: "hook"
                                },
                                {
                                    title: "Trust Factors",
                                    icon: CheckCircle2,
                                    color: "text-blue-500 bg-blue-50",
                                    content: deepAnalysis.trust_analysis,
                                    id: "trust"
                                },
                            ].map((topic, i) => topic.content && (
                                <Accordion key={i} type="single" collapsible className="w-full">
                                    <AccordionItem value={topic.id} className="border-0 bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 overflow-hidden">
                                        <AccordionTrigger className="px-4 py-3 hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-1.5 rounded-md ${topic.color}`}>
                                                    <topic.icon className="w-4 h-4" />
                                                </div>
                                                <span className="font-semibold text-sm text-slate-700">{topic.title}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="px-4 pb-4 pt-1 text-sm text-slate-600 leading-relaxed bg-slate-50/50">
                                            {topic.content}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </div>

            {/* Floating Chat Button Only */}
            <AnalysisChat analysisId={params.id as string} />
        </motion.div>
    );
}
