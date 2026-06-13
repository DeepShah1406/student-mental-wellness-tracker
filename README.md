# MindGuard | GenAI Student Mental Wellness Tracker

MindGuard is an AI-powered digital companion and mental wellness tracker designed specifically for students preparing for high-stakes board exams and competitive entrance tests (such as NEET, JEE, CUET, GATE, and UPSC). 

By analyzing daily mood choices and open-ended journaling, MindGuard extracts subconscious stress triggers (like mock test performance, subject difficulties, or parental pressure) that standard trackers miss. It provides empathetic, context-aware coping strategies grounded in clinical frameworks while incorporating strict safety boundaries and crisis bypass protocols.

---

## 🌟 Key Features
*   **Low-Friction Mood & Journal Logging:** Quickly record emotions with emoji selections and write freely about prep schedules.
*   **GenAI Trigger & Sentiment Extraction:** Processes journal text using the Groq API (Llama 3.3) to isolate specific anxiety sources.
*   **Empathetic AI Companion:** A guarded chat companion strictly bounded to study-related stress, declining out-of-scope curriculum questions.
*   **Safety & Crisis Bypass:** Real-time pre-checks intercept critical keywords (e.g. self-harm, suicidal ideation) to immediately present a National Helpline card (Kiran, AASRA) while disabling standard LLM lookup.
*   **Student Analytics Dashboard:** Visualizes 7-day mood scores via interactive Recharts line graphs and displays a stress trigger frequency cloud.
*   **Offline Robustness:** Automatic fallback to local database files (`local_db_logs.json` and `local_db_chats.json`) and heuristic mock models if database or API connections are unavailable.

---

## 🛠️ Technology Stack
*   **Frontend & Routing:** Next.js (TypeScript, App Router)
*   **Styling & Components:** Tailwind CSS v4, custom glassmorphic layout
*   **Database & Storage:** Supabase (PostgreSQL)
*   **LLM Inference:** Groq API (Model: `llama-3.3-70b-versatile`)
*   **Deployment:** Vercel

---

## 🚀 Getting Started

### 1. Prerequisites
Make sure you have **Node.js 18+** installed.

### 2. Installation
1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/<your-username>/student-mental-wellness-tracker.git
   cd student-mental-wellness-tracker
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```

### 3. Database Setup (Supabase)
1. Create a free project on [Supabase](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Copy the contents of the `schema.sql` file in this repository and paste them into the SQL editor, then click **Run**. This will create the required `daily_logs` and `chat_history` tables and configure RLS policies.

### 4. Configuration
1. Rename `.env.example` to `.env`.
2. Populate the environment variables with your API keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   GROQ_API_KEY=gsk_your_groq_key
   ```

### 5. Running the App
Start the development server:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the application.

---

## 📦 Deployment to Vercel

1. Install the Vercel CLI globally (optional):
   ```bash
   npm install -g vercel
   ```
2. Run the deployment command in the project root:
   ```bash
   vercel
   ```
3. Add the environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GROQ_API_KEY`) in the Vercel Project Settings under **Environment Variables**.
4. Redeploy to apply variables.

---

## 📄 License & Attributions
*   Structured stress management guidelines and coping techniques adapted from the **World Health Organization (WHO)** and **Ministry of Health and Family Welfare (MoHFW), Government of India**.
