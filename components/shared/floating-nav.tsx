"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";

export const FloatingNav = ({ user }: { user: any }) => {
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;

        // Hide when scrolling down, Show when scrolling up
        if (latest > previous && latest > 150) {
            setHidden(true);
        } else {
            setHidden(false);
        }

        // Add background blur when scrolled down
        if (latest > 50) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    });

    return (
        <motion.div
            variants={{
                visible: { y: 0, opacity: 1 },
                hidden: { y: -100, opacity: 0 },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
        >
            <nav
                className={`
                    pointer-events-auto w-full max-w-5xl rounded-full px-8 py-4 
                    flex items-center justify-between transition-all duration-500
                    ${scrolled
                        ? `
                            bg-slate-950/40 backdrop-blur-2xl 
                            border border-white/20 
                            shadow-[0_8px_32px_rgba(0,0,0,0.4),0_0_1px_rgba(255,255,255,0.1)_inset]
                            ring-1 ring-white/10
                            before:absolute before:inset-0 before:rounded-full 
                            before:bg-gradient-to-b before:from-white/5 before:to-transparent 
                            before:pointer-events-none
                            relative overflow-hidden
                        `
                        : `
                            bg-slate-950/20 backdrop-blur-md
                            border border-white/5
                            shadow-[0_4px_16px_rgba(0,0,0,0.2)]
                        `
                    }
                `}
            >
                {/* Subtle gradient overlay for depth */}
                {scrolled && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
                )}

                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 group relative z-10">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all ring-2 ring-emerald-400/20 group-hover:ring-emerald-400/40 group-hover:scale-105">
                        <span className="text-black font-black text-xl">R</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-100 transition-colors">
                        Rival<span className="text-emerald-400">Lens</span>
                    </span>
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-8 text-sm font-medium relative z-10">
                    <Link href="/#features" className="text-slate-300 hover:text-white transition-colors relative group py-2">
                        Features
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link href="/pricing" className="text-slate-300 hover:text-white transition-colors relative group py-2">
                        Pricing
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link href="/#how-it-works" className="text-slate-300 hover:text-white transition-colors relative group py-2">
                        How It Works
                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center gap-3 relative z-10">
                    {user ? (
                        <Link href="/dashboard">
                            <Button
                                size="sm"
                                className="rounded-xl h-10 px-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300 border border-emerald-400/30 hover:scale-105"
                            >
                                Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block px-4 py-2">
                                Login
                            </Link>
                            <Link href="/signup">
                                <Button
                                    size="sm"
                                    className="rounded-xl h-10 px-5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300 border border-emerald-400/30 hover:scale-105"
                                >
                                    Get Started
                                </Button>
                            </Link>
                        </>
                    )}

                    {/* Mobile Menu Trigger */}
                    <div className="md:hidden">
                        <Button variant="ghost" size="icon" className="rounded-xl w-10 h-10 text-slate-300 hover:text-white hover:bg-white/10">
                            <span className="sr-only">Menu</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
                        </Button>
                    </div>
                </div>

            </nav>
        </motion.div>
    );
};
