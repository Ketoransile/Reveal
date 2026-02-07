"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    BarChart3,
    CheckCircle2,
    Clock,
    XCircle,
    Calendar,
    ArrowRight
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default function RecentReportsPage() {
    const [analyses, setAnalyses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/user');
                const data = await response.json();
                if (data.analyses) {
                    // Sort by date desc and take top 10
                    const sorted = [...data.analyses].sort((a, b) =>
                        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                    ).slice(0, 10);
                    setAnalyses(sorted);
                }
            } catch (err) {
                console.error('Error fetching analyses:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case 'processing':
                return (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-400 text-xs font-medium">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        Processing
                    </div>
                );
            case 'completed':
                return (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Complete
                    </div>
                );
            case 'failed':
                return (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-xs font-medium">
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
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                    Recent Reports
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Your 10 most recent competitive analysis reports.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    [...Array(6)].map((_, i) => (
                        <div key={i} className="h-40 rounded-xl bg-muted/50 animate-pulse border border-border" />
                    ))
                ) : analyses.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground border border-dashed border-border rounded-xl">
                        <Calendar className="w-12 h-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-semibold text-foreground mb-1">No reports yet</h3>
                        <p className="text-sm text-center mb-6">
                            Compete analyses to see them here.
                        </p>
                        <Link href="/dashboard/analysis">
                            <Button>Start Analysis</Button>
                        </Link>
                    </div>
                ) : (
                    analyses.map((analysis) => (
                        <Link
                            href={analysis.status === 'completed' ? `/dashboard/report/${analysis.id}` : '#'}
                            key={analysis.id}
                            className={`block group ${analysis.status !== 'completed' ? 'pointer-events-none' : ''}`}
                        >
                            <Card className="h-full hover:shadow-md transition-all duration-300 border-border bg-card group-hover:-translate-y-1">
                                <CardContent className="p-5 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                            <BarChart3 className="w-5 h-5" />
                                        </div>
                                        <StatusBadge status={analysis.status} />
                                    </div>

                                    <div className="flex-1 space-y-1">
                                        <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                            {new URL(analysis.your_url).hostname}
                                        </h3>
                                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                                            <span className="text-xs font-mono uppercase bg-muted px-1.5 py-0.5 rounded">VS</span>
                                            <span className="truncate">{new URL(analysis.competitor_url).hostname}</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between text-sm pt-4 border-t border-border">
                                        <span className="text-muted-foreground">
                                            {new Date(analysis.created_at).toLocaleDateString()}
                                        </span>
                                        {analysis.status === 'completed' && (
                                            <div className="flex items-center gap-1 font-medium text-primary">
                                                View Report <ArrowRight className="w-4 h-4" />
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
