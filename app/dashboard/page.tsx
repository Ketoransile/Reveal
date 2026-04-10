"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Plus,
    Clock,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Globe,
    Activity,
    Crown,
    CreditCard,
    BarChart,
    TrendingUp
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
    const [userData, setUserData] = useState<any>(null);
    const [analyses, setAnalyses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            const cachedUser = localStorage.getItem('dashboard_user');
            const cachedAnalyses = localStorage.getItem('dashboard_analyses');
            if (cachedUser) setUserData(JSON.parse(cachedUser));
            if (cachedAnalyses) setAnalyses(JSON.parse(cachedAnalyses));
        } catch { }

        async function fetchData() {
            try {
                const response = await fetch('/api/user');

                if (response.status === 401 || response.status === 403) {
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

                try {
                    localStorage.setItem('dashboard_user', JSON.stringify(data.user));
                    localStorage.setItem('dashboard_analyses', JSON.stringify(data.analyses || []));
                } catch { }
            } catch (err) {
                const isNetworkError = err instanceof TypeError && (
                    err.message.includes('fetch') || err.message.includes('network') || err.message.includes('Failed')
                );

                if (isNetworkError && userData) {
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
            transition: { staggerChildren: 0.05, delayChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1, y: 0,
            transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case 'processing':
                return (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-[11px] font-semibold tracking-wide uppercase shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                        <Clock className="w-3 h-3 animate-spin" />
                        Processing
                    </div>
                );
            case 'completed':
                return (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold tracking-wide uppercase shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                        <CheckCircle2 className="w-3 h-3" />
                        Complete
                    </div>
                );
            case 'failed':
                return (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[11px] font-semibold tracking-wide uppercase shadow-[0_0_15px_rgba(239,68,68,0.15)]">
                        <AlertCircle className="w-3 h-3" />
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
    const rawName = fullName.split(/[ .]/)[0];
    const firstName = rawName.charAt(0).toUpperCase() + rawName.slice(1).toLowerCase();

    return (
        <div className="relative min-h-screen">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <motion.div
                    className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
                    transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                />
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 space-y-8 max-w-[1600px] mx-auto pb-12"
            >
                {/* Header Area */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2"
                >
                    <div className="relative">
                        <div className="absolute -left-4 top-1 w-1 h-8 bg-primary rounded-r-full hidden md:block opacity-80" />
                        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                            {getGreeting()}{firstName ? `, ${firstName}` : ''}
                            <motion.span
                                animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                                transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 5 }}
                                className="origin-bottom-right"
                            >
                                👋
                            </motion.span>
                        </h1>
                        <p className="text-muted-foreground text-sm mt-2 max-w-lg leading-relaxed font-medium">
                            Monitor market movements, analyze competitor strategies, and seize the advantage.
                        </p>
                    </div>
                    <Link href="/dashboard/analysis">
                        <Button className="h-11 px-6 rounded-xl font-semibold shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                            <Plus className="w-4 h-4 mr-2 relative z-10" />
                            <span className="relative z-10">New Analysis</span>
                        </Button>
                    </Link>
                </motion.div>

                {error && (
                    <motion.div
                        variants={itemVariants}
                        className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 backdrop-blur-xl shadow-lg"
                    >
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p className="font-medium">{error}</p>
                    </motion.div>
                )}

                {/* Premium Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Plan Status / Credits */}
                    <motion.div variants={itemVariants} className="h-full">
                        <Card className="border-border/40 bg-card/40 backdrop-blur-2xl overflow-hidden h-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 relative group rounded-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                            
                            <CardContent className="p-6 relative z-10">
                                <div className="flex justify-between items-start mb-5">
                                    <div className="p-3 bg-background/50 rounded-2xl text-primary ring-1 ring-border/50 shadow-sm backdrop-blur-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                        {isPro ? <Crown className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                                    </div>
                                    <div className="px-2.5 py-1 rounded-full bg-background/50 border border-border/50 text-[10px] font-bold uppercase tracking-widest text-muted-foreground backdrop-blur-sm">
                                        {isPro ? 'Plan' : 'Credits'}
                                    </div>
                                </div>
                                <div className="space-y-1 mt-auto">
                                    {isPro ? (
                                        <div className="pt-2">
                                            <div className="text-4xl font-bold text-foreground flex items-center gap-3 tracking-tighter">
                                                Pro
                                                <div className="px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-500 border border-emerald-500/30 text-[11px] uppercase font-bold tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                                    Active
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-3 font-medium">
                                                Unlimited analyses available
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="pt-2">
                                            <div className="flex items-baseline gap-1.5 focus:outline-none">
                                                <span className="text-4xl font-bold text-foreground tabular-nums tracking-tighter">
                                                    {loading ? (
                                                        <div className="w-8 h-10 bg-muted/80 animate-pulse rounded-lg" />
                                                    ) : (
                                                        userData?.credits || 0
                                                    )}
                                                </span>
                                                {!loading && <span className="text-muted-foreground font-semibold text-lg">/ 3</span>}
                                            </div>
                                            {!loading && (
                                                <div className="mt-5 h-2 bg-background/50 rounded-full overflow-hidden w-full max-w-[200px] ring-1 ring-inset ring-border/50">
                                                    <motion.div
                                                        className={`h-full rounded-full transition-all relative overflow-hidden ${((userData?.credits || 0) / 3) <= 0.33 ? 'bg-gradient-to-r from-amber-500 to-orange-400' : 'bg-gradient-to-r from-emerald-500 to-teal-400'}`}
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${((userData?.credits || 0) / 3) * 100}%` }}
                                                        transition={{ delay: 0.3, duration: 1, ease: "easeOut" }}
                                                    >
                                                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                                    </motion.div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Lifetime Analyses */}
                    <motion.div variants={itemVariants} className="h-full">
                        <Card className="border-border/40 bg-card/40 backdrop-blur-2xl overflow-hidden h-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 relative group rounded-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                            
                            <CardContent className="p-6 relative z-10">
                                <div className="flex justify-between items-start mb-5">
                                    <div className="p-3 bg-background/50 rounded-2xl text-emerald-500 ring-1 ring-border/50 shadow-sm backdrop-blur-sm group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
                                        <BarChart className="w-5 h-5" />
                                    </div>
                                    <div className="px-2.5 py-1 rounded-full bg-background/50 border border-border/50 text-[10px] font-bold uppercase tracking-widest text-muted-foreground backdrop-blur-sm">
                                        Completed
                                    </div>
                                </div>
                                <div className="space-y-1 pt-2">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-foreground tabular-nums tracking-tighter">
                                            {loading ? (
                                                <div className="w-8 h-10 bg-muted/80 animate-pulse rounded-lg" />
                                            ) : (
                                                completedAnalyses.length
                                            )}
                                        </span>
                                    </div>
                                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-3 font-medium flex items-center gap-1.5">
                                        <TrendingUp className="w-4 h-4" />
                                        Lifetime analyses run
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Processing Reports */}
                    <motion.div variants={itemVariants} className="h-full">
                        <Card className="border-border/40 bg-card/40 backdrop-blur-2xl overflow-hidden h-full shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 relative group rounded-2xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
                            
                            <CardContent className="p-6 relative z-10">
                                <div className="flex justify-between items-start mb-5">
                                    <div className="p-3 bg-background/50 rounded-2xl text-amber-500 ring-1 ring-border/50 shadow-sm backdrop-blur-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                                        <Activity className="w-5 h-5" />
                                    </div>
                                    <div className="px-2.5 py-1 rounded-full bg-background/50 border border-border/50 text-[10px] font-bold uppercase tracking-widest text-muted-foreground backdrop-blur-sm">
                                        Active
                                    </div>
                                </div>
                                <div className="space-y-1 pt-2">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-4xl font-bold text-foreground tabular-nums tracking-tighter">
                                            {loading ? (
                                                <div className="w-8 h-10 bg-muted/80 animate-pulse rounded-lg" />
                                            ) : (
                                                processingAnalyses.length
                                            )}
                                        </span>
                                    </div>
                                    <p className="text-sm text-amber-600 dark:text-amber-400 mt-3 font-medium flex items-center gap-1.5">
                                        {processingAnalyses.length > 0 ? (
                                            <>
                                                <Clock className="w-4 h-4 animate-[spin_3s_linear_infinite]" />
                                                Running now
                                            </>
                                        ) : (
                                            <span className="text-muted-foreground flex items-center gap-1.5">
                                                <CheckCircle2 className="w-4 h-4" /> All caught up
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                {/* Recent Analyses List */}
                <motion.div variants={itemVariants} className="space-y-5 pt-6">
                    <div className="flex items-center justify-between px-1">
                        <h2 className="text-xl font-bold text-foreground tracking-tight">Recent Activity</h2>
                        {analyses.length > 0 && (
                            <Link href="/dashboard/all-analyses" className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 group">
                                View all history
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        )}
                    </div>

                    <div className="bg-card/40 backdrop-blur-2xl border border-border/40 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] overflow-hidden relative">
                        {loading ? (
                            <div className="divide-y divide-border/20">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="p-5 flex items-center gap-5">
                                        <div className="w-14 h-14 bg-muted/50 rounded-2xl animate-pulse ring-1 ring-border/50" />
                                        <div className="space-y-3 flex-1">
                                            <div className="h-4 bg-muted/50 w-1/3 rounded-md animate-pulse" />
                                            <div className="h-3 bg-muted/50 w-1/4 rounded-md animate-pulse" />
                                        </div>
                                        <div className="w-24 h-7 bg-muted/50 rounded-full animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        ) : analyses.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-center px-4 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 pointer-events-none" />
                                <div className="w-20 h-20 bg-background/50 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-6 ring-1 ring-border/50 shadow-lg relative z-10">
                                    <Globe className="w-8 h-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-3 relative z-10 tracking-tight">No analyses yet</h3>
                                <p className="text-muted-foreground max-w-md text-sm leading-relaxed mb-8 relative z-10 font-medium">
                                    Launch your first competitor analysis to start uncovering strategies and gaps and gain your unfair advantage.
                                </p>
                                <Link href="/dashboard/analysis" className="relative z-10">
                                    <Button className="h-12 px-8 rounded-xl font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:-translate-y-0.5 transition-all duration-300">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Start First Analysis
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-border/20">
                                <AnimatePresence>
                                    {analyses.slice(0, 5).map((analysis, index) => (
                                        <motion.div
                                            key={analysis.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Link
                                                href={analysis.status === 'completed' ? `/dashboard/report/${analysis.id}` : '#'}
                                                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 md:p-6 transition-all duration-300 
                                                    ${analysis.status === 'completed'
                                                        ? 'hover:bg-accent/40 group relative overflow-hidden'
                                                        : 'opacity-80'}`}
                                            >
                                                {analysis.status === 'completed' && (
                                                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out pointer-events-none" />
                                                )}
                                                
                                                <div className="flex items-start sm:items-center gap-5 flex-1 min-w-0 relative z-10">
                                                    <div className="w-14 h-14 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50 flex items-center justify-center shrink-0 shadow-sm text-foreground/70 group-hover:border-primary/30 group-hover:text-primary transition-colors duration-300">
                                                        <Globe className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                                                            <h3 className="text-base font-bold text-foreground tracking-tight truncate group-hover:text-primary transition-colors">
                                                                {(() => {
                                                                    try { return new URL(analysis.your_url).hostname.replace('www.', ''); } catch { return analysis.your_url; }
                                                                })()}
                                                                <span className="text-muted-foreground font-semibold mx-3 opacity-50 bg-muted/50 px-2 py-0.5 rounded-md text-[10px] uppercase tracking-widest">vs</span>
                                                                {(() => {
                                                                    try { return new URL(analysis.competitor_url).hostname.replace('www.', ''); } catch { return analysis.competitor_url; }
                                                                })()}
                                                            </h3>
                                                        </div>

                                                        <div className="flex items-center gap-3 text-[13px] text-muted-foreground font-medium">
                                                            <span className="flex items-center gap-1.5">
                                                                <Clock className="w-3.5 h-3.5 opacity-70" />
                                                                {new Date(analysis.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                            </span>
                                                        </div>

                                                        {analysis.status === 'failed' && analysis.error_message && (
                                                            <p className="text-xs text-red-500 mt-2 flex items-center gap-1.5 bg-red-500/10 px-3 py-1.5 rounded-md border border-red-500/20 w-fit">
                                                                <AlertCircle className="w-3 h-3 shrink-0" />
                                                                {analysis.error_message}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-5 shrink-0 sm:ml-auto relative z-10">
                                                    <StatusBadge status={analysis.status} />

                                                    {analysis.status === 'completed' && (
                                                        <div className="hidden sm:flex w-10 h-10 items-center justify-center rounded-xl bg-background/50 backdrop-blur-sm border border-border/50 shadow-sm group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-300 text-muted-foreground">
                                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                                        </div>
                                                    )}
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Premium Upsell for Free Users */}
                {!loading && !isPro && (
                    <motion.div variants={itemVariants} className="pt-6">
                        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card/40 backdrop-blur-2xl p-8 md:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgba(16,185,129,0.05)] group hover:border-primary/40 transition-colors duration-500">
                            {/* Abstract Premium Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none" />
                            <div className="absolute -right-20 -top-20 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[80px] pointer-events-none mix-blend-screen group-hover:bg-primary/20 transition-colors duration-700" />
                            
                            <div className="absolute top-0 right-0 p-12 opacity-[0.02] dark:opacity-[0.04] pointer-events-none scale-150 origin-center group-hover:scale-[1.6] group-hover:rotate-12 transition-transform duration-1000">
                                <Crown className="w-64 h-64" />
                            </div>

                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div className="flex items-start gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center shrink-0 border border-primary/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                                        <Crown className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-bold text-2xl text-foreground tracking-tight">Scale your insights with Pro</h3>
                                        <p className="text-[15px] text-muted-foreground leading-relaxed max-w-xl font-medium">
                                            Unlock the ultimate competitive edge. Get unlimited analyses, deep metadata extraction, priority queueing, and early access to new AI models.
                                        </p>
                                    </div>
                                </div>
                                <Link href="/pricing" className="shrink-0">
                                    <Button className="w-full md:w-auto h-12 px-8 rounded-xl font-bold bg-foreground text-background hover:bg-foreground/90 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group ring-1 ring-border/10">
                                        Upgrade to Pro
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1.5 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
