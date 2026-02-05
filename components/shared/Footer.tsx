import Link from "next/link";
import { Twitter, Linkedin, Github, Mail } from "lucide-react";

export const Footer = () => {
    return (
        <footer className="border-t border-white/10 bg-slate-950 pt-16 pb-12 relative z-10 overflow-hidden">

            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center gap-3 group w-fit">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all">
                                <span className="text-black font-black text-xl">R</span>
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-white">
                                Reveal
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            Stop guessing. We analyze your competitor's Strategy, UX, and SEO to give you a clear, data-backed roadmap to win.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all group">
                                <Twitter className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all group">
                                <Linkedin className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all group">
                                <Github className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="space-y-6">
                        <h4 className="text-white font-bold tracking-wide">Product</h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li>
                                <Link href="/#features" className="hover:text-emerald-400 transition-colors">Features</Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="hover:text-emerald-400 transition-colors">Pricing</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-emerald-400 transition-colors">Case Studies</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-emerald-400 transition-colors">Roadmap</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-emerald-400 transition-colors">Changelog</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-white font-bold tracking-wide">Company</h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li>
                                <Link href="#" className="hover:text-emerald-400 transition-colors">About Us</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-emerald-400 transition-colors">Careers</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-emerald-400 transition-colors">Blog</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-emerald-400 transition-colors">Contact</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-emerald-400 transition-colors">Partners</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-white font-bold tracking-wide">Legal</h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li>
                                <Link href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-emerald-400 transition-colors">Cookie Policy</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-emerald-400 transition-colors">Security</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm">
                        &copy; 2026 Reveal Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Mail className="w-4 h-4" />
                        <span>support@reveal.com</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
