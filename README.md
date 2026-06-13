# 🛡️ MindGuard
### A GenAI mental wellness companion and exam stress trigger tracker built for student aspirants.

![Built at PromptWars 2026](https://img.shields.io/badge/Built%20at-PromptWars%202026-teal?style=flat-square)
![Next.js](https://img.shields.io/badge/Framework-Next.js-black?style=flat-square)
![Supabase](https://img.shields.io/badge/Database-Supabase-green?style=flat-square)
![Deployed on Vercel](https://img.shields.io/badge/Deployment-Vercel-black?style=flat-square)

---

## 📷 Screenshots (Recommended Capture)
1. **Wellness Dashboard**: The mood trend line chart, trigger tag clouds, and the interactive monthly **Calendar Mood Tracker**.
2. **Daily Journal**: Free-form journaling panel, mood emoji selections, and the celebratory **canvas confetti burst** on successful submission.
3. **AI Companion**: The chat interface showing CBT stress coping advice, homework rejection guards, and the prominent red **National Crisis Helpline Card**.
4. **Relax Center**: Side-by-side circular **Pomodoro timer** and the interactive canvas **Zen Bubble Popper** game.

---

## 🚀 Quick Start
Run these three commands to spin up the project locally:
```bash
git clone https://github.com/DeepShah1406/student-mental-wellness-tracker.git
npm install
npm run dev
```
*Note: Make sure to copy `.env.example` to `.env` and fill in your Supabase & Groq API credentials.*

---

## 🌟 Features
* 🧘‍♀️ **Relax Center**: Customizable Pomodoro Focus Timer and canvas-based Zen Bubble Popper game with synthesized audio alerts.
* 📅 **Mood Calendar**: Visual monthly check-in grid displaying color-coded emotional states and journal summaries.
* 🛡️ **PII Scrubbing**: Local regex sanitization that scrubs emails, phone numbers, and full names before sending logs to LLMs.
* 🚨 **Crisis Bypass**: Pre-checks that block LLMs and display Indian National Helpline cards (Kiran/Tele-MANAS) instantly when crisis keywords are detected.
* 💬 **Empathetic Companion**: Conversational wellness bot grounded in WHO frameworks (rejects coding/homework requests).
* 📰 **Wellness Blogs**: Dedicated space containing wellness articles tailored for student exam stress management.
* 🎨 **Light/Dark Toggle**: Switcher changing layouts from slate-teal dark mode to mint-green light mode.
* 📦 **Offline Fallback Cache**: Automatic fallback to local cache JSON files if database connection fails.

---

## 🛠️ Tech Stack & Justifications
* **Next.js 16 (App Router)**: Enables sub-second loading speeds, clean layout structures, and serverless API endpoints.
* **Supabase (PostgreSQL)**: Handles relational session databases, configured with robust Row-Level Security (RLS) policies.
* **Groq (Llama 3.3 70B)**: Unlocks sub-second response latency for trigger parsing and conversation.
* **Tailwind CSS v4**: Dynamic glassmorphic theme styling mapping variables for seamless light/dark swaps.

---

## 🤖 Built By
MindGuard was designed and shipped collaboratively by the **AI Agent Team**:
* **Orchestrator**: Directed workspace setups, acceptance checks, and port allocations.
* **Research**: Analyzed competitor platforms (Wysa, Calm, Headspace) and local Indian helpline integrations.
* **Architect**: Defined relational DB schemas, Next.js folder routing layouts, and API boundaries.
* **Backend**: Completed serverless routes, crisis bypass algorithms, and JSON data fail-safes.
* **Frontend**: Designed the glassmorphic Teal/Cyan user interfaces, theme toggle, and canvas physics.
* **QA**: Wrote comprehensive validation test suites and checked the 10 acceptance criteria.
* **Git/DevOps**: Handled commits, versioning (`0.0.2` baseline), and pushed code to GitHub.
