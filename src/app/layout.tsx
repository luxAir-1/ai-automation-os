import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { CookieBanner } from "@/components/layout/cookie-banner";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AI Automation OS — Intelligent Agent Platform",
  description:
    "Deploy and manage AI agents that automate complex workflows. Control multi-tool automation with natural language.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${dmSans.variable} ${geistMono.variable} font-body antialiased`}
      >
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
