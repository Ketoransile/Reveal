"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    BarChart3,
    CheckCircle2,
    Clock,
    XCircle,
    Search,
    Filter
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default function AllAnalysesPage() {
    const [analyses, setAnalyses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/user');
                const data = await response.json();
                if (data.analyses) {
                    setAnalyses(data.analyses);
                }
            } catch (err) {
                console.error('Error fetching analyses:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const filteredAnalyses = analyses.filter(analysis =>
        analysis.your_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        analysis.competitor_url.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                    All Analyses
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    View and manage all your competitive analysis reports.
                </p>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search URL..."
                        className="pl-9 bg-background"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline" size="sm" className="h-10 gap-1 bg-background">
                    <Filter className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filter
                    </span>
                </Button>
            </div>

            <Card className="border-border bg-card shadow-sm">
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                            <p className="text-sm">Loading analyses...</p>
                        </div>
                    ) : filteredAnalyses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                            <BarChart3 className="w-12 h-12 text-muted-foreground/50 mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-1">No analyses found</h3>
                            <p className="text-sm text-center mb-6">
                                {searchTerm ? "Try a different search term" : "Start your first competitive analysis"}
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            <div className="grid grid-cols-12 gap-4 p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted/50">
                                <div className="col-span-6 md:col-span-7">Analysis Pair</div>
                                <div className="col-span-3 md:col-span-3">Status</div>
                                <div className="col-span-3 md:col-span-2 text-right">Date</div>
                            </div>
                            {filteredAnalyses.map((analysis) => (
                                <div
                                    key={analysis.id}
                                    onClick={() => {
                                        if (analysis.status === 'completed') {
                                            window.location.href = `/dashboard/report/${analysis.id}`;
                                        }
                                    }}
                                    className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors 
                                        ${analysis.status === 'completed'
                                            ? 'hover:bg-muted/50 cursor-pointer'
                                            : 'opacity-75 cursor-default'}`}
                                >
                                    <div className="col-span-6 md:col-span-7 min-w-0">
                                        <div className="font-semibold text-foreground truncate">
                                            {new URL(analysis.your_url).hostname}
                                        </div>
                                        <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
                                            <span className="text-muted-foreground/70">vs</span>
                                            {new URL(analysis.competitor_url).hostname}
                                        </div>
                                    </div>

                                    <div className="col-span-3 md:col-span-3">
                                        <StatusBadge status={analysis.status} />
                                    </div>

                                    <div className="col-span-3 md:col-span-2 text-sm text-muted-foreground text-right">
                                        {new Date(analysis.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
