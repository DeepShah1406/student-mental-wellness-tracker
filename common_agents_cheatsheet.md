---
aliases: [Antigravity Contest Cheat-Sheet]
tags: [antigravity, multi-agent, hackathon, cheatsheet]
---

# Contest Cheat-Sheet - Antigravity Multi-Agent Build (1 page)

> Full playbook: [[common_agents_creation_doc]] · Agent prompts: `common_agents_prompts/`

## The loop (memorise this)
```
RESEARCH -> ARCHITECT -> [ DATABASE | BACKEND | FRONTEND ]  (contract-first, parallel)
   -> QA -> REVIEWER --(not ready & time left)--> back to ARCHITECT/RESEARCH
                     --(ready OR time up)-------> DOCS + PITCH
GIT commits at every green milestone · DASHBOARD shows it all live
ORCHESTRATOR holds the clock + talks to you the whole time
```

## 4-hour timeline (cut build scope before QA or pitch)
| Time | Phase | Done when |
|---|---|---|
| 0:00-0:03 | MCP health check | All 4 MCP servers verified; GitHub repo created |
| 0:03-0:18 | Frame (Research + Sequential Thinking MCP) | SPEC + testable acceptance criteria |
| 0:18-0:35 | Design + scaffold | PLAN + frozen API_CONTRACT; Next.js app runs; Supabase tables created; dashboard live |
| 0:35-0:55 | Thin vertical slice | ONE end-to-end path works |
| 0:55-2:20 | Build out | all must-have criteria implemented |
| 2:20-3:00 | QA + iterate (loop) | criteria pass; 0 critical bugs |
| 3:00-3:30 | Polish + deploy | Vercel deployed; UI premium per §6.5 |
| 3:30-4:00 | Docs + pitch | README + 60-90s demo script + pitch outline |

## Default stack
**Next.js + Supabase + Vercel + shadcn/ui.** Switch to Python + Streamlit ONLY if you explicitly say so (for data/ML problems).

## MCP servers (pre-configured)
Sequential Thinking (reasoning) · GitHub (repo+push) · Supabase (DB+auth) · Stitch (UI generation). If any fails → agents fall back to manual. Don't stall.

## The team (one line each)
Orchestrator (conductor) · Research (spec) · Architect (plan + API contract) · Database (schema+seed via Supabase MCP) · Backend (APIs) · Frontend (UI via Stitch MCP) · QA (test+bugs) · Reviewer (ready? change-list) · Docs/Pitch · Git (GitHub MCP) · **Dashboard (live progress UI)**.

## When the agents stop you (only these)
`[DECISION NEEDED]` scope/stack trade-off · `[SECRET NEEDED]` key/credential · `[APPROVAL NEEDED]` deploy/push/spend. Everything else: they decide with a stated default. If you don't reply in ~3 min, they proceed.

## Definition of Done
[ ] all must-have criteria PASS (verified live) · [ ] end-to-end demo works on seed data · [ ] no crashes, graceful errors · [ ] deployed Vercel URL / one-command run · [ ] UI premium per §6.5 · [ ] committed + pushed via GitHub MCP · [ ] TESTING.md documents H2S evaluation · [ ] demo script + pitch ready.

## Final 30 min (Orchestrator runs at 3:30)
Re-verify demo path live · seed data fills every screen · no console errors · README runs clean · latest commit pushed, no secrets · Vercel URL works · 60-90s demo script + roadmap (frame cut scope) rehearsed once.

## KICKOFF PROMPT (paste to start)
> You are the Orchestrator in `common_agents_creation_doc`. Use it as your manual and the PROBLEM STATEMENT as the goal. 4 hours. **MCP servers ready:** Sequential Thinking, GitHub, Supabase, Stitch. **Default stack: Next.js + Supabase + Vercel + shadcn/ui.** Start: MCP health check (30s) → spawn Research → SPEC → Architect → PLAN + API_CONTRACT → Git creates GitHub repo via MCP → DB creates Supabase tables via MCP → run the build loop (DB ∥ Backend ∥ Frontend via Stitch → QA → Reviewer → iterate), pushing via GitHub MCP at every green milestone. Visual polish per §6.5 is a must-have. When Done → deploy to Vercel → docs + pitch. Operate autonomously; decide with sensible defaults; report after each phase; only pause me for [DECISION/SECRET/APPROVAL NEEDED]. Go.

## Quick decision when problem is revealed
- **Web app / platform / tool?** → use default (Next.js + Supabase). Say nothing extra.
- **Data/ML/analytics/dashboard?** → tell agent: *"Switch to Python + Streamlit."*

## If you're hand-holding
Tell it: *"Act autonomously. Only stop me for [DECISION/SECRET/APPROVAL NEEDED]."*
