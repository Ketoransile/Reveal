import Link from "next/link";
import { Twitter, Linkedin, Github, Mail } from "lucide-react";

export const Footer = () => {
    return (
        <footer className="border-t border-border/10 bg-background pt-16 pb-12 relative z-10 overflow-hidden">

            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-foreground/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

                    {/* Brand Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center gap-3 group w-fit">
                            <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center shadow-md border border-border/50 group-hover:shadow-lg transition-all">
                                <span className="text-background font-black text-xl">R</span>
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-foreground opacity-90">
                                Reveal
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs font-medium">
                            Stop guessing. We analyze your competitor's Strategy, UX, and SEO to give you a clear, data-backed roadmap to win.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href="#" className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all group border border-border/50">
                                <Twitter className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all group border border-border/50">
                                <Linkedin className="w-4 h-4" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all group border border-border/50">
                                <Github className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="space-y-6">
                        <h4 className="text-foreground font-bold tracking-wide">Product</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground font-medium">
                            <li>
                                <Link href="/#features" className="hover:text-foreground transition-colors">Features</Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-foreground transition-colors">Case Studies</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-foreground transition-colors">Roadmap</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-foreground transition-colors">Changelog</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-foreground font-bold tracking-wide">Company</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground font-medium">
                            <li>
                                <Link href="#" className="hover:text-foreground transition-colors">About Us</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-foreground transition-colors">Careers</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-foreground transition-colors">Blog</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-foreground transition-colors">Contact</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-foreground transition-colors">Partners</Link>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-6">
                        <h4 className="text-foreground font-bold tracking-wide">Legal</h4>
                        <ul className="space-y-3 text-sm text-muted-foreground font-medium">
                            <li>
                                <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-foreground transition-colors">Cookie Policy</Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-foreground transition-colors">Security</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-border/20 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-muted-foreground text-sm font-medium">
                        &copy; 2026 Reveal Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                        <Mail className="w-4 h-4" />
                        <span>support@reveal.com</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};
