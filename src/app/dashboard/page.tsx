"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface LogItem {
  id: string;
  mood: string;
  dominant_emotion: string;
  triggers: string[];
  journal_text: string;
  created_at: string;
}

interface TrendItem {
  date: string;
  mood_score: number;
  mood_name: string;
}

export default function DashboardPage() {
  const [userId, setUserId] = useState<string>("");
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [trend, setTrend] = useState<TrendItem[]>([]);
  const [triggers, setTriggers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    let currentSessionId = localStorage.getItem("mindguard_session_id");
    if (!currentSessionId) {
      currentSessionId = crypto.randomUUID();
      localStorage.setItem("mindguard_session_id", currentSessionId);
    }
    setUserId(currentSessionId);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchAnalytics = async () => {
      try {
        const res = await fetch(`/api/logs?user_id=${userId}`);
        const json = await res.json();
        if (json.success && json.data) {
          setLogs(json.data.logs || []);
          setTrend(json.data.mood_trend || []);
          setTriggers(json.data.trigger_frequencies || {});
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [userId]);

  const moodScoreLabel = (score: number) => {
    switch (score) {
      case 5: return "Great";
      case 4: return "Good";
      case 3: return "Okay";
      case 2: return "Anxious";
      case 1: return "Overwhelmed";
      default: return "Okay";
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood.toLowerCase()) {
      case "great": return "😊";
      case "good": return "🙂";
      case "okay": return "😐";
      case "anxious": return "😰";
      case "overwhelmed": return "🤯";
      default: return "😐";
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center py-20 space-y-4 max-w-6xl mx-auto w-full px-4">
        <div className="h-10 w-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm">Compiling student stress analytics...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 space-y-8 bg-slate-950">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Your Wellness Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Tracking your exam stress triggers and emotional trends.
          </p>
        </div>
        <Link
          href="/log"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-5 rounded-xl transition-all hover:scale-101 text-sm shadow-md shadow-indigo-600/10"
        >
          ✍️ Log Today's Mood
        </Link>
      </div>

      {logs.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center rounded-2xl border border-slate-900 bg-slate-900/10 backdrop-blur-sm space-y-4 py-20 max-w-xl mx-auto">
          <span className="text-5xl block">📊</span>
          <h2 className="text-xl font-bold text-slate-200">No Analytics Yet</h2>
          <p className="text-slate-400 text-sm leading-normal max-w-md mx-auto">
            You haven't logged any daily wellness logs yet. Write your first open-ended journal entry to extract stress triggers and start tracking your trends.
          </p>
          <div className="pt-2">
            <Link
              href="/log"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl transition-all text-sm inline-block"
            >
              Log Your First Entry
            </Link>
          </div>
        </div>
      ) : (
        /* Dashboard Content */
        <div className="space-y-8 animate-fade-in">
          {/* Top Row: Mood Chart and Trigger Cloud */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Mood Trend Card */}
            <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/20 backdrop-blur-sm space-y-4 flex flex-col">
              <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                📈 7-Day Mood Trend
              </h2>
              <p className="text-xs text-slate-400">
                Visualizing daily progress. Higher scores represent lower stress levels.
              </p>
              
              <div className="h-64 flex-1 mt-4">
                {mounted && trend.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                      <XAxis dataKey="date" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis
                        domain={[1, 5]}
                        ticks={[1, 2, 3, 4, 5]}
                        tickFormatter={(v) => moodScoreLabel(v)[0]} // Initial letter
                        stroke="#64748B"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#0F172A", borderColor: "#1E293B", borderRadius: "10px" }}
                        labelStyle={{ color: "#94A3B8", fontWeight: "bold" }}
                        formatter={(value: any) => [moodScoreLabel(value), "Mood"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="mood_score"
                        stroke="#6366F1"
                        strokeWidth={3}
                        dot={{ fill: "#6366F1", r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                    Not enough trend points. Keep logging to render the chart.
                  </div>
                )}
              </div>
            </div>

            {/* Trigger Tag Cloud Card */}
            <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/20 backdrop-blur-sm space-y-4 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                  🎯 Top Stress Triggers
                </h2>
                <p className="text-xs text-slate-400">
                  Subconscious triggers extracted by GenAI from your journaling logs.
                </p>

                <div className="flex flex-wrap gap-2.5 mt-6">
                  {Object.keys(triggers).length > 0 ? (
                    Object.entries(triggers)
                      .sort((a, b) => b[1] - a[1]) // Sort descending by frequency
                      .map(([trigger, freq], idx) => {
                        // Color coding based on frequency
                        const intensity = freq > 3 ? "bg-rose-500/10 text-rose-300 border-rose-500/30" :
                                          freq > 1 ? "bg-amber-500/10 text-amber-300 border-amber-500/30" :
                                          "bg-indigo-500/10 text-indigo-300 border-indigo-500/30";
                        return (
                          <div
                            key={idx}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${intensity}`}
                          >
                            <span>#{trigger}</span>
                            <span className="h-4 w-4 rounded-full bg-black/40 text-[9px] font-bold flex items-center justify-center">
                              {freq}
                            </span>
                          </div>
                        );
                      })
                  ) : (
                    <div className="text-slate-500 text-sm italic">No triggers registered.</div>
                  )}
                </div>
              </div>

              {Object.keys(triggers).length > 0 && (
                <div className="mt-6 p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-xs text-indigo-300 leading-normal">
                  💡 <strong>Wellness Insight:</strong> Triggers like <em>#{Object.keys(triggers).sort((a,b)=>triggers[b]-triggers[a])[0]}</em> are causing the most tension. Consider venting to the <Link href="/chat" className="underline hover:text-indigo-200">AI Companion</Link> specifically about this to learn personalized CBT strategies.
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row: Detailed Log Timeline */}
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-900/20 backdrop-blur-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              📜 Journal Timeline
            </h2>

            <div className="space-y-4">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="p-5 rounded-xl border border-slate-900 bg-slate-950/60 flex flex-col sm:flex-row justify-between items-start gap-4 hover:border-slate-800 transition-all"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xl">{getMoodEmoji(log.mood)}</span>
                      <span className="font-bold text-sm text-slate-200 uppercase tracking-tight">
                        {log.mood}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(log.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                      {log.dominant_emotion && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          {log.dominant_emotion}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-slate-300 text-sm leading-relaxed">
                      "{log.journal_text}"
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {log.triggers.map((trigger, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 text-[10px] font-semibold"
                        >
                          {trigger}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
