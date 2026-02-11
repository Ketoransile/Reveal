"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, Gift, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const supabase = createClient();
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
        }
    };

    const handleOAuthLogin = async (provider: 'github' | 'google') => {
        console.log('[Signup] Starting OAuth login with:', provider);
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        })
        if (error) {
            console.error('[Signup] OAuth error:', error);
            setError(error.message);
        } else {
            console.log('[Signup] OAuth initiated successfully');
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
            {/* Animated Background Grid */}
            <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    backgroundSize: '80px 80px',
                    backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)'
                }}
            />
            <div className="fixed pointer-events-none inset-0 bg-slate-950/60 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_100%)]" />

            {/* Morphing Gradient Orbs */}
            <motion.div
                className="absolute bottom-[-10%] right-[10%] w-[600px] h-[500px] bg-gradient-to-tl from-emerald-600/20 via-teal-500/15 to-cyan-600/15 rounded-full blur-[130px] pointer-events-none mix-blend-screen animate-morph"
                animate={{ x: [0, -25, 15, 0], y: [0, 20, -15, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className="absolute top-[-5%] left-[5%] w-[500px] h-[400px] bg-gradient-to-br from-purple-600/15 via-pink-500/10 to-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-morph"
                animate={{ x: [0, 20, -15, 0], y: [0, -15, 10, 0] }}
                transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            />

            {/* Floating Particles */}
            {Array.from({ length: 12 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-white/15 pointer-events-none"
                    style={{
                        width: Math.random() * 3 + 1,
                        height: Math.random() * 3 + 1,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [-10, -35, -10],
                        opacity: [0.1, 0.4, 0.1],
                    }}
                    transition={{
                        duration: Math.random() * 8 + 8,
                        delay: Math.random() * 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full max-w-md relative z-10"
            >
                <Card className="border-white/10 bg-slate-900/30 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
                    <CardHeader className="space-y-1 pb-6 text-center">
                        <Link href="/" className="flex justify-center mb-6 group">
                            <motion.div
                                className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)] ring-2 ring-white/20 group-hover:shadow-[0_0_50px_rgba(16,185,129,0.7)] transition-all group-hover:scale-105 cursor-pointer"
                                whileHover={{ rotate: [0, -5, 5, 0] }}
                                transition={{ duration: 0.5 }}
                            >
                                <span className="text-black font-bold text-2xl">R</span>
                            </motion.div>
                        </Link>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <CardTitle className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
                                Create your account
                            </CardTitle>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <CardDescription className="text-center text-slate-400 text-base flex items-center justify-center gap-2">
                                <Gift className="w-4 h-4 text-emerald-400" />
                                Start with <span className="text-emerald-400 font-bold">3 free credits</span>
                            </CardDescription>
                        </motion.div>
                    </CardHeader>

                    <CardContent className="grid gap-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className="p-4 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 text-sm flex items-start gap-3"
                            >
                                <span className="block w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] mt-1 shrink-0 animate-pulse" />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        <AnimatePresence mode="wait">
                            {success ? (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                                    className="p-6 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-200 text-sm text-center"
                                >
                                    <motion.div
                                        className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400 ring-2 ring-emerald-500/30"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                    >
                                        <CheckCircle2 className="w-8 h-8" />
                                    </motion.div>
                                    <motion.p
                                        className="font-semibold text-lg mb-1"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        Account created successfully!
                                    </motion.p>
                                    <motion.p
                                        className="text-sm text-emerald-300/80"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        Check your email to confirm your registration.
                                    </motion.p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 1 }}
                                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
                                    className="grid gap-6"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4, duration: 0.5 }}
                                        className="grid gap-4"
                                    >
                                        <Button
                                            variant="outline"
                                            type="button"
                                            onClick={() => handleOAuthLogin('google')}
                                            className="w-full border-white/20 !bg-transparent hover:!bg-white/5 hover:text-white transition-all text-slate-300 h-12 rounded-xl group relative overflow-hidden cursor-pointer"
                                        >
                                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <svg className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform relative z-10" aria-hidden="true" viewBox="0 0 24 24">
                                                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.44 0 6.04-1.133 7.973-3.267 2.027-1.92 2.6-4.84 2.6-7.253 0-.693-.067-1.347-.187-1.973z" fill="currentColor" />
                                            </svg>
                                            <span className="relative z-10">Sign up with Google</span>
                                        </Button>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="flex items-center gap-4 my-2"
                                    >
                                        <motion.div
                                            className="h-px flex-1 bg-white/10"
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ delay: 0.6, duration: 0.5 }}
                                            style={{ transformOrigin: "right" }}
                                        />
                                        <span className="text-xs uppercase text-slate-500 font-medium">Or continue with email</span>
                                        <motion.div
                                            className="h-px flex-1 bg-white/10"
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ delay: 0.6, duration: 0.5 }}
                                            style={{ transformOrigin: "left" }}
                                        />
                                    </motion.div>

                                    <motion.form
                                        onSubmit={handleSignup}
                                        className="grid gap-5"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.55, duration: 0.5 }}
                                    >
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
                                                placeholder="Minimum 8 characters"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="!bg-transparent border-white/20 focus-visible:ring-emerald-500/50 focus-visible:border-emerald-500/50 transition-all hover:border-white/30 h-12 rounded-xl text-white placeholder:text-slate-500"
                                            />
                                        </div>
                                        <Button
                                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold h-12 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] transition-all duration-300 relative overflow-hidden group cursor-pointer"
                                            type="submit"
                                            disabled={loading}
                                        >
                                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                            {loading ? (
                                                <span className="relative flex items-center gap-2">
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                    Creating account...
                                                </span>
                                            ) : (
                                                <span className="relative flex items-center gap-2">
                                                    <Sparkles className="h-5 w-5" />
                                                    Sign Up
                                                </span>
                                            )}
                                        </Button>
                                    </motion.form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </CardContent>

                    <CardFooter className="flex justify-center pb-6 pt-2">
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-sm text-slate-400"
                        >
                            Already have an account?{" "}
                            <Link href="/login" className="text-emerald-400 hover:text-emerald-300 hover:underline underline-offset-4 transition-colors font-semibold">
                                Sign in
                            </Link>
                        </motion.p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
