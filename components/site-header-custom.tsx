"use client"

import { Separator } from '@/components/ui/separator'
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
        <header className={`flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed top-0 right-0 z-50 px-4 md:px-6 transition-all duration-300 ${collapsed ? 'md:left-20' : 'md:left-64'} left-0`}>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="md:hidden -ml-2" onClick={onMenuClick}>
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>

                {/* Collapse Button - Desktop Only */}
                {onToggleCollapse && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hidden md:flex h-8 w-8 -ml-2"
                        onClick={onToggleCollapse}
                    >
                        <PanelLeft className="h-5 w-5" />
                        <span className="sr-only">Toggle sidebar</span>
                    </Button>
                )}

                <Separator orientation="vertical" className="mr-2 h-4 bg-border hidden md:block" />
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
            <div className="flex items-center gap-2">
                <ThemeToggle />
            </div>
        </header>
    )
}
