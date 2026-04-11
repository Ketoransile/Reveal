"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Gift, CheckCircle2, AlertCircle } from "lucide-react";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [oauthLoading, setOauthLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const params = new URLSearchParams(window.location.search);
        const redirectUrl = params.get('redirect') || "/dashboard";

        const supabase = createClient();
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(redirectUrl)}`,
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
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
            {/* Minimal Background Gradients */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute bottom-[0%] right-[-10%] w-[600px] h-[500px] bg-primary/5 rounded-full blur-[130px] pointer-events-none mix-blend-screen opacity-40" />
                <div className="absolute top-[-5%] left-[5%] w-[500px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen opacity-30" />
            </div>

            {/* Card */}
            <div className="w-full max-w-md relative z-10">
                <Card className="border-border/40 bg-card/40 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.1)] rounded-3xl overflow-hidden hover:border-primary/20 transition-colors duration-500">
                    <CardHeader className="space-y-1 pb-6 text-center pt-8">
                        <Link href="/" className="flex justify-center mb-6 group">
                            <div className="w-14 h-14 bg-background border border-border/50 rounded-2xl flex items-center justify-center shadow-sm group-hover:border-primary/50 transition-all duration-300 cursor-pointer">
                                <span className="text-foreground font-bold text-2xl group-hover:text-primary transition-colors">R</span>
                            </div>
                        </Link>

                        <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
                            Create account
                        </CardTitle>

                        <CardDescription className="text-center text-muted-foreground font-medium text-base flex items-center justify-center gap-2">
                            <Gift className="w-4 h-4 text-primary" />
                            Start with <span className="text-primary font-bold">3 free credits</span>
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="grid gap-6 px-8">
                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        {success ? (
                            <div className="p-8 rounded-2xl bg-primary/10 border border-primary/20 text-center">
                                <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-5 text-primary border border-primary/30 shadow-sm">
                                    <CheckCircle2 className="w-8 h-8" />
                                </div>
                                <p className="font-bold text-xl mb-2 text-foreground">
                                    Check your inbox
                                </p>
                                <p className="text-sm text-foreground/80 font-medium">
                                    We sent you a confirmation link to activate your account.
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                <div className="grid gap-4">
                                    <Button
                                        variant="outline"
                                        type="button"
                                        onClick={() => handleOAuthLogin('google')}
                                        disabled={isDisabled}
                                        className="w-full bg-background/50 border-border/50 hover:bg-background hover:text-foreground shadow-sm transition-all text-muted-foreground h-12 rounded-xl group relative overflow-hidden"
                                    >
                                        {oauthLoading ? (
                                            <span className="relative z-10 flex items-center gap-2 font-medium">
                                                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                                Redirecting to Google...
                                            </span>
                                        ) : (
                                            <span className="relative z-10 flex items-center gap-2 font-medium group-hover:text-foreground">
                                                <svg className="h-5 w-5 group-hover:scale-110 transition-transform" aria-hidden="true" viewBox="0 0 24 24">
                                                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.44 0 6.04-1.133 7.973-3.267 2.027-1.92 2.6-4.84 2.6-7.253 0-.693-.067-1.347-.187-1.973z" fill="currentColor" />
                                                </svg>
                                                Sign up with Google
                                            </span>
                                        )}
                                    </Button>
                                </div>

                                <div className="flex items-center gap-4 my-2">
                                    <div className="h-px flex-1 bg-border/50" />
                                    <span className="text-xs uppercase text-muted-foreground font-bold tracking-widest">Or continue with email</span>
                                    <div className="h-px flex-1 bg-border/50" />
                                </div>

                                <form onSubmit={handleSignup} className="grid gap-5">
                                    <div className="grid gap-2">
                                        <label htmlFor="email" className="text-sm font-bold text-foreground">Email</label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="analyst@competitor.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            disabled={isDisabled}
                                            className="bg-background/50 border-border/50 focus-visible:ring-1 focus-visible:ring-primary h-12 rounded-xl"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <label htmlFor="password" className="text-sm font-bold text-foreground">Password</label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="Minimum 8 characters"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            disabled={isDisabled}
                                            className="bg-background/50 border-border/50 focus-visible:ring-1 focus-visible:ring-primary h-12 rounded-xl"
                                        />
                                    </div>
                                    <Button
                                        className="w-full bg-foreground text-background hover:bg-foreground/90 font-bold h-12 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                                        type="submit"
                                        disabled={isDisabled}
                                    >
                                        {loading ? (
                                            <span className="flex items-center gap-2">
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                                Creating account...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                Create Account
                                            </span>
                                        )}
                                    </Button>
                                </form>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex justify-center pb-8 pt-4">
                        <p className="text-sm text-muted-foreground font-medium">
                            Already have an account?{" "}
                            <Link href="/login" className="text-primary hover:text-primary/80 transition-colors font-bold">
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
