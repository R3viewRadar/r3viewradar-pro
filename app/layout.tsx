import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "R3viewRadar — Search Reputation. Find Trust.",
    template: "%s | R3viewRadar",
  },
  description:
    "The #1 reputation search engine for legal, insurance, financial, and real estate professionals. Find trusted advisors backed by verified reviews and Trust Scores.",
  keywords: [
    "lawyer reviews",
    "insurance agent reviews",
    "financial advisor reviews",
    "real estate agent reviews",
    "professional reputation",
    "trust score",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://r3viewradar.com",
    siteName: "R3viewRadar",
    title: "R3viewRadar — Search Reputation. Find Trust.",
    description: "Find trusted lawyers, insurance agents, financial advisors, and real estate professionals.",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "R3viewRadar",
    description: "Search Reputation. Find Trust.",
  },
  robots: { index: true, follow: true },
  themeColor: "#06b6d4",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
