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
    AlertCircle
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function DashboardPage() {
    const [userData, setUserData] = useState<any>(null);
    const [analyses, setAnalyses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/user');
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch data');
                }

                setUserData(data.user);
                setAnalyses(data.analyses || []);
            } catch (err) {
                console.error('[DASHBOARD] Error:', err);
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const completedAnalyses = analyses.filter(a => a.status === 'completed');
    const processingAnalyses = analyses.filter(a => a.status === 'processing');

    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case 'processing':
                return (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        Processing
                    </div>
                );
            case 'completed':
                return (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Complete
                    </div>
                );
            case 'failed':
                return (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                        <XCircle className="w-3.5 h-3.5" />
                        Failed
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                        Dashboard
                    </h1>
                    <p className="text-slate-600 text-sm mt-1">
                        Track your competitive intelligence and insights
                    </p>
                </div>
                <Link href="/dashboard/analysis">
                    <Button
                        size="lg"
                        className="w-full md:w-auto h-10 px-5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm font-semibold"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        New Analysis
                    </Button>
                </Link>
            </div>

            {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-slate-200 hover:shadow-md transition-shadow bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Credits</CardTitle>
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-emerald-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">
                            {loading ? '...' : userData?.credits || 0}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Analyses remaining</p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 hover:shadow-md transition-shadow bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Completed</CardTitle>
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">
                            {loading ? '...' : completedAnalyses.length}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Lifetime analyses</p>
                    </CardContent>
                </Card>

                <Card className="border-slate-200 hover:shadow-md transition-shadow bg-white">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">In Progress</CardTitle>
                        <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                            <Clock className="w-4 h-4 text-orange-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-900">
                            {loading ? '...' : processingAnalyses.length}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Processing now</p>
                    </CardContent>
                </Card>
            </div>

            {/* Analysis List */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-slate-700" />
                    <h2 className="text-lg font-bold text-slate-900">Recent Analyses</h2>
                </div>

                <Card className="border-slate-200 bg-white shadow-sm">
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                                <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-4" />
                                <p className="text-sm">Loading your data...</p>
                            </div>
                        ) : analyses.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                    <BarChart3 className="w-8 h-8 text-slate-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">No analyses yet</h3>
                                <p className="text-slate-500 max-w-sm text-center mb-6 text-sm">
                                    Start your first competitive analysis to uncover actionable insights.
                                </p>
                                <Link href="/dashboard/analysis">
                                    <Button className="rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 h-10 px-5 font-semibold">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Create Your First Analysis
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {analyses.map((analysis) => (
                                    <div
                                        key={analysis.id}
                                        onClick={() => {
                                            if (analysis.status === 'completed') {
                                                window.location.href = `/dashboard/report/${analysis.id}`;
                                            }
                                        }}
                                        className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-200 
                                            ${analysis.status === 'completed'
                                                ? 'hover:bg-slate-50 cursor-pointer group'
                                                : 'opacity-75 cursor-default'}`}
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-base font-semibold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                                                    {new URL(analysis.your_url).hostname} <span className="text-slate-400 font-normal">vs</span> {new URL(analysis.competitor_url).hostname}
                                                </h3>
                                                <StatusBadge status={analysis.status} />
                                            </div>

                                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                                <span>{new Date(analysis.created_at).toLocaleDateString()}</span>
                                                <span>•</span>
                                                <span className="truncate max-w-[200px]">{analysis.your_url}</span>
                                            </div>

                                            {analysis.status === 'failed' && analysis.error_message && (
                                                <p className="text-xs text-red-600 mt-2 flex items-center gap-1">
                                                    <AlertCircle className="w-3 h-3" />
                                                    {analysis.error_message}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4 md:gap-8">
                                            {analysis.status === 'completed' && analysis.reports?.[0] ? (
                                                null
                                            ) : analysis.status === 'processing' ? (
                                                <div className="text-right">
                                                    <p className="text-sm text-slate-600 animate-pulse font-medium">Analyzing...</p>
                                                    <p className="text-[10px] text-slate-400">Approx 30s remaining</p>
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
