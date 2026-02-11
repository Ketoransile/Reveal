"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    BarChart3,
    Settings,
    Box,
    LogOut,
    ChevronsUpDown,
    Plus,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { createClient } from "@/lib/supabase/client"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Data Configuration
const NAV_MAIN = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "All Analyses", url: "/dashboard/all-analyses", icon: BarChart3 },
]

const NAV_SECONDARY = [
    { title: "Settings", url: "/dashboard/settings", icon: Settings },
]

// const RECENT_REPORTS = [
//     { name: "Recent Reports", url: "/dashboard/recent-reports", icon: FileText },
// ]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    collapsed?: boolean
    setCollapsed?: (collapsed: boolean) => void
    onClose?: () => void
}

export function CustomSidebar({ className, collapsed = false, setCollapsed, onClose }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [mounted, setMounted] = React.useState(false)
    const [showLogoutDialog, setShowLogoutDialog] = React.useState(false)
    const [user, setUser] = React.useState<any>(null)

    React.useEffect(() => {
        setMounted(true)

        const fetchUser = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                // Force a refresh of user data from the session to get latest metadata
                const { data: { session } } = await supabase.auth.getSession()

                // Get the most up-to-date user object
                const currentUser = session?.user || user;

                setUser({
                    name: currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || "User",
                    email: currentUser.email || "",
                    avatar: currentUser.user_metadata?.avatar_url || "",
                })
            }
        }

        // Initial fetch
        fetchUser()

        // Listen for profile updates
        const handleProfileUpdate = () => {
            fetchUser();
        };

        window.addEventListener('user-profile-updated', handleProfileUpdate);

        return () => {
            window.removeEventListener('user-profile-updated', handleProfileUpdate);
        };
    }, [])

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.refresh()
        router.push('/login')
    }

    const toggleCollapse = () => {
        setCollapsed?.(!collapsed)
    }

    const NavItem = ({ item, isActive }: { item: any, isActive: boolean }) => (
        <Link
            href={item.url || '#'}
            onClick={() => onClose?.()}
            className={cn("flex items-center", collapsed ? "justify-center" : "w-full")}
        >
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        className={cn(
                            "mb-1 transition-all duration-200",
                            collapsed ? "w-10 h-10 p-0 justify-center rounded-lg" : "w-full justify-start gap-3",
                            isActive ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <item.icon className="w-5 h-5 shrink-0" />
                        {!collapsed && <span>{item.title || item.name}</span>}
                    </Button>
                </TooltipTrigger>
                {collapsed && (
                    <TooltipContent side="right">
                        {item.title || item.name}
                    </TooltipContent>
                )}
            </Tooltip>
        </Link>
    )

    const SidebarContentInner = () => (
        <div className="flex flex-col h-full bg-background/80 backdrop-blur-xl border-r border-border/5 md:border-border/40 p-3 pt-4 transition-all duration-300">
            {/* Header */}
            <Link href="/" onClick={() => onClose?.()} className={cn("h-12 flex items-center mb-6 transition-all cursor-pointer hover:opacity-80", collapsed ? "justify-center px-0" : "gap-3 px-2")}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shrink-0">
                    <Box className="size-4" />
                </div>
                {!collapsed && <span className="text-lg font-bold tracking-tight whitespace-nowrap overflow-hidden">Reveal</span>}
            </Link>

            {/* New Analysis Button - Prominent */}
            <div className={cn("mb-6 transition-all", collapsed ? "px-0 flex justify-center" : "px-2")}>
                <Link href="/dashboard/analysis" onClick={() => onClose?.()} className={cn("flex items-center", collapsed ? "justify-center" : "w-full")}>
                    <Tooltip delayDuration={0}>
                        <TooltipTrigger asChild>
                            <Button
                                className={cn(
                                    "shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-medium",
                                    collapsed ? "w-10 h-10 p-0 rounded-xl justify-center bg-primary text-primary-foreground" : "w-full justify-start gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                                )}
                                size={collapsed ? "icon" : "lg"}
                            >
                                <Plus className={cn("w-5 h-5", collapsed ? "mr-0" : "mr-1")} />
                                {!collapsed && <span>New Analysis</span>}
                            </Button>
                        </TooltipTrigger>
                        {collapsed && <TooltipContent side="right">New Analysis</TooltipContent>}
                    </Tooltip>
                </Link>
            </div>

            {/* Navigation */}
            <TooltipProvider>
                <div className="flex-1 space-y-6 overflow-y-auto overflow-x-hidden no-scrollbar px-1 py-1">

                    {/* Main Nav */}
                    <div className="space-y-1">
                        {!collapsed && <h4 className="text-xs font-medium text-muted-foreground px-2 py-2 mb-1 uppercase tracking-wider animate-in fade-in">Platform</h4>}
                        {collapsed && <div className="h-4" />} {/* Spacer for consistency */}
                        {NAV_MAIN.map((item) => (
                            <NavItem key={item.url} item={item} isActive={pathname === item.url} />
                        ))}
                    </div>

                    {/* Recent Reports */}
                    {/* <div className="space-y-1">
                        {!collapsed && <h4 className="text-xs font-medium text-muted-foreground px-2 py-2 mb-1 uppercase tracking-wider animate-in fade-in">Documents</h4>}
                        {collapsed && <div className="h-4" />}
                        {RECENT_REPORTS.map((item) => (
                            <NavItem key={item.url} item={item} isActive={pathname === item.url} />
                        ))}
                    </div> */}

                    {/* Secondary Nav */}
                    <div className="space-y-1">
                        {!collapsed && <h4 className="text-xs font-medium text-muted-foreground px-2 py-2 mb-1 uppercase tracking-wider animate-in fade-in">Support</h4>}
                        {collapsed && <div className="h-4" />}
                        {NAV_SECONDARY.map((item) => (
                            <NavItem key={item.url} item={item} isActive={pathname === item.url} />
                        ))}
                    </div>
                </div>
            </TooltipProvider>

            {/* User Footer */}
            <div className="mt-auto pt-4 border-t border-border/40">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className={cn("w-full h-14 hover:bg-accent group transition-all", collapsed ? "justify-center px-0" : "justify-start px-2")}>
                            <div className="flex items-center gap-3 w-full">
                                {user ? (
                                    <>
                                        <Avatar className="h-8 w-8 rounded-lg shrink-0">
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                                        </Avatar>
                                        {!collapsed && (
                                            <>
                                                <div className="grid flex-1 text-left text-sm leading-tight overflow-hidden">
                                                    <span className="truncate font-semibold">{user.name}</span>
                                                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                                                </div>
                                                <ChevronsUpDown className="ml-auto size-4 opacity-50 group-hover:opacity-100 transition-opacity shrink-0" />
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <div className="h-8 w-8 rounded-lg bg-muted animate-pulse shrink-0" />
                                        {!collapsed && (
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                                                <div className="h-3 w-32 bg-muted animate-pulse rounded" />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 mb-2" align={collapsed ? "center" : "start"} side={typeof window !== 'undefined' && window.innerWidth < 768 ? "bottom" : "right"}>
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild className="cursor-pointer" onClick={() => onClose?.()}>
                            <Link href="/dashboard/settings?tab=billing">
                                <Box className="mr-2 h-4 w-4" />
                                <span>Billing</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer" onClick={() => onClose?.()}>
                            <Link href="/dashboard/settings">
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => setShowLogoutDialog(true)}
                            className="text-red-500 focus:text-red-600 cursor-pointer"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )

    return (
        <>
            <aside className={cn("hidden md:block fixed inset-y-0 left-0 z-30 transition-[width] duration-300 ease-in-out", collapsed ? "w-20" : "w-64", className)}>
                <SidebarContentInner />
            </aside>

            <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <AlertDialogContent className="bg-white dark:bg-black">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You will be redirected to the login page.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleLogout}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Log out
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

// Mobile Version
interface MobileSidebarProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="left" className="p-0 w-72 bg-transparent border-r-0">
                <div className="h-full bg-background">
                    <CustomSidebar
                        className="!block !fixed !inset-0 !w-full !relative"
                        onClose={() => onOpenChange(false)}
                    />
                </div>
            </SheetContent>
        </Sheet>
    )
}
