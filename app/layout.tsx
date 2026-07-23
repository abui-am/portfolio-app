import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter, Lora, Manrope } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@/components/seo/google-analytics";
import { JsonLdPerson } from "@/components/seo/json-ld-person";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createSiteMetadata } from "@/lib/seo/metadata";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-portfolio-sans",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-portfolio-serif",
  display: "swap",
});

export const metadata: Metadata = createSiteMetadata();

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${manrope.variable} ${lora.variable} h-full antialiased`}
    >
      <head>
        <link rel="llms-txt" href="/llms.txt" type="text/plain" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt" />
      </head>
      <body className={`min-h-full flex flex-col font-sans ${inter.className}`}>
        <JsonLdPerson />
        <GoogleAnalytics />
        <TooltipProvider>{children}</TooltipProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
