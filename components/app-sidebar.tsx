"use client"

import * as React from "react"
import {
    LayoutDashboard,
    BarChart3,
    List,
    Folder,
    Users,
    FileText,
    FileCode,
    Settings,
    HelpCircle,
    Search,
    Database,
    Zap,
    Box
} from "lucide-react"

import { NavDocuments } from '@/components/nav-documents'
import { NavMain } from '@/components/nav-main'
import { NavSecondary } from '@/components/nav-secondary'
import { NavUser } from '@/components/nav-user'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'
import { createClient } from "@/lib/supabase/client"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [user, setUser] = React.useState<any>({
        name: "User",
        email: "user@example.com",
        avatar: "",
    })

    React.useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setUser({
                    name: user.user_metadata?.name || user.email?.split('@')[0] || "User",
                    email: user.email || "",
                    avatar: user.user_metadata?.avatar_url || "",
                })
            }
        }
        fetchUser()
    }, [])

    const data = {
        navMain: [
            {
                title: "Dashboard",
                url: "/dashboard",
                icon: LayoutDashboard,
            },
            {
                title: "All Analyses",
                url: "/dashboard/all-analyses",
                icon: BarChart3,
            }
        ],
        navSecondary: [
            {
                title: "Settings",
                url: "/dashboard/settings",
                icon: Settings,
            },
            {
                title: "Get Help",
                url: "/dashboard/help",
                icon: HelpCircle,
            }
        ],
        documents: [
            {
                name: "Recent Reports",
                url: "/dashboard/recent-reports",
                icon: FileText,
            }
        ],
    }

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            {/* Header with Logo */}
            <SidebarHeader className="h-16 px-4 border-b border-slate-200 flex items-center">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="h-10 hover:bg-transparent px-0"
                        >
                            <a href="/dashboard" className="flex items-center gap-3">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-slate-900 text-white font-bold">
                                    <Box className="size-4" />
                                </div>
                                <span className="text-lg font-bold text-slate-900 tracking-tight">RivalLens</span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Main Content */}
            <SidebarContent className="py-4 space-y-6">
                <NavMain items={data.navMain} />
                <NavDocuments items={data.documents} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>

            {/* Footer with User */}
            <SidebarFooter className="border-t border-slate-200 py-3">
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    )
}
