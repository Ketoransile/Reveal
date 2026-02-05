"use client"

import { useState } from "react"
import { CustomSidebar, MobileSidebar } from "@/components/custom-sidebar"
import { SiteHeaderCustom } from "@/components/site-header-custom"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [collapsed, setCollapsed] = useState(false)

    return (
        <div className="flex min-h-screen bg-background relative isolate overflow-x-hidden">
            <CustomSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
            <MobileSidebar open={mobileOpen} onOpenChange={setMobileOpen} />

            <main
                className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out overflow-x-hidden ${collapsed ? 'md:ml-20' : 'md:ml-64'}`}
            >
                <SiteHeaderCustom onMenuClick={() => setMobileOpen(true)} />
                <div className="flex-1 p-4 sm:p-6 lg:p-10 w-full max-w-7xl mx-auto space-y-4">
                    {children}
                </div>
            </main>
        </div>
    );
}

