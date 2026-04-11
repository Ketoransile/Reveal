"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export const FloatingNav = ({ user: initialUser }: { user: any }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [user, setUser] = useState(initialUser);
    const [authLoading, setAuthLoading] = useState(initialUser === undefined);

    // Check for user session on mount and when auth state changes
    useEffect(() => {
        const supabase = createClient();

        // Get current user session
        supabase.auth.getUser().then(async ({ data: { user } }) => {
            if (user) {
                // Verify user has a public profile
                const { data: profile, error } = await supabase
                    .from('users')
                    .select('id')
                    .eq('id', user.id)
                    .single();

                if (error || !profile) {
                    console.log("User missing profile on client check, signing out...");
                    await supabase.auth.signOut();
                    setUser(null);
                } else {
                    setUser(user);
                }
            } else {
                setUser(null);
            }
            setAuthLoading(false);
        });

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return (
        <>
            <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 md:px-0 w-full pointer-events-none">
                <nav className="w-full md:max-w-5xl rounded-2xl px-5 py-2.5 md:px-6 md:py-3 flex items-center justify-between text-foreground bg-background/60 dark:bg-background/60 backdrop-blur-2xl border border-border pointer-events-auto shadow-lg shadow-black/5 dark:shadow-white/5">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group relative z-10" onClick={() => setMobileMenuOpen(false)}>
                        <div className="w-9 h-9 bg-foreground rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:scale-105">
                            <span className="text-background font-bold text-lg">R</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-foreground opacity-90 group-hover:opacity-100 transition-opacity">
                            Reveal
                        </span>
                    </Link>

                    {/* Navigation Links - Desktop */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium relative z-10">
                        <Link href="/#features" className="text-muted-foreground hover:text-foreground transition-colors relative group py-2">
                            Features
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors relative group py-2">
                            Pricing
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link href="/#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors relative group py-2">
                            How It Works
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-foreground transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    </div>

                    {/* Auth Buttons */}
                    <div className="flex items-center gap-3 relative z-10 w-[140px] md:w-auto overflow-hidden justify-end">
                        {authLoading ? (
                            <div className="hidden md:block w-[120px] h-10 rounded-xl bg-foreground/5 animate-pulse" />
                        ) : user ? (
                            <Link href="/dashboard" className="hidden md:block">
                                <Button
                                    size="sm"
                                    className="rounded-xl h-10 px-5 bg-foreground hover:bg-foreground/90 text-background font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                                >
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/signup" className="hidden md:block ">
                                    <Button
                                        size="sm"
                                        className="rounded-xl h-10 px-5 bg-foreground hover:bg-foreground/90 text-background font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                    >
                                        Get Started
                                    </Button>
                                </Link>
                            </>
                        )}

                        {/* Mobile Menu Trigger */}
                        <div className="md:hidden">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-xl w-10 h-10 text-muted-foreground hover:text-foreground hover:bg-muted"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                <span className="sr-only">Menu</span>
                                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </Button>
                        </div>
                    </div>
                </nav>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-background pt-24 px-6 md:hidden overflow-y-auto">
                    {/* Background Elements */}
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-foreground/5 rounded-full blur-[80px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-foreground/5 rounded-full blur-[80px] pointer-events-none" />

                    <div className="flex flex-col space-y-6 relative z-10">
                        <Link
                            href="/#features"
                            className="text-xl font-medium text-muted-foreground hover:text-foreground py-2 border-b border-border/50"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Features
                        </Link>
                        <Link
                            href="/pricing"
                            className="text-xl font-medium text-muted-foreground hover:text-foreground py-2 border-b border-border/50"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Pricing
                        </Link>
                        <Link
                            href="/#how-it-works"
                            className="text-xl font-medium text-muted-foreground hover:text-foreground py-2 border-b border-border/50"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            How It Works
                        </Link>

                        <div className="pt-6 flex flex-col gap-4">
                            {user ? (
                                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                    <Button className="w-full h-12 text-lg font-semibold bg-foreground hover:bg-foreground/90 text-background rounded-xl">
                                        Dashboard
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="ghost" className="w-full h-12 text-lg text-muted-foreground hover:text-foreground hover:bg-muted border border-border/50 rounded-xl">
                                            Login
                                        </Button>
                                    </Link>
                                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                                        <Button className="w-full h-12 text-lg font-semibold bg-foreground hover:bg-foreground/90 text-background rounded-xl">
                                            Get Started
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
