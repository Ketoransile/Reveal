"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, CreditCard, Bell, Shield, Palette, Loader2, CheckCircle2, Zap, AlertCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function SettingsContent() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState("account");
    const [loading, setLoading] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // User state
    const [user, setUser] = useState({
        name: "",
        email: "",
        credits: 3,
        subscription_plan: "free"
    });

    // Usage stats
    const [usageStats, setUsageStats] = useState({
        totalAnalyses: 0,
        completedAnalyses: 0,
        monthlyAnalyses: 0
    });

    const [formData, setFormData] = useState({
        name: ""
    });

    useEffect(() => {
        setMounted(true);

        fetchUserData();

        // Handle tab query parameter
        const tab = searchParams.get('tab');
        if (tab) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    // Separate function to fetch user data so we can call it after updates
    const fetchUserData = async () => {
        try {
            const response = await fetch('/api/user');
            const data = await response.json();

            console.log('[SETTINGS] API Response:', data);

            if (data.user) {
                // data.user is the database user object, not auth user
                const userName = data.user.name || data.user.email?.split('@')[0] || "User";
                const userEmail = data.user.email || "";
                const userCredits = data.user.credits ?? 3; // Use nullish coalescing to handle 0
                const userPlan = data.user.subscription_plan || "free";

                console.log('[SETTINGS] Parsed user data:', { userName, userEmail, userCredits, userPlan });

                setUser({
                    name: userName,
                    email: userEmail,
                    credits: userCredits,
                    subscription_plan: userPlan
                });
                setFormData({
                    name: userName
                });

                // Calculate usage stats
                if (data.analyses) {
                    const now = new Date();
                    const currentMonth = now.getMonth();
                    const currentYear = now.getFullYear();

                    const monthlyAnalyses = data.analyses.filter((analysis: any) => {
                        const analysisDate = new Date(analysis.created_at);
                        return analysisDate.getMonth() === currentMonth &&
                            analysisDate.getFullYear() === currentYear;
                    }).length;

                    const completedAnalyses = data.analyses.filter(
                        (analysis: any) => analysis.status === 'completed'
                    ).length;

                    setUsageStats({
                        totalAnalyses: data.analyses.length,
                        completedAnalyses,
                        monthlyAnalyses
                    });
                }
            }
        } catch (err) {
            console.error('Error fetching user:', err);
        }
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        setSaveSuccess(false);

        try {
            const supabase = createClient();
            const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();

            if (userError || !currentUser) throw new Error(userError?.message || 'User not found');

            // Update the database users table with the new name
            const { error: dbError } = await supabase
                .from('users')
                .update({ name: formData.name })
                .eq('id', currentUser.id);

            if (dbError) throw dbError;

            // Also update auth user metadata for consistency
            await supabase.auth.updateUser({
                data: {
                    name: formData.name
                }
            });

            setSaveSuccess(true);

            // Refresh user data to show the update immediately
            await fetchUserData();

            // Hide success message after 3 seconds
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            console.error('Error updating profile:', err);
            alert('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!mounted) return null;

    return (
        <div className="space-y-6 animate-in fade-in duration-700 max-w-4xl">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                    Settings
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Manage your account settings and preferences.
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-grid md:grid-cols-4 bg-muted">
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                    <TabsTrigger value="billing">Billing</TabsTrigger>
                </TabsList>

                <TabsContent value="account" className="space-y-6">
                    <Card className="border-border bg-card">
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Update your account profile details.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Display Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Your name"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    value={user.email}
                                    disabled
                                    className="bg-muted text-muted-foreground"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Contact support to change your email address.
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t border-border px-6 py-4 bg-muted/20 flex items-center gap-3">
                            <Button
                                onClick={handleSaveProfile}
                                disabled={loading || formData.name === user.name}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                            {saveSuccess && (
                                <div className="flex items-center text-sm text-green-600">
                                    <CheckCircle2 className="mr-2 h-4 w-4" />
                                    Profile updated successfully!
                                </div>
                            )}
                        </CardFooter>
                    </Card>

                    <Card className="border-border bg-card">
                        <CardHeader>
                            <CardTitle className="text-red-600">Danger Zone</CardTitle>
                            <CardDescription>
                                Irreversible and destructive actions.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                                <div>
                                    <div className="font-medium text-red-900">Delete Account</div>
                                    <div className="text-sm text-red-700">
                                        Permanently delete your account and all data.
                                    </div>
                                </div>
                                <Button variant="destructive" size="sm" disabled>
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="appearance" className="space-y-6">
                    <Card className="border-border bg-card">
                        <CardHeader>
                            <CardTitle>Theme Preferences</CardTitle>
                            <CardDescription>
                                The application is currently configured for light mode only.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 max-w-md opacity-75">
                                <div
                                    className="cursor-not-allowed rounded-xl border-2 p-1 border-primary"
                                >
                                    <div className="space-y-2 rounded-lg bg-[#ecedef] p-2">
                                        <div className="space-y-2 rounded-md bg-white p-2 shadow-sm">
                                            <div className="h-2 w-[80px] rounded-lg bg-[#ecedef]" />
                                            <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                                        </div>
                                        <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                                            <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                                            <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                                        </div>
                                        <div className="flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm">
                                            <div className="h-4 w-4 rounded-full bg-[#ecedef]" />
                                            <div className="h-2 w-[100px] rounded-lg bg-[#ecedef]" />
                                        </div>
                                    </div>
                                    <div className="block w-full p-2 text-center font-medium">Light (Active)</div>
                                </div>
                                <div
                                    className="cursor-not-allowed rounded-xl border-2 p-1 border-transparent opacity-50"
                                >
                                    <div className="space-y-2 rounded-lg bg-slate-950 p-2">
                                        <div className="space-y-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                            <div className="h-2 w-[80px] rounded-lg bg-slate-400" />
                                            <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                                        </div>
                                        <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                            <div className="h-4 w-4 rounded-full bg-slate-400" />
                                            <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                                        </div>
                                        <div className="flex items-center space-x-2 rounded-md bg-slate-800 p-2 shadow-sm">
                                            <div className="h-4 w-4 rounded-full bg-slate-400" />
                                            <div className="h-2 w-[100px] rounded-lg bg-slate-400" />
                                        </div>
                                    </div>
                                    <div className="block w-full p-2 text-center font-normal text-slate-500">Dark (Unavailable)</div>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Dark mode is currently disabled. The application is optimized for light mode.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                    <Card className="border-border bg-card">
                        <CardHeader>
                            <CardTitle>Email Notifications</CardTitle>
                            <CardDescription>
                                Choose what analysis updates you want to receive.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="analysis-completed" className="flex flex-col space-y-1">
                                    <span>Analysis Completed</span>
                                    <span className="font-normal text-xs text-muted-foreground">Receive an email when your reports are ready.</span>
                                </Label>
                                <Switch id="analysis-completed" defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="credits-low" className="flex flex-col space-y-1">
                                    <span>Low Credits Warning</span>
                                    <span className="font-normal text-xs text-muted-foreground">Get notified when you are running out of credits.</span>
                                </Label>
                                <Switch id="credits-low" defaultChecked />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between space-x-2">
                                <Label htmlFor="marketing" className="flex flex-col space-y-1">
                                    <span>Marketing Updates</span>
                                    <span className="font-normal text-xs text-muted-foreground">Receive updates about new features and tips.</span>
                                </Label>
                                <Switch id="marketing" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="billing" className="space-y-6">
                    <Card className="overflow-hidden border-slate-200 shadow-sm bg-white">
                        <div className={`h-2 w-full ${user.subscription_plan === 'free' ? 'bg-slate-200' : 'bg-gradient-to-r from-emerald-500 to-emerald-400'}`} />
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <CardTitle>Current Plan</CardTitle>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase ${user.subscription_plan === 'free'
                                            ? 'bg-slate-100 text-slate-600'
                                            : 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200'
                                            }`}>
                                            {user.subscription_plan === 'free' ? 'Starter' : user.subscription_plan === 'agency' ? 'Agency' : 'Pro'}
                                        </span>
                                    </div>
                                    <CardDescription>
                                        Manage your subscription and billing details.
                                    </CardDescription>
                                </div>
                                {user.subscription_plan !== 'free' && (
                                    <div className="hidden sm:block">
                                        <Shield className="w-8 h-8 text-emerald-500 opacity-20" />
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className={`p-5 rounded-2xl border ${user.subscription_plan === 'free'
                                ? 'bg-slate-50 border-slate-100'
                                : 'bg-emerald-50/50 border-emerald-100'
                                }`}>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                            {user.subscription_plan === 'free' ? 'Starter Plan' : user.subscription_plan === 'agency' ? 'Agency Plan' : 'Pro Plan'}
                                            {user.subscription_plan !== 'free' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            {user.subscription_plan === 'free' && 'Includes 3 comprehensive analyses per month.'}
                                            {user.subscription_plan === 'pro' && 'Unlimited analyses, priority processing, and deep insights.'}
                                            {user.subscription_plan === 'agency' && 'Whitelabel reports, API access, and team seats.'}
                                        </div>
                                    </div>

                                    {user.subscription_plan === 'free' ? (
                                        <Button
                                            className="bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10 rounded-full px-6 transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
                                            onClick={() => router.push('/pricing')}
                                        >
                                            Upgrade Plan
                                        </Button>
                                    ) : (
                                        <Button variant="outline" className="rounded-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800">
                                            Manage Subscription
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <Separator />

                            {/* Usage Statistics Section */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-slate-400" /> Usage & Limits
                                </h3>

                                {user.subscription_plan === 'free' ? (
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-slate-600">Monthly Analyses Credits</span>
                                            <span className="font-bold text-slate-900">{user.credits} / 3</span>
                                        </div>

                                        <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`absolute left-0 top-0 bottom-0 transition-all duration-500 ease-out rounded-full ${user.credits === 0 ? 'bg-red-500' :
                                                    user.credits === 1 ? 'bg-amber-500' :
                                                        'bg-emerald-500'
                                                    }`}
                                                style={{ width: `${(user.credits / 3) * 100}%` }}
                                            />
                                        </div>

                                        {user.credits === 0 ? (
                                            <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-100 flex items-start gap-2">
                                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                                <p>You have used all your credits. Upgrade to Pro for unlimited access.</p>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-500">
                                                Credits reset on the 1st of every month.
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <div className="grid sm:grid-cols-3 gap-4">
                                        <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                                            <p className="text-xs text-emerald-600 uppercase font-bold tracking-wider mb-1">Analyses</p>
                                            <p className="text-xl font-black text-slate-900 flex items-center gap-1">
                                                Unlimited <span className="text-lg">∞</span>
                                            </p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Total</p>
                                            <p className="text-xl font-black text-slate-900">{usageStats.totalAnalyses}</p>
                                        </div>
                                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">This Month</p>
                                            <p className="text-xl font-black text-slate-900">{usageStats.monthlyAnalyses}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200 shadow-sm bg-white">
                        <CardHeader>
                            <CardTitle className="text-base">Payment Method</CardTitle>
                            <CardDescription>
                                Securely managed via Stripe.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-16 bg-slate-100 rounded border border-slate-200 flex items-center justify-center text-slate-400">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-900">
                                        {user.subscription_plan === 'free' ? 'No payment method' : '•••• •••• •••• 4242'}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {user.subscription_plan === 'free' ? 'Add a card to upgrade.' : 'Expires 12/28'}
                                    </p>
                                </div>
                                <Button variant="outline" size="sm" disabled={user.subscription_plan === 'free'}>
                                    Update
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default function SettingsPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>}>
            <SettingsContent />
        </Suspense>
    );
}
