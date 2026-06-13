import type { Metadata } from "next";
import "./globals.css";
import NavbarClient from "@/components/navbar-client";
import AuthGuard from "@/components/auth-guard";

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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem("mindguard_theme") === "light") {
                  document.documentElement.classList.remove("dark");
                } else {
                  document.documentElement.classList.add("dark");
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans selection:bg-indigo-500 selection:text-white antialiased">
        <NavbarClient />

        <main className="flex-1 flex flex-col">
          <AuthGuard>
            {children}
          </AuthGuard>
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
