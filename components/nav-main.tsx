"use client"

import { PlusCircle, type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'

export function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        icon?: LucideIcon
    }[]
}) {
    const pathname = usePathname()

    return (
        <SidebarGroup>
            <SidebarGroupLabel className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-3">
                <SidebarMenu className="space-y-0.5">
                    {items.map((item) => {
                        const isActive = pathname === item.url
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    tooltip={item.title}
                                    isActive={isActive}
                                    className={`h-9 px-3 rounded-md transition-colors ${isActive
                                            ? "bg-slate-100 text-slate-900 font-semibold"
                                            : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium"
                                        }`}
                                >
                                    <Link href={item.url} className="flex items-center gap-3">
                                        {item.icon && <item.icon className="h-[18px] w-[18px]" />}
                                        <span className="text-sm">{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>

                <div className="mt-3">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                tooltip="New Analysis"
                                className="h-9 px-3 rounded-md bg-slate-900 text-white hover:bg-slate-800 font-medium transition-colors hover:text-white"
                            >
                                <Link href="/dashboard/analysis" className="flex items-center gap-3">
                                    <PlusCircle className="h-[18px] w-[18px]" />
                                    <span className="text-sm">New Analysis</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </div>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
