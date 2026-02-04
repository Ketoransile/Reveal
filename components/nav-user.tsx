"use client"

import {
    CreditCard,
    MoreVertical,
    LogOut,
    Bell,
    UserCircle,
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar'
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Link from "next/link"

export function NavUser({
    user,
}: {
    user: {
        name: string
        email: string
        avatar: string
    }
}) {
    const { isMobile } = useSidebar()
    const router = useRouter()
    const supabase = createClient()
    const [showLogoutDialog, setShowLogoutDialog] = useState(false)

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.refresh()
        router.push('/login')
    }

    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem className="px-3 py-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-slate-100 hover:bg-slate-50 text-slate-700 h-14 px-3 rounded-lg bg-transparent transition-all"
                            >
                                <Avatar className="h-9 w-9 rounded-lg border-2 border-white shadow-sm">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-sm">
                                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left leading-tight ml-0.5">
                                    <span className="truncate font-semibold text-slate-900 text-sm">{user.name}</span>
                                    <span className="truncate text-xs text-slate-500">
                                        {user.email}
                                    </span>
                                </div>
                                <MoreVertical className="ml-auto h-4 w-4 text-slate-400" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-56 rounded-lg bg-white border-slate-200 shadow-lg p-2"
                            side={isMobile ? "bottom" : "right"}
                            align="end"
                            sideOffset={8}
                        >
                            <DropdownMenuLabel className="p-0 font-normal mb-2">
                                <div className="flex items-center gap-3 px-2 py-2 bg-slate-50 rounded-lg">
                                    <Avatar className="h-9 w-9 rounded-lg border-2 border-white shadow-sm">
                                        <AvatarImage src={user.avatar} alt={user.name} />
                                        <AvatarFallback className="rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold text-sm">
                                            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left leading-tight">
                                        <span className="truncate font-semibold text-slate-900 text-sm">{user.name}</span>
                                        <span className="truncate text-xs text-slate-500">
                                            {user.email}
                                        </span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-slate-200 my-2" />
                            <DropdownMenuGroup className="space-y-0.5">
                                <DropdownMenuItem asChild className="hover:bg-slate-100 text-slate-900 cursor-pointer rounded-md h-9">
                                    <Link href="/dashboard/settings">
                                        <UserCircle className="mr-3 h-4 w-4 text-slate-500" />
                                        <span className="text-sm">Account</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="hover:bg-slate-100 text-slate-900 cursor-pointer rounded-md h-9">
                                    <Link href="/dashboard/settings?tab=billing">
                                        <CreditCard className="mr-3 h-4 w-4 text-slate-500" />
                                        <span className="text-sm">Billing</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="hover:bg-slate-100 text-slate-900 cursor-pointer rounded-md h-9">
                                    <Link href="/dashboard/settings?tab=notifications">
                                        <Bell className="mr-3 h-4 w-4 text-slate-500" />
                                        <span className="text-sm">Notifications</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator className="bg-slate-200 my-2" />
                            <DropdownMenuItem
                                onClick={() => setShowLogoutDialog(true)}
                                className="text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer rounded-md h-9"
                            >
                                <LogOut className="mr-3 h-4 w-4" />
                                <span className="text-sm font-medium">Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>

            <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <AlertDialogContent className="bg-white">
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
