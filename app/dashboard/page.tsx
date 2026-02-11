"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Plus,
    Zap,
    BarChart3,
    TrendingUp,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    ArrowRight,
    Sparkles,
    Globe,
    ExternalLink,
    Activity,
    Crown,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
    const [userData, setUserData] = useState<any>(null);
    const [analyses, setAnalyses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Load cached data first for instant render
        try {
            const cachedUser = localStorage.getItem('dashboard_user');
            const cachedAnalyses = localStorage.getItem('dashboard_analyses');
            if (cachedUser) setUserData(JSON.parse(cachedUser));
            if (cachedAnalyses) setAnalyses(JSON.parse(cachedAnalyses));
        } catch { /* ignore parse errors */ }

        async function fetchData() {
            try {
                const response = await fetch('/api/user');

                if (response.status === 401 || response.status === 403) {
                    // Clear cached data on genuine auth failure
                    localStorage.removeItem('dashboard_user');
                    localStorage.removeItem('dashboard_analyses');
                    window.location.href = '/login';
                    return;
                }

                if (!response.ok) {
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.indexOf("application/json") !== -1) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Failed to fetch data');
                    } else {
                        throw new Error(`Server returned ${response.status} ${response.statusText}`);
                    }
                }

                const data = await response.json();
                setUserData(data.user);
                setAnalyses(data.analyses || []);

                // Cache fresh data in localStorage
                try {
                    localStorage.setItem('dashboard_user', JSON.stringify(data.user));
                    localStorage.setItem('dashboard_analyses', JSON.stringify(data.analyses || []));
                } catch { /* localStorage full or unavailable */ }
            } catch (err) {
                // If it's a network error (offline), don't show error if we have cached data
                const isNetworkError = err instanceof TypeError && (
                    err.message.includes('fetch') || err.message.includes('network') || err.message.includes('Failed')
                );

                if (isNetworkError && userData) {
                    // We have cached data, silently ignore the network error
                    return;
                }

                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const completedAnalyses = analyses.filter(a => a.status === 'completed');
    const processingAnalyses = analyses.filter(a => a.status === 'processing');
    const isPro = userData?.subscription_plan === 'pro' || userData?.subscription_plan === 'agency';

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1, y: 0,
            transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case 'processing':
                return (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-medium">
                        <Clock className="w-3 h-3 animate-spin" />
                        Processing
                    </div>
                );
            case 'completed':
                return (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        Complete
                    </div>
                );
            case 'failed':
                return (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 dark:bg-red-500/20 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium">
                        <XCircle className="w-3 h-3" />
                        Failed
                    </div>
                );
            default:
                return null;
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    };

    const fullName = userData?.name || userData?.email?.split('@')[0] || '';
    const firstName = fullName.split(' ')[0];

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
        >
            {/* Hero Header */}
            <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-900 dark:via-slate-800/80 dark:to-slate-900 p-6 md:p-8 border border-white/5">
                {/* Decorative gradient orbs */}
                <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-56 h-56 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
                    <div>
                        <motion.p
                            className="text-emerald-400 text-sm font-medium mb-1 flex items-center gap-1.5"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Sparkles className="w-3.5 h-3.5" />
                            {getGreeting()}{firstName ? `, ${firstName}` : ''}
                        </motion.p>
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                            Command Center
                        </h1>
                        <p className="text-slate-400 text-sm mt-1.5 max-w-md">
                            Monitor your competitive intelligence and discover actionable insights.
                        </p>
                    </div>
                    <Link href="/dashboard/analysis">
                        <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold shadow-lg shadow-emerald-500/20 rounded-xl px-6 h-11 transition-all hover:scale-[1.03] active:scale-95 hover:shadow-emerald-500/30 group cursor-pointer">
                            <Plus className="w-4 h-4 mr-2" />
                            New Analysis
                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </motion.div>

            {error && (
                <motion.div
                    variants={itemVariants}
                    className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-center gap-3"
                >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>{error}</p>
                </motion.div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                {/* Credits / Subscription Card */}
                <motion.div variants={itemVariants}>
                    <Card className="border-border/50 hover:border-emerald-500/30 transition-all duration-300 bg-card relative overflow-hidden group hover:shadow-lg hover:shadow-emerald-500/5 h-full">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/8 to-transparent rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-125" />
                        <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
                            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                {isPro ? 'Plan Status' : 'Credits'}
                            </CardTitle>
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${isPro
                                ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-500 dark:text-indigo-400'
                                : 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400'}`}
                            >
                                {isPro ? <Crown className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            {isPro ? (
                                <div>
                                    <div className="text-2xl font-bold text-foreground flex items-center gap-2">
                                        Unlimited
                                        <span className="text-[10px] bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Pro</span>
                                    </div>
                                    {userData?.subscription_period_end ? (
                                        <p className="text-xs text-muted-foreground mt-1.5">
                                            Renews {new Date(userData.subscription_period_end).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </p>
                                    ) : (
                                        <p className="text-xs text-muted-foreground mt-1.5">Active subscription</p>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-3xl font-black text-foreground tabular-nums">
                                            {loading ? '–' : userData?.credits || 0}
                                        </span>
                                        <span className="text-sm text-muted-foreground font-medium">/ 3</span>
                                    </div>
                                    <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${((userData?.credits || 0) / 3) * 100}%` }}
                                            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">Credits remaining</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Completed Card */}
                <motion.div variants={itemVariants}>
                    <Card className="border-border/50 hover:border-blue-500/30 transition-all duration-300 bg-card relative overflow-hidden group hover:shadow-lg hover:shadow-blue-500/5 h-full">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/8 to-transparent rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-125" />
                        <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
                            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Completed</CardTitle>
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 transition-transform group-hover:scale-110">
                                <CheckCircle2 className="w-4 h-4" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-3xl font-black text-foreground tabular-nums">
                                    {loading ? '–' : completedAnalyses.length}
                                </span>
                                <span className="text-sm text-muted-foreground font-medium">analyses</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3 text-emerald-500" />
                                Lifetime total
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* In Progress Card */}
                <motion.div variants={itemVariants}>
                    <Card className="border-border/50 hover:border-orange-500/30 transition-all duration-300 bg-card relative overflow-hidden group hover:shadow-lg hover:shadow-orange-500/5 h-full">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/8 to-transparent rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-125" />
                        <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
                            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">In Progress</CardTitle>
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center text-orange-600 dark:text-orange-400 transition-transform group-hover:scale-110">
                                <Activity className="w-4 h-4" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="flex items-baseline gap-1.5">
                                <span className="text-3xl font-black text-foreground tabular-nums">
                                    {loading ? '–' : processingAnalyses.length}
                                </span>
                                <span className="text-sm text-muted-foreground font-medium">active</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                                {processingAnalyses.length > 0 ? (
                                    <>
                                        <Clock className="w-3 h-3 text-orange-500 animate-spin" />
                                        Processing now
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                        All caught up
                                    </>
                                )}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Recent Analyses Section */}
            <motion.div variants={itemVariants} className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-500/10 to-slate-500/5 flex items-center justify-center">
                            <BarChart3 className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <h2 className="text-lg font-bold text-foreground">Recent Analyses</h2>
                    </div>
                    {analyses.length > 0 && (
                        <Link href="/dashboard/all-analyses" className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                            View all
                            <ArrowRight className="w-3 h-3" />
                        </Link>
                    )}
                </div>

                <Card className="border-border/50 bg-card shadow-sm overflow-hidden">
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                                <div className="relative w-10 h-10 mb-4">
                                    <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-full" />
                                    <div className="absolute inset-0 border-2 border-transparent border-t-emerald-500 rounded-full animate-spin" />
                                </div>
                                <p className="text-sm font-medium">Loading your data...</p>
                            </div>
                        ) : analyses.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground relative">
                                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl flex items-center justify-center mb-5 border border-emerald-500/10">
                                        <Globe className="w-7 h-7 text-emerald-500/60" />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground mb-1.5">No analyses yet</h3>
                                    <p className="text-muted-foreground max-w-xs text-center mb-6 text-sm leading-relaxed">
                                        Launch your first analysis to uncover competitive insights and growth opportunities.
                                    </p>
                                    <Link href="/dashboard/analysis">
                                        <Button className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400 h-11 px-6 font-semibold shadow-lg shadow-emerald-500/15 hover:shadow-emerald-500/25 transition-all hover:scale-[1.03] group cursor-pointer">
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Start First Analysis
                                            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <AnimatePresence>
                                <div className="divide-y divide-border/50">
                                    {analyses.slice(0, 5).map((analysis, index) => (
                                        <motion.div
                                            key={analysis.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05, duration: 0.4 }}
                                            onClick={() => {
                                                if (analysis.status === 'completed') {
                                                    window.location.href = `/dashboard/report/${analysis.id}`;
                                                }
                                            }}
                                            className={`p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all duration-200 
                                                ${analysis.status === 'completed'
                                                    ? 'hover:bg-accent/50 cursor-pointer group'
                                                    : 'opacity-70 cursor-default'}`}
                                        >
                                            <div className="flex items-start gap-3.5 flex-1 min-w-0">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${analysis.status === 'completed'
                                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                    : analysis.status === 'processing'
                                                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                                        : 'bg-red-500/10 text-red-600 dark:text-red-400'
                                                    }`}>
                                                    <Globe className="w-4.5 h-4.5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                                                        <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                            {(() => {
                                                                try { return new URL(analysis.your_url).hostname; } catch { return analysis.your_url; }
                                                            })()}
                                                            <span className="text-muted-foreground font-normal mx-1.5">vs</span>
                                                            {(() => {
                                                                try { return new URL(analysis.competitor_url).hostname; } catch { return analysis.competitor_url; }
                                                            })()}
                                                        </h3>
                                                        <StatusBadge status={analysis.status} />
                                                    </div>

                                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{new Date(analysis.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                                    </div>

                                                    {analysis.status === 'failed' && analysis.error_message && (
                                                        <p className="text-xs text-red-500 mt-2 flex items-center gap-1.5 bg-red-500/5 px-2.5 py-1.5 rounded-lg">
                                                            <AlertCircle className="w-3 h-3 shrink-0" />
                                                            {analysis.error_message}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 shrink-0 ml-auto">
                                                {analysis.status === 'completed' && (
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                                        <span className="hidden md:inline">View Report</span>
                                                        <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                                    </div>
                                                )}
                                                {analysis.status === 'processing' && (
                                                    <div className="text-right">
                                                        <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium">
                                                            <div className="w-4 h-4 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                                                            Analyzing...
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </AnimatePresence>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Upgrade CTA for free users */}
            {!loading && !isPro && (
                <motion.div variants={itemVariants}>
                    <Card className="border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5 dark:from-emerald-500/10 dark:via-teal-500/10 dark:to-cyan-500/10 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 rounded-full blur-[60px] pointer-events-none" />
                        <CardContent className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                            <div className="flex items-start gap-3.5">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center shrink-0">
                                    <Crown className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground text-sm">Unlock Unlimited Analyses</h3>
                                    <p className="text-xs text-muted-foreground mt-0.5">Upgrade to Pro for unlimited analyses, deep AI insights, and priority support.</p>
                                </div>
                            </div>
                            <Link href="/pricing">
                                <Button variant="outline" className="rounded-xl border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 font-semibold text-sm h-9 px-5 shrink-0 cursor-pointer">
                                    View Plans
                                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </motion.div>
    );
}
