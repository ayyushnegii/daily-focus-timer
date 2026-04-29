import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";

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
    default: "Daily Focus Timer",
    template: "%s | Daily Focus Timer",
  },
  description: "A Pomodoro-style focus timer I use daily to manage work sessions. Built with Next.js + Tailwind CSS, featuring dark neon UI and local session tracking.",
  keywords: ["pomodoro", "timer", "focus", "productivity", "next.js", "tailwind"],
  authors: [{ name: "Ayush Negi", url: "https://ayyushportfolio.vercel.app" }],
  creator: "Ayush Negi",
  metadataBase: new URL("https://daily-focus-timer.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://daily-focus-timer.vercel.app",
    title: "Daily Focus Timer - Pomodoro Timer for Daily Use",
    description: "A dogfooded Pomodoro timer with dark neon UI, circular progress, and local stats tracking.",
    siteName: "Daily Focus Timer",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Daily Focus Timer Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily Focus Timer",
    description: "A Pomodoro timer I actually use daily. Dark neon UI, local stats, and browser notifications.",
    creator: "@ayyushnegii",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a0f]">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <footer className="mt-auto py-4 text-center text-gray-600 text-sm border-t border-gray-800">
          <p>
            Built by{' '}
            <a 
              href="https://ayyushportfolio.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neon-cyan hover:text-neon-lime transition-colors"
            >
              Ayush Negi
            </a>
            {' '}•{' '}
            <a 
              href="https://github.com/ayyushnegii/daily-focus-timer" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neon-cyan hover:text-neon-lime transition-colors"
            >
              GitHub
            </a>
            {' '}•{' '}
            <a 
              href="https://vercel.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neon-cyan hover:text-neon-lime transition-colors"
            >
              Powered by Vercel
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
