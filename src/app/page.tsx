"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [sessionId, setSessionId] = useState<string>("");
  const [keyInput, setKeyInput] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [restoreMessage, setRestoreMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    // Check if session ID exists in localStorage, otherwise create a new one
    let currentSessionId = localStorage.getItem("mindguard_session_id");
    if (!currentSessionId) {
      currentSessionId = crypto.randomUUID();
      localStorage.setItem("mindguard_session_id", currentSessionId);
    }
    setSessionId(currentSessionId);
  }, []);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(sessionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRestoreKey = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = keyInput.trim();
    
    // Simple UUID validation regex
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    
    if (!cleanKey) {
      setRestoreMessage({ type: "error", text: "Please enter a valid passkey." });
      return;
    }

    if (!uuidRegex.test(cleanKey)) {
      setRestoreMessage({ type: "error", text: "Invalid passkey format. Make sure it matches the copied key." });
      return;
    }

    localStorage.setItem("mindguard_session_id", cleanKey);
    setSessionId(cleanKey);
    setKeyInput("");
    setRestoreMessage({ type: "success", text: "Session passkey restored successfully! Your history is loaded." });
  };

  return (
    <div className="flex-1 flex flex-col justify-center relative overflow-hidden bg-slate-950">
      {/* Decorative background glow blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 py-16 text-center z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-indigo-400 text-xs font-semibold mb-6 animate-fade-in">
          🌟 Designed for JEE, NEET, UPSC & Board Exam Aspirants
        </div>

        {/* Hero title */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
          Your Companion Through the <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Aspirant Journey
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          High-stakes competitive exams bring severe stress, burnout, and self-doubt. 
          MindGuard is a safe, empathetic digital space to track your daily mood, uncover subconscious anxiety triggers, 
          and chat with an AI companion bounded to support your well-being.
        </p>

        {/* CTA Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12 text-left">
          {/* Card 1 */}
          <Link href="/log" className="group glass p-6 rounded-2xl border border-slate-900 bg-slate-900/30 hover:bg-slate-900/50 hover:border-indigo-500/30 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-105 transition-transform">
                ✍️
              </div>
              <h3 className="font-bold text-lg mb-1 group-hover:text-indigo-400 transition-colors">Daily Journal</h3>
              <p className="text-sm text-slate-400 leading-snug">
                Log your daily mood and vent in an open-ended journal. Our AI extracts hidden stress triggers.
              </p>
            </div>
            <div className="text-xs font-semibold text-indigo-400 mt-4 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Start writing <span>→</span>
            </div>
          </Link>

          {/* Card 2 */}
          <Link href="/chat" className="group glass p-6 rounded-2xl border border-slate-900 bg-slate-900/30 hover:bg-slate-900/50 hover:border-purple-500/30 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-105 transition-transform">
                💬
              </div>
              <h3 className="font-bold text-lg mb-1 group-hover:text-purple-400 transition-colors">AI Companion</h3>
              <p className="text-sm text-slate-400 leading-snug">
                An empathetic, always-available digital companion to guide you through anxiety and offer support.
              </p>
            </div>
            <div className="text-xs font-semibold text-purple-400 mt-4 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              Chat now <span>→</span>
            </div>
          </Link>

          {/* Card 3 */}
          <Link href="/dashboard" className="group glass p-6 rounded-2xl border border-slate-900 bg-slate-900/30 hover:bg-slate-900/50 hover:border-pink-500/30 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="h-10 w-10 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-lg mb-4 group-hover:scale-105 transition-transform">
                📊
              </div>
              <h3 className="font-bold text-lg mb-1 group-hover:text-pink-400 transition-colors">Dashboard</h3>
              <p className="text-sm text-slate-400 leading-snug">
                Visualize your 7-day mood trend and examine the trigger cloud to discover what holds you back.
              </p>
            </div>
            <div className="text-xs font-semibold text-pink-400 mt-4 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
              View stats <span>→</span>
            </div>
          </Link>
        </div>

        {/* Data Security & recovery key panel */}
        <div className="max-w-3xl mx-auto mb-10 p-6 rounded-2xl border border-slate-900 bg-slate-900/25 backdrop-blur-sm grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-200">🛡️ Your Anonymous Wellness Key</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              To guarantee absolute privacy, we do not require accounts. All logs are linked to this unique key. 
              <strong> Save this key!</strong> If you clear cookies or use another device, you can load your session here.
            </p>
            <div className="flex gap-2 bg-slate-950 border border-slate-800 rounded-lg p-2.5 items-center justify-between">
              <code className="text-xs text-indigo-400 select-all font-mono truncate max-w-[200px]">
                {sessionId}
              </code>
              <button
                onClick={handleCopyKey}
                className="bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded text-[10px] font-bold transition-all uppercase"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <form onSubmit={handleRestoreKey} className="space-y-3 flex flex-col justify-end">
            <h3 className="font-bold text-sm text-slate-200">🔑 Restore Existing Session</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your saved Wellness Key below to reload your previous logs and chats.
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Paste your UUID key here..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/50 font-mono"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all"
              >
                Load
              </button>
            </div>
            {restoreMessage && (
              <p className={`text-[10px] font-semibold ${restoreMessage.type === "success" ? "text-emerald-400" : "text-rose-400"}`}>
                {restoreMessage.text}
              </p>
            )}
          </form>
        </div>

        {/* Safety Warning */}
        <div className="max-w-xl mx-auto p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-300 text-xs flex gap-2 items-start justify-center text-left">
          <span>⚠️</span>
          <p>
            <strong>Crisis Notice:</strong> MindGuard is an educational/wellness support companion. 
            If you are experiencing severe depression, crisis, or suicidal ideation, please contact emergency lines immediately. 
            We have a built-in safety filter linked directly to Kiran (1800-599-0019) and AASRA (+91-9820466726).
          </p>
        </div>
      </div>
    </div>
  );
}
