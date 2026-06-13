---
aliases: [PromptWars Pre-Competition Setup]
tags: [antigravity, hackathon, setup, checklist]
---

# 🔧 Pre-Competition Setup Checklist

> Run through this **the night before** (June 12) on your own laptop.
> Estimated time: ~30 minutes.

---

## 1. Environment Check

- [ ] Antigravity 2.0 IDE installed and updated to latest version
- [ ] Node.js 18+ installed → verify: `node --version`
- [ ] npm / npx available → verify: `npx --version`
- [ ] Git installed and configured → verify: `git config user.name` and `git config user.email`
- [ ] Docker Desktop installed and running (for optional MCP servers)
- [ ] Python 3.10+ installed → verify: `python --version` (needed only if you switch to Streamlit)

---

## 2. Create GitHub Personal Access Token (PAT)

1. Open browser → go to **https://github.com/settings/tokens**
2. Log in if prompted
3. In the left sidebar, click **"Tokens (classic)"**
4. Click **"Generate new token"** → choose **"Generate new token (classic)"**
5. Fill in:
   - **Note:** `promptwars-antigravity`
   - **Expiration:** `7 days`
   - **Scopes:** check ✅ `repo` (full control of private repositories)
6. Click **"Generate token"**
7. **COPY the token NOW** (starts with `ghp_...`) — GitHub never shows it again!
8. Save it:
   - On your phone (notes app)
   - In a text file on your desktop (delete after competition)

---

## 3. Create Supabase Account & Project

1. Go to **https://supabase.com** → click **"Start your project"**
2. Click **"Continue with GitHub"** (signs up using your GitHub account)
3. Authorize the Supabase app when GitHub asks
4. Once on the Dashboard, click **"New Project"**
5. Fill in:
   - **Name:** `promptwars` (or any name — you can create a fresh one during competition)
   - **Database Password:** generate a strong one → **SAVE IT**
   - **Region:** `South Asia (Mumbai) - ap-south-1` ← closest to Ahmedabad
   - **Plan:** Free (already selected)
6. Click **"Create new project"** → wait ~2 minutes
7. Once ready, go to **Settings** (gear icon, bottom-left) → **API**
8. Copy and save:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon / public key:** `eyJhbGci...` (safe for frontend)

> **Tip:** You can also create a fresh Supabase project ON competition day (takes 2 min). But having the account ready saves time.

---

## 4. Set Up MCP Servers

### 4A. Open the config file
Navigate to: `C:\Users\shahd\.gemini\config\mcp_config.json`

If you followed the instructions, this file should already exist with 4 servers.

### 4B. Paste your GitHub PAT
Open `mcp_config.json` and replace `ghp_PASTE_YOUR_ACTUAL_TOKEN_HERE` with your actual token.

### 4C. Restart Antigravity IDE
1. Close Antigravity completely
2. Reopen it

### 4D. Verify MCP servers are loaded
1. Click the **"..."** menu → **"MCP Server"** or **"Manage MCP Servers"**
2. You should see 4 servers: `sequential-thinking`, `github`, `supabase`, `stitch`

### 4E. Test each server
Open a new Antigravity chat and run these tests:

| Test | Prompt to Send | Success Looks Like |
|---|---|---|
| Sequential Thinking | "Use sequential thinking to plan a hello world app" | Agent uses `sequentialthinking` tool with structured steps |
| GitHub | "Use GitHub MCP to list my repos" | Your GitHub repos are listed |
| Supabase | "Use Supabase MCP to list my projects" | Your `promptwars` project appears |
| Stitch | "Use Stitch to generate a dark-mode login card" | Generated HTML/CSS code appears |

> **If a test fails:** Don't panic. The prompts are designed to fall back to manual approaches. MCPs are a speed boost, not a requirement.

---

## 5. Pre-warm npm Packages (saves ~60 seconds during competition)

Run this in any terminal (then delete the `test-warmup` folder):

```powershell
npx -y create-next-app@latest test-warmup --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
Remove-Item -Recurse -Force test-warmup
```

This caches the Next.js template so `create-next-app` is instant during competition.

---

## 6. Workspace Setup

- [ ] Copy the `promptwars_2/` folder into your Antigravity workspace
- [ ] Open Antigravity → verify the agent can read `common_agents_creation_doc.md`
- [ ] Double-check the dashboard preview: open `common_agents_prompts/progress_dashboard_preview.html`

---

## 7. On Your Phone (quick access during competition)

- [ ] Timer app ready for 4-hour countdown
- [ ] Cheat-sheet screenshot or printout
- [ ] GitHub PAT saved
- [ ] Supabase Project URL + anon key saved
- [ ] Supabase database password saved

---

## 8. Mental Prep

- **You are NOT coding.** You are a CEO watching your AI team build.
- **Only intervene** for `[DECISION NEEDED]` / `[SECRET NEEDED]` / `[APPROVAL NEEDED]`
- **If stuck >5 minutes** on anything → tell the agent to skip it and move on
- **When the problem is revealed:** take 2 minutes to read it yourself, then decide:
  - Web app → **Next.js + Supabase** (default, say nothing special)
  - Data/ML heavy → tell agent: **"Switch to Python + Streamlit"**
- **If the agent's UI looks basic:** tell it "Stop adding features. Spend 15 min on visual polish per §6.5."

---

## 🏁 Competition Day Quick Reference (June 13)

### Before Timer Starts
1. Open Antigravity IDE → verify MCPs in settings
2. Have cheat-sheet on phone / printed
3. Have `common_agents_creation_doc.md` open and ready

### When Problem Statement is Revealed
1. Read it yourself (2 min)
2. Decide: web app → Next.js (default) · data/ML → "Switch to Streamlit"
3. Paste problem into §12 of `common_agents_creation_doc.md`
4. Send the Kickoff Prompt (§11)
5. Sit back and watch. Answer only `[DECISION/SECRET/APPROVAL NEEDED]`.

### Emergency Responses

| Problem | What to Say |
|---|---|
| MCP fails | "Skip [name] MCP. Do it manually. Don't waste time." |
| Agent is looping | "Cut this feature. Move to the next acceptance criterion." |
| UI looks ugly | "Stop features. 15 min on visual polish. Use shadcn/ui for everything." |
| Nothing works at hour 3 | "Ship what we have. Pitch the vision, not just what's built." |
| Supabase won't connect | "Use Prisma + SQLite instead. Local database." |
| Wrong stack used | "STOP. We're using Next.js + Supabase. Restart this component." |
| WiFi dies | "Use SQLite locally. Skip deploy. We'll demo from localhost." |
