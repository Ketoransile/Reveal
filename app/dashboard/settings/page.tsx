"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, CreditCard, Bell, Shield, Palette, Loader2, CheckCircle2, Zap, AlertCircle } from "lucide-react";
import { toast } from "sonner";
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
        subscription_plan: "free",
        subscription_period_end: null as string | null
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

        // Handle payment success
        const paymentStatus = searchParams.get('payment');
        if (paymentStatus === 'success') {
            toast.success("Payment Successful!", {
                description: "Your account has been upgraded to Pro. Welcome aboard!",
                duration: 5000,
            });
            // Switch to billing tab
            setActiveTab('billing');

            // Poll for update to ensure webhook has processed
            const pollUserData = async (count = 0) => {
                if (count > 5) return;
                await fetchUserData();
                setTimeout(() => pollUserData(count + 1), 2000);
            };
            pollUserData();
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
                    subscription_plan: userPlan,
                    subscription_period_end: data.user.subscription_period_end
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

            // Notify other components (like Sidebar) about the profile update
            window.dispatchEvent(new Event('user-profile-updated'));

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
                <TabsList className="grid w-full grid-cols-2 h-auto md:w-auto md:inline-grid md:grid-cols-4 bg-muted">
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
                            <div className="grid grid-cols-2 gap-4 max-w-md">
                                <div
                                    className={`cursor-pointer rounded-xl border-2 p-1 transition-all ${theme === 'light' ? 'border-primary' : 'border-transparent hover:bg-muted/50'}`}
                                    onClick={() => setTheme('light')}
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
                                    <div className="block w-full p-2 text-center font-medium">Light</div>
                                </div>
                                <div
                                    className={`cursor-pointer rounded-xl border-2 p-1 transition-all ${theme === 'dark' ? 'border-primary' : 'border-transparent hover:bg-muted/50'}`}
                                    onClick={() => setTheme('dark')}
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
                                    <div className="block w-full p-2 text-center font-medium">Dark</div>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Select your preferred theme for the dashboard.
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="overflow-hidden border-none shadow-xl shadow-zinc-200/60 dark:border-border dark:shadow-sm bg-white dark:bg-card h-full flex flex-col">
                            <div className={`h-2 w-full ${user.subscription_plan === 'free' ? 'bg-muted' : 'bg-zinc-100 dark:bg-muted/40'}`} />
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 mb-1">
                                        <CardTitle className="text-base text-foreground">Current Plan</CardTitle>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase ${user.subscription_plan === 'free'
                                            ? 'bg-muted text-muted-foreground'
                                            : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-900'
                                            }`}>
                                            {user.subscription_plan === 'free' ? 'Starter' : user.subscription_plan === 'agency' ? 'Agency' : 'Pro'}
                                        </span>
                                    </div>
                                    {user.subscription_plan !== 'free' && (
                                        <div className="hidden sm:block">
                                            <Shield className="w-8 h-8 text-emerald-500 opacity-20" />
                                        </div>
                                    )}
                                </div>
                                <CardDescription className="text-muted-foreground">
                                    Your subscription status.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 flex-1">
                                <div>
                                    <div className="font-bold text-2xl text-foreground flex items-center gap-2">
                                        {user.subscription_plan === 'free' ? 'Starter Plan' : user.subscription_plan === 'agency' ? 'Agency Plan' : 'Pro Plan'}
                                        {user.subscription_plan !== 'free' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        {user.subscription_plan === 'free' && 'Includes 3 comprehensive analyses per month.'}
                                        {user.subscription_plan === 'pro' && 'Unlimited analyses, priority processing, and deep insights.'}
                                        {user.subscription_plan === 'agency' && 'Whitelabel reports, API access, and team seats.'}
                                    </p>
                                </div>
                            </CardContent>
                            <CardFooter className="pt-0">
                                {user.subscription_plan === 'free' ? (
                                    <Button
                                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/10 rounded-full transition-all"
                                        onClick={() => router.push('/pricing')}
                                    >
                                        Upgrade Plan
                                    </Button>
                                ) : (
                                    <Button variant="outline" disabled className="w-full rounded-full border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 opacity-50 cursor-not-allowed mb-2 md:mb-0">
                                        Manage Subscription (Coming Soon)
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>

                        <Card className="border-none shadow-xl shadow-zinc-200/60 dark:border-border dark:shadow-sm bg-white dark:bg-card h-full flex flex-col justify-between">
                            <CardHeader>
                                <CardTitle className="text-base text-foreground">Payment Method</CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    Securely managed via Polar.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-20 bg-muted/50 rounded border border-border flex items-center justify-center text-muted-foreground">
                                        <CreditCard className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-base font-medium text-foreground">
                                            {user.subscription_plan === 'free' ? 'No payment method' : '•••• •••• •••• 4242'}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {user.subscription_plan === 'free' ? 'Add a card to upgrade.' : 'Expires 12/28'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" className="w-full opacity-50 cursor-not-allowed mb-2 md:mb-0" disabled>
                                    Update Payment Method (Coming Soon)
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    <Card className="border-none shadow-xl shadow-zinc-200/60 dark:border-border dark:shadow-sm bg-white dark:bg-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base text-foreground">
                                <Zap className="w-5 h-5 text-amber-500" />
                                Usage & Limits
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">
                                Track your consumption and billing cycle.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {user.subscription_plan === 'free' ? (
                                <div className="space-y-4 bg-zinc-50/80 dark:bg-muted/20 p-6 rounded-xl border-none shadow-none">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold text-foreground">Monthly Usage</p>
                                            <p className="text-xs text-muted-foreground">Credits reset on the 1st of every month.</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-2xl font-bold text-foreground">{3 - user.credits}</span>
                                            <span className="text-sm text-muted-foreground font-medium"> / 3 used</span>
                                        </div>
                                    </div>

                                    <div className="relative w-full h-3 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={`absolute left-0 top-0 bottom-0 transition-all duration-500 ease-out rounded-full ${(3 - user.credits) === 3 ? 'bg-red-500' :
                                                (3 - user.credits) >= 2 ? 'bg-amber-500' :
                                                    'bg-emerald-500'
                                                }`}
                                            style={{ width: `${((3 - user.credits) / 3) * 100}%` }}
                                        />
                                    </div>

                                    {user.credits === 0 ? (
                                        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-xs text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900 flex items-start gap-2">
                                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                            <p>You have used all your credits. Upgrade to Pro for unlimited access.</p>
                                        </div>
                                    ) : (
                                        <p className="text-xs text-muted-foreground text-center">
                                            {user.credits} analyses remaining
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4 bg-zinc-50/80 dark:bg-emerald-900/10 p-6 rounded-xl border-none shadow-none">
                                    <div className="flex justify-between items-center mb-2">
                                        <div>
                                            <p className="font-semibold text-foreground">Billing Cycle</p>
                                            <p className="text-xs text-muted-foreground font-medium">
                                                Running smoothly
                                            </p>
                                        </div>
                                        {user.subscription_period_end && (() => {
                                            const end = new Date(user.subscription_period_end);
                                            const now = new Date();
                                            const totalDuration = 30 * 24 * 60 * 60 * 1000; // Approx 30 days in ms
                                            const timeLeft = end.getTime() - now.getTime();
                                            const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
                                            // Assuming a 30-day cycle for progress bar visualization
                                            const progress = Math.max(0, Math.min(100, ((totalDuration - timeLeft) / totalDuration) * 100));

                                            return (
                                                <div className="text-right">
                                                    <span className="text-2xl font-bold text-foreground">{daysLeft}</span>
                                                    <span className="text-sm text-muted-foreground font-medium"> days left</span>
                                                </div>
                                            );
                                        })()}
                                    </div>

                                    {user.subscription_period_end && (() => {
                                        const end = new Date(user.subscription_period_end);
                                        const now = new Date();
                                        const totalDuration = 30 * 24 * 60 * 60 * 1000;
                                        const timeLeft = end.getTime() - now.getTime();
                                        const progress = Math.min(100, Math.max(0, ((totalDuration - timeLeft) / totalDuration) * 100));

                                        return (
                                            <div className="relative w-full h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                <div
                                                    className="absolute left-0 top-0 bottom-0 bg-zinc-500 transition-all duration-500 ease-out rounded-full"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        );
                                    })()}

                                    <div className="flex justify-between items-center pt-2">
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-amber-500" />
                                            <span className="text-sm text-foreground font-medium">{usageStats.totalAnalyses} <span className="text-muted-foreground text-xs font-normal">analyses completed</span></span>
                                        </div>
                                        {user.subscription_period_end && (
                                            <span className="text-xs text-muted-foreground">
                                                Renews {new Date(user.subscription_period_end).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div >
    );
}

export default function SettingsPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>}>
            <SettingsContent />
        </Suspense>
    );
}
