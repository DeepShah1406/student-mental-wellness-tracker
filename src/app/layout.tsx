import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MindGuard | Student Mental Wellness Tracker",
  description: "A GenAI-powered digital companion and wellness tracker designed for students preparing for high-stakes examinations (JEE, NEET, UPSC).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans selection:bg-indigo-500 selection:text-white antialiased">
        <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-95 transition-opacity">
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1.5 rounded-lg text-white font-bold flex items-center justify-center">
                🛡️
              </span>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                MindGuard
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded">
                Aspirant Companion
              </span>
            </Link>
            
            <nav className="flex items-center gap-6 text-sm font-medium text-slate-300">
              <Link href="/dashboard" className="hover:text-white transition-colors flex items-center gap-1.5">
                📊 Dashboard
              </Link>
              <Link href="/log" className="hover:text-white transition-colors flex items-center gap-1.5">
                ✍️ Daily Journal
              </Link>
              <Link href="/chat" className="hover:text-white transition-colors flex items-center gap-1.5">
                💬 AI Companion
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 flex flex-col">
          {children}
        </main>

        <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© {new Date().getFullYear()} MindGuard. Created for students preparing for NEET, JEE, CUET, GATE, and UPSC.</p>
            <p className="flex items-center gap-1.5">
              <span>🛡️ Bounded & Grounded AI</span>
              <span className="h-3 w-px bg-slate-800"></span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Safe Mode Active
              </span>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
