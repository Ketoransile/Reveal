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
        }).catch(() => {
            // Supabase unreachable (e.g. wrong URL, no internet) — treat as logged out
            setUser(null);
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
            <div className="fixed top-0 left-0 right-0 z-50 w-full pointer-events-none">
                <nav className="w-full h-16 px-6 md:px-10 flex items-center justify-between text-foreground bg-background/80 dark:bg-background/90 backdrop-blur-md border-b border-border pointer-events-auto">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group relative z-10" onClick={() => setMobileMenuOpen(false)}>
                        <div className="w-8 h-8 bg-foreground flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                            <span className="text-background font-bold text-base">R</span>
                        </div>
                        <span className="text-lg font-bold tracking-tight text-foreground opacity-90 group-hover:opacity-100 transition-opacity">
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
                            <div className="hidden md:block w-[120px] h-9 bg-foreground/5 animate-pulse" />
                        ) : user ? (
                            <Link href="/dashboard" className="hidden md:block">
                                <Button
                                    size="sm"
                                    className="h-9 px-4 bg-foreground hover:bg-foreground/90 text-background font-semibold transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
                                >
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" className="hidden md:block ">
                                    <Button
                                        size="sm"
                                        className="h-9 px-4 bg-foreground hover:bg-foreground/90 text-background font-semibold transition-all duration-200 hover:-translate-y-0.5"
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
                                className="w-9 h-9 text-muted-foreground hover:text-foreground hover:bg-muted"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                <span className="sr-only">Menu</span>
                                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
                                        <Button className="w-full h-12 text-lg font-semibold bg-foreground hover:bg-foreground/90 text-background">
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
