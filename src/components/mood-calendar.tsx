"use client";

import { useState } from "react";

interface LogItem {
  id: string;
  mood: string;
  dominant_emotion: string;
  triggers: string[];
  journal_text: string;
  created_at: string;
}

interface MoodCalendarProps {
  logs: LogItem[];
}

export default function MoodCalendar({ logs }: MoodCalendarProps) {
  const [selectedDayLog, setSelectedDayLog] = useState<LogItem | null>(null);
  
  // Date calculations
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed

  // Month details
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // Day of week (0-6)
  
  // Group logs by day of month (1-indexed)
  const logsByDay: Record<number, LogItem[]> = {};
  logs.forEach(log => {
    const d = new Date(log.created_at);
    if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
      const dayNum = d.getDate();
      if (!logsByDay[dayNum]) logsByDay[dayNum] = [];
      logsByDay[dayNum].push(log);
    }
  });

  // Mood color maps
  const moodColorMap: Record<string, { bg: string, text: string, border: string, emoji: string }> = {
    great: { 
      bg: "bg-emerald-500/25", 
      text: "text-emerald-700 dark:text-emerald-300", 
      border: "border-emerald-500/30",
      emoji: "😊"
    },
    good: { 
      bg: "bg-cyan-500/25", 
      text: "text-cyan-700 dark:text-cyan-300", 
      border: "border-cyan-500/30",
      emoji: "🙂"
    },
    okay: { 
      bg: "bg-slate-500/15", 
      text: "text-slate-600 dark:text-slate-400", 
      border: "border-slate-350 dark:border-slate-800",
      emoji: "😐"
    },
    anxious: { 
      bg: "bg-amber-500/25", 
      text: "text-amber-700 dark:text-amber-300", 
      border: "border-amber-500/30",
      emoji: "😰"
    },
    overwhelmed: { 
      bg: "bg-rose-500/25", 
      text: "text-rose-700 dark:text-rose-300", 
      border: "border-rose-500/30",
      emoji: "🤯"
    }
  };

  const getDominantMoodForDay = (dayNum: number): string | null => {
    const dayLogs = logsByDay[dayNum];
    if (!dayLogs || dayLogs.length === 0) return null;
    
    // Count moods
    const counts: Record<string, number> = {};
    dayLogs.forEach(l => {
      const mood = l.mood.toLowerCase();
      counts[mood] = (counts[mood] || 0) + 1;
    });

    // Find highest frequency mood
    let dominant = "okay";
    let max = 0;
    Object.entries(counts).forEach(([m, c]) => {
      if (c > max) {
        max = c;
        dominant = m;
      }
    });
    return dominant;
  };

  // Build calendar matrix
  const calendarCells = [];
  
  // Empty slots before first day
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="h-10 sm:h-12 bg-transparent border border-transparent" />);
  }

  // Active slots for days in month
  for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
    const dayLogs = logsByDay[dayNum] || [];
    const dominantMood = getDominantMoodForDay(dayNum);
    const moodStyle = dominantMood ? moodColorMap[dominantMood] : null;
    const isSelected = selectedDayLog && new Date(selectedDayLog.created_at).getDate() === dayNum;

    calendarCells.push(
      <button
        key={`day-${dayNum}`}
        type="button"
        onClick={() => {
          if (dayLogs.length > 0) {
            setSelectedDayLog(dayLogs[0]); // Show the first log for this day
          }
        }}
        disabled={dayLogs.length === 0}
        className={`h-10 sm:h-12 flex flex-col justify-between p-1.5 rounded-lg border text-left transition-all relative ${
          moodStyle 
            ? `${moodStyle.bg} ${moodStyle.border} ${moodStyle.text} hover:scale-105 cursor-pointer`
            : "border-slate-800/40 bg-slate-950/20 text-slate-500 dark:text-slate-600 cursor-not-allowed"
        } ${isSelected ? "ring-2 ring-teal-500" : ""}`}
      >
        <span className="text-[10px] font-bold font-mono">{dayNum}</span>
        {moodStyle && (
          <span className="absolute bottom-1 right-1.5 text-xs sm:text-sm">
            {moodStyle.emoji}
          </span>
        )}
      </button>
    );
  }

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="glass p-6 rounded-2xl border border-slate-850 bg-slate-900/10 space-y-5 flex flex-col">
      <div className="flex justify-between items-center border-b border-slate-900 pb-3">
        <div>
          <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
            📅 Mood Calendar
          </h2>
          <p className="text-xs text-slate-400">
            A monthly tracker visual mapping your daily emotional logs.
          </p>
        </div>
        <div className="text-xs font-bold text-teal-400 bg-teal-500/10 border border-teal-500/25 px-3 py-1 rounded-xl">
          {monthNames[currentMonth]} {currentYear}
        </div>
      </div>

      {/* Grid */}
      <div className="space-y-4">
        {/* Weekday labels */}
        <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-black uppercase tracking-wider text-slate-400">
          {weekdays.map(w => <div key={w}>{w}</div>)}
        </div>
        
        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1.5">
          {calendarCells}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 pt-3 border-t border-slate-900 justify-center text-[10px] font-bold text-slate-400">
        <div className="flex items-center gap-1"><span className="text-xs">😊</span> Great (Emerald)</div>
        <div className="flex items-center gap-1"><span className="text-xs">🙂</span> Good (Cyan)</div>
        <div className="flex items-center gap-1"><span className="text-xs">😐</span> Okay (Slate)</div>
        <div className="flex items-center gap-1"><span className="text-xs">😰</span> Anxious (Amber)</div>
        <div className="flex items-center gap-1"><span className="text-xs">🤯</span> Overwhelmed (Rose)</div>
      </div>

      {/* Day Details panel */}
      {selectedDayLog && (
        <div className="mt-4 p-4 rounded-xl bg-slate-950/60 border border-slate-850 space-y-2 text-left animate-fade-in relative">
          <button 
            onClick={() => setSelectedDayLog(null)}
            className="absolute top-2 right-3 text-slate-400 hover:text-slate-200 text-xs font-black"
          >
            ✕
          </button>
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="text-sm">
              {moodColorMap[selectedDayLog.mood.toLowerCase()]?.emoji || "😐"}
            </span>
            <span className="font-extrabold uppercase text-slate-250">
              Logged {selectedDayLog.mood}
            </span>
            <span className="text-[10px] text-slate-500">
              on {new Date(selectedDayLog.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
            </span>
            {selectedDayLog.dominant_emotion && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-teal-500/10 text-teal-400 border border-teal-500/25">
                {selectedDayLog.dominant_emotion}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-300 italic leading-relaxed">
            "{selectedDayLog.journal_text}"
          </p>
          {selectedDayLog.triggers && selectedDayLog.triggers.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {selectedDayLog.triggers.map((t, idx) => (
                <span key={idx} className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 text-[9px] rounded font-semibold">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
