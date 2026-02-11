import { Suspense } from "react";
import { NavBar } from "@/components/shared/NavBar";
import { Footer } from "@/components/shared/Footer";
import { PricingContent } from "@/components/landing/pricing-content";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 overflow-hidden relative selection:bg-emerald-500/30 font-sans">
            <Suspense fallback={null}>
                <NavBar />
            </Suspense>
            <PricingContent />
            <Footer />
        </div>
    );
}
