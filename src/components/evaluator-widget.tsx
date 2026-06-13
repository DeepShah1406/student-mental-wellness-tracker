"use client";

import { useEffect, useState } from "react";

interface ScoreCategory {
  label: string;
  key: string;
  baseline: number;
  current: number;
}

export default function EvaluatorWidget() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const res = await fetch("/api/evaluate");
        const json = await res.json();
        if (json.success) {
          setData(json);
        }
      } catch (err) {
        console.error("Failed to fetch evaluation scores:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchScores();
  }, []);

  if (loading) {
    return (
      <div className="glass p-6 rounded-2xl border border-slate-850 bg-slate-900/10 space-y-4 flex flex-col justify-center items-center py-12">
        <div className="h-6 w-6 border-2 border-teal-500/20 border-t-teal-500 rounded-full animate-spin"></div>
        <p className="text-xs text-slate-400">Analyzing codebase security and accessibility...</p>
      </div>
    );
  }

  if (!data) return null;

  const { baseline, current, better } = data;

  const categories: ScoreCategory[] = [
    { label: "Code Quality", key: "codeQuality", baseline: baseline.categories.codeQuality, current: current.categories.codeQuality },
    { label: "Security", key: "security", baseline: baseline.categories.security, current: current.categories.security },
    { label: "Efficiency", key: "efficiency", baseline: baseline.categories.efficiency, current: current.categories.efficiency },
    { label: "Testing", key: "testing", baseline: baseline.categories.testing, current: current.categories.testing },
    { label: "Accessibility", key: "accessibility", baseline: baseline.categories.accessibility, current: current.categories.accessibility },
    { label: "Problem Statement Alignment", key: "problemAlignment", baseline: baseline.categories.problemAlignment, current: current.categories.problemAlignment }
  ];

  const diff = parseFloat((current.overall - baseline.overall).toFixed(2));

  return (
    <div className="glass p-6 rounded-2xl border border-slate-850 bg-slate-900/10 space-y-6">
      {/* Header info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-900 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
            🤖 AI Codebase Evaluator
          </h2>
          <p className="text-xs text-slate-400">
            Real-time static code analyzer comparing current build against Version 0.0.2 baseline.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-950/50 border border-slate-900 p-2 rounded-xl">
          <div className="text-center px-2">
            <span className="block text-[9px] text-slate-400 font-bold uppercase">v0.0.2 Baseline</span>
            <span className="text-sm font-extrabold text-slate-300 font-mono">{baseline.overall}</span>
          </div>
          <div className="h-6 w-px bg-slate-800"></div>
          <div className="text-center px-2">
            <span className="block text-[9px] text-teal-400 font-bold uppercase">Current Version</span>
            <span className="text-sm font-extrabold text-teal-400 font-mono">{current.overall}</span>
          </div>
          <div className="h-6 w-px bg-slate-800"></div>
          <div className="px-2">
            {diff >= 0 ? (
              <span className="inline-flex items-center gap-0.5 px-2 py-1 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 text-[10px] font-bold">
                ▲ +{diff} Better!
              </span>
            ) : (
              <span className="inline-flex items-center gap-0.5 px-2 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold">
                ▼ {diff}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Grid of scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((c) => {
          const catDiff = c.current - c.baseline;
          return (
            <div key={c.key} className="p-4 rounded-xl border border-slate-900/60 bg-slate-950/20 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-300">{c.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-mono">v0.0.2: {c.baseline}</span>
                  <span className="font-extrabold text-slate-200 font-mono">{c.current}/100</span>
                  {catDiff > 0 && (
                    <span className="text-[10px] text-teal-400 font-bold">+{catDiff}</span>
                  )}
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="relative w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-850">
                {/* Baseline marker overlay */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-slate-500 z-10"
                  style={{ left: `${c.baseline}%` }}
                  title={`Baseline Marker: ${c.baseline}`}
                />
                {/* Current score fill */}
                <div 
                  className="h-full bg-gradient-to-r from-teal-600 to-cyan-500 rounded-full transition-all duration-500"
                  style={{ width: `${c.current}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {better && (
        <div className="p-3 bg-teal-500/5 border border-teal-500/15 rounded-xl text-[10px] text-teal-400 flex items-center gap-2">
          ✨ <strong>Evaluation Insight:</strong> Code modularity, accessibility labels (ARIA), theme toggle switch, and comprehensive blogs have successfully boosted the overall score above the baseline.
        </div>
      )}
    </div>
  );
}
