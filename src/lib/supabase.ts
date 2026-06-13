import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Initialize the real Supabase Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// File paths for local fallback JSON database
const WORKSPACE_DIR = "d:/H2S/promptwars_5";
const LOCAL_LOGS_FILE = path.join(WORKSPACE_DIR, "local_db_logs.json");
const LOCAL_CHATS_FILE = path.join(WORKSPACE_DIR, "local_db_chats.json");

// Helper to ensure files exist with empty arrays
function ensureLocalDb() {
  if (!fs.existsSync(LOCAL_LOGS_FILE)) {
    fs.writeFileSync(LOCAL_LOGS_FILE, JSON.stringify([]));
  }
  if (!fs.existsSync(LOCAL_CHATS_FILE)) {
    fs.writeFileSync(LOCAL_CHATS_FILE, JSON.stringify([]));
  }
}

export interface DailyLog {
  id?: string;
  user_id: string;
  mood: string;
  journal_text: string;
  dominant_emotion: string;
  triggers: string[];
  created_at?: string;
}

export interface ChatMessage {
  id?: string;
  user_id: string;
  message: string;
  response: string;
  created_at?: string;
}

/**
 * Saves a daily log to Supabase, falling back to local file if unreachable.
 */
export async function saveLog(log: DailyLog): Promise<DailyLog> {
  const newLog = {
    ...log,
    id: log.id || crypto.randomUUID(),
    created_at: log.created_at || new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("daily_logs")
        .insert([newLog])
        .select()
        .single();
      
      if (!error && data) {
        return data as DailyLog;
      }
      console.warn("Supabase insert failed or table missing, falling back to local database:", error);
    } catch (err) {
      console.warn("Failed to connect to Supabase, falling back to local database:", err);
    }
  }

  // Fallback: Save to local JSON file
  ensureLocalDb();
  const fileContent = fs.readFileSync(LOCAL_LOGS_FILE, "utf-8");
  const logsList: DailyLog[] = JSON.parse(fileContent);
  logsList.push(newLog);
  fs.writeFileSync(LOCAL_LOGS_FILE, JSON.stringify(logsList, null, 2));
  return newLog;
}

/**
 * Retrieves daily logs for a given user, falling back to local file if unreachable.
 */
export async function getLogs(userId: string): Promise<DailyLog[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("daily_logs")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      
      if (!error && data) {
        return data as DailyLog[];
      }
      console.warn("Supabase fetch failed, falling back to local database:", error);
    } catch (err) {
      console.warn("Failed to connect to Supabase, falling back to local database:", err);
    }
  }

  // Fallback: Read from local JSON file
  ensureLocalDb();
  const fileContent = fs.readFileSync(LOCAL_LOGS_FILE, "utf-8");
  const logsList: DailyLog[] = JSON.parse(fileContent);
  return logsList
    .filter(log => log.user_id === userId)
    .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime());
}

/**
 * Saves a chat interaction, falling back to local file if unreachable.
 */
export async function saveChatMessage(chat: ChatMessage): Promise<ChatMessage> {
  const newChat = {
    ...chat,
    id: chat.id || crypto.randomUUID(),
    created_at: chat.created_at || new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("chat_history")
        .insert([newChat])
        .select()
        .single();
      
      if (!error && data) {
        return data as ChatMessage;
      }
      console.warn("Supabase insert chat failed, falling back to local database:", error);
    } catch (err) {
      console.warn("Failed to connect to Supabase, falling back to local database:", err);
    }
  }

  // Fallback: Save to local JSON file
  ensureLocalDb();
  const fileContent = fs.readFileSync(LOCAL_CHATS_FILE, "utf-8");
  const chatsList: ChatMessage[] = JSON.parse(fileContent);
  chatsList.push(newChat);
  fs.writeFileSync(LOCAL_CHATS_FILE, JSON.stringify(chatsList, null, 2));
  return newChat;
}

/**
 * Retrieves chat history, falling back to local file if unreachable.
 */
export async function getChatHistory(userId: string): Promise<ChatMessage[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("chat_history")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: true });
      
      if (!error && data) {
        return data as ChatMessage[];
      }
      console.warn("Supabase fetch chat failed, falling back to local database:", error);
    } catch (err) {
      console.warn("Failed to connect to Supabase, falling back to local database:", err);
    }
  }

  // Fallback: Read from local JSON file
  ensureLocalDb();
  const fileContent = fs.readFileSync(LOCAL_CHATS_FILE, "utf-8");
  const chatsList: ChatMessage[] = JSON.parse(fileContent);
  return chatsList
    .filter(chat => chat.user_id === userId)
    .sort((a, b) => new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime());
}

/**
 * Purges all daily logs and chat history for a given user from Supabase and local cache.
 */
export async function purgeUserData(userId: string): Promise<boolean> {
  let supabaseSuccess = false;

  if (supabase) {
    try {
      const logDelete = await supabase.from("daily_logs").delete().eq("user_id", userId);
      const chatDelete = await supabase.from("chat_history").delete().eq("user_id", userId);
      
      if (!logDelete.error && !chatDelete.error) {
        supabaseSuccess = true;
      } else {
        console.warn("Supabase purge returned errors, applying local cache purge anyway:", { logs: logDelete.error, chats: chatDelete.error });
      }
    } catch (err) {
      console.warn("Failed to purge from Supabase, applying local cache purge:", err);
    }
  }

  // Always apply to local JSON database fallback
  try {
    ensureLocalDb();
    
    // Purge local logs
    const logsContent = fs.readFileSync(LOCAL_LOGS_FILE, "utf-8");
    const logsList: DailyLog[] = JSON.parse(logsContent);
    const filteredLogs = logsList.filter(log => log.user_id !== userId);
    fs.writeFileSync(LOCAL_LOGS_FILE, JSON.stringify(filteredLogs, null, 2));

    // Purge local chats
    const chatsContent = fs.readFileSync(LOCAL_CHATS_FILE, "utf-8");
    const chatsList: ChatMessage[] = JSON.parse(chatsContent);
    const filteredChats = chatsList.filter(chat => chat.user_id !== userId);
    fs.writeFileSync(LOCAL_CHATS_FILE, JSON.stringify(filteredChats, null, 2));

    return true;
  } catch (err) {
    console.error("Failed to purge local JSON database cache:", err);
    return supabaseSuccess;
  }
}

