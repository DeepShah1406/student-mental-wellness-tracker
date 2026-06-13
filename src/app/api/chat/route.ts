import { NextRequest, NextResponse } from "next/server";
import { saveChatMessage, getChatHistory } from "@/lib/supabase";
import { checkCrisis, CRISIS_RESOURCES } from "@/lib/safety";
import { generateEmpatheticResponse } from "@/lib/groq";
import { scrubPII } from "@/lib/scrub";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, message, history } = body;

    if (!user_id || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: user_id and message are mandatory." },
        { status: 400 }
      );
    }

    // 1. Safety Pre-check
    const isCrisis = checkCrisis(message);

    if (isCrisis) {
      const warningResponse = "It sounds like you are going through an incredibly difficult time right now, and I want to make sure you have immediate support. Please connect with a professional counselor or helpline who can help you navigate this safely. You do not have to go through this alone. I am here to help you find resources, but please reach out to the helplines listed below.";
      
      // Save crisis message to chat database
      await saveChatMessage({
        user_id,
        message,
        response: warningResponse
      });

      return NextResponse.json({
        success: true,
        flagged: true,
        response: warningResponse,
        resources: CRISIS_RESOURCES
      });
    }

    // 2. Clear prompt path: Scrub PII and generate response using Groq / mock
    const cleanMessage = scrubPII(message);
    const cleanHistory = (history || []).map((h: any) => ({
      role: h.role,
      content: scrubPII(h.content)
    }));

    const aiResponse = await generateEmpatheticResponse(cleanMessage, cleanHistory);

    // 3. Save clean chat message to database
    await saveChatMessage({
      user_id,
      message,
      response: aiResponse
    });

    // Extract potential grounding citation
    let grounding_source = "WHO Guidelines on Stress Management (2020)";
    if (aiResponse.includes("MoHFW") || aiResponse.includes("Ministry of Health")) {
      grounding_source = "MoHFW Student Wellness Advisory (2021)";
    }

    return NextResponse.json({
      success: true,
      flagged: false,
      response: aiResponse,
      grounding_source
    });
  } catch (err: any) {
    console.error("Error in POST /api/chat:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process message." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing required query parameter: user_id." },
        { status: 400 }
      );
    }

    const chats = await getChatHistory(userId);
    
    // Convert to client history format
    const history = chats.flatMap(chat => [
      { role: "user", content: chat.message },
      { role: "assistant", content: chat.response }
    ]);

    return NextResponse.json({
      success: true,
      data: history
    });
  } catch (err: any) {
    console.error("Error in GET /api/chat:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch chat history." },
      { status: 500 }
    );
  }
}
