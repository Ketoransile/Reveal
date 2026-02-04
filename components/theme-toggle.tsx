"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="h-9 w-9">
                <Sun className="h-[18px] w-[18px]" />
            </Button>
        )
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 hover:bg-accent rounded-md transition-colors"
        >
            {theme === "dark" ? (
                <Sun className="h-[18px] w-[18px] text-foreground" />
            ) : (
                <Moon className="h-[18px] w-[18px] text-foreground" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
