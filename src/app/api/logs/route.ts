import { NextRequest, NextResponse } from "next/server";
import { saveLog, getLogs } from "@/lib/supabase";
import { extractJournalAnalytics } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, mood, journal_text } = body;

    if (!user_id || !mood) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: user_id and mood are mandatory." },
        { status: 400 }
      );
    }

    // Run trigger and sentiment extraction using Groq (or fallback)
    const { dominant_emotion, triggers } = await extractJournalAnalytics(journal_text || "");

    // Save daily log
    const saved = await saveLog({
      user_id,
      mood,
      journal_text: journal_text || "",
      dominant_emotion,
      triggers
    });

    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (err: any) {
    console.error("Error in POST /api/logs:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to save daily log." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");
    const daysParam = searchParams.get("days") || "7";
    const days = parseInt(daysParam, 10);

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing required query parameter: user_id." },
        { status: 400 }
      );
    }

    const logs = await getLogs(userId);

    // Compute mood trends (past 'days' logs, sorted chronologically)
    const moodScoreMap: Record<string, number> = {
      great: 5,
      good: 4,
      okay: 3,
      anxious: 2,
      overwhelmed: 1
    };

    // Aggregate trigger frequencies
    const trigger_frequencies: Record<string, number> = {};
    
    // Process last N days of trends
    const recentLogs = logs.slice(0, days).reverse();
    const mood_trend = recentLogs.map(log => {
      const date = new Date(log.created_at!).toISOString().split("T")[0];
      return {
        date,
        mood_score: moodScoreMap[log.mood.toLowerCase()] || 3,
        mood_name: log.mood
      };
    });

    // Populate trigger frequencies from all historical logs for this user
    logs.forEach(log => {
      if (Array.isArray(log.triggers)) {
        log.triggers.forEach(trigger => {
          const key = trigger.toLowerCase().trim();
          if (key) {
            trigger_frequencies[key] = (trigger_frequencies[key] || 0) + 1;
          }
        });
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        logs,
        mood_trend,
        trigger_frequencies
      }
    });
  } catch (err: any) {
    console.error("Error in GET /api/logs:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch logs history." },
      { status: 500 }
    );
  }
}
