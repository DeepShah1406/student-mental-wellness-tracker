"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Confetti, { ConfettiRef } from "@/components/confetti";

const MOODS = [
  { id: "great", emoji: "😊", label: "Great", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25" },
  { id: "good", emoji: "🙂", label: "Good", color: "text-blue-400 bg-blue-500/10 border-blue-500/25" },
  { id: "okay", emoji: "😐", label: "Okay", color: "text-slate-400 bg-slate-500/10 border-slate-500/25" },
  { id: "anxious", emoji: "😰", label: "Anxious", color: "text-amber-400 bg-amber-500/10 border-amber-500/25" },
  { id: "overwhelmed", emoji: "🤯", label: "Overwhelmed", color: "text-rose-400 bg-rose-500/10 border-rose-500/25" }
];

export default function LogPage() {
  const confettiRef = useRef<ConfettiRef | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [selectedMood, setSelectedMood] = useState<string>("okay");
  const [journalText, setJournalText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let currentSessionId = localStorage.getItem("mindguard_session_id");
    if (!currentSessionId) {
      currentSessionId = crypto.randomUUID();
      localStorage.setItem("mindguard_session_id", currentSessionId);
    }
    setUserId(currentSessionId);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalText.trim()) {
      setError("Please write down a few thoughts in your journal before submitting.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          mood: selectedMood,
          journal_text: journalText
        })
      });

      const json = await res.json();
      if (json.success) {
        setResult(json.data);
        setTimeout(() => {
          confettiRef.current?.trigger();
        }, 100);
      } else {
        setError(json.error || "Failed to save daily log.");
      }
    } catch (err) {
      setError("Server connection failure. Please make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
      <Confetti ref={confettiRef} />
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
          Write Your Daily Log
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Express yourself freely. Your journal is private and analyzed locally to discover stress patterns.
        </p>
      </div>

      {!result ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mood Selection Card */}
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/30 backdrop-blur-sm space-y-4">
            <h2 className="text-base font-bold text-slate-200">How is your mental wellness right now?</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {MOODS.map(mood => {
                const isSelected = selectedMood === mood.id;
                return (
                  <button
                    key={mood.id}
                    type="button"
                    onClick={() => setSelectedMood(mood.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all duration-300 ${
                      isSelected
                        ? `${mood.color} scale-102 ring-1 ring-indigo-500/40`
                        : "border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                    }`}
                  >
                    <span className="text-3xl mb-2">{mood.emoji}</span>
                    <span className="text-xs font-bold">{mood.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Journal Textarea */}
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/30 backdrop-blur-sm space-y-3">
            <label htmlFor="journal" className="block text-base font-bold text-slate-200">
              Venting / Journal Entry
            </label>
            <p className="text-xs text-slate-500 leading-normal">
              Talk about study schedules, mock scores, exam prep blockers, concepts you are stuck on, or parent/peer expectations. The more specific you are, the better triggers we can identify.
            </p>
            <textarea
              id="journal"
              rows={6}
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="Start typing your thoughts here..."
              className="w-full bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/35 transition-all text-sm resize-none"
            />
          </div>

          {error && (
            <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs">
              ⚠️ {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 text-white font-bold py-3.5 px-6 rounded-xl transition-all hover:scale-101 active:scale-99 shadow-lg shadow-indigo-600/10 disabled:opacity-50 disabled:pointer-events-none text-sm"
          >
            {loading ? "Analyzing Mental Patterns..." : "Submit Entry & Extract Triggers"}
          </button>
        </form>
      ) : (
        /* Result Layout after submission */
        <div className="space-y-6 animate-fade-in">
          {/* Analysis Card */}
          <div className="p-8 rounded-2xl border border-slate-900 bg-slate-900/30 backdrop-blur-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800/60">
              <span className="text-4xl">🧬</span>
              <div>
                <h2 className="text-xl font-bold text-slate-100">AI Wellness Analysis</h2>
                <p className="text-xs text-slate-400">Journal processed and triggers cataloged successfully.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Dominant Emotion</h3>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold text-sm">
                  🎭 {result.dominant_emotion.toUpperCase()}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Extracted Triggers</h3>
                <div className="flex flex-wrap gap-2">
                  {result.triggers.map((trigger: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 text-xs font-semibold"
                    >
                      🎯 {trigger}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Calming Coping Exercise (Wow Moment) */}
          <div className="p-8 rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-slate-900/30 to-purple-950/30 backdrop-blur-sm space-y-4">
            <h3 className="text-indigo-400 text-xs font-bold uppercase tracking-wider">Recommended Calming Exercise</h3>
            <h2 className="text-xl font-extrabold text-slate-100">Box Breathing Technique</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              When dealing with high study pressure and exam stress, the heart rate rises. Practicing box breathing sends a biological signal to your brain to restore calm.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 text-center">
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="text-indigo-400 text-lg font-bold mb-1">4 sec</div>
                <div className="text-slate-400 text-xs">Inhale Deeply</div>
              </div>
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="text-indigo-400 text-lg font-bold mb-1">4 sec</div>
                <div className="text-slate-400 text-xs">Hold Breath</div>
              </div>
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="text-indigo-400 text-lg font-bold mb-1">4 sec</div>
                <div className="text-slate-400 text-xs">Exhale Slowly</div>
              </div>
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl">
                <div className="text-indigo-400 text-lg font-bold mb-1">4 sec</div>
                <div className="text-slate-400 text-xs">Hold Empty</div>
              </div>
            </div>
            
            <p className="text-[10px] text-slate-500 italic">
              * Recommended by the World Health Organization (WHO) for stress and acute anxiety management.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link
              href="/dashboard"
              className="flex-1 text-center bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-100 font-bold py-3.5 rounded-xl transition-all text-sm"
            >
              📊 View Dashboard Trends
            </Link>
            <Link
              href="/chat"
              className="flex-1 text-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all text-sm"
            >
              💬 Talk to AI Companion
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
