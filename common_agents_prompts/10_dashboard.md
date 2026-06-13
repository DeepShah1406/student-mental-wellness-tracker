---
tags: [antigravity, agent, dashboard, progress-ui]
---
# Agent: Dashboard / Progress (live build view)
> Shared rules + schemas: [[_README]] · Playbook: [[common_agents_creation_doc]]

**ROLE:** Build + maintain a **live web dashboard** that visualizes the whole team's progress in real time. (ReAct.)
**OBJECTIVE:** One self-contained **HTML + CSS + Bootstrap** page that auto-refreshes (~2s) and shows: product name, problem summary, a **4-hour countdown**, overall progress, **each agent's live status + current task**, acceptance criteria X/Y, critical bugs, ship decision, a **live activity feed**, and the **commit log**. It serves two audiences: (a) the human watching progress, and (b) the **pitch judges** - so make it look great on a projector.
**CONTEXT:** Every agent writes to `/_agents/state.json` (schema in [[_README]]). You create `/_agents/dashboard.html` that reads that file every 2s and re-renders.
**RULES:**
- Self-contained (Bootstrap + Bootstrap Icons via CDN). Dark theme, clean, presentable.
- **Stand this up EARLY** (Design phase) so progress is visible from ~0:30. Seed an empty `state.json` skeleton first so the page renders immediately.
- `file://` fetch of `state.json` is usually blocked by browsers - **serve the folder over http** (e.g. `cd /_agents && python3 -m http.server 4321`) so `dashboard.html` and `state.json` are same-origin. Give the Orchestrator the URL (`http://localhost:4321/dashboard.html`) for its status block.
- Don't block other agents; this is a side artifact.
**PROCESS (ReAct):** drop in the template below → seed `state.json` → start the static server → ensure every agent updates `state.json` on each status change → open the page and confirm it animates live.
**OUTPUT:** a working, auto-refreshing dashboard URL.
**STATE:** add yourself to `agents[]`; append activity ("dashboard live at <url>").
**SELF-CHECK (Reflexion):** "If I open this URL now, do I see agents flipping status live, and would it impress a judge on the projector?"

---

### Drop-in template → save as `/_agents/dashboard.html`
```html
<!doctype html>
<html lang="en" data-bs-theme="dark">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Build Progress</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
  <style>
    body{background:radial-gradient(1200px 600px at 20% -10%, #16204a 0%, #0b1020 60%);min-height:100vh}
    .glass{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:1rem}
    .agent-working{box-shadow:0 0 0 2px rgba(13,110,253,.45);animation:pulse 1.4s infinite}
    @keyframes pulse{0%{box-shadow:0 0 0 0 rgba(13,110,253,.4)}70%{box-shadow:0 0 0 12px rgba(13,110,253,0)}100%{box-shadow:0 0 0 0 rgba(13,110,253,0)}}
    .feed{max-height:320px;overflow:auto}.mono{font-family:ui-monospace,Menlo,monospace}
  </style>
</head>
<body class="text-light">
<div class="container-fluid py-4" style="max-width:1400px">
  <div class="d-flex flex-wrap justify-content-between align-items-center mb-3">
    <div><h3 class="mb-0"><i class="bi bi-cpu-fill text-info"></i> <span id="product">Waiting for the team to start...</span></h3>
      <div class="text-secondary" id="problem"></div></div>
    <div class="text-end"><div class="display-5 mono fw-bold" id="timer">--:--</div>
      <div class="small text-secondary">remaining · <span id="phase" class="badge text-bg-primary">-</span></div></div>
  </div>
  <div class="progress mb-4" style="height:.5rem"><div id="overall" class="progress-bar bg-success" style="width:0%"></div></div>
  <div class="row g-3 mb-4">
    <div class="col-6 col-md-3"><div class="glass p-3"><div class="text-secondary small">ACCEPTANCE CRITERIA</div><div class="h4 mb-1" id="acc">0/0</div><div class="progress" style="height:.4rem"><div id="accbar" class="progress-bar bg-info" style="width:0%"></div></div></div></div>
    <div class="col-6 col-md-3"><div class="glass p-3"><div class="text-secondary small">CRITICAL BUGS</div><div class="h3 mb-0"><span id="bugs" class="badge text-bg-success">0</span></div></div></div>
    <div class="col-6 col-md-3"><div class="glass p-3"><div class="text-secondary small">SHIP DECISION</div><div class="h4 mb-0"><span id="ship" class="badge text-bg-secondary">pending</span></div></div></div>
    <div class="col-6 col-md-3"><div class="glass p-3"><div class="text-secondary small">LIVE DEMO</div><a id="demo" class="btn btn-sm btn-outline-info disabled mt-1" target="_blank">not yet</a></div></div>
  </div>
  <h6 class="text-secondary text-uppercase small mb-2">The AI team</h6>
  <div class="row g-3 mb-4" id="agents"></div>
  <div class="row g-3">
    <div class="col-lg-7"><div class="glass p-3"><h6 class="text-secondary text-uppercase small"><i class="bi bi-activity"></i> Live activity</h6><div class="feed" id="feed"></div></div></div>
    <div class="col-lg-5"><div class="glass p-3"><h6 class="text-secondary text-uppercase small"><i class="bi bi-git"></i> Commits</h6><div class="feed mono" id="commits"></div></div></div>
  </div>
  <div class="text-secondary small mt-3">auto-refresh 2s · last update <span id="updated">-</span></div>
</div>
<script>
const ST={idle:["secondary","bi-pause-circle"],working:["primary","bi-gear-fill"],done:["success","bi-check-circle-fill"],blocked:["danger","bi-exclamation-triangle-fill"]};
const esc=x=>(x??"").toString().replace(/[<>&]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;"}[c]));
const rel=t=>{if(!t)return"";const s=Math.round((Date.now()-new Date(t))/1000);return s<60?s+"s ago":Math.round(s/60)+"m ago";};
async function tick(){
  let s; try{s=await (await fetch("state.json?_="+Date.now())).json();}catch(e){return;}
  product.textContent=s.product_name||"Building..."; problem.textContent=s.problem_summary||"";
  phase.textContent=s.phase||"-";
  if(s.deadline_at){let ms=new Date(s.deadline_at)-Date.now(),m=Math.max(0,Math.floor(ms/60000)),ss=Math.max(0,Math.floor(ms/1000)%60);timer.textContent=(m<10?"0":"")+m+":"+(ss<10?"0":"")+ss;timer.className="display-5 mono fw-bold "+(ms<15*60000?"text-danger":ms<45*60000?"text-warning":"text-light");}
  let a=s.acceptance||{passing:0,total:0},pct=a.total?Math.round(100*a.passing/a.total):0;
  acc.textContent=a.passing+"/"+a.total; accbar.style.width=pct+"%"; accbar.className="progress-bar bg-"+(pct==100?"success":"info"); overall.style.width=pct+"%";
  bugs.textContent=s.critical_bugs??0; bugs.className="badge text-bg-"+((s.critical_bugs??0)>0?"danger":"success");
  ship.textContent=s.ship_decision||"pending"; ship.className="badge text-bg-"+({ship:"success",iterating:"warning",pending:"secondary"}[s.ship_decision]||"secondary");
  if(s.demo_url){demo.href=s.demo_url;demo.textContent="Open demo ↗";demo.classList.remove("disabled");}
  agents.innerHTML=(s.agents||[]).map(g=>{let[c,ic]=ST[g.status]||ST.idle;return '<div class="col-6 col-md-4 col-xl-3"><div class="glass p-3 h-100 '+(g.status=="working"?"agent-working":"")+'"><div class="d-flex justify-content-between align-items-center"><strong>'+esc(g.name)+'</strong><span class="badge text-bg-'+c+'"><i class="bi '+ic+'"></i> '+esc(g.status)+'</span></div><div class="small text-secondary mt-2">'+(esc(g.task)||"&nbsp;")+'</div><div class="small text-secondary mt-2">'+rel(g.updated_at)+'</div></div></div>';}).join("");
  feed.innerHTML=(s.activity||[]).slice(0,40).map(e=>'<div class="border-bottom border-secondary-subtle py-1 small"><span class="badge text-bg-dark me-1">'+esc(e.agent)+'</span>'+esc(e.msg)+' <span class="text-secondary">· '+rel(e.ts)+'</span></div>').join("");
  commits.innerHTML=(s.commits||[]).slice(0,20).map(c=>'<div class="py-1 small"><span class="text-info">'+esc(c.sha)+'</span> '+esc(c.msg)+' <span class="text-secondary">· '+rel(c.ts)+'</span></div>').join("");
  updated.textContent=new Date().toLocaleTimeString();
}
tick(); setInterval(tick,2000);
</script>
</body></html>
```

### Seed `/_agents/state.json` first (so the page renders immediately)
```json
{
  "product_name": "Initializing...", "problem_summary": "",
  "started_at": null, "deadline_at": null, "phase": "Frame",
  "demo_url": null, "acceptance": {"passing":0,"total":0}, "critical_bugs": 0,
  "ship_decision": "pending",
  "agents": [
    {"id":"orchestrator","name":"Orchestrator","status":"working","task":"booting the team","updated_at":null},
    {"id":"research","name":"Research","status":"idle","task":"","updated_at":null},
    {"id":"architect","name":"Architect","status":"idle","task":"","updated_at":null},
    {"id":"database","name":"Database","status":"idle","task":"","updated_at":null},
    {"id":"backend","name":"Backend","status":"idle","task":"","updated_at":null},
    {"id":"frontend","name":"Frontend","status":"idle","task":"","updated_at":null},
    {"id":"qa","name":"QA","status":"idle","task":"","updated_at":null},
    {"id":"reviewer","name":"Reviewer","status":"idle","task":"","updated_at":null},
    {"id":"docs","name":"Docs/Pitch","status":"idle","task":"","updated_at":null},
    {"id":"git","name":"Git/DevOps","status":"idle","task":"","updated_at":null},
    {"id":"dashboard","name":"Dashboard","status":"done","task":"live","updated_at":null}
  ],
  "activity": [], "commits": []
}
```
