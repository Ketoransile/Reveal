"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Clock,
    CheckCircle2,
    Search,
    ArrowRight,
    Globe,
    Plus,
    LayoutGrid,
    List,
    TrendingUp,
    Calendar,
    AlertCircle
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default function AllAnalysesPage() {
    const [analyses, setAnalyses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/user');
                const data = await response.json();
                if (data.analyses) {
                    const sorted = data.analyses.sort((a: any, b: any) =>
                        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                    );
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

    const filteredAnalyses = analyses.filter(analysis =>
        analysis.your_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        analysis.competitor_url.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getHostName = (url: string) => {
        try {
            return new URL(url).hostname.replace('www.', '');
        } catch {
            return url;
        }
    };

    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case 'processing':
                return (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-foreground/5 border border-border text-foreground dark:text-foreground text-[11px] font-bold tracking-widest uppercase shadow-sm">
                        <Clock className="w-3 h-3 animate-[spin_3s_linear_infinite]" />
                        Processing
                    </div>
                );
            case 'completed':
                return (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-foreground/5 border border-border text-foreground dark:text-foreground text-[11px] font-bold tracking-widest uppercase shadow-sm">
                        <CheckCircle2 className="w-3 h-3" />
                        Complete
                    </div>
                );
            case 'failed':
                return (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-foreground/5 border border-border text-foreground dark:text-foreground text-[11px] font-bold tracking-widest uppercase shadow-sm">
                        <AlertCircle className="w-3 h-3" />
                        Failed
                    </div>
                );
            default:
                return (
                    <div className="px-2.5 py-1 rounded-full bg-muted border border-border/50 text-muted-foreground text-[11px] font-bold tracking-widest uppercase">
                        {status}
                    </div>
                );
        }
    };

    return (
        <div className="relative min-h-screen">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-foreground/5 rounded-full blur-[150px] pointer-events-none mix-blend-screen opacity-40" />
            </div>

            <div className="relative z-10 max-w-[1600px] mx-auto space-y-8 pb-20">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                    <div className="relative space-y-2">
                        <div className="absolute -left-4 top-1 w-1 h-8 bg-foreground/5 rounded-r-full hidden md:block opacity-80" />
                        <h1 className="text-3xl font-semibold font-display tracking-tight text-foreground">
                            Analysis History
                        </h1>
                        <p className="text-muted-foreground text-sm max-w-lg leading-relaxed font-medium">
                            Access all your past competitive audits. Track performance changes and revisit strategic insights over time.
                        </p>
                    </div>

                    <Link href="/dashboard/analysis">
                        <Button className="h-11 px-6 rounded-xl font-semibold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                            <Plus className="w-4 h-4 mr-2 relative z-10" />
                            <span className="relative z-10">New Analysis</span>
                        </Button>
                    </Link>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card/40 backdrop-blur-2xl p-3 rounded-2xl border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative z-10">
                    <div className="relative w-full sm:w-96 group">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                        <Input
                            type="search"
                            placeholder="Search domains..."
                            className="pl-10 bg-background/50 border-border/50 focus-visible:ring-1 focus-visible:ring-border transition-all h-11 w-full rounded-xl placeholder:text-muted-foreground text-sm font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex bg-background/50 p-1.5 rounded-xl border border-border/50 shadow-sm backdrop-blur-sm shrink-0">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2.5 rounded-lg transition-all duration-300 ${viewMode === 'grid' ? 'bg-foreground/5 text-foreground shadow-sm hover:bg-foreground/5' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
                            aria-label="Grid View"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2.5 rounded-lg transition-all duration-300 ${viewMode === 'list' ? 'bg-foreground/5 text-foreground shadow-sm hover:bg-foreground/5' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
                            aria-label="List View"
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                {loading ? (
                    viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                <div key={n} className="h-64 bg-card/40 backdrop-blur-2xl border border-border/40 rounded-3xl p-7 flex flex-col gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-pulse">
                                    <div className="flex justify-between w-full">
                                        <div className="w-24 h-7 bg-muted/50 rounded-full" />
                                        <div className="w-16 h-5 bg-muted/50 rounded-md" />
                                    </div>
                                    <div className="space-y-5 mt-6 border-l-2 border-border/20 pl-4">
                                        <div className="space-y-2.5">
                                            <div className="w-12 h-3 bg-muted/50 rounded-md" />
                                            <div className="w-3/4 h-5 bg-muted/50 rounded-md" />
                                        </div>
                                        <div className="space-y-2.5">
                                            <div className="w-12 h-3 bg-muted/50 rounded-md" />
                                            <div className="w-2/3 h-5 bg-muted/50 rounded-md" />
                                        </div>
                                    </div>
                                    <div className="mt-auto pt-5 border-t border-border/20 w-full flex justify-between items-center">
                                        <div className="w-24 h-4 bg-muted/50 rounded-md" />
                                        <div className="w-10 h-10 bg-muted/50 rounded-xl" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-card/40 backdrop-blur-2xl border border-border/40 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                            <div className="divide-y divide-border/20">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="p-6 flex items-center gap-5 animate-pulse">
                                        <div className="w-12 h-12 bg-muted/50 rounded-2xl" />
                                        <div className="space-y-2.5 flex-1">
                                            <div className="h-5 bg-muted/50 w-1/3 rounded-md" />
                                            <div className="h-4 bg-muted/50 w-1/4 rounded-md" />
                                        </div>
                                        <div className="w-28 h-7 bg-muted/50 rounded-full hidden sm:block" />
                                        <div className="w-24 h-4 bg-muted/50 rounded-md hidden sm:block" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ) : filteredAnalyses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center px-4 bg-card/40 backdrop-blur-2xl rounded-3xl border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group hover:border-border transition-colors duration-500">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-transparent pointer-events-none" />
                        <div className="w-20 h-20 bg-background/50 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-6 ring-1 ring-border/50 shadow-lg relative z-10">
                            <Search className="w-8 h-8 text-foreground" />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold tracking-tight text-foreground">No analyses found</h3>
                            <p className="text-muted-foreground mt-3 text-[15px] font-medium max-w-sm mb-8 leading-relaxed">
                                {searchTerm ? "Try adjusting your search terms or clearing the filter." : "You haven't run any competitive audits yet. Start discovering insights today."}
                            </p>
                            {!searchTerm && (
                                <Link href="/dashboard/analysis">
                                    <Button className="h-12 px-8 rounded-xl font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Start First Analysis
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                ) : viewMode === 'grid' ? (
                    // GRID VIEW
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredAnalyses.map((analysis) => (
                            <div key={analysis.id} className="h-full">
                                <Link
                                    href={analysis.status === 'completed' ? `/dashboard/report/${analysis.id}` : '#'}
                                    className={`block h-full cursor-pointer group ${analysis.status !== 'completed' ? 'pointer-events-none opacity-80' : ''}`}
                                >
                                    <div className="bg-card/40 backdrop-blur-2xl rounded-3xl p-7 border border-border/40 hover:border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(16,185,129,0.08)] transition-all duration-500 h-full flex flex-col relative overflow-hidden hover:-translate-y-1">
                                        {/* Hover Gradients */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-foreground/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-foreground/5 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 ease-out pointer-events-none" />

                                        {/* Status & Date */}
                                        <div className="flex justify-between items-start mb-6 relative z-10">
                                            <StatusBadge status={analysis.status} />
                                            <div className="flex items-center text-[12px] text-muted-foreground font-semibold bg-background/50 backdrop-blur-sm px-2.5 py-1 rounded-full border border-border/50">
                                                <Calendar className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                                                {new Date(analysis.created_at).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </div>

                                        {/* URLs Visualization */}
                                        <div className="space-y-5 mb-8 flex-1 relative z-10 mt-2">
                                            {/* Your Site */}
                                            <div className="relative pl-4 border-l-2 border-border">
                                                <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mb-1.5 focus:outline-none">You</p>
                                                <div className="flex items-center gap-2">
                                                    <Globe className="w-4 h-4 text-foreground shrink-0" />
                                                    <span className="font-bold text-foreground truncate text-sm tracking-tight group-hover:text-foreground transition-colors duration-300">
                                                        {getHostName(analysis.your_url)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Competitor */}
                                            <div className="relative pl-4 border-l-2 border-border/40">
                                                <p className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase mb-1.5 focus:outline-none">Competitor</p>
                                                <div className="flex items-center gap-2">
                                                    <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                                                    <span className="font-semibold text-muted-foreground truncate text-sm tracking-tight group-hover:text-foreground transition-colors duration-300">
                                                        {getHostName(analysis.competitor_url)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer Action */}
                                        <div className="pt-5 mt-auto border-t border-border/20 flex items-center justify-between relative z-10">
                                            <span className="text-[13px] font-bold tracking-tight text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                                                {analysis.status === 'completed' ? 'View Full Report' : 'Analyzing Data...'}
                                            </span>
                                            {analysis.status === 'completed' && (
                                                <div className="w-10 h-10 rounded-xl bg-background/50 border border-border/50 shadow-sm flex items-center justify-center text-muted-foreground group-hover:bg-foreground/5 group-hover:text-foreground-foreground group-hover:border-border group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-300">
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                ) : (
                    // LIST VIEW
                    <div className="bg-card/40 backdrop-blur-2xl rounded-3xl border border-border/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border/40 bg-muted/20">
                                        <th className="py-5 px-6 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Analysis Comparison</th>
                                        <th className="py-5 px-6 text-[11px] font-bold text-muted-foreground uppercase tracking-widest w-[160px]">Status</th>
                                        <th className="py-5 px-6 text-[11px] font-bold text-muted-foreground uppercase tracking-widest w-[150px] hidden sm:table-cell">Date</th>
                                        <th className="py-5 px-6 text-right text-[11px] font-bold text-muted-foreground uppercase tracking-widest w-[100px]">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/20">
                                    {filteredAnalyses.map((analysis) => (
                                        <tr
                                            key={analysis.id}
                                            className={`group transition-all duration-300 ${analysis.status === 'completed' ? 'hover:bg-accent/40 cursor-pointer relative overflow-hidden' : 'opacity-80'}`}
                                            onClick={() => {
                                                if (analysis.status === 'completed') {
                                                    window.location.href = `/dashboard/report/${analysis.id}`;
                                                }
                                            }}
                                        >
                                            {analysis.status === 'completed' && (
                                                <div className="absolute inset-0 bg-gradient-to-r from-foreground/10 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-out pointer-events-none" />
                                            )}
                                            <td className="py-4 px-6 relative z-10">
                                                <div className="flex items-center gap-5">
                                                    <div className="p-3 bg-background/50 border border-border/50 shadow-sm text-foreground/70 rounded-2xl shrink-0 group-hover:border-border group-hover:text-foreground transition-colors duration-300">
                                                        <TrendingUp className="w-5 h-5" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <h4 className="font-bold text-foreground text-[15px] tracking-tight truncate group-hover:text-foreground transition-colors duration-300">
                                                            {getHostName(analysis.your_url)}
                                                        </h4>
                                                        <p className="text-xs text-muted-foreground mt-1 truncate flex items-center gap-2 font-medium">
                                                            <span className="opacity-60 text-[10px] uppercase font-bold tracking-widest bg-muted/50 px-1.5 py-0.5 rounded-sm">vs</span>
                                                            {getHostName(analysis.competitor_url)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 relative z-10">
                                                <StatusBadge status={analysis.status} />
                                            </td>
                                            <td className="py-4 px-6 text-[13px] text-muted-foreground font-semibold hidden sm:table-cell relative z-10">
                                                {new Date(analysis.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className="py-4 px-6 text-right relative z-10">
                                                {analysis.status === 'completed' && (
                                                    <div className="inline-flex w-10 h-10 items-center justify-center rounded-xl bg-background/50 border border-border/50 shadow-sm group-hover:bg-foreground/5 group-hover:text-foreground-foreground group-hover:border-border group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all duration-300 text-muted-foreground">
                                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
