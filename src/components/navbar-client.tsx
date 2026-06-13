"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function NavbarClient() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const checkAuth = () => {
      setIsLoggedIn(localStorage.getItem("mindguard_logged_in") === "true");
      setUserEmail(localStorage.getItem("mindguard_user_email") || "");
    };

    checkAuth();

    // Listen for storage changes
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("mindguard_logged_in");
    localStorage.removeItem("mindguard_user_email");
    setIsLoggedIn(false);
    setUserEmail("");
    router.push("/login");
  };

  // Hide Navbar completely on the login page
  if (pathname === "/login") return null;

  return (
    <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-95 transition-opacity">
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1.5 rounded-lg text-white font-bold flex items-center justify-center">
            🛡️
          </span>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            MindGuard
          </span>
          <span className="text-[10px] uppercase tracking-wider font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded hidden sm:inline-block">
            Aspirant Companion
          </span>
        </Link>
        
        <nav className="flex items-center gap-4 sm:gap-6 text-sm font-medium text-slate-300">
          <Link href="/dashboard" className="hover:text-white transition-colors flex items-center gap-1.5">
            📊 <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link href="/log" className="hover:text-white transition-colors flex items-center gap-1.5">
            ✍️ <span className="hidden sm:inline">Daily Journal</span>
          </Link>
          <Link href="/chat" className="hover:text-white transition-colors flex items-center gap-1.5">
            💬 <span className="hidden sm:inline">AI Companion</span>
          </Link>

          {mounted && isLoggedIn && (
            <div className="flex items-center gap-3 border-l border-slate-800 pl-4">
              <span className="hidden md:inline-block text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                👤 {userEmail}
              </span>
              <button
                onClick={handleLogout}
                className="bg-rose-500/10 hover:bg-rose-600 hover:text-white border border-rose-500/20 text-rose-400 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
