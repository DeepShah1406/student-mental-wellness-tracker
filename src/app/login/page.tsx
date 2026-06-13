"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // If already logged in, redirect to home
    if (localStorage.getItem("mindguard_logged_in") === "true") {
      router.push("/");
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    setTimeout(() => {
      const trimmedEmail = email.trim().toLowerCase();
      
      if (isLogin) {
        // 1. DUMMY LOGIN CREDENTIALS CHECK
        if (trimmedEmail === "test123@hoop.com" && password === "3072@Admin") {
          localStorage.setItem("mindguard_logged_in", "true");
          localStorage.setItem("mindguard_user_email", trimmedEmail);
          localStorage.setItem("mindguard_session_id", "f1a3d568-1936-49a1-959e-cc649e200529");
          setSuccess("Welcome back! Loading secure session...");
          setTimeout(() => {
            router.push("/");
          }, 1000);
        } else {
          // Check registered users in localStorage
          const registeredUsersStr = localStorage.getItem("mindguard_registered_users") || "[]";
          const registeredUsers = JSON.parse(registeredUsersStr);
          const found = registeredUsers.find((u: any) => u.email === trimmedEmail && u.password === password);
          
          if (found) {
            localStorage.setItem("mindguard_logged_in", "true");
            localStorage.setItem("mindguard_user_email", trimmedEmail);
            setSuccess("Welcome back! Loading secure session...");
            setTimeout(() => {
              router.push("/");
            }, 1000);
          } else {
            setError("Invalid credentials. For testing, use test123@hoop.com / 3072@Admin or signup a new account.");
            setLoading(false);
          }
        }
      } else {
        // 2. SIGNUP WORKFLOW
        if (!email || !password) {
          setError("Please fill out all fields.");
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setError("Password must be at least 6 characters.");
          setLoading(false);
          return;
        }

        const registeredUsersStr = localStorage.getItem("mindguard_registered_users") || "[]";
        const registeredUsers = JSON.parse(registeredUsersStr);
        
        if (registeredUsers.some((u: any) => u.email === trimmedEmail) || trimmedEmail === "test123@hoop.com") {
          setError("Email is already registered. Try logging in.");
          setLoading(false);
          return;
        }

        // Register user
        registeredUsers.push({ email: trimmedEmail, password });
        localStorage.setItem("mindguard_registered_users", JSON.stringify(registeredUsers));
        
        // Auto login after signup
        localStorage.setItem("mindguard_logged_in", "true");
        localStorage.setItem("mindguard_user_email", trimmedEmail);
        setSuccess("Account created successfully! Loading your safe space...");
        setTimeout(() => {
          router.push("/");
        }, 1000);
      }
    }, 800); // Add a small delay for realistic load feel
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center px-4 py-16 bg-slate-950 relative overflow-hidden">
      {/* Background glow blobs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md p-8 rounded-2xl border border-slate-900 bg-slate-900/30 backdrop-blur-md space-y-6 z-10">
        {/* Title */}
        <div className="text-center space-y-2">
          <span className="text-4xl block animate-pulse">🛡️</span>
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
            {isLogin ? "Access MindGuard" : "Join MindGuard"}
          </h2>
          <p className="text-xs text-slate-400">
            {isLogin ? "Sign in to enter your secure mental wellness space" : "Create an anonymous account for stress monitoring"}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-950 border border-slate-850 p-1 rounded-xl">
          <button
            onClick={() => { setIsLogin(true); setError(""); setSuccess(""); }}
            className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all ${
              isLogin ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(""); setSuccess(""); }}
            className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all ${
              !isLogin ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-xs font-bold text-slate-350">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., student@hoop.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="pass" className="block text-xs font-bold text-slate-350">
              Password
            </label>
            <input
              type="password"
              id="pass"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50"
            />
          </div>

          {/* Dummy instructions hint */}
          {isLogin && (
            <div className="p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-lg text-[10px] text-indigo-300">
              💡 <strong>Test Credentials:</strong> Use email <code>test123@hoop.com</code> and password <code>3072@Admin</code>.
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-500/5 border border-rose-500/10 rounded-lg text-[10px] text-rose-400">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-[10px] text-emerald-400">
              ✨ {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl transition-all disabled:opacity-50 text-xs shadow-md shadow-indigo-600/5"
          >
            {loading ? "Authenticating..." : isLogin ? "Login to Secure Safe Space" : "Register Anonymous Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
