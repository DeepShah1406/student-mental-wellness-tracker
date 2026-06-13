"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Check if session ID exists in localStorage, otherwise create a new one
    let currentSessionId = localStorage.getItem("mindguard_session_id");
    if (!currentSessionId) {
      currentSessionId = crypto.randomUUID();
      localStorage.setItem("mindguard_session_id", currentSessionId);
    }
    setSessionId(currentSessionId);
  }, []);

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
