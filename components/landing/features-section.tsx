import { Badge } from "@/components/ui/badge";
import { BarChart3, Zap, Lock, Search, MousePointerClick, FileText, ArrowRight, Sparkles } from "lucide-react";

export const FeaturesSection = () => {
    return (
        <section id="features" className="py-24 relative overflow-hidden bg-slate-950/50">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-20">
                    <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 px-4 py-1.5 text-sm uppercase tracking-wider backdrop-blur-sm">
                        Powerful Features
                    </Badge>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">
                        Complete Intelligence <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Toolkit</span>
                    </h2>
                    <p className="max-w-[700px] text-slate-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Everything you need to dissect your competitor's strategy and build a better one.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {/* Feature 1 */}
                    <div className="group p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-blue-500/40 transition-all duration-500 hover:bg-slate-900/60 hover:-translate-y-2">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                            <Search className="w-7 h-7 text-blue-400 group-hover:text-blue-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-blue-200 transition-colors">SEO Backlink Spy</h3>
                        <p className="text-slate-400 leading-relaxed">
                            See exactly who links to them. Replicate their high-authority backlinks to boost your own domain authority.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="group p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-emerald-500/40 transition-all duration-500 hover:bg-slate-900/60 hover:-translate-y-2">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                            <MousePointerClick className="w-7 h-7 text-emerald-400 group-hover:text-emerald-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-emerald-200 transition-colors">UX/UI Pattern Detection</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Identify the design patterns they use to drive conversions. Buttons, layouts, and user flows analyzed by AI.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="group p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-purple-500/40 transition-all duration-500 hover:bg-slate-900/60 hover:-translate-y-2">
                        <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                            <FileText className="w-7 h-7 text-purple-400 group-hover:text-purple-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-purple-200 transition-colors">Content Strategy decoding</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Analyze their top-performing blog posts and landing pages. Know what topics resonate with your shared audience.
                        </p>
                    </div>

                    {/* Feature 4 */}
                    <div className="group p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-amber-500/40 transition-all duration-500 hover:bg-slate-900/60 hover:-translate-y-2">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                            <Zap className="w-7 h-7 text-amber-400 group-hover:text-amber-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-amber-200 transition-colors">Performance Benchmarking</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Compare load speeds, core web vitals, and mobile responsiveness. Don't let slow tech kill your conversions.
                        </p>
                    </div>

                    {/* Feature 5 */}
                    <div className="group p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-pink-500/40 transition-all duration-500 hover:bg-slate-900/60 hover:-translate-y-2">
                        <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                            <Lock className="w-7 h-7 text-pink-400 group-hover:text-pink-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-pink-200 transition-colors">Tech Stack Reveal</h3>
                        <p className="text-slate-400 leading-relaxed">
                            See under the hood. Detect their CMS, analytics tools, advertising pixels, and backend technologies.
                        </p>
                    </div>

                    {/* Feature 6 */}
                    <div className="group p-8 rounded-3xl bg-slate-900/40 border border-slate-800 hover:border-cyan-500/40 transition-all duration-500 hover:bg-slate-900/60 hover:-translate-y-2">
                        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                            <BarChart3 className="w-7 h-7 text-cyan-400 group-hover:text-cyan-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-cyan-200 transition-colors">Traffic Source Breakdown</h3>
                        <p className="text-slate-400 leading-relaxed">
                            Do they get users from organic search, paid ads, or social? Know where to spend your marketing budget.
                        </p>
                    </div>
                </div>

                {/* Coming Soon Feature - Full Width Highlight */}
                <div className="mt-16 max-w-7xl mx-auto px-4">
                    <div className="relative group p-8 md:p-10 rounded-3xl bg-gradient-to-br from-slate-900/60 via-blue-900/20 to-purple-900/20 border-2 border-blue-500/30 hover:border-blue-400/50 transition-all duration-500 hover:shadow-[0_0_50px_rgba(59,130,246,0.3)] overflow-hidden">
                        {/* Animated Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        {/* Coming Soon Badge */}
                        <div className="absolute top-6 right-6">
                            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-lg animate-pulse">
                                <Sparkles className="w-3 h-3 mr-1 inline" />
                                Coming Soon
                            </Badge>
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
                            {/* Icon */}
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shrink-0">
                                <Search className="w-8 h-8 text-blue-400 group-hover:text-blue-300" />
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <h3 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 mb-4">
                                    Auto-Competitor Discovery & Multi-Analysis
                                </h3>
                                <p className="text-slate-300 text-lg leading-relaxed mb-4">
                                    Just paste your website URL and our AI will automatically discover all top competitors across the internet. We'll analyze each one and show you exactly why they're converting better than you.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <div className="flex items-center gap-2 text-sm text-blue-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                        <span>Automatic competitor detection</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-purple-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                                        <span>Multi-site comparison</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-pink-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                                        <span>Conversion gap analysis</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
