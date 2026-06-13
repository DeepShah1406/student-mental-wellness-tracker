---
aliases: [Antigravity Agent Prompts - index]
tags: [antigravity, multi-agent, prompt-engineering]
---

# common_agents_prompts - individual agent system prompts

Load these into Antigravity 2.0 **one per agent** (its Agent Manager / sub-agent slot). Each file is a self-contained system prompt. The shared rules, schemas, and time budget live here in this README, so load this README into the **Orchestrator** (or the shared/global context) first.

> Full playbook: [[common_agents_creation_doc]] · 1-page cheat-sheet: [[common_agents_cheatsheet]]

## Load order
1. `_README.md` (shared context - give to the Orchestrator / global rules)
2. `00_orchestrator.md`  ← boots everything
3. `01_research.md` → `02_architect.md` → `03_database.md` → `04_backend.md` → `05_frontend.md` → `06_qa.md` → `07_reviewer.md` → `08_documentation_pitch.md` → `09_git_devops.md`
4. `10_dashboard.md` (stand up early - phase "Design + scaffold")

## Shared operating rules (every agent obeys)
- **4-hour time box.** Ship vertical slices, not horizontal layers. MVP-first. Ruthless scope control.
- **Be honest** - never claim a failing test passed; label mocked parts.
- **Autonomy** - decide with sensible defaults; pause the human ONLY for `[DECISION NEEDED]` / `[SECRET NEEDED]` / `[APPROVAL NEEDED]`.
- **Every agent prompt = CARE skeleton + Reflexion self-check:** Role → Context → Ask/Objective → Rules → (Examples) → think step-by-step (CoT) → act one tool at a time (ReAct) → produce the hand-off artifact → **self-critique vs the Ask before handing off.**
- **MCP-first, code-second:** if a task can be done via MCP (Supabase, GitHub, Stitch, Sequential Thinking), use MCP. If MCP is down, log it and fall back to manual.
- **Default stack:** Next.js + Supabase + Vercel + shadcn/ui. Only switch to Python + Streamlit if the human says so.
- **Visual polish per §6.5 is mandatory** — dark mode, shadcn/ui components, micro-animations, one "wow moment."
- Keep artifacts/state in `/_agents/` so nothing is lost.

## Hand-off artifact schemas (structured output)
```
<SPEC> problem_summary · primary_users · core_jobs · mvp_scope[] · out_of_scope[] ·
       acceptance_criteria[given/when/then] · risks[]
<PLAN> stack{fe,be,db,host} · repo_structure · data_model · milestones[->criterion]
<API_CONTRACT> endpoints[{method,path,request,response,errors}]
<DB_ARTIFACT> schema_location · migrate_cmd · seed_cmd · row_counts
<TEST_REPORT> results[{criterion,PASS/FAIL,evidence}] · bugs[{severity,where,repro,cause}] · coverage X/Y
<CHANGE_LIST> ship:NO · reason · changes[{what,why,owner,est_min}] · scope_cuts[]
<SHIP> ship:YES · evidence · known_gaps[]
<DOCS> readme · api_docs   <PITCH> demo_script(60-90s) · pitch_outline
```

## Shared live-state file (the Dashboard reads this; all agents write to it)
`/_agents/state.json` - every agent updates its own entry + appends to `activity` whenever its status changes. Schema:
```json
{
  "product_name": "string", "problem_summary": "string",
  "started_at": "ISO-8601", "deadline_at": "ISO-8601 (started + 4h)",
  "phase": "Frame|Design|Thin slice|Build out|QA+iterate|Polish|Docs+pitch",
  "demo_url": "string|null",
  "acceptance": { "passing": 0, "total": 0 },
  "critical_bugs": 0,
  "ship_decision": "pending|iterating|ship",
  "agents": [
    { "id": "research", "name": "Research", "status": "idle|working|done|blocked",
      "task": "what it's doing right now", "updated_at": "ISO-8601" }
  ],
  "activity": [ { "ts": "ISO-8601", "agent": "id", "msg": "human-readable event" } ],
  "commits": [ { "sha": "short", "msg": "conventional commit", "ts": "ISO-8601" } ]
}
```

## Definition of Done (the Reviewer gate)
must-have criteria PASS (live) · end-to-end demo on seed data · no crashes · one-command run / live URL · presentable UI · committed (pushed if remote) · demo script + pitch ready.

## Prompt-engineering frameworks in play
CARE (skeleton) · CO-STAR (pitch/docs/UI copy) · TCREI (iterate loop) · ReAct (tool agents) · Reflexion/self-critique (every hand-off) · Chain-of-Thought (planning/debug) · Plan-and-Execute (orchestrator) · Least-to-most (thin slice) · Self-Consistency (reviewer) · structured XML/JSON hand-offs · multi-shot examples · explicit guardrails.

## MCP servers available (pre-configured)
- **Sequential Thinking** — structured reasoning scratchpad (no key needed)
- **GitHub** — create repos, push code, manage issues (PAT configured)
- **Supabase** — create tables, seed data, manage auth (account configured)
- **Stitch** — generate polished UI components from text descriptions (no key needed)

If an MCP is unavailable: log "⚠️ [name] unavailable", fall back to manual, do NOT stall.
