"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Loader2, Info, Zap, Globe, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import { PricingModal } from "@/components/pricing-modal";

export default function AnalysisPage() {
    const [yourWebsite, setYourWebsite] = useState("");
    const [competitorWebsite, setCompetitorWebsite] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPricing, setShowPricing] = useState(false);
    const router = useRouter();

    const handleAnalysis = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    yourUrl: yourWebsite,
                    competitorUrl: competitorWebsite,
                }),
            });

            const data = await response.json();

            if (response.status === 403 || data.code === 'INSUFFICIENT_CREDITS' || (data.error && data.error.includes("credits"))) {
                setShowPricing(true);
                setLoading(false);
                return;
            }

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create analysis');
            }

            router.push('/dashboard');
            router.refresh();

        } catch (err) {
            console.error('[ANALYSIS PAGE] Error:', err);
            setError(err instanceof Error ? err.message : 'An error occurred');
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <PricingModal open={showPricing} onOpenChange={setShowPricing} />
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-2">
                    Start New Analysis
                </h1>
                <p className="text-slate-600 text-sm">
                    See exactly why they are winning in just 30 seconds.
                </p>
            </div>

            {/* Rest of the component... */}
            <Card className="border-slate-200 shadow-lg bg-white">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-emerald-600" />
                        </div>
                        AI Comparison Engine
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                        Our agents will browse both sites, analyzing design, copy, technical performance, and SEO.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
                        >
                            <p className="font-semibold mb-1 flex items-center gap-2">
                                <Info className="w-4 h-4" />
                                Unable to start analysis
                            </p>
                            <p className="text-red-600">{error}</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleAnalysis} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Your Website */}
                            <div className="space-y-3">
                                <label htmlFor="your-website" className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-slate-600" />
                                    Your Website
                                </label>
                                <Input
                                    id="your-website"
                                    type="url"
                                    placeholder="https://yoursite.com"
                                    value={yourWebsite}
                                    onChange={(e) => setYourWebsite(e.target.value)}
                                    required
                                    className="bg-white border-slate-200 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 h-11 rounded-lg text-slate-900 placeholder:text-slate-400"
                                />
                                <p className="text-xs text-slate-500">
                                    The site you want to improve.
                                </p>
                            </div>

                            {/* Competitor Website */}
                            <div className="space-y-3">
                                <label htmlFor="competitor-website" className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                    <Search className="w-4 h-4 text-slate-600" />
                                    Competitor's Website
                                </label>
                                <Input
                                    id="competitor-website"
                                    type="url"
                                    placeholder="https://competitor.com"
                                    value={competitorWebsite}
                                    onChange={(e) => setCompetitorWebsite(e.target.value)}
                                    required
                                    className="bg-white border-slate-200 focus-visible:ring-emerald-500 focus-visible:border-emerald-500 h-11 rounded-lg text-slate-900 placeholder:text-slate-400"
                                />
                                <p className="text-xs text-slate-500">
                                    The winner you want to overtake.
                                </p>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            size="lg"
                            className="w-full h-12 text-base rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-md font-semibold"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Initializing Agents...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-5 h-5 mr-2" />
                                    Start Competitive Analysis
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Feature Pills */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                    { label: "Deep Traffic Scan" },
                    { label: "UX/UI Teardown" },
                    { label: "Conversion Tactics" },
                    { label: "Keywords Gap" },
                ].map((item, i) => (
                    <div key={i} className="flex items-center justify-center p-3 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
                        {item.label}
                    </div>
                ))}
            </div>
        </div>
    );
}
