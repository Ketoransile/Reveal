"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ScrollbarTheme() {
    const pathname = usePathname();

    useEffect(() => {
        const darkPages = ["/", "/pricing"];
        const isDarkPage = darkPages.includes(pathname);

        if (isDarkPage) {
            document.documentElement.setAttribute("data-scroll-theme", "dark");
            document.documentElement.style.colorScheme = "dark";
        } else {
            document.documentElement.setAttribute("data-scroll-theme", "light");
            document.documentElement.style.colorScheme = "light";
        }
    }, [pathname]);

    return null;
}
