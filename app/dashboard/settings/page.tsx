"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, CreditCard, Bell, Shield, Palette, Loader2, CheckCircle2 } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function SettingsContent() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const supabase = createClient();

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

                <TabsContent value="billing" className="space-y-4">
                    <Card className="border-border bg-card">
                        <CardHeader>
                            <CardTitle>Plan & Usage</CardTitle>
                            <CardDescription>
                                {user.subscription_plan === 'free' && 'You are currently on the Free Plan.'}
                                {user.subscription_plan === 'pro' && 'You are currently on the Pro Plan.'}
                                {user.subscription_plan === 'agency' && 'You are currently on the Agency Plan.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-muted/50 rounded-lg flex items-center justify-between">
                                <div>
                                    <div className="font-semibold">
                                        {user.subscription_plan === 'free' && 'Starter (Free)'}
                                        {user.subscription_plan === 'pro' && 'Pro Plan'}
                                        {user.subscription_plan === 'agency' && 'Agency Plan'}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {user.subscription_plan === 'free' && '3 analyses per month'}
                                        {user.subscription_plan === 'pro' && 'Unlimited analyses - $29/month'}
                                        {user.subscription_plan === 'agency' && 'Unlimited analyses + White-label - $99/month'}
                                    </div>
                                </div>
                                {user.subscription_plan === 'free' && (
                                    <Button
                                        variant="default"
                                        className="bg-emerald-600 hover:bg-emerald-700"
                                        onClick={() => router.push('/pricing')}
                                    >
                                        Upgrade to Pro
                                    </Button>
                                )}
                                {(user.subscription_plan === 'pro' || user.subscription_plan === 'agency') && (
                                    <Button
                                        variant="outline"
                                        disabled
                                    >
                                        Manage Billing
                                    </Button>
                                )}
                            </div>
                            <Separator />

                            {/* Usage Statistics for Free Plan */}
                            {user.subscription_plan === 'free' && (
                                <>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <div className="text-sm font-medium text-slate-900">Monthly Credits</div>
                                                <div className="text-xs text-muted-foreground">Resets at the start of each month</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-slate-900">{user.credits}</div>
                                                <div className="text-xs text-muted-foreground">of 3 remaining</div>
                                            </div>
                                        </div>

                                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all ${user.credits === 0 ? 'bg-red-500' :
                                                    user.credits === 1 ? 'bg-amber-500' :
                                                        'bg-emerald-500'
                                                    }`}
                                                style={{ width: `${(user.credits / 3) * 100}%` }}
                                            />
                                        </div>

                                        {user.credits === 0 && (
                                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                                <p className="text-sm text-red-800 font-medium">
                                                    ⚠️ No credits remaining
                                                </p>
                                                <p className="text-xs text-red-600 mt-1">
                                                    Upgrade to Pro for unlimited analyses or wait for your monthly reset.
                                                </p>
                                            </div>
                                        )}

                                        {user.credits === 1 && (
                                            <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded">
                                                💡 Only 1 credit remaining. Consider upgrading for unlimited access.
                                            </p>
                                        )}

                                        {user.credits > 1 && (
                                            <p className="text-xs text-muted-foreground">
                                                You have {user.credits} analyses remaining this month.
                                            </p>
                                        )}
                                    </div>
                                    <Separator />
                                </>
                            )}

                            {/* Monthly Usage Stats */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Analyses this month</span>
                                    <span className="font-medium">
                                        {usageStats.monthlyAnalyses}
                                        {user.subscription_plan === 'free' ? ' created' : ' (unlimited)'}
                                    </span>
                                </div>
                            </div>

                            {/* All-time Stats */}
                            <Separator />
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-slate-50 rounded-lg">
                                    <div className="text-2xl font-bold text-slate-900">{usageStats.totalAnalyses}</div>
                                    <div className="text-xs text-muted-foreground">Total analyses</div>
                                </div>
                                <div className="p-3 bg-emerald-50 rounded-lg">
                                    <div className="text-2xl font-bold text-emerald-700">{usageStats.completedAnalyses}</div>
                                    <div className="text-xs text-muted-foreground">Completed</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border bg-card">
                        <CardHeader>
                            <CardTitle>Payment Method</CardTitle>
                            <CardDescription>
                                {user.subscription_plan === 'free'
                                    ? 'Add a payment method to upgrade your plan.'
                                    : 'Manage your payment method and billing information.'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" disabled>
                                <CreditCard className="mr-2 h-4 w-4" />
                                {user.subscription_plan === 'free' ? 'Add Payment Method' : 'Manage Payment Method'}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default function SettingsPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <SettingsContent />
        </Suspense>
    );
}
