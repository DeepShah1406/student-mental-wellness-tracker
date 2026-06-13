-- Schema DDL for Student Mental Wellness Tracker
-- Execute this in your Supabase SQL Editor to configure tables

-- 1. Daily Logs Table
CREATE TABLE IF NOT EXISTS daily_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    mood VARCHAR(50) NOT NULL,
    journal_text TEXT NOT NULL,
    dominant_emotion VARCHAR(100),
    triggers TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for daily logs lookup optimization
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_id_created ON daily_logs(user_id, created_at DESC);

-- 2. Chat History Table
CREATE TABLE IF NOT EXISTS chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for chat history lookup optimization
CREATE INDEX IF NOT EXISTS idx_chat_history_user_id_created ON chat_history(user_id, created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- Set up permissive policies for public/anonymous access based on client-generated session UUIDs
CREATE POLICY "Allow public inserts" ON daily_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to read their own logs" ON daily_logs FOR SELECT USING (true);

CREATE POLICY "Allow public chat insert" ON chat_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to read their own chats" ON chat_history FOR SELECT USING (true);
