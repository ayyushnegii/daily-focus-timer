import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://daily-focus-timer.vercel.app",
    title: "Daily Focus Timer - Pomodoro Timer for Daily Use",
    description: "A dogfooded Pomodoro timer with dark neon UI, circular progress, and local stats tracking.",
    siteName: "Daily Focus Timer",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daily Focus Timer",
    description: "A Pomodoro timer I actually use daily. Dark neon UI, local stats, and browser notifications.",
    creator: "@ayyushnegii",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
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
      <body className="min-h-full flex flex-col">
        {children}
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
          </p>
        </footer>
      </body>
    </html>
  );
}
