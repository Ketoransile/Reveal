
import { Suspense } from "react";
import { NavBar } from "@/components/shared/NavBar";
import { Footer } from "@/components/shared/Footer";
import { LandingPageContent } from "@/components/landing/landing-page-content";

// Force dynamic rendering to always fetch fresh user data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Home() {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-hidden relative selection:bg-primary/20">
            <Suspense fallback={null}>
                <NavBar />
            </Suspense>
            <LandingPageContent />
            <Footer />
        </div>
    );
}