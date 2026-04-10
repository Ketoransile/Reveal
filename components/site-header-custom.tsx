"use client"

import { Button } from '@/components/ui/button'
import { Menu, PanelLeft } from "lucide-react"
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

interface SiteHeaderProps {
    onMenuClick?: () => void
    collapsed?: boolean
    onToggleCollapse?: () => void
}

export function SiteHeaderCustom({ onMenuClick, collapsed = false, onToggleCollapse }: SiteHeaderProps) {
    const pathname = usePathname()
    const segments = pathname.split('/').filter(Boolean)

    const formatSegment = (segment: string) => {
        return segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
    }

    return (
        <header className={`flex h-[60px] shrink-0 items-center justify-between gap-4 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 fixed top-0 right-0 z-40 px-4 md:px-8 transition-[left] duration-300 ease-in-out border-b border-border/40 ${collapsed ? 'md:left-20' : 'md:left-64'} left-0`}>
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="md:hidden -ml-2 text-muted-foreground hover:text-foreground" onClick={onMenuClick}>
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>

                {/* Collapse Button - Desktop Only */}
                {onToggleCollapse && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hidden md:flex h-8 w-8 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
                        onClick={onToggleCollapse}
                    >
                        <PanelLeft className="h-[18px] w-[18px]" />
                        <span className="sr-only">Toggle sidebar</span>
                    </Button>
                )}

                <div className="h-4 w-px bg-border/50 hidden md:block mx-1" />

                <Breadcrumb className="hidden sm:block">
                    <BreadcrumbList>
                        {segments.map((segment, index) => {
                            const href = `/${segments.slice(0, index + 1).join('/')}`
                            const isLast = index === segments.length - 1
                            const formattedName = formatSegment(segment)

                            return (
                                <React.Fragment key={href}>
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <BreadcrumbPage className="font-semibold text-foreground tracking-tight">
                                                {formattedName}
                                            </BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink href={href} className="text-muted-foreground hover:text-foreground font-medium transition-colors tracking-tight">
                                                {formattedName}
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && <BreadcrumbSeparator className="text-muted-foreground/50" />}
                                </React.Fragment>
                            )
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="bg-muted/50 rounded-full p-1 border border-border/50 shadow-sm">
                    <ThemeToggle />
                </div>
            </div>
        </header>
    )
}
