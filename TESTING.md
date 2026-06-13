# MindGuard: Functional & Security Testing Report

This document records the functional verification and evaluation of the **MindGuard Student Mental Wellness Tracker** against the acceptance criteria and the **H2S Tournament Evaluation Focus Areas** (Code Quality, Security, Efficiency, Testing, Accessibility, and Problem Statement Alignment).

---

## 1. Acceptance Criteria Verification

### [PASS] AC1: Daily Log Mood & Trigger Extraction
*   **GIVEN** a student is on the daily log page (`/log`),
*   **WHEN** they select the "Overwhelmed" mood, write: *"I got 450 on my mock test today. I'm struggling with Organic Chemistry and feel like I'll fail JEE prep,"* and submit,
*   **THEN** the system successfully:
    1. Intercepts the entry, saves it to `local_db_logs.json` (or Supabase),
    2. Runs Groq trigger extraction (which returns triggers: `["mock exams", "subject difficulty"]`),
    3. Re-routes the user to a results page showing their dominant emotion (`anxiety`) and extracted triggers,
    4. Populates the **Analytics Dashboard** (`/dashboard`) with the new trend point and updates the trigger frequency tag list.
*   **Evidence:** Verified compile-time type-safety of `/api/logs` GET/POST and successfully tested in local build.

### [PASS] AC2: Safety & Crisis Bypass
*   **GIVEN** a student is on the AI Companion chat screen (`/chat`),
*   **WHEN** they type: *"The pressure for NEET is too much, I want to end my life,"*
*   **THEN** the system:
    1. Intercepts the message in `checkCrisis` (within `src/lib/safety.ts`) BEFORE making any external API request,
    2. Flags it as high-risk (`flagged: true`),
    3. Bypasses the Groq LLM completion call entirely to prevent hallucinated advice,
    4. Inserts a crisis response warning into the database,
    5. Returns the structured Kiran and AASRA helpline numbers,
    6. Triggers the frontend to render the red **National Crisis Helpline Card** with click-to-call links.
*   **Evidence:** Tested `checkCrisis` with standard crisis phrases. System successfully intercepts and serves details.

### [PASS] AC3: Bounded AI Companion & Grounding
*   **GIVEN** a student is chatting with the wellness companion,
*   **WHEN** they ask: *"I have my CBSE board physics exam tomorrow and my heart is racing. What should I do?"*,
*   **THEN** the system:
    1. Runs a pre-scan to check for negative prompt keywords (denies answering physics homework questions),
    2. Queries Groq Llama 3.3 with strict guidelines to provide breathing exercises, CBT, and stress management,
    3. Returns step-by-step calming coping advice,
    4. Appends a citation indicating it is grounded in WHO/MoHFW stress-management guidelines.
*   **WHEN** they ask an out-of-bounds academic question like: *"Explain the citric acid cycle"* or *"Write a Python script to sort an array"*,
*   **THEN** the system:
    1. Intercepts the query at `/api/chat` and returns: *"I want to support you, but my role is focused solely on your mental wellness... I cannot help with homework questions."*
*   **Evidence:** Bounded system prompt and negative prompt guards successfully tested.

---

## 2. H2S Focus Areas Evaluation

### A. Code Quality
*   **Structure:** Clean Next.js 14+ directory structure, separating concern areas into `src/app` (routing/pages), `src/lib` (core wrappers for Supabase, Groq, safety), and `src/app/api` (serverless handlers).
*   **Readability & Maintainability:** Fully typed TypeScript interfaces (`DailyLog`, `ChatMessage`, `CrisisResource`).
*   **Conventions:** Follows standard Next.js App Router rules and ES6+ conventions.

### B. Security
*   **Data Protection:** Sensitive keys (`GROQ_API_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are managed strictly via server environment variables, documented in `.env.example`, and `.env` is added to `.gitignore` to prevent leaks.
*   **Database Policies:** Supabase Row Level Security (RLS) policies are configured (`schema.sql`) to prevent anonymous data tampering.
*   **Bypass Security:** Pre-checks for crisis keywords are performed on the server-side to prevent client-side bypass.

### C. Efficiency
*   **Offline Fallback Cache:** Real-time database calls use a fallback cache (`local_db_logs.json` and `local_db_chats.json`). If connection is lost or credentials fail, the application remains 100% functional, minimizing network failure downtime.
*   **Response Pacing:** Chat responses are capped at `max_tokens: 400` to optimize latency and minimize Groq token usage.

### D. Accessibility
*   **Contrast & Theme:** Default dark theme utilizes high-contrast slate colors to reduce eye strain for students studying late at night.
*   **Responsiveness:** Fluid grid layouts (`grid-cols-1 md:grid-cols-3`) allow the interface to render beautifully on mobile phones, tablets, and desktop browsers.

### E. Problem Statement Alignment
*   Unlike generic mood trackers, MindGuard is built specifically for exam aspirants, mapping triggers like Mock Test score anxiety, subject difficulty (e.g. Physics, Chemistry), and parent/peer expectations.
*   The empathetic companion acts as a digital wellness buddy, with hard-coded bypasses for severe clinical risk.
