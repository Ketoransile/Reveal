"use client";
import { useEffect } from "react";
import Lenis from "lenis";

export function SmoothScrolling() {
    useEffect(() => {
        // Prevent browser from restoring scroll position on reload
        if ("scrollRestoration" in history) {
            history.scrollRestoration = "manual";
        }

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2,
        });

        // Force scroll to top on mount
        window.scrollTo(0, 0);
        lenis.scrollTo(0, { immediate: true });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    return null;
}
