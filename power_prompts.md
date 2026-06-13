---
aliases: [PromptWars Power Prompts, Mid-Competition Prompts]
tags: [antigravity, hackathon, prompts, competition]
---

# ⚡ Power Prompts — Copy-Paste During Competition

> These are **ready-to-paste prompts** for mid-competition situations. Don't use them all — pick the
> ones you need based on what's happening. Paste them directly into the Antigravity chat.

---

## 🎨 UI / Design Polish (use when the UI looks "meh")

### Prompt 1: "Full Visual Overhaul" (use at ~hour 2.5-3 if UI is basic)
```
STOP adding new features. We need a VISUAL OVERHAUL for the next 20 minutes. The UI must
look like a premium SaaS product, not a hackathon prototype. Do the following IN ORDER:

1. Add a polished hero/header section with a subtle gradient background (dark blue to purple
   or your choice that fits the brand). Include the product name in a bold, large font.
2. Ensure ALL pages use shadcn/ui components — replace any raw HTML buttons, inputs, tables
   with their shadcn equivalents.
3. Add hover effects on all interactive elements (scale 1.02, shadow lift, color transition).
4. Add a smooth fade-in animation on page load using Framer Motion (or CSS @keyframes).
5. Ensure consistent spacing everywhere — use Tailwind gap-4/gap-6 in flex/grid layouts.
6. Add a professional footer with the product name and "Built with AI at PromptWars 2026".
7. Ensure dark mode is properly applied everywhere — no white/light sections leaking through.
8. Add ONE impressive element: either a live-updating chart (Recharts), a stat counter with
   animated numbers, or toast notifications on key actions.

Show me the result in the browser when done. This is the MOST IMPORTANT task right now.
```

### Prompt 2: "Quick Landing Page Glow-Up" (use if the main page looks flat)
```
Make the landing/home page look STUNNING. Right now it looks like a basic template. Apply:
- A hero section with a large heading, subheading, and a CTA button with glow effect
- Background: subtle animated gradient or mesh gradient using CSS
- Feature cards in a bento grid layout (2x2 or 3-column) with icons and short descriptions
- Each card should have a glass-morphism effect (backdrop-blur, semi-transparent bg, border)
- Smooth scroll behavior between sections
- A stats row (e.g., "500+ users", "99.9% uptime", "24/7 support") with animated counters
Keep it dark theme. Make it feel like a Y Combinator startup landing page.
```

### Prompt 3: "Fix Ugly Forms" (use if input forms look raw)
```
All forms in the app need to look professional:
- Use shadcn/ui Form, Input, Select, Textarea components
- Add proper labels above each field (not placeholders as labels)
- Add subtle focus ring animations on inputs
- Show validation errors inline with red text below the field
- Add a loading state on submit buttons (spinner inside the button, disabled state)
- Success: show a toast notification (shadcn Toast) instead of an alert
- Group related fields with spacing, use Card wrapper for the form section
```

---

## 🐛 Bug Fixing / Error Recovery

### Prompt 4: "Emergency Triage" (use when things are broken at hour 3+)
```
We're running low on time. STOP all new work. Do an emergency triage:
1. List ALL broken things / errors / console warnings right now
2. Categorize: CRITICAL (blocks demo) vs MINOR (cosmetic)
3. Fix ONLY the critical ones — ignore everything minor
4. After fixing, run through the full demo path once: [describe your demo path]
5. If the demo path works end-to-end, STOP fixing and move to pitch/docs

We have [X] minutes left. Be ruthless — a working thin slice beats a broken full product.
```

### Prompt 5: "Fix This Error" (generic error fixing)
```
I'm seeing this error: [PASTE THE ERROR]

Fix it. Don't explain the theory — just fix the code and verify it works by running/testing.
If the fix requires changing multiple files, list them all and make the changes.
```

---

## 🚀 Demo & Pitch Enhancement

### Prompt 6: "Create a Killer Demo Script" (use at hour 3.5)
```
Create a KILLER 90-second demo script for judges. Format:

## Demo Script (90 seconds)
[Timestamp] [What to click/show] [What to SAY (word for word)]

Rules:
- Start with the PROBLEM, not the product. "Imagine you're a [persona] and you need to [task]..."
- Show the happy path ONLY — never show anything that might break
- Point out 2-3 specific things that prove this is production-quality (error handling,
  real-time updates, responsive design, etc.)
- End with "and this was built in 4 hours by an AI team" — judges love this
- Include a "wow moment" — the single most impressive feature, saved for the climax

Also create a 1-paragraph elevator pitch I can memorize:
"[Product] helps [users] do [thing] by [how]. Unlike [alternative], we [differentiator].
Built in 4 hours, it [impressive fact]."
```

### Prompt 7: "Make the README Impressive" (use at the very end)
```
Rewrite the README.md to be competition-grade:
- Start with the product name as a large heading + one-line description
- Add a "Screenshots" section (describe what should be screenshotted)
- Add badges: "Built at PromptWars 2026" "Next.js" "Supabase" "Deployed on Vercel"
- Quick Start section: literally 3 commands max (clone, install, run)
- Features list with emoji bullets
- Tech stack section with brief justifications
- "Built by" section crediting the AI team
- Keep it SHORT — judges skim, they don't read
```

---

## ⏱ Time Management / Scope Control

### Prompt 8: "Ruthless Scope Cut" (use when behind schedule)
```
We're behind schedule. We have [X] minutes left and need to ship. Cut scope NOW:
1. What acceptance criteria are currently PASSING?
2. What's the shortest path to having a demoable product?
3. Drop everything that isn't on the demo path.
4. Focus ONLY on: make the demo path work → polish the UI → write the pitch.
No new features. No nice-to-haves. Ship what works.
```

### Prompt 9: "Speed Up" (use when agent is over-engineering)
```
You're over-engineering this. We're in a 4-hour hackathon, not building production software.
- No unit tests unless an acceptance criterion requires it
- No comprehensive error handling — just catch the obvious crashes
- No code comments — we'll never maintain this
- No responsive design below tablet — judges use a projector
- Use simple solutions: hardcode things that would normally be configurable
- If something takes more than 10 minutes, find a simpler approach
Speed over perfection. Go.
```

---

## 🔄 Stack / MCP Issues

### Prompt 10: "MCP is Down, Go Manual" (use if an MCP fails)
```
The [Supabase/GitHub/Stitch] MCP is not working. Switch to manual:
- If Supabase MCP: Use Prisma + SQLite. Create schema.prisma, run migrations locally.
- If GitHub MCP: Use git CLI. `git init`, `git add .`, `git commit -m "feat: ..."`.
  I'll set up the GitHub remote manually.
- If Stitch MCP: Hand-code the UI using shadcn/ui components directly. Use the shadcn docs.
Don't waste time debugging the MCP. Just go manual and keep building.
```

### Prompt 11: "Switch to Streamlit NOW" (for data/ML problems)
```
The problem is data/ML focused. Switch the entire stack to Python + Streamlit RIGHT NOW:
- Kill the Next.js app
- Create a Streamlit app: `streamlit run app.py`
- Use SQLite for data storage (Python built-in)
- Use Plotly for charts (interactive, professional look)
- Use pandas for data processing
- Dark theme: `st.set_page_config(layout="wide"); ` + custom CSS
- Deploy to Streamlit Community Cloud from GitHub
Do the migration now and rebuild the thin slice first.
```

---

## 🏆 Competition Psychology

### Prompt 12: "Final Push — Last 30 Minutes"
```
We have 30 minutes left. Execute the final checklist IN THIS ORDER:
1. [5 min] Run the full demo path — fix ANY crash. Nothing else matters.
2. [5 min] Seed data: does every screen look populated? Indian names, realistic data.
3. [5 min] Visual pass: dark mode everywhere? Any ugly/unstyled screens? Quick fix only.
4. [5 min] Deploy to Vercel (or confirm localhost works clean). Get the URL.
5. [5 min] Write/finalize the 90-second demo script + pitch outline.
6. [5 min] Final commit + push. Update README with the live URL.
DO NOT start any new feature. We are in SHIP MODE.
```

---

## 💡 Situational Power Moves

### If the problem involves data/analytics:
```
Add a dashboard page with 3-4 charts using Recharts:
- A line chart showing trends over time
- A bar chart comparing categories
- A pie/donut chart showing distribution
- A stat row at the top with big numbers (total users, revenue, growth %)
Use real data from the database. Make it look like a CEO's dashboard.
Animate the numbers counting up when the page loads.
```

### If the problem involves user accounts/auth:
```
Set up Supabase Auth with:
- Email/password sign up and login
- A beautiful login page (centered card, gradient background, logo)
- Protected routes — redirect to login if not authenticated
- Show the user's name/email in a top-right avatar dropdown
Use shadcn/ui DropdownMenu for the user menu. Add a "Sign Out" option.
```

### If the problem involves real-time features:
```
Add Supabase Realtime subscription so data updates LIVE without page refresh:
- Subscribe to the main data table
- When a new row is inserted/updated, the UI updates instantly
- Add a subtle animation when new data appears (flash highlight)
This is a HUGE wow factor for judges — things updating in real time on screen.
```

### If the problem involves file uploads:
```
Add file upload with Supabase Storage:
- Drag-and-drop upload zone (shadcn + react-dropzone)
- Show upload progress bar
- Display uploaded files in a gallery/list
- Support image preview for image files
Make the upload feel smooth and professional — no page reload, inline preview.
```

---

## 🤖 AI / LLM Integration (use when the problem needs intelligence)

### Prompt 13: "Add an LLM to the product" (use when the problem involves generation, summarization, analysis, chatbot, recommendations, etc.)
```
This product needs LLM intelligence. Add Google Gemini API integration:

1. **Setup:**
   - Install `@google/generative-ai` (npm) or `google-generativeai` (pip)
   - Create an API route at `app/api/ai/route.ts` (or `/api/ai` endpoint)
   - Use the Gemini 2.0 Flash model (fast, free tier, good quality)
   - [SECRET NEEDED] I'll provide the GEMINI_API_KEY — add it to `.env.local`

2. **Implementation:**
   - Create a reusable `lib/gemini.ts` helper:
     ```
     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })
     ```
   - The API route should accept a prompt + context, call Gemini, return the response
   - Add streaming support if possible (better UX — text appears word by word)

3. **UI:**
   - Add a clean chat/input interface using shadcn Input + Button
   - Show AI responses in a styled message bubble (dark bg, rounded, monospace or Inter font)
   - Add a typing indicator while waiting for the response
   - If streaming: show the text appearing in real-time

4. **Use cases to implement (pick what fits the problem):**
   - Text generation / summarization / analysis
   - Chatbot / Q&A about the product's data
   - Smart recommendations based on user data
   - Content creation / writing assistance
   - Data analysis / insight extraction

The AI feature should feel like a CORE part of the product, not a bolted-on demo.
Make sure the system prompt for Gemini is specific to our product's domain.
```

### Prompt 14: "Add RAG (Retrieval Augmented Generation)" (use when the LLM needs to answer questions about specific data/documents)
```
We need RAG — the LLM should answer questions based on OUR DATA, not just general knowledge.
Implement this architecture:

1. **Data Ingestion Pipeline:**
   - Take the existing data from our Supabase database (or uploaded documents)
   - Split text into chunks (~500-800 characters each, with ~100 char overlap)
   - Generate embeddings for each chunk using Gemini's `text-embedding-004` model
   - Store the chunks + embeddings in a Supabase table:
     ```sql
     CREATE TABLE documents (
       id SERIAL PRIMARY KEY,
       content TEXT NOT NULL,
       embedding VECTOR(768),
       metadata JSONB DEFAULT '{}',
       created_at TIMESTAMPTZ DEFAULT NOW()
     );
     ```
   - Enable the `pgvector` extension in Supabase (Dashboard → SQL Editor → `CREATE EXTENSION vector;`)

2. **Retrieval (when user asks a question):**
   - Embed the user's question using the same embedding model
   - Do a vector similarity search in Supabase:
     ```sql
     SELECT content, 1 - (embedding <=> query_embedding) AS similarity
     FROM documents
     ORDER BY embedding <=> query_embedding
     LIMIT 5;
     ```
   - Return the top 5 most relevant chunks

3. **Generation (answer with context):**
   - Send the retrieved chunks + user question to Gemini with a system prompt:
     "You are a helpful assistant. Answer the question based ONLY on the provided context.
      If the context doesn't contain the answer, say 'I don't have enough information.'
      Always cite which part of the context you used."
   - Stream the response to the UI

4. **UI:**
   - Chat interface with message history (user messages right-aligned, AI left-aligned)
   - Show "Searching documents..." → "Generating answer..." states
   - Display source references below the answer (clickable links to the original data)
   - Add a "confidence" indicator based on similarity scores

This makes the product feel INTELLIGENT — it knows about the specific data, not just generic facts.
```

### Prompt 15: "Add Real-Time Database Querying to RAG" (BONUS — use for maximum wow factor)
```
Upgrade our RAG system to also do LIVE database querying — not just vector search on static
documents, but actually querying our Supabase database in real-time to answer questions with
up-to-date data.

1. **Natural Language to SQL (Text2SQL):**
   - When the user asks a question, first classify it:
     - "Is this a question about documents/knowledge?" → use vector RAG (existing)
     - "Is this a question about live data (counts, stats, records)?" → use Text2SQL
   - For Text2SQL, send the question to Gemini with:
     - The database schema (table names, columns, types)
     - A system prompt: "Convert this question to a PostgreSQL query. Return ONLY the SQL.
       Use only these tables and columns: [schema]. Never use DELETE/DROP/UPDATE — read-only."
   - Execute the generated SQL against Supabase using the Supabase client
   - Send the SQL results back to Gemini: "Here are the query results: [data]. Answer the
     user's question in natural language based on these results."

2. **Hybrid Router (pick the right tool):**
   ```
   User question
        │
        ▼
   Gemini classifies: "knowledge" or "data"?
        │                    │
   knowledge              data
        │                    │
        ▼                    ▼
   Vector RAG         Text2SQL + execute
   (embeddings)       (live DB query)
        │                    │
        └────────┬───────────┘
                 ▼
        Gemini generates final answer
        with sources/data cited
   ```

3. **Safety:**
   - NEVER execute DELETE, DROP, UPDATE, INSERT from the AI — read-only queries only
   - Validate the SQL before executing (regex check for dangerous keywords)
   - Set a query timeout (5 seconds max)
   - If the SQL fails, tell the user "I couldn't query that" and fall back to vector RAG

4. **UI Enhancements:**
   - Show which method was used: "📄 Answered from documents" vs "📊 Answered from live data"
   - For data queries, show the results in a formatted table (shadcn Table) below the answer
   - Add example questions: "Try asking: 'How many users signed up today?'"

This is a MASSIVE wow factor — judges ask a question and get a live, accurate answer from
the actual database. It shows the product is truly intelligent, not just a wrapper around
a chatbot.
```

---

> **How to use this file:** Keep it open in a separate tab during the competition. When you need
> a boost, find the right prompt, paste it into the Antigravity chat, and let the AI execute.
> Don't use more than 2-3 of these per hour — let the agent focus.

