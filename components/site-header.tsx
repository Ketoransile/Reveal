"use client"

import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbLink,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { ThemeToggle } from '@/components/theme-toggle'
import { usePathname } from 'next/navigation'
import React from 'react'

export function SiteHeader() {
    const pathname = usePathname()
    const segments = pathname.split('/').filter(Boolean)

    // Helper to format segment names
    const formatSegment = (segment: string) => {
        return segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    }

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border bg-card sticky top-0 z-10 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1 text-foreground hover:bg-accent" />
                <Separator orientation="vertical" className="mr-2 h-4 bg-border" />
                <Breadcrumb>
                    <BreadcrumbList>
                        {segments.map((segment, index) => {
                            const href = `/${segments.slice(0, index + 1).join('/')}`
                            const isLast = index === segments.length - 1
                            const formattedName = formatSegment(segment)

                            return (
                                <React.Fragment key={href}>
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <BreadcrumbPage className="font-semibold text-foreground">
                                                {formattedName}
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink href={href} className="text-muted-foreground hover:text-foreground">
                                                {formattedName}
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && <BreadcrumbSeparator />}
                                </React.Fragment>
                            )
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            <div className="px-4">
                {/* <ThemeToggle /> */}
            </div>
        </header>
    )
}
