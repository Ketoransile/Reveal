"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Clock,
    CheckCircle2,
    XCircle,
    Search,
    ArrowRight,
    Globe,
    Plus,
    LayoutGrid,
    List,
    MoreHorizontal,
    TrendingUp,
    Calendar,
    ExternalLink
} from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

export default function AllAnalysesPage() {
    const [analyses, setAnalyses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('/api/user'); // Assuming this endpoint returns user's data including analyses
                const data = await response.json();
                if (data.analyses) {
                    // Sort by newest first
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
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1.5 py-1">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Processing
                    </Badge>
                );
            case 'completed':
                return (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1.5 py-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Complete
                    </Badge>
                );
            case 'failed':
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1.5 py-1">
                        <XCircle className="w-3.5 h-3.5" />
                        Failed
                    </Badge>
                );
            default:
                return (
                    <Badge variant="secondary">
                        {status}
                    </Badge>
                );
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto space-y-8 p-6 pb-20">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
                <div className="space-y-1.5">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        Analysis History
                    </h1>
                    <p className="text-slate-500 text-sm max-w-lg leading-relaxed">
                        Access all your past competitive audits. Track performance changes and revisit strategic insights for your domains.
                    </p>
                </div>

                <Link href="/dashboard">
                    <Button className="bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10 rounded-full px-6 h-11">
                        <Plus className="w-4 h-4 mr-2" />
                        New Analysis
                    </Button>
                </Link>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        type="search"
                        placeholder="Search domains..."
                        className="pl-10 bg-slate-50 border-transparent focus:bg-white transition-all h-10 rounded-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="h-48 bg-slate-100 animate-pulse rounded-3xl" />
                    ))}
                </div>
            ) : filteredAnalyses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <Search className="w-6 h-6 text-slate-300" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900">No analyses found</h3>
                        <p className="text-slate-500 mt-1">
                            {searchTerm ? "Try adjusting your search terms" : "Get started with your first competitive audit"}
                        </p>
                    </div>
                    {!searchTerm && (
                        <Link href="/dashboard">
                            <Button variant="outline" className="rounded-full">Start Analysis</Button>
                        </Link>
                    )}
                </div>
            ) : viewMode === 'grid' ? (
                // GRID VIEW
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredAnalyses.map((analysis, index) => (
                        <motion.div
                            key={analysis.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Link href={analysis.status === 'completed' ? `/dashboard/report/${analysis.id}` : '#'} className="block h-full cursor-pointer group">
                                <div className="bg-white hover:bg-slate-50/50 rounded-3xl p-6 border border-slate-100 shadow-[0_2px_10px_rgb(0,0,0,0.02)] hover:shadow-[0_12px_24px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 h-full flex flex-col relative overflow-hidden">

                                    {/* Status & Date */}
                                    <div className="flex justify-between items-start mb-6">
                                        <StatusBadge status={analysis.status} />
                                        <div className="flex items-center text-xs text-slate-400 font-medium">
                                            <Calendar className="w-3 h-3 mr-1.5" />
                                            {// Format relative date if recent, or short date
                                                new Date(analysis.created_at).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric'
                                                })
                                            }
                                        </div>
                                    </div>

                                    {/* URLs Visualization */}
                                    <div className="space-y-4 mb-8 flex-1">
                                        {/* Your Site */}
                                        <div className="relative pl-4 border-l-2 border-emerald-500">
                                            <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mb-0.5">You</p>
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-4 h-4 text-slate-400" />
                                                <span className="font-bold text-slate-900 truncate">
                                                    {getHostName(analysis.your_url)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Competitor */}
                                        <div className="relative pl-4 border-l-2 border-slate-200">
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Competitor</p>
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-4 h-4 text-slate-300" />
                                                <span className="font-semibold text-slate-600 truncate">
                                                    {getHostName(analysis.competitor_url)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Action */}
                                    <div className="pt-4 mt-auto border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                                            {/* Could add score here if available in list view data */}
                                            <span>View Report</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            ) : (
                // LIST VIEW
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-50 bg-slate-50/50">
                                    <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Analysis</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Date Created</th>
                                    <th className="py-4 px-6 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAnalyses.map((analysis) => (
                                    <tr
                                        key={analysis.id}
                                        className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors group cursor-pointer"
                                        onClick={() => {
                                            if (analysis.status === 'completed') {
                                                window.location.href = `/dashboard/report/${analysis.id}`;
                                            }
                                        }}
                                    >
                                        <td className="py-5 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                                    <TrendingUp className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900 text-sm">{getHostName(analysis.your_url)}</h4>
                                                    <p className="text-xs text-slate-500 mt-0.5">vs {getHostName(analysis.competitor_url)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6">
                                            <StatusBadge status={analysis.status} />
                                        </td>
                                        <td className="py-5 px-6 text-sm text-slate-500 font-medium">
                                            {new Date(analysis.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-5 px-6 text-right">
                                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                View <ArrowRight className="w-4 h-4 ml-1" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
