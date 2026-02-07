"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
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
            router.push("/dashboard");
            router.refresh();
        }
    };

    const handleOAuthLogin = async (provider: 'github' | 'google') => {
        console.log('[Login] Starting OAuth login with:', provider);
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        })
        if (error) {
            console.error('[Login] OAuth error:', error);
            setError(error.message);
        } else {
            console.log('[Login] OAuth initiated successfully');
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden p-4">
            {/* Background Grid & Lighting Elements */}
            <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    backgroundSize: '100px 100px',
                    backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)'
                }}
            />
            <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    backgroundSize: '20px 20px',
                    backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)'
                }}
            />
            <div className="fixed pointer-events-none inset-0 flex items-center justify-center bg-slate-950/80 [mask-image:radial-gradient(ellipse_at_center,transparent_0%,black_100%)]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none opacity-50 animate-pulse" />

            <Card className="w-full max-w-md border-white/10 bg-slate-900/30 backdrop-blur-2xl relative z-10 animate-in fade-in zoom-in-95 duration-700 slide-in-from-bottom-8 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
                <CardHeader className="space-y-1 pb-6 text-center">
                    <Link href="/" className="flex justify-center mb-6 group">
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)] ring-2 ring-white/20 group-hover:shadow-[0_0_50px_rgba(16,185,129,0.7)] transition-all group-hover:scale-105 cursor-pointer">
                            <span className="text-black font-bold text-2xl">R</span>
                        </div>
                    </Link>
                    <CardTitle className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">Welcome back</CardTitle>
                    <CardDescription className="text-center text-slate-400 text-base">
                        Sign in to access your intelligence dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    {error && (
                        <div className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                            <span className="block w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] mt-1 shrink-0"></span>
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="grid gap-4">
                        <Button variant="outline" type="button" onClick={() => handleOAuthLogin('google')} className="w-full border-white/20 !bg-transparent hover:!bg-white/5 hover:text-white transition-all text-slate-300 h-12 rounded-xl group relative overflow-hidden">
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <svg className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform relative z-10" aria-hidden="true" viewBox="0 0 24 24">
                                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.44 0 6.04-1.133 7.973-3.267 2.027-1.92 2.6-4.84 2.6-7.253 0-.693-.067-1.347-.187-1.973z" fill="currentColor" />
                            </svg>
                            <span className="relative z-10">Continue with Google</span>
                        </Button>
                    </div>

                    <div className="flex items-center gap-4 my-2">
                        <div className="h-px flex-1 bg-white/10"></div>
                        <span className="text-xs uppercase text-slate-500 font-medium">Or continue with email</span>
                        <div className="h-px flex-1 bg-white/10"></div>
                    </div>

                    <form onSubmit={handleLogin} className="grid gap-5">
                        <div className="grid gap-2">
                            <label htmlFor="email" className="text-sm font-semibold text-slate-300">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="analyst@competitor.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="!bg-transparent border-white/20 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 transition-all hover:border-white/30 h-12 rounded-xl text-white placeholder:text-slate-500"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="password" className="text-sm font-semibold text-slate-300">Password</label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="!bg-transparent border-white/20 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 transition-all hover:border-white/30 h-12 rounded-xl text-white placeholder:text-slate-500"
                            />
                        </div>
                        <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold h-12 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] transition-all duration-300" type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-5 w-5" />
                                    Sign In
                                </>
                            )}
                        </Button>
                    </form>

                </CardContent>
                <CardFooter className="flex justify-center pb-6 pt-2">
                    <p className="text-sm text-slate-400">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 hover:underline underline-offset-4 transition-colors font-semibold">
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
