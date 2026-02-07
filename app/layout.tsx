
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScrolling } from "@/components/smooth-scrolling";
import { ScrollbarTheme } from "@/components/scrollbar-theme";
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-full`}
      >
        <ScrollbarTheme />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SmoothScrolling />
          <TooltipProvider delayDuration={0}>
            {children}
          </TooltipProvider>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
