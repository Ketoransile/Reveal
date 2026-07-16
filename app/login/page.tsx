"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, AlertCircle } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [oauthLoading, setOauthLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            const params = new URLSearchParams(window.location.search);
            const redirectUrl = params.get('redirect') || "/dashboard";
            router.push(redirectUrl);
            router.refresh();
        }
    };

    const handleOAuthLogin = async (provider: 'github' | 'google') => {
        setOauthLoading(true);
        setError(null);

        const params = new URLSearchParams(window.location.search);
        const redirectUrl = params.get('redirect') || "/dashboard";

        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(redirectUrl)}`,
            },
        })
        if (error) {
            setError(error.message);
            setOauthLoading(false);
        }
    }

    const isDisabled = loading || oauthLoading;

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-background overflow-hidden relative selection:bg-foreground/20">
            {/* Left Panel - Editorial Brand Column (Desktop only) */}
            <div className="hidden md:flex md:w-1/2 bg-black relative flex-col justify-between p-16 border-r border-border">
                {/* Background Grid */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                        backgroundSize: '40px 40px',
                        backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)'
                    }}
                />
                
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 relative z-10 w-fit">
                    <div className="w-8 h-8 bg-white flex items-center justify-center">
                        <span className="text-black font-bold text-base">R</span>
                    </div>
                    <span className="text-lg font-bold tracking-tight text-white opacity-90">
                        Reveal
                    </span>
                </Link>

                {/* Editorial Tagline */}
                <div className="relative z-10 max-w-md my-auto space-y-6">
                    <h2 className="text-4xl lg:text-5xl font-light tracking-tight text-white font-display leading-[1.15]">
                        Decode strategies. <br />
                        <span className="italic font-normal">Outsell competitors.</span>
                    </h2>
                    <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                        Stop guessing what works. Reveal analyzes tech stacks, conversion scores, and SEO flow to give you an actionable roadmap in seconds.
                    </p>
                </div>

                {/* Footer credit */}
                <div className="relative z-10 text-xs text-zinc-500 font-medium">
                    &copy; 2026 Reveal Inc. All rights reserved.
                </div>
            </div>

            {/* Right Panel - Form Column */}
            <div className="flex-1 flex items-center justify-center p-8 md:p-16 relative">
                {/* Logo for mobile */}
                <div className="absolute top-8 left-8 md:hidden">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-foreground flex items-center justify-center">
                            <span className="text-background font-bold text-base">R</span>
                        </div>
                        <span className="text-lg font-bold tracking-tight text-foreground">
                            Reveal
                        </span>
                    </Link>
                </div>

                <div className="w-full max-w-sm space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-light tracking-tight text-foreground font-display">
                            Welcome back
                        </h1>
                        <p className="text-sm text-muted-foreground font-medium">
                            Sign in to access your intelligence dashboard
                        </p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="space-y-6">
                        {/* OAuth login */}
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => handleOAuthLogin('google')}
                            disabled={isDisabled}
                            className="w-full bg-background border-border hover:bg-muted text-foreground transition-all h-11 relative overflow-hidden font-medium cursor-pointer"
                        >
                            {oauthLoading ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Redirecting...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24">
                                        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.44 0 6.04-1.133 7.973-3.267 2.027-1.92 2.6-4.84 2.6-7.253 0-.693-.067-1.347-.187-1.973z" fill="currentColor" />
                                    </svg>
                                    Continue with Google
                                </span>
                            )}
                        </Button>

                        <div className="flex items-center gap-4">
                            <div className="h-px flex-1 bg-border/50" />
                            <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-widest">Or continue with email</span>
                            <div className="h-px flex-1 bg-border/50" />
                        </div>

                        {/* Email form */}
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-1.5">
                                <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="analyst@competitor.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isDisabled}
                                    className="bg-background border-border focus-visible:ring-1 focus-visible:ring-primary h-11"
                                />
                            </div>
                            
                            <div className="space-y-1.5">
                                <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Password</label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isDisabled}
                                    className="bg-background border-border focus-visible:ring-1 focus-visible:ring-primary h-11"
                                />
                            </div>

                            <Button
                                className="w-full bg-foreground text-background hover:bg-foreground/90 font-semibold h-11 transition-all cursor-pointer"
                                type="submit"
                                disabled={isDisabled}
                             >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Signing in...
                                    </span>
                                ) : (
                                    <span>Sign In</span>
                                )}
                            </Button>
                        </form>
                    </div>

                    <div className="text-center pt-4">
                        <p className="text-sm text-muted-foreground font-medium">
                            Don&apos;t have an account?{" "}
                            <Link href="/signup" className="text-foreground hover:underline font-semibold transition-colors">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
