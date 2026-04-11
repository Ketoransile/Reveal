"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Plus,
    Clock,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Globe,
    Activity,
    CreditCard,
    BarChart,
    ChevronRight,
    Zap
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

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

    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case 'processing':
                return (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/60 border border-border text-foreground text-xs font-semibold tracking-wide">
                        <Clock className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                        Analyzing
                    </div>
                );
            case 'completed':
                return (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-foreground text-background text-xs font-semibold tracking-wide">
                        <CheckCircle2 className="w-3.5 h-3.5 text-background" />
                        Completed
                    </div>
                );
            case 'failed':
                return (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/60 border border-border text-foreground text-xs font-semibold tracking-wide">
                        <AlertCircle className="w-3.5 h-3.5 text-muted-foreground" />
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
        <div className="min-h-screen bg-background border-t border-border">
            <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
                {/* Clean Header Area */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-semibold font-display tracking-tight text-foreground flex items-center gap-2">
                            {getGreeting()}{firstName ? `, ${firstName}` : ''}
                        </h1>
                        <p className="text-muted-foreground mt-2 text-sm max-w-xl">
                            Welcome back to Reveal. Here's a quick overview of your competitive landscape and ongoing analyses.
                        </p>
                    </div>
                    <Link href="/dashboard/analysis">
                        <Button className="h-11 px-6 rounded-lg font-medium tracking-tight hover:-translate-y-px transition-transform duration-200">
                            <Plus className="w-4 h-4 mr-2" />
                            New Analysis
                        </Button>
                    </Link>
                </div>

                {error && (
                    <div className="p-4 rounded-lg border border-border bg-card text-foreground text-sm flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 shrink-0 opacity-70" />
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-card shadow-sm border-border">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2 justify-between">
                                Active Plan
                                <CreditCard className="w-4 h-4" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline gap-2 mt-2">
                                <span className="text-4xl font-semibold font-display tabular-nums tracking-tighter text-foreground">
                                    {isPro ? "Pro" : (loading ? "-" : userData?.credits || 0)}
                                </span>
                                {!isPro && !loading && (
                                    <span className="text-muted-foreground font-medium text-lg">/ 3</span>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 font-medium">
                                {isPro ? "Unlimited analyses enabled" : "Credits remaining this month"}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-card shadow-sm border-border">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2 justify-between">
                                Total Rendered
                                <BarChart className="w-4 h-4" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline gap-2 mt-2">
                                <span className="text-4xl font-semibold font-display tabular-nums tracking-tighter text-foreground">
                                    {loading ? "-" : completedAnalyses.length}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 font-medium">
                                Lifetime competitor reports completed
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-card shadow-sm border-border">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2 justify-between">
                                Processing
                                <Activity className="w-4 h-4" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-baseline gap-2 mt-2">
                                <span className="text-4xl font-semibold font-display tabular-nums tracking-tighter text-foreground">
                                    {loading ? "-" : processingAnalyses.length}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2 font-medium">
                                Active analyses running
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* History Lists */}
                <div className="space-y-6 pt-6">
                    <div className="flex justify-between items-end border-b border-border pb-4">
                        <div>
                            <h2 className="text-lg font-semibold font-display tracking-tight text-foreground">Activity Log</h2>
                            <p className="text-xs text-muted-foreground mt-1">Your recent reports and analysis jobs</p>
                        </div>
                        {analyses.length > 0 && (
                            <Link href="/dashboard/all-analyses" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                                View all
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        )}
                    </div>

                    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="divide-y divide-border/50">
                                {[1, 2].map((i) => (
                                    <div key={i} className="p-6 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-muted/50 rounded-lg animate-pulse" />
                                        <div className="space-y-2 flex-1">
                                            <div className="h-4 bg-muted/50 w-48 rounded animate-pulse" />
                                            <div className="h-3 bg-muted/50 w-24 rounded animate-pulse" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : analyses.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                                <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center mb-4 border border-border">
                                    <Globe className="w-6 h-6 text-muted-foreground" />
                                </div>
                                <h3 className="text-base font-semibold font-display text-foreground tracking-tight">No analyses found</h3>
                                <p className="text-muted-foreground text-sm mt-1 mb-6 max-w-sm">
                                    Compare your site with competitors to get immediate actionable insights.
                                </p>
                                <Link href="/dashboard/analysis">
                                    <Button variant="outline" className="h-10 px-5 rounded-lg border-border group">
                                        <Plus className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-foreground" />
                                        Run New Check
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-border">
                                {analyses.slice(0, 5).map((analysis, index) => (
                                    <Link
                                        key={analysis.id}
                                        href={analysis.status === 'completed' ? `/dashboard/report/${analysis.id}` : '#'}
                                        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 transition-colors ${analysis.status === 'completed' ? 'hover:bg-muted/30 group' : 'cursor-default opacity-80'}`}
                                    >
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0">
                                                <Globe className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-x-2 text-sm font-semibold tracking-tight text-foreground truncate">
                                                    <span>{(() => {
                                                        try { return new URL(analysis.your_url).hostname.replace('www.', ''); } catch { return analysis.your_url; }
                                                    })()}</span>
                                                    <span className="text-muted-foreground text-xs font-bold leading-none">VS</span>
                                                    <span>{(() => {
                                                        try { return new URL(analysis.competitor_url).hostname.replace('www.', ''); } catch { return analysis.competitor_url; }
                                                    })()}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 font-medium">
                                                    <span>{format(new Date(analysis.created_at), "MMMM d, yyyy")}</span>
                                                    {analysis.status === 'failed' && analysis.error_message && (
                                                        <span className="truncate text-foreground max-w-[200px] border-l border-border pl-2 border-dashed">
                                                            err: {analysis.error_message}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 shrink-0 mt-3 sm:mt-0">
                                            <StatusBadge status={analysis.status} />
                                            {analysis.status === 'completed' && (
                                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Premium Upsell - Minimal */}
                {!loading && !isPro && (
                    <div className="bg-card border border-border rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-muted border border-border rounded-full flex items-center justify-center shrink-0">
                                <Zap className="w-5 h-5 text-foreground" />
                            </div>
                            <div>
                                <h3 className="font-semibold font-display text-foreground text-lg tracking-tight">Unlock Unlimited Scans</h3>
                                <p className="text-sm text-muted-foreground mt-1 max-w-lg">
                                    Your competitive advantage doesn't stop at three. Upgrade your plan to get zero limits and priority reporting times.
                                </p>
                            </div>
                        </div>
                        <Link href="/pricing" className="shrink-0 w-full md:w-auto">
                            <Button className="w-full h-11 px-6 rounded-lg font-medium">
                                Upgrade Plan
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
