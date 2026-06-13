import { NextRequest, NextResponse } from "next/server";
import { purgeUserData } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id } = body;

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: "Missing required field: user_id is mandatory." },
        { status: 400 }
      );
    }

    const success = await purgeUserData(user_id);
    
    if (success) {
      return NextResponse.json({ success: true, message: "All user logs and chats purged successfully." });
    } else {
      return NextResponse.json({ success: false, error: "Failed to purge user data from database." }, { status: 500 });
    }
  } catch (err: any) {
    console.error("Error in POST /api/purge:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process purge request." },
      { status: 500 }
    );
  }
}
