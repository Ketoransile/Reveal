
import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { ScrollbarTheme } from "@/components/scrollbar-theme";
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner";

const interSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfitDisplay = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Reveal | AI-Powered Competitor Analysis",
    template: "%s | Reveal"
  },
  description: "Reveal your competitor's strategy, tech stack, and traffic sources in 30 seconds. The ultimate intelligence tool for growth hackers.",
  openGraph: {
    title: "Reveal | AI-Powered Competitor Analysis",
    description: "Reveal your competitor's strategy in 30 seconds.",
    url: "https://revealai.com",
    siteName: "Reveal",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Reveal",
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${interSans.variable} ${outfitDisplay.variable} font-sans antialiased min-h-full`}
      >
        <ScrollbarTheme />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider delayDuration={0}>
            {children}
          </TooltipProvider>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
