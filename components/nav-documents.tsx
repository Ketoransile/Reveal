"use client"

import {
    MoreHorizontal,
    Folder,
    Share2,
    Trash2,
    type LucideIcon,
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar'

export function NavDocuments({
    items,
}: {
    items: {
        name: string
        url: string
        icon: LucideIcon
    }[]
}) {
    const { isMobile } = useSidebar()

    return (
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Documents
            </SidebarGroupLabel>
            <SidebarGroupContent className="px-3">
                <SidebarMenu className="space-y-0.5">
                    {items.map((item) => (
                        <SidebarMenuItem key={item.name}>
                            <SidebarMenuButton
                                asChild
                                className="h-9 px-3 rounded-md bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors font-medium"
                            >
                                <a href={item.url} className="flex items-center gap-3">
                                    <item.icon className="h-[18px] w-[18px]" />
                                    <span className="text-sm">{item.name}</span>
                                </a>
                            </SidebarMenuButton>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuAction
                                        showOnHover
                                        className="rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 right-1"
                                    >
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">More</span>
                                    </SidebarMenuAction>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-48 rounded-lg bg-white border-slate-200 shadow-lg"
                                    side={isMobile ? "bottom" : "right"}
                                    align={isMobile ? "end" : "start"}
                                >
                                    <DropdownMenuItem className="hover:bg-slate-100 text-slate-900 cursor-pointer">
                                        <Folder className="mr-2 h-4 w-4" />
                                        <span>Open</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="hover:bg-slate-100 text-slate-900 cursor-pointer">
                                        <Share2 className="mr-2 h-4 w-4" />
                                        <span>Share</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-slate-200" />
                                    <DropdownMenuItem className="text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        <span>Delete</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}
