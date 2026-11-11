/* ExamForge IDE — app shell, shared UI pieces, dashboard, syllabus, practice/exam runner */
"use strict";
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = U.esc, md = U.md;

const App = { view: "dashboard", session: null, ui: {}, timers: [] };
const ACT = {}; // delegated click actions: data-act="name"

/* ---------- shared UI ---------- */
function typeset(el) { try { if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise([el]).catch(() => {}); } catch (e) {} }
function toast(msg, kind = "") { const t = document.createElement("div"); t.className = "toast " + kind; t.textContent = msg; $("#toasts").appendChild(t); setTimeout(() => t.remove(), 4200); }
function modal(html, { okText = "OK", cancelText = "Cancel", onOk, wide = false, noOk = false } = {}) {
  const m = document.createElement("div"); m.className = "modal-back";
  m.innerHTML = `<div class="modal ${wide ? "wide" : ""}" role="dialog" aria-modal="true"><div class="modal-body">${html}</div><div class="modal-foot">${cancelText ? `<button class="btn ghost" data-m="cancel">${esc(cancelText)}</button>` : ""}${noOk ? "" : `<button class="btn primary" data-m="ok">${esc(okText)}</button>`}</div></div>`;
  document.body.appendChild(m); typeset(m);
  const close = () => m.remove();
  m.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-m]"); if (!b) { if (e.target === m) close(); return; }
    if (b.dataset.m === "cancel") close();
    if (b.dataset.m === "ok") { if (onOk) { const r = await onOk(m); if (r === false) return; } close(); }
  });
  return m;
}
const confirmDlg = (text, onOk, okText = "Confirm") => modal(`<p>${text}</p>`, { okText, onOk });
const pill = (text, cls = "") => `<span class="pill ${cls}">${esc(text)}</span>`;
const STATUS_LABEL = { "not-started": "Not started", learning: "Learning", practising: "Practising", mastered: "Mastered" };
function statusPill(st) { const s = st.status; const self = st.manual === "mastered" && !st.evidence; return pill(STATUS_LABEL[s] + (self ? " (self-marked)" : ""), "st-" + s + (self ? " st-self" : "")); }
function bar(frac, label = "") { const p = frac == null ? 0 : U.clamp(frac, 0, 1) * 100; return `<div class="bar" title="${esc(label)}"><span style="width:${p}%"></span></div>`; }
function opts(list, sel) { return list.map(([v, l]) => `<option value="${esc(v)}" ${String(v) === String(sel) ? "selected" : ""}>${esc(l)}</option>`).join(""); }
const subjOpts = (sel, any) => opts((any ? [["", "All subjects"]] : []).concat(Store.cfg.subjects.map((s) => [s.id, s.name])), sel);
const cycleOpts = (sel, any) => opts((any ? [["", "All cycles"]] : []).concat(Store.cfg.cycles.map((c) => [c.id, c.name])), sel);
function topicOpts(subject, cycle, sel, any = true) {
  let h = any ? `<option value="">All topics</option>` : "";
  for (const u of Cfg.units(subject, cycle)) { h += `<optgroup label="${esc((cycle ? "" : Cfg.cycle(u.cycle).name + " · ") + u.title)}">` + u.subtopics.map((s) => `<option value="${s.id}" ${s.id === sel ? "selected" : ""}>${esc(s.title)}</option>`).join("") + "</optgroup>"; }
  return h;
}
function typeOptsFor(subject, sel, any = true) {
  const all = Object.keys(TYPE_LABEL); const used = new Set(Cfg.questions({ subject }).map((q) => q.type));
  return opts((any ? [["any", "Any type"]] : []).concat(all.filter((t) => !subject || used.has(t) || t === sel).map((t) => [t, TYPE_LABEL[t]])), sel);
}
const diffOpts = (sel, any = true) => opts((any ? [["any", "Any difficulty"]] : []).concat([["easy", "Easy"], ["medium", "Medium"], ["hard", "Hard"]]), sel);

/* ---------- code editor (textarea with gutter) ---------- */
function editor(id, value, { ro = false, rows = 14, lang = "python" } = {}) {
  return `<div class="ed ${ro ? "ro" : ""}"><pre class="ed-gutter" aria-hidden="true"></pre><textarea id="${id}" class="ed-text" data-lang="${lang}" spellcheck="false" autocapitalize="off" autocomplete="off" rows="${rows}" ${ro ? "readonly" : ""}>${esc(value)}</textarea></div>`;
}
function bindEditors(root) {
  $$(".ed-text", root).forEach((ta) => {
    if (ta._bound) return; ta._bound = true;
    const g = ta.previousElementSibling;
    const upd = () => { const n = ta.value.split("\n").length; g.textContent = Array.from({ length: n }, (_, i) => i + 1).join("\n"); g.scrollTop = ta.scrollTop; };
    upd(); ta.addEventListener("input", upd); ta.addEventListener("scroll", () => { g.scrollTop = ta.scrollTop; });
    ta.addEventListener("keydown", (e) => {
      if (ta.readOnly) return;
      const ind = ta.dataset.lang === "python" ? "    " : "  ";
      const { selectionStart: s, selectionEnd: en, value: v } = ta;
      if (e.key === "Tab") {
        e.preventDefault();
        const ls = v.lastIndexOf("\n", s - 1) + 1;
        if (e.shiftKey) { if (v.slice(ls, ls + ind.length) === ind) { ta.value = v.slice(0, ls) + v.slice(ls + ind.length); ta.selectionStart = ta.selectionEnd = Math.max(ls, s - ind.length); } }
        else { ta.value = v.slice(0, s) + ind + v.slice(en); ta.selectionStart = ta.selectionEnd = s + ind.length; }
        ta.dispatchEvent(new Event("input", { bubbles: true }));
      } else if (e.key === "Enter" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        const ls = v.lastIndexOf("\n", s - 1) + 1; const line = v.slice(ls, s); let lead = line.match(/^\s*/)[0];
        if (/[:{[(]\s*$/.test(line)) lead += ind;
        ta.value = v.slice(0, s) + "\n" + lead + v.slice(en); ta.selectionStart = ta.selectionEnd = s + 1 + lead.length;
        ta.dispatchEvent(new Event("input", { bubbles: true }));
      } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); const run = ta.closest(".q-work")?.querySelector("[data-act=runCustom], [data-act=webPreview]"); if (run) run.click(); }
    });
  });
}

/* ---------- shell & routing ---------- */
const VIEWS = [
  ["dashboard", "Dashboard", "◧"], ["syllabus", "Syllabus", "☰"], ["practice", "Practice Arena", "✎"], ["exams", "Exam Simulator", "⏱"],
  ["tutor", "AI Tutor", "✦"], ["flashcards", "Flashcards", "▤"], ["mistakes", "Mistake Notebook", "✗"], ["analytics", "Analytics", "▥"], ["exam-setup", "Exam Setup", "⚙"],
];
function renderShell() {
  $("#nav").innerHTML = VIEWS.map(([id, label, ic]) => `<a href="#${id}" class="nav-item ${App.view === id ? "on" : ""}" data-view="${id}"><span class="ic">${ic}</span><span>${label}</span>${id === "mistakes" ? badge(Progress.dueRetests().length) : id === "flashcards" ? badge(Progress.dueCards().length) : ""}</a>`).join("");
  $("#sync").textContent = Store.status; $("#sync").className = "sync " + (Store.mode === "cloud" ? "ok" : "warn");
  $("#ai-state").innerHTML = AI.on ? `<span class="dot ok"></span>Claude connected${AI.mode === "server" ? " (API key)" : ""}` : `<span class="dot"></span>${AI.checked ? "AI unavailable here" : "Checking AI…"}`;
}
const badge = (n) => (n ? `<span class="badge">${n}</span>` : "");
function go(view) { if (location.hash !== "#" + view) location.hash = view; else route(); }
function route() {
  const h = location.hash.replace("#", "") || "dashboard";
  if (h === "session" && !App.session) { location.hash = "dashboard"; return; }
  App.view = VIEWS.some((v) => v[0] === h) || h === "session" ? h : "dashboard";
  App.timers.forEach(clearInterval); App.timers = [];
  renderShell();
  const main = $("#main"); main.scrollTop = 0;
  const fn = { dashboard: viewDashboard, syllabus: viewSyllabus, practice: viewPractice, exams: viewExams, tutor: viewTutor, flashcards: viewCards, mistakes: viewMistakes, analytics: viewAnalytics, "exam-setup": viewSetup, session: viewSession }[App.view];
  main.innerHTML = fn(); afterRender(main);
  if (App.view === "session") { startSessionTimer(); if (!App.session.submittedAt && curItem().q.type === "web") setTimeout(() => ACT.webPreview(), 50); }
  if (App.view === "dashboard") App.timers.push(setInterval(() => { $$(".countdown").forEach((el) => { el.textContent = countdown(new Date(+el.dataset.t)); }); }, 1000));
}
function afterRender(el) { bindEditors(el); typeset(el); (App.ui.after || []).forEach((f) => f(el)); App.ui.after = []; }
function rerender() { route(); }

document.addEventListener("click", (e) => {
  const a = e.target.closest("[data-act]"); if (!a) return;
  const f = ACT[a.dataset.act]; if (f) { e.preventDefault(); f(a, e); }
});
document.addEventListener("change", (e) => { const a = e.target.closest("[data-chg]"); if (a && ACT[a.dataset.chg]) ACT[a.dataset.chg](a, e); });
document.addEventListener("input", (e) => { const a = e.target.closest("[data-inp]"); if (a && ACT[a.dataset.inp]) ACT[a.dataset.inp](a, e); });
window.addEventListener("hashchange", route);

/* ===================== Dashboard ===================== */
function countdown(t) {
  const ms = t - Date.now(); if (ms <= 0) return "Started / past";
  const d = Math.floor(ms / 86400000), h = Math.floor((ms % 86400000) / 3600000), m = Math.floor((ms % 3600000) / 60000), s = Math.floor((ms % 60000) / 1000);
  return `${d}d ${h}h ${m}m ${s}s`;
}
function examCoverage(e) {
  const subs = Cfg.subtopics(e.subject, e.cycle); const all = Progress.all();
  const st = subs.map((s) => Progress.topicStats(s.id, all));
  return { total: subs.length, attempted: st.filter((x) => x.attempts > 0).length, mastered: st.filter((x) => x.evidence).length, selfMastered: st.filter((x) => x.manual === "mastered" && !x.evidence).length };
}
function recommendation() {
  const now = Date.now(); const next = Cfg.exams().find((e) => Cfg.examStart(e).getTime() + 86400000 > now);
  const ret = Progress.dueRetests();
  if (ret.length) return { text: `Retest ${ret.length} mistake${ret.length > 1 ? "s" : ""} that ${ret.length > 1 ? "are" : "is"} due`, why: "Re-attempting past mistakes on schedule is the fastest way to stop repeating them.", act: "retestDue", label: "Start retest" };
  if (!next) return { text: "All configured exams are in the past", why: "Add new exam dates in Exam Setup.", act: "goto", arg: "exam-setup", label: "Open Exam Setup" };
  const all = Progress.all(); const subs = Cfg.subtopics(next.subject, next.cycle).map((s) => Object.assign({ st: Progress.topicStats(s.id, all) }, s));
  const weak = subs.filter((s) => s.st.attempts >= 2 && s.st.recentAcc < 0.7).sort((a, b) => a.st.recentAcc - b.st.recentAcc)[0];
  if (weak) return { text: `Strengthen "${weak.title}" (${U.pct(weak.st.recentAcc)} recent accuracy) for ${Cfg.examName(next)}`, why: "This is your weakest attempted topic in the next exam's syllabus.", act: "practiceTopic", arg: weak.id, label: "Practise this topic" };
  const fresh = subs.find((s) => !s.st.attempts && Cfg.questions({ topics: [s.id] }).length);
  if (fresh) return { text: `Start "${fresh.title}" — not attempted yet (${Cfg.examName(next)})`, why: "You have no evidence on this topic yet.", act: "practiceTopic", arg: fresh.id, label: "Start practice" };
  const cards = Progress.dueCards().length; if (cards) return { text: `Review ${cards} due flashcards`, why: "Spaced repetition keeps formulas and syntax fresh.", act: "goto", arg: "flashcards", label: "Review cards" };
  return { text: `Take a mock exam for ${Cfg.examName(next)}`, why: "You've touched every topic that has questions — test yourself under exam conditions.", act: "mockExam", arg: next.id, label: "Start mock" };
}
function viewDashboard() {
  const S = Store.cfg.settings; const all = Progress.all(); const today = U.today();
  const todayN = (Store.s.days[today]?.attempts || []).length;
  const exams = Cfg.exams(); const now = Date.now();
  const upcoming = exams.filter((e) => Cfg.examStart(e).getTime() + 86400000 > now);
  const rec = recommendation();
  const allSubs = Store.cfg.syllabus.flatMap((u) => u.subtopics);
  const stats = allSubs.map((s) => Object.assign({ st: Progress.topicStats(s.id, all) }, s));
  const weakest = stats.filter((s) => s.st.attempts >= 2).sort((a, b) => a.st.recentAcc - b.st.recentAcc).slice(0, 5);
  const sessions = Object.values(Store.s.sessions).filter((s) => s.submittedAt).sort((a, b) => b.submittedAt - a.submittedAt).slice(0, 5);
  const recentAtt = all.slice(-8).reverse();
  return `<div class="page-head"><div><h1>${S.studentName ? "Hi " + esc(S.studentName) : "Dashboard"}</h1><p class="muted">Everything here is computed from your saved attempts. Nothing is a demo figure.</p></div></div>
  <div class="rec card accent"><div><div class="eyebrow">Recommended next</div><div class="rec-text">${esc(rec.text)}</div><div class="muted small">${esc(rec.why)}</div></div><button class="btn primary" data-act="${rec.act}" data-arg="${esc(rec.arg || "")}">${esc(rec.label)}</button></div>
  <div class="grid kpis">
    <div class="card kpi"><div class="kpi-label">Today</div><div class="kpi-val">${todayN}<span class="muted"> / ${S.dailyTarget}</span></div>${bar(todayN / S.dailyTarget)}<div class="muted small">questions toward daily target</div></div>
    <div class="card kpi"><div class="kpi-label">Streak</div><div class="kpi-val">${Progress.streak()}<span class="muted"> day${Progress.streak() === 1 ? "" : "s"}</span></div><div class="muted small">consecutive days with practice or reviews</div></div>
    <div class="card kpi"><div class="kpi-label">Pending revision</div><div class="kpi-val">${Progress.dueCards().length + Progress.dueRetests().length}</div><div class="muted small">${Progress.dueCards().length} flashcards · ${Progress.dueRetests().length} retests due</div></div>
    <div class="card kpi"><div class="kpi-label">Evidence-based mastery</div><div class="kpi-val">${stats.filter((s) => s.st.evidence).length}<span class="muted"> / ${allSubs.length}</span></div><div class="muted small">subtopics meeting the mastery rule</div></div>
  </div>
  <h2>Upcoming examinations</h2>
  <div class="grid exams-grid">${upcoming.length ? upcoming.map((e) => { const c = examCoverage(e); const t = Cfg.examStart(e).getTime();
    return `<div class="card exam-card"><div class="row between"><div><div class="eyebrow">${esc(Cfg.cycle(e.cycle).name)}</div><h3>${esc(Cfg.subj(e.subject).name)}</h3></div>${e.official ? pill("Official pattern", "ok") : pill("Practice blueprint", "warn")}</div>
      <div class="muted small">${U.fmtDate(e.date)}${e.time ? " · " + esc(e.time) : " · time not set"}${e.durationMin ? " · " + e.durationMin + " min" : ""}</div>
      <div class="countdown" data-t="${t}">${countdown(new Date(t))}</div>
      <div class="small">Syllabus attempted: <strong>${c.attempted}/${c.total}</strong> · mastered (evidence): <strong>${c.mastered}</strong>${c.selfMastered ? ` · self-marked: ${c.selfMastered}` : ""}</div>${bar(c.total ? c.attempted / c.total : 0)}
      <div class="row gap mt"><button class="btn sm" data-act="practiceExam" data-arg="${e.id}">Practise syllabus</button><button class="btn sm ghost" data-act="mockExam" data-arg="${e.id}">Mock exam</button></div></div>`; }).join("") : `<div class="card empty">No upcoming exams. <a href="#exam-setup">Add exam dates</a>.</div>`}</div>
  <div class="grid two">
    <div class="card"><h2>Weakest five topics</h2>${weakest.length ? `<table class="tbl"><tr><th>Topic</th><th>Recent accuracy</th><th>Attempts</th><th></th></tr>${weakest.map((s) => `<tr><td>${esc(Cfg.topicName(s.id))}<div class="muted small">${esc(Cfg.subj(Cfg.topic(s.id).unit.subject).name)} · ${esc(Cfg.cycle(Cfg.topic(s.id).unit.cycle).name)}</div></td><td>${U.pct(s.st.recentAcc)} ${bar(s.st.recentAcc)}</td><td>${s.st.attempts}</td><td><button class="btn sm" data-act="practiceTopic" data-arg="${s.id}">Practise</button></td></tr>`).join("")}</table>` : `<p class="muted">Needs at least two attempts on a topic before it can be ranked.</p>`}</div>
    <div class="card"><h2>Recent results</h2>${sessions.length ? `<table class="tbl"><tr><th>Session</th><th>Score</th><th></th></tr>${sessions.map((s) => `<tr><td>${esc(s.title)}<div class="muted small">${new Date(s.submittedAt).toLocaleString()}</div></td><td>${s.summary ? `${fmtScore(s.summary.score)}/${s.summary.max} (${U.pct(s.summary.max ? s.summary.score / s.summary.max : 0)})` : "—"}${s.summary && s.summary.pending ? `<div class="muted small">${s.summary.pending} awaiting marking</div>` : ""}</td><td><button class="btn sm ghost" data-act="openReport" data-arg="${s.id}">Report</button></td></tr>`).join("")}</table>` : ""}
      ${recentAtt.length ? `<h3 class="mt">Latest attempts</h3><ul class="plain">${recentAtt.map((a) => { const q = Cfg.q(a.qid); return `<li class="row between"><span class="small">${esc(q ? q.title || TYPE_LABEL[q.type] : "Deleted question")} · ${esc(Cfg.topicName(a.topicId))}</span>${resPill(a.status, a.score, a.max)}</li>`; }).join("")}</ul>` : `<p class="muted">No attempts yet. Start from the recommendation above.</p>`}</div>
  </div>`;
}
const fmtScore = (x) => (Math.round(x * 100) / 100).toString();
function resPill(status, score, max) { const cls = { correct: "ok", partial: "warn", wrong: "bad", unanswered: "", pending: "info", error: "bad" }[status] || ""; return pill(`${status === "pending" ? "awaiting marking" : status}${max != null && status !== "pending" ? " · " + fmtScore(Math.max(0, score)) + "/" + max : ""}`, cls); }
ACT.goto = (el) => go(el.dataset.arg);

/* ===================== Syllabus explorer ===================== */
App.ui.syl = { subject: "math", cycle: "mid", open: {} };
function viewSyllabus() {
  const u = App.ui.syl; if (!Cfg.subj(u.subject)) u.subject = Store.cfg.subjects[0]?.id;
  const all = Progress.all(); const units = Cfg.units(u.subject, u.cycle);
  let lastGroup = null;
  const body = units.map((un) => {
    const subs = un.subtopics.map((s) => Object.assign({ st: Progress.topicStats(s.id, all), qn: Cfg.questions({ topics: [s.id] }).length }, s));
    const att = subs.filter((s) => s.st.attempts).length; const open = u.open[un.id] !== false;
    const grp = un.group && un.group !== lastGroup ? `<div class="group-label">${esc(un.group)}</div>` : ""; lastGroup = un.group;
    return grp + `<div class="card unit"><button class="unit-head" data-act="toggleUnit" data-arg="${un.id}" aria-expanded="${open}"><span class="caret">${open ? "▾" : "▸"}</span><strong>${esc(un.title)}</strong><span class="muted small">${att}/${subs.length} attempted</span></button>
      ${open ? `<table class="tbl sub-tbl"><tr><th>Subtopic</th><th>Status</th><th>Accuracy</th><th>Attempts</th><th>Bank</th><th></th></tr>${subs.map((s) => `<tr>
        <td><a href="#" data-act="openTopic" data-arg="${s.id}">${esc(s.title)}</a>${s.objectives.length ? `<div class="muted small">${s.objectives.length} objective(s)</div>` : ""}</td>
        <td>${statusPill(s.st)}<select class="mini" data-chg="setStatus" data-arg="${s.id}" aria-label="Set status"><option value="">Auto (${STATUS_LABEL[s.st.auto]})</option>${opts(Object.entries(STATUS_LABEL), s.st.manual || "_")}</select></td>
        <td>${U.pct(s.st.acc)}${bar(s.st.acc)}</td><td>${s.st.attempts}</td><td>${s.qn} q</td>
        <td class="nowrap"><button class="btn sm" data-act="practiceTopic" data-arg="${s.id}" ${s.qn ? "" : "disabled title='No questions yet — add or generate some in Exam Setup'"}>Practise</button> <button class="btn sm ghost" data-act="tutorTopic" data-arg="${s.id}">Learn</button></td></tr>`).join("")}</table>` : ""}</div>`;
  }).join("");
  return `<div class="page-head"><div><h1>Syllabus Explorer</h1><p class="muted">Status is set automatically from evidence. “Mastered” requires ≥${Store.cfg.settings.masteryMinAttempts} attempts, ≥${U.pct(Store.cfg.settings.masteryAccuracy)} recent accuracy and practice on ≥${Store.cfg.settings.masteryMinDays} days. You can override it, but self-marked mastery is labelled.</p></div><a class="btn ghost" href="#exam-setup">Edit syllabus</a></div>
  <div class="tabs">${Store.cfg.subjects.map((s) => `<button class="tab ${u.subject === s.id ? "on" : ""}" data-act="sylSubj" data-arg="${s.id}">${esc(s.name)}</button>`).join("")}</div>
  <div class="tabs sub">${Store.cfg.cycles.map((c) => `<button class="tab ${u.cycle === c.id ? "on" : ""}" data-act="sylCycle" data-arg="${c.id}">${esc(c.name)}</button>`).join("")}</div>
  ${body || `<div class="card empty">No syllabus entered for this subject and cycle. <a href="#exam-setup">Add it in Exam Setup</a>.</div>`}`;
}
ACT.sylSubj = (el) => { App.ui.syl.subject = el.dataset.arg; rerender(); };
ACT.sylCycle = (el) => { App.ui.syl.cycle = el.dataset.arg; rerender(); };
ACT.toggleUnit = (el) => { const o = App.ui.syl.open; o[el.dataset.arg] = o[el.dataset.arg] === false; rerender(); };
ACT.setStatus = (el) => { const v = el.value; if (v) Store.s.meta.topicStatus[el.dataset.arg] = v; else delete Store.s.meta.topicStatus[el.dataset.arg]; Store.touch("meta"); if (v === "mastered" && !Progress.topicStats(el.dataset.arg).evidence) toast("Marked as mastered by you — it will show as self-marked until your attempts provide evidence.", "warn"); rerender(); };
ACT.openTopic = (el) => {
  const id = el.dataset.arg; const t = Cfg.topic(id); Store.s.meta.opened[id] = Date.now(); Store.touch("meta");
  const all = Progress.all(); const st = Progress.topicStats(id, all); const at = all.filter((a) => a.topicId === id).slice(-15).reverse();
  const mist = Object.values(Store.s.mistakes).filter((m) => m.topicId === id);
  modal(`<div class="eyebrow">${esc(Cfg.subj(t.unit.subject).name)} · ${esc(Cfg.cycle(t.unit.cycle).name)} · ${esc(t.unit.title)}</div><h2>${esc(t.title)}</h2>
    <div class="row gap">${statusPill(st)} ${pill("Difficulty: " + t.difficulty)} ${pill(Cfg.questions({ topics: [id] }).length + " questions in bank")}</div>
    <h3>Learning objectives</h3>${t.objectives.length ? `<ul>${t.objectives.map((o) => `<li>${esc(o)}</li>`).join("")}</ul>` : `<p class="muted small">None entered. Add objectives in Exam Setup → Syllabus.</p>`}
    <h3>Evidence</h3><p class="small">Attempts: ${st.attempts} · Overall accuracy: ${U.pct(st.acc)} · Recent accuracy: ${U.pct(st.recentAcc)} · Active days: ${st.days} · Open mistakes: ${mist.filter((m) => !m.resolved).length}</p>
    ${at.length ? `<table class="tbl"><tr><th>When</th><th>Type</th><th>Result</th></tr>${at.map((a) => `<tr><td class="small">${new Date(a.ts).toLocaleString()}</td><td>${TYPE_LABEL[a.type] || a.type}</td><td>${resPill(a.status, a.score, a.max)}</td></tr>`).join("")}</table>` : `<p class="muted small">No previous attempts.</p>`}
    <div class="row gap mt"><button class="btn primary" data-act="practiceTopic" data-arg="${id}">Practise</button><button class="btn" data-act="tutorTopic" data-arg="${id}">Learn with tutor</button><button class="btn ghost" data-act="cardsTopic" data-arg="${id}">Flashcards</button></div>`, { noOk: true, cancelText: "Close", wide: true });
};
ACT.tutorTopic = (el) => { document.querySelector(".modal-back")?.remove(); App.ui.tutor = Object.assign(App.ui.tutor || {}, { topicId: el.dataset.arg, subject: Cfg.topic(el.dataset.arg).unit.subject }); Store.s.meta.opened[el.dataset.arg] = Store.s.meta.opened[el.dataset.arg] || Date.now(); Store.touch("meta"); go("tutor"); };
ACT.cardsTopic = (el) => { document.querySelector(".modal-back")?.remove(); App.ui.cards = Object.assign(App.ui.cards || {}, { topicId: el.dataset.arg, subject: Cfg.topic(el.dataset.arg).unit.subject }); go("flashcards"); };

/* ===================== Paper building ===================== */
function pickQuestions(filter, count, exclude = new Set(), { weakFirst = false } = {}) {
  const all = Progress.all(); const seen = {}; all.forEach((a) => { seen[a.qid] = seen[a.qid] || { n: 0, s: 0, m: 0 }; seen[a.qid].n++; seen[a.qid].s += a.score; seen[a.qid].m += a.max; });
  let pool = Cfg.questions(filter).filter((q) => !exclude.has(q.id));
  pool = U.shuffle(pool).sort((a, b) => {
    const sa = seen[a.id], sb = seen[b.id];
    if (weakFirst) return (sa ? sa.s / (sa.m || 1) : 0.5) - (sb ? sb.s / (sb.m || 1) : 0.5);
    return (sa ? sa.n : 0) - (sb ? sb.n : 0);
  });
  return pool.slice(0, count);
}
function buildFromPattern(exam, overrides = {}) {
  const items = [], short = []; const used = new Set();
  for (const sec of exam.pattern) {
    const f = { subject: exam.subject, cycle: exam.cycle, type: sec.type, difficulty: sec.difficulty, topics: sec.topics };
    const qs = pickQuestions(f, +sec.count, used);
    if (qs.length < sec.count) short.push(`${sec.label}: ${qs.length}/${sec.count} available`);
    qs.forEach((q) => { used.add(q.id); items.push({ q: U.clone(q), section: sec.label, marks: +sec.marks, negative: overrides.negative != null ? +overrides.negative : +sec.negative || 0 }); });
  }
  return { items, short };
}
function newSession(o) {
  const s = Object.assign({ id: U.uid("s"), kind: "practice", feedback: "instant", answers: {}, results: {}, flags: {}, timeSpent: {}, hints: {}, current: 0, startedAt: Date.now(), durationSec: 0, strict: false, submittedAt: null }, o);
  s.items.forEach((it) => { it.q.marks = it.marks != null ? it.marks : it.q.marks; });
  Store.s.sessions[s.id] = s; Store.touch("sessions:" + s.id);
  App.session = s; go("session");
}

/* ===================== Practice Arena ===================== */
App.ui.pr = { subject: "python", cycle: "", topic: "", type: "any", difficulty: "any", count: 5, time: 0, feedback: "instant" };
function viewPractice() {
  const p = App.ui.pr; if (!Cfg.subj(p.subject)) p.subject = Store.cfg.subjects[0]?.id;
  const filt = { subject: p.subject, cycle: p.cycle, topics: p.topic ? [p.topic] : [], type: p.type, difficulty: p.difficulty };
  const avail = Cfg.questions(filt).length;
  const typeTable = Store.cfg.subjects.map((s) => { const ts = [...new Set(Cfg.questions({ subject: s.id }).map((q) => TYPE_LABEL[q.type] + (q.lab ? " (" + q.lab + ")" : "") + (q.lang ? " (" + q.lang + ")" : "")))]; return `<tr><td>${esc(s.name)}</td><td class="small">${esc(ts.join(", ") || "—")}</td></tr>`; }).join("");
  return `<div class="page-head"><div><h1>Practice Arena</h1><p class="muted">Pick exactly what to practise. Instant feedback mode lets you use hints and retry; test mode holds feedback until the end.</p></div></div>
  <div class="grid two"><div class="card form">
    <label>Subject<select data-chg="prSet" data-k="subject">${subjOpts(p.subject)}</select></label>
    <label>Examination cycle<select data-chg="prSet" data-k="cycle">${cycleOpts(p.cycle, true)}</select></label>
    <label>Topic / subtopic<select data-chg="prSet" data-k="topic">${topicOpts(p.subject, p.cycle, p.topic)}</select></label>
    <div class="row gap"><label>Question type<select data-chg="prSet" data-k="type">${typeOptsFor(p.subject, p.type)}</select></label><label>Difficulty<select data-chg="prSet" data-k="difficulty">${diffOpts(p.difficulty)}</select></label></div>
    <div class="row gap"><label>Number of questions<input type="number" min="1" max="100" value="${p.count}" data-chg="prSet" data-k="count"></label><label>Time limit (min, 0 = none)<input type="number" min="0" value="${p.time}" data-chg="prSet" data-k="time"></label></div>
    <label>Feedback<select data-chg="prSet" data-k="feedback">${opts([["instant", "Instant — check each answer, hints, retry"], ["end", "At the end — like a test"]], p.feedback)}</select></label>
    <p class="small ${avail < p.count ? "warn-text" : "muted"}">${avail} matching question${avail === 1 ? "" : "s"} in your bank${avail < p.count ? ` — fewer than ${p.count} requested.` : "."}</p>
    <div class="row gap"><button class="btn primary" data-act="startPractice" ${avail ? "" : "disabled"}>Start practice</button>${AI.on ? `<button class="btn ghost" data-act="aiGenFromPractice">Generate questions with Claude</button>` : ""}</div>
  </div>
  <div class="card"><h2>What's in your bank</h2><table class="tbl">${typeTable}</table><p class="muted small mt">Add your own questions, change marks, or import a whole bank in <a href="#exam-setup">Exam Setup → Question bank</a>.</p>
  ${Progress.dueRetests().length ? `<div class="callout mt">You have ${Progress.dueRetests().length} mistake retest(s) due. <button class="btn sm" data-act="retestDue">Retest now</button></div>` : ""}</div></div>`;
}
ACT.prSet = (el) => { const p = App.ui.pr; const k = el.dataset.k; p[k] = ["count", "time"].includes(k) ? Math.max(k === "count" ? 1 : 0, +el.value || 0) : el.value; if (k === "subject" || k === "cycle") { p.topic = ""; if (k === "subject") p.type = "any"; } rerender(); };
ACT.startPractice = () => {
  const p = App.ui.pr; const qs = pickQuestions({ subject: p.subject, cycle: p.cycle, topics: p.topic ? [p.topic] : [], type: p.type, difficulty: p.difficulty }, p.count);
  if (!qs.length) return toast("No matching questions.");
  newSession({ kind: "practice", feedback: p.feedback, title: `Practice · ${Cfg.subj(p.subject).name}${p.topic ? " · " + Cfg.topic(p.topic).title : ""}`, subject: p.subject, durationSec: p.time * 60, items: qs.map((q) => ({ q: U.clone(q), marks: q.marks, negative: 0, section: "" })) });
};
ACT.practiceTopic = (el) => {
  document.querySelector(".modal-back")?.remove();
  const t = Cfg.topic(el.dataset.arg); Store.s.meta.opened[t.id] = Store.s.meta.opened[t.id] || Date.now(); Store.touch("meta");
  const qs = pickQuestions({ topics: [t.id] }, 6); if (!qs.length) { App.ui.pr = Object.assign(App.ui.pr, { subject: t.unit.subject, cycle: t.unit.cycle, topic: t.id }); go("practice"); return toast("No questions for this topic yet — generate or add some."); }
  newSession({ kind: "practice", feedback: "instant", title: "Practice · " + t.title, subject: t.unit.subject, items: qs.map((q) => ({ q: U.clone(q), marks: q.marks, negative: 0, section: "" })) });
};
ACT.practiceExam = (el) => { const e = Store.cfg.exams.find((x) => x.id === el.dataset.arg); Object.assign(App.ui.pr, { subject: e.subject, cycle: e.cycle, topic: "", type: "any" }); go("practice"); };
ACT.retestDue = () => {
  const due = Progress.dueRetests(); if (!due.length) return toast("No retests due.");
  newSession({ kind: "practice", mode: "retest", feedback: "instant", title: `Mistake retest (${due.length})`, items: due.slice(0, 30).map((m) => { const q = Cfg.q(m.qid); return { q: U.clone(q), marks: q.marks, negative: 0, section: "" }; }) });
};
ACT.aiGenFromPractice = () => { const p = App.ui.pr; openGenerator({ subject: p.subject, topicId: p.topic, type: p.type === "any" ? "mcq" : p.type }); };

/* ===================== Exam simulator ===================== */
App.ui.ex = { mode: "mock", examId: "", subject: "python", cycle: "mid", topics: [], count: 10, minutes: 30, negative: "", mixSubjects: [] };
function viewExams() {
  const x = App.ui.ex; const exams = Cfg.exams(); if (!x.examId && exams[0]) x.examId = exams[0].id;
  const ex = Store.cfg.exams.find((e) => e.id === x.examId);
  const inprog = Object.values(Store.s.sessions).filter((s) => s.kind === "exam" && !s.submittedAt);
  const done = Object.values(Store.s.sessions).filter((s) => s.submittedAt).sort((a, b) => b.submittedAt - a.submittedAt);
  const modes = [["topic", "A · Topic test", "One or more chosen subtopics."], ["mock", "B · Subject mock", "Full cycle syllabus, using the exam's blueprint."], ["mixed", "C · Mixed", "Questions across several subjects/topics."], ["timed", "D · Timed (strict)", "Blueprint paper; auto-submits when time runs out."], ["weak", "E · Weakness", "Built from your mistakes and weakest topics."]];
  let form = "";
  if (x.mode === "mock" || x.mode === "timed") {
    form = `<label>Examination<select data-chg="exSet" data-k="examId">${opts(exams.map((e) => [e.id, Cfg.examName(e) + " · " + e.date]), x.examId)}</select></label>
    ${ex ? `<div class="callout small">${ex.official ? "Official pattern" : "<strong>Practice blueprint</strong> — the institution's real pattern was not supplied. Edit it in Exam Setup when it is announced."}<br>${ex.pattern.map((s) => `${esc(s.label)}: ${s.count} × ${TYPE_LABEL[s.type]} @ ${s.marks} mark(s)${s.negative ? `, −${s.negative} wrong` : ""}`).join("<br>")}<br>Duration: ${ex.durationMin || "not set"} min · Total: ${ex.pattern.reduce((a, s) => a + s.count * s.marks, 0)} marks</div>` : ""}`;
  } else if (x.mode === "topic") {
    form = `<div class="row gap"><label>Subject<select data-chg="exSet" data-k="subject">${subjOpts(x.subject)}</select></label><label>Cycle<select data-chg="exSet" data-k="cycle">${cycleOpts(x.cycle)}</select></label></div>
      <fieldset class="topic-pick"><legend>Subtopics</legend>${Cfg.units(x.subject, x.cycle).map((u) => `<div class="small strong">${esc(u.title)}</div>` + u.subtopics.map((s) => `<label class="chk"><input type="checkbox" data-chg="exTopic" value="${s.id}" ${x.topics.includes(s.id) ? "checked" : ""}> ${esc(s.title)} <span class="muted">(${Cfg.questions({ topics: [s.id] }).length})</span></label>`).join("")).join("")}</fieldset>`;
  } else if (x.mode === "mixed") {
    form = `<fieldset class="topic-pick"><legend>Include</legend>${Store.cfg.subjects.flatMap((s) => Store.cfg.cycles.map((c) => `<label class="chk"><input type="checkbox" data-chg="exMix" value="${s.id}|${c.id}" ${x.mixSubjects.includes(s.id + "|" + c.id) ? "checked" : ""}> ${esc(s.name)} — ${esc(c.name)} <span class="muted">(${Cfg.questions({ subject: s.id, cycle: c.id }).length})</span></label>`)).join("")}</fieldset>`;
  } else form = `<p class="small">Uses open mistakes first, then questions from your lowest-accuracy topics. ${Object.values(Store.s.mistakes).filter((m) => !m.resolved).length} open mistakes on record.</p>`;
  const needsCount = ["topic", "mixed", "weak"].includes(x.mode);
  return `<div class="page-head"><div><h1>Exam Simulator</h1><p class="muted">Realistic conditions: timer, navigation, flags, saved progress and a locked final submission.</p></div></div>
  ${inprog.length ? `<div class="card callout"><strong>In progress:</strong> ${inprog.map((s) => `${esc(s.title)} <button class="btn sm" data-act="resume" data-arg="${s.id}">Resume</button>`).join(" ")}</div>` : ""}
  <div class="mode-grid">${modes.map(([id, l, d]) => `<button class="card mode ${x.mode === id ? "on" : ""}" data-act="exMode" data-arg="${id}"><strong>${l}</strong><span class="muted small">${d}</span></button>`).join("")}</div>
  <div class="card form">${form}
    <div class="row gap">${needsCount ? `<label>Questions<input type="number" min="1" value="${x.count}" data-chg="exSet" data-k="count"></label><label>Duration (min)<input type="number" min="1" value="${x.minutes}" data-chg="exSet" data-k="minutes"></label>` : ""}
    <label>Negative marking override<input type="number" step="0.25" min="0" placeholder="use blueprint" value="${esc(x.negative)}" data-chg="exSet" data-k="negative"></label></div>
    <p class="muted small">Negative marking applies to wrong MCQ / numerical / output answers only. Unanswered questions score 0.</p>
    <button class="btn primary" data-act="startExam">Start examination</button></div>
  <h2>History</h2>${done.length ? `<table class="tbl"><tr><th>Session</th><th>Date</th><th>Score</th><th></th></tr>${done.map((s) => `<tr><td>${esc(s.title)}</td><td class="small">${new Date(s.submittedAt).toLocaleString()}</td><td>${s.summary ? fmtScore(s.summary.score) + "/" + s.summary.max + " · " + U.pct(s.summary.max ? s.summary.score / s.summary.max : 0) : "—"}</td><td><button class="btn sm ghost" data-act="openReport" data-arg="${s.id}">Report</button> <button class="btn sm ghost" data-act="delSession" data-arg="${s.id}" aria-label="Delete">✕</button></td></tr>`).join("")}</table>` : `<p class="muted">No completed sessions yet.</p>`}`;
}
ACT.exMode = (el) => { App.ui.ex.mode = el.dataset.arg; rerender(); };
ACT.exSet = (el) => { const x = App.ui.ex; x[el.dataset.k] = ["count", "minutes"].includes(el.dataset.k) ? Math.max(1, +el.value || 1) : el.value; if (["subject", "cycle"].includes(el.dataset.k)) x.topics = []; rerender(); };
ACT.exTopic = (el) => { const t = App.ui.ex.topics; if (el.checked) t.push(el.value); else t.splice(t.indexOf(el.value), 1); };
ACT.exMix = (el) => { const t = App.ui.ex.mixSubjects; if (el.checked) t.push(el.value); else t.splice(t.indexOf(el.value), 1); };
ACT.mockExam = (el) => { App.ui.ex.mode = "mock"; App.ui.ex.examId = el.dataset.arg; go("exams"); };
ACT.resume = (el) => { App.session = Store.s.sessions[el.dataset.arg]; go("session"); };
ACT.delSession = (el) => confirmDlg("Delete this session report? Attempts already recorded in analytics are kept.", () => { Store.remove("sessions", el.dataset.arg); rerender(); }, "Delete");
ACT.startExam = () => {
  const x = App.ui.ex; const neg = x.negative === "" ? null : +x.negative; let items = [], title = "", dur = x.minutes * 60, short = [];
  const mk = (q) => ({ q: U.clone(q), marks: q.marks, negative: neg != null ? neg : +q.negative || 0, section: TYPE_LABEL[q.type] });
  if (x.mode === "mock" || x.mode === "timed") {
    const ex = Store.cfg.exams.find((e) => e.id === x.examId); if (!ex) return toast("Choose an exam.");
    const r = buildFromPattern(ex, { negative: neg }); items = r.items; short = r.short; title = (x.mode === "timed" ? "Timed exam · " : "Mock · ") + Cfg.examName(ex); dur = (ex.durationMin || 60) * 60;
  } else if (x.mode === "topic") {
    if (!x.topics.length) return toast("Pick at least one subtopic."); items = pickQuestions({ topics: x.topics }, x.count).map(mk); title = "Topic test · " + x.topics.map((t) => Cfg.topic(t).title).join(", ").slice(0, 60);
  } else if (x.mode === "mixed") {
    if (!x.mixSubjects.length) return toast("Pick at least one subject/cycle.");
    const per = Math.ceil(x.count / x.mixSubjects.length); const used = new Set();
    x.mixSubjects.forEach((sc) => { const [s, c] = sc.split("|"); pickQuestions({ subject: s, cycle: c }, per, used).forEach((q) => { used.add(q.id); items.push(mk(q)); }); });
    items = U.shuffle(items).slice(0, x.count); title = "Mixed exam";
  } else {
    const open = Object.values(Store.s.mistakes).filter((m) => !m.resolved).map((m) => Cfg.q(m.qid)).filter(Boolean);
    const all = Progress.all(); const weakTopics = Store.cfg.syllabus.flatMap((u) => u.subtopics).map((s) => ({ id: s.id, st: Progress.topicStats(s.id, all) })).filter((s) => s.st.attempts && s.st.recentAcc < 0.75).map((s) => s.id);
    const used = new Set(open.map((q) => q.id)); let qs = open.slice(0, x.count);
    if (qs.length < x.count && weakTopics.length) qs = qs.concat(pickQuestions({ topics: weakTopics }, x.count - qs.length, used, { weakFirst: true }));
    if (!qs.length) return toast("No mistakes or weak topics recorded yet — practise first.");
    items = qs.map(mk); title = "Weakness exam";
  }
  if (!items.length) return toast("No questions matched. Add or generate questions in Exam Setup.");
  const start = () => newSession({ kind: "exam", mode: x.mode, feedback: "end", strict: x.mode === "timed", title, durationSec: dur, items });
  if (short.length) confirmDlg(`Your bank does not have enough questions for the full paper:<br>${short.map(esc).join("<br>")}<br><br>Start with the ${items.length} questions available?`, start, "Start anyway");
  else start();
};

/* ===================== Session runner ===================== */
function curItem() { const s = App.session; return s.items[s.current]; }
function elapsed(s) { return ((s.submittedAt || Date.now()) - s.startedAt) / 1000; }
function startSessionTimer() {
  const s = App.session; if (!s) return; let lastTick = Date.now(); let lastSave = Date.now();
  App.timers.push(setInterval(() => {
    if (!App.session || App.session.submittedAt) return;
    const it = curItem(); const now = Date.now(); s.timeSpent[it.q.id] = (s.timeSpent[it.q.id] || 0) + (now - lastTick) / 1000; lastTick = now;
    const el = $("#timer"); if (el) { if (s.durationSec) { const rem = s.durationSec - elapsed(s); el.textContent = U.fmtTime(rem) + " left"; el.classList.toggle("low", rem < 300); if (rem <= 0 && s.kind === "exam") { toast("Time is up — submitting.", "warn"); finalSubmit(true); } else if (rem <= 0 && !s.timeUpShown) { s.timeUpShown = true; toast("Time limit reached.", "warn"); } } else el.textContent = U.fmtTime(elapsed(s)); }
    if (now - lastSave > 15000) { lastSave = now; Store.touch("sessions:" + s.id); }
  }, 1000));
}
function viewSession() {
  const s = App.session; if (s.submittedAt) return viewReport(s);
  const it = curItem(); const q = it.q; const res = s.results[q.id];
  const pal = s.items.map((x, i) => { const r = s.results[x.q.id]; const ans = hasAnswer(x.q, s.answers[x.q.id]); const cls = [i === s.current ? "cur" : "", ans ? "ans" : "", s.flags[x.q.id] ? "flag" : "", r && s.feedback === "instant" ? "r-" + r.status : ""].join(" "); return `<button class="pal ${cls}" data-act="goQ" data-arg="${i}" aria-label="Question ${i + 1}">${i + 1}</button>`; }).join("");
  const answered = s.items.filter((x) => hasAnswer(x.q, s.answers[x.q.id])).length;
  return `<div class="runner">
  <div class="runner-top card"><div><div class="eyebrow">${s.kind === "exam" ? "Examination" : "Practice"}${s.strict ? " · strict timing" : ""}</div><strong>${esc(s.title)}</strong></div>
    <div class="row gap"><span id="timer" class="timer">${s.durationSec ? U.fmtTime(s.durationSec - elapsed(s)) + " left" : U.fmtTime(elapsed(s))}</span><span class="muted small">${answered}/${s.items.length} answered</span>
    ${s.kind === "exam" ? `<button class="btn primary" data-act="submitExam">Submit examination</button>` : `<button class="btn" data-act="finishPractice">Finish</button>`}
    ${s.strict ? "" : `<button class="btn ghost" data-act="leaveSession">Save & exit</button>`}</div></div>
  <div class="runner-body"><nav class="palette card" aria-label="Questions">${pal}<div class="legend small muted"><span class="pal ans sm"></span> answered <span class="pal flag sm"></span> flagged</div></nav>
  <section class="qpane card" id="qpane">${questionPane(s, it, res)}</section></div></div>`;
}
const hasAnswer = (q, a) => a != null && a !== "" && !(Array.isArray(a) && !a.length) && !(typeof a === "object" && !Array.isArray(a) && (q.type === "coding" || q.type === "debug" ? !a.code || (a.code === q.starter && !a.explanation) : q.type === "web" ? !a.files : false));
function questionPane(s, it, res) {
  const q = it.q; const i = s.current; const a = s.answers[q.id]; const locked = !!res && s.feedback === "instant" && !res.retry;
  const head = `<div class="q-head"><div><span class="muted">Question ${i + 1} of ${s.items.length}</span>${it.section ? ` · <span class="muted">${esc(it.section)}</span>` : ""}</div>
    <div class="row gap">${pill(TYPE_LABEL[q.type] + (q.lang ? " · " + (q.lang === "js" ? "JavaScript" : "Python") : "") + (q.lab ? " · " + q.lab.toUpperCase() : ""))} ${pill(q.difficulty)} ${pill(q.marks + " mark" + (q.marks == 1 ? "" : "s") + (it.negative ? ` · −${it.negative}` : ""))} ${q.source === "ai" ? pill("AI-generated", "info") : ""}
    <button class="btn sm ghost ${s.flags[q.id] ? "on" : ""}" data-act="flagQ">${s.flags[q.id] ? "⚑ Flagged" : "⚐ Flag"}</button></div></div>
    <div class="muted small">${esc(Cfg.topicName(q.topicId))}</div>`;
  const body = `<div class="q-prompt">${q.title ? `<h2>${esc(q.title)}</h2>` : ""}${md(q.prompt)}</div>` + answerWidget(q, a, locked, s);
  const hintsUsed = s.hints[q.id] || 0; const hintList = (q.hints || []);
  const canHint = s.feedback === "instant" && !locked;
  const hints = s.feedback === "instant" ? `<div class="hints">${(s.hintText && s.hintText[q.id] || []).map((h, k) => `<div class="hint"><div class="eyebrow">${["Hint 1 · direction", "Hint 2 · method", "Hint 3 · next step", "Full solution"][k]}</div>${md(h)}</div>`).join("")}
    ${canHint && hintsUsed < 4 ? `<button class="btn sm ghost" data-act="hint">${hintsUsed < 3 ? `Hint ${hintsUsed + 1}` : "Show full solution"}${hintsUsed >= 3 || hintList[hintsUsed] ? "" : AI.on ? " (Claude)" : ""}</button>` : ""}</div>` : "";
  const ctrl = `<div class="q-ctrl row between"><div class="row gap"><button class="btn ghost" data-act="prevQ" ${i === 0 ? "disabled" : ""}>← Previous</button><button class="btn ghost" data-act="nextQ" ${i === s.items.length - 1 ? "disabled" : ""}>Next →</button></div>
    ${s.feedback === "instant" ? (locked ? `<button class="btn" data-act="retryQ">Retry</button>` : `<button class="btn primary" data-act="checkQ">Check answer</button>`) : ""}</div>`;
  return head + body + hints + `<div id="qresult">${res && s.feedback === "instant" && !res.retry ? resultBlock(q, res, a, { session: s }) : ""}</div>` + ctrl;
}
function answerWidget(q, a, locked, s) {
  const dis = locked ? "disabled" : "";
  switch (q.type) {
    case "mcq": return `<div class="options">${q.options.map((o, k) => `<label class="opt ${+a === k && a !== "" && a != null ? "sel" : ""}"><input type="radio" name="opt" value="${k}" ${+a === k && a !== "" && a != null ? "checked" : ""} ${dis} data-chg="ansMcq"><span class="opt-l">${String.fromCharCode(65 + k)}</span><span>${md(o)}</span></label>`).join("")}</div>${!locked && a != null && a !== "" ? `<button class="btn sm ghost" data-act="clearAns">Clear response</button>` : ""}`;
    case "msq": return `<p class="muted small">Select all that apply.</p><div class="options">${q.options.map((o, k) => `<label class="opt ${(a || []).includes(k) ? "sel" : ""}"><input type="checkbox" value="${k}" ${(a || []).includes(k) ? "checked" : ""} ${dis} data-chg="ansMsq"><span class="opt-l">${String.fromCharCode(65 + k)}</span><span>${md(o)}</span></label>`).join("")}</div>`;
    case "numerical": return `<label class="ans-label">Your answer (number, decimal or fraction like 7/8)<input class="num-in" type="text" inputmode="decimal" value="${esc(a ?? "")}" ${dis} data-inp="ansText"></label>`;
    case "output": return `<label class="ans-label">Exact output<textarea class="mono" rows="5" ${dis} data-inp="ansText" spellcheck="false">${esc(a ?? "")}</textarea></label>`;
    case "subjective": return `<div class="q-work"><label class="ans-label">Your solution — show every step. Use $…$ for maths, e.g. $x^2 + 1$.<textarea rows="12" ${dis} data-inp="ansText" id="subj-in">${esc(a ?? "")}</textarea></label><button class="btn sm ghost" data-act="previewMath">Preview maths</button><div id="math-prev" class="math-prev"></div>
      <details class="small"><summary>Marking rubric (${q.marks} marks)</summary><table class="tbl">${(q.rubric || []).map((r) => `<tr><td>${esc(r.criterion)}</td><td>${r.marks}</td></tr>`).join("")}</table></details></div>`;
    case "coding": case "debug": return codingWidget(q, a || {}, locked, s);
    case "web": return webWidget(q, a || {}, locked, s);
  }
  return "";
}
function codingWidget(q, a, locked, s) {
  const code = a.code != null ? a.code : q.starter || ""; const lang = q.lang === "js" ? "js" : "python";
  const vis = (q.tests || []).filter((t) => !t.hidden); const hid = (q.tests || []).length - vis.length;
  const spec = q.type === "coding" ? `<div class="spec">${q.inputFormat ? `<div><strong>Input format</strong>${md(q.inputFormat)}</div>` : ""}${q.outputFormat ? `<div><strong>Output format</strong>${md(q.outputFormat)}</div>` : ""}${q.constraints ? `<div><strong>Constraints</strong>${md(q.constraints)}</div>` : ""}${q.complexity ? `<div><strong>Expected complexity</strong><p>${esc(q.complexity)}</p></div>` : ""}</div>
    ${q.steps && q.steps.length ? `<details class="small" ${s.feedback === "instant" ? "" : ""}><summary>Step-by-step instructions</summary><ol>${q.steps.map((x) => `<li>${md(x)}</li>`).join("")}</ol></details>` : ""}
    ${q.sampleInput != null && q.sampleInput !== "" ? `<div class="row gap sample"><div><strong class="small">Sample input</strong><pre class="code">${esc(q.sampleInput)}</pre></div><div><strong class="small">Sample output</strong><pre class="code">${esc(q.sampleOutput || "")}</pre></div></div>` : ""}` : "";
  return `${spec}<div class="small muted">Test cases: ${vis.length} visible, ${hid} hidden (hidden inputs are revealed only after submission). Marks are proportional to passed tests${q.type === "debug" ? " (70%) plus your explanation (30%)" : ""}. Output comparison: ${({ exact: "exact", tokens: "whitespace-insensitive", float: "numeric tolerance" })[q.compare] || "trailing whitespace ignored"}.</div>
  <div class="q-work">${editor("code-in", code, { ro: locked, rows: Math.max(10, code.split("\n").length + 3), lang })}
  ${q.type === "debug" ? `<label class="ans-label">Explain the bug(s) and your fix<textarea rows="4" data-inp="ansExpl" ${locked ? "disabled" : ""}>${esc(a.explanation || "")}</textarea></label>` : ""}
  <div class="row gap wrap mt">${lang === "python" ? `<label class="grow small">Custom input (stdin)<textarea id="stdin-in" class="mono" rows="2" spellcheck="false">${esc(App.ui.stdin?.[q.id] ?? q.sampleInput ?? "")}</textarea></label>` : `<label class="grow small">Expression to evaluate (optional)<input id="stdin-in" class="mono" value="${esc(App.ui.stdin?.[q.id] ?? q.sampleInput ?? "")}"></label>`}
  <div class="col gap"><button class="btn" data-act="runCustom" title="Ctrl+Enter in the editor">▶ Run</button><button class="btn" data-act="runVisible">Run visible tests</button>${AI.on && s.feedback === "instant" ? `<button class="btn ghost sm" data-act="codeReview">Code review (Claude)</button>` : ""}</div></div>
  <div id="run-out" class="console"></div>${lang === "python" ? `<div class="muted small" id="py-state">${pyStateText()}</div>` : ""}</div>`;
}
function pyStateText() { return { idle: "Python runs in your browser (Pyodide). First run downloads the runtime (~10 MB).", loading: "Loading Python runtime…", ready: "Python ready.", error: "Python runtime failed to load: " + (PyRunner.error || "") }[PyRunner.state]; }
PyRunner.on(() => { const el = $("#py-state"); if (el) el.textContent = pyStateText(); });
function webWidget(q, a, locked, s) {
  const files = Object.assign({}, q.files || {}, a.files || {}); const tab = App.ui.webTab && (q.files || {})[App.ui.webTab] != null ? App.ui.webTab : (q.editable || ["html"])[0];
  const editable = q.editable || ["html", "css", "js"];
  const tabs = ["html", "css", "js"].filter((k) => (q.files || {})[k] != null && (editable.includes(k) || (q.files[k] || "").trim()));
  return `<div class="q-work web"><div class="web-grid"><div><div class="tabs ftabs">${tabs.map((k) => `<button class="tab ${k === tab ? "on" : ""}" data-act="webTab" data-arg="${k}">${{ html: "index.html", css: "style.css", js: "script.js" }[k]}${editable.includes(k) ? "" : " 🔒"}</button>`).join("")}</div>
    ${editor("web-in", files[tab] || "", { ro: locked || !editable.includes(tab), rows: 20, lang: tab })}
    <div class="row gap mt"><button class="btn" data-act="webPreview">▶ Run preview</button>${s.feedback === "instant" ? `<button class="btn" data-act="webChecks">Run checks</button>` : `<span class="muted small">Functional checks run when you submit.</span>`}</div></div>
    <div><div class="row between"><strong class="small">Live preview</strong><div class="row gap">${[375, 768, 1280].map((w) => `<button class="btn sm ghost ${(App.ui.vw || 1280) === w ? "on" : ""}" data-act="webVw" data-arg="${w}">${w === 375 ? "Mobile" : w === 768 ? "Tablet" : "Desktop"} ${w}</button>`).join("")}</div></div>
    <div class="preview-wrap"><iframe id="web-prev" sandbox="allow-scripts allow-same-origin allow-forms allow-modals" title="Live preview" style="width:${App.ui.vw || 1280}px"></iframe></div>
    <div class="console" id="web-console" aria-live="polite"><div class="muted small">Console output appears here.</div></div><div id="web-checks"></div></div></div></div>`;
}

/* ----- runner actions ----- */
function saveAns(val) { const s = App.session; const q = curItem().q; s.answers[q.id] = val; Store.touch("sessions:" + s.id); }
ACT.ansMcq = (el) => { saveAns(+el.value); $$(".opt").forEach((o) => o.classList.toggle("sel", o.querySelector("input").checked)); };
ACT.ansMsq = () => { saveAns($$(".opt input").filter((i) => i.checked).map((i) => +i.value)); $$(".opt").forEach((o) => o.classList.toggle("sel", o.querySelector("input").checked)); };
ACT.ansText = (el) => saveAns(el.value);
ACT.clearAns = () => { saveAns(""); rerenderPane(); };
ACT.ansExpl = (el) => { const s = App.session, q = curItem().q; const a = Object.assign({}, s.answers[q.id] || { code: q.starter }); a.explanation = el.value; s.answers[q.id] = a; Store.touch("sessions:" + s.id); };
document.addEventListener("input", (e) => {
  if (!App.session || App.view !== "session") return;
  const s = App.session, q = curItem().q;
  if (e.target.id === "code-in") { const a = Object.assign({}, s.answers[q.id] || {}); a.code = e.target.value; s.answers[q.id] = a; Store.touch("sessions:" + s.id); }
  if (e.target.id === "web-in") { const tab = $(".ftabs .tab.on")?.dataset.arg; const a = Object.assign({ files: {} }, s.answers[q.id] || {}); a.files = Object.assign({}, q.files, a.files, { [tab]: e.target.value }); s.answers[q.id] = a; Store.touch("sessions:" + s.id); }
  if (e.target.id === "stdin-in") { App.ui.stdin = App.ui.stdin || {}; App.ui.stdin[q.id] = e.target.value; }
});
function rerenderPane() { const s = App.session; const pane = $("#qpane"); if (!pane) return rerender(); pane.innerHTML = questionPane(s, curItem(), s.results[curItem().q.id]); afterRender(pane); $$(".palette button.pal").forEach((p, i) => { const x = s.items[i]; p.classList.toggle("cur", i === s.current); p.classList.toggle("ans", hasAnswer(x.q, s.answers[x.q.id])); p.classList.toggle("flag", !!s.flags[x.q.id]); }); if (curItem().q.type === "web") setTimeout(() => ACT.webPreview(), 50); }
ACT.goQ = (el) => { App.session.current = +el.dataset.arg; App.ui.webTab = null; rerender(); };
ACT.prevQ = () => { App.session.current--; App.ui.webTab = null; rerender(); };
ACT.nextQ = () => { App.session.current++; App.ui.webTab = null; rerender(); };
ACT.flagQ = () => { const s = App.session, id = curItem().q.id; s.flags[id] = !s.flags[id]; Store.touch("sessions:" + s.id); rerenderPane(); };
ACT.leaveSession = () => { Store.touch("sessions:" + App.session.id); App.session = null; go(App.view === "session" ? "exams" : App.view); };
ACT.previewMath = () => { const p = $("#math-prev"); p.innerHTML = md($("#subj-in").value); typeset(p); };
App.ui.after = [];
const _origRoute = route;

ACT.runCustom = async () => {
  const q = curItem().q; const code = $("#code-in").value; const out = $("#run-out"); out.innerHTML = `<div class="muted">Running…</div>`;
  try {
    let r;
    if (q.lang === "js") { const ex = ($("#stdin-in")?.value || "").trim(); r = await JsRunner.run(code, { call: ex || undefined, mock: q.mock || (q.tests || []).find((t) => t.mock)?.mock || {}, timeoutSec: Store.cfg.settings.codeTimeoutSec }); }
    else r = await PyRunner.run(code, $("#stdin-in")?.value || "", Store.cfg.settings.codeTimeoutSec);
    out.innerHTML = `<div class="small muted">stdout</div><pre>${esc(r.stdout || "")}</pre>${q.lang === "js" && r.result && r.result !== "undefined" ? `<div class="small muted">result</div><pre>${esc(r.result)}</pre>` : ""}${r.error ? `<div class="err"><strong>${esc(r.error.type)}</strong>: ${esc(r.error.msg)}${r.error.trace ? `<pre>${esc(r.error.trace)}</pre>` : ""}</div>` : ""}`;
  } catch (e) { out.innerHTML = `<div class="err">Runner failed: ${esc(e.message)}</div>`; }
};
ACT.runVisible = async () => {
  const q = curItem().q; const code = $("#code-in").value; const out = $("#run-out"); out.innerHTML = `<div class="muted">Running visible tests…</div>`;
  try { const res = await Grader.runTests(q, code, { visibleOnly: true }); out.innerHTML = testTable(res.map((r) => ({ category: r.test.category, input: r.test.input, call: r.test.call, expected: r.test.expected, got: r.got, pass: r.pass, error: r.error })), false); }
  catch (e) { out.innerHTML = `<div class="err">Runner failed: ${esc(e.message)}</div>`; }
};
function testTable(tests, revealHidden = true) {
  const p = tests.filter((t) => t.pass).length;
  return `<div class="small"><strong>${p}/${tests.length} passed</strong></div><table class="tbl tests"><tr><th>#</th><th>Category</th><th>Input</th><th>Expected</th><th>Your output</th><th></th></tr>${tests.map((t, i) => {
    const hide = t.hidden && !revealHidden; const inp = t.call || t.input || "";
    return `<tr class="${t.pass ? "pass" : "fail"}"><td>${i + 1}</td><td>${esc(t.category)}${t.hidden ? " · hidden" : ""}</td><td><pre>${hide ? "hidden" : esc(inp)}</pre></td><td><pre>${hide ? "hidden" : esc(t.expected)}</pre></td><td><pre>${hide ? (t.pass ? "✓" : "✗") : esc(t.got ?? "")}</pre>${t.error ? `<div class="err small">${esc(t.error.type)}: ${esc(t.error.msg)}</div>` : ""}</td><td>${t.pass ? "✓" : "✗"}</td></tr>`;
  }).join("")}</table>`;
}
ACT.codeReview = async (el) => {
  const q = curItem().q; const code = $("#code-in").value; const out = $("#run-out"); el.disabled = true; out.innerHTML = `<div class="muted">Asking Claude for a review…</div>`;
  try { const res = await Grader.runTests(q, code, { visibleOnly: true }); const txt = await AI.codeReview(q, code, `${res.filter((r) => r.pass).length}/${res.length} visible tests passed`); out.innerHTML = `<div class="ai-box"><div class="eyebrow">Code quality feedback · Claude</div>${md(txt)}</div>`; }
  catch (e) { out.innerHTML = `<div class="err">${esc(e.message)}</div>`; } el.disabled = false;
};
ACT.webTab = (el) => { App.ui.webTab = el.dataset.arg; rerenderPane(); };
ACT.webVw = (el) => { App.ui.vw = +el.dataset.arg; rerenderPane(); };
ACT.webPreview = () => {
  const s = App.session; const q = curItem().q; const a = s.answers[q.id] || {}; const files = Object.assign({}, q.files, a.files || {});
  const con = $("#web-console"); if (!con) return; con.innerHTML = ""; const ch = "prev"; window.__efLabSinks = window.__efLabSinks || {};
  window.__efLabSinks[ch] = (k, m) => { const d = document.createElement("div"); d.className = "log " + k; d.textContent = (k === "log" ? "" : k + ": ") + m; con.appendChild(d); };
  const f = $("#web-prev"); f.srcdoc = WebLab.srcdoc(files, q.mock || {}, ch);
};
ACT.webChecks = async (el) => {
  const s = App.session; const q = curItem().q; const a = s.answers[q.id] || {}; const box = $("#web-checks"); el.disabled = true; box.innerHTML = `<div class="muted small">Running ${q.checks.length} checks…</div>`;
  const checks = await WebLab.runChecks(q, Object.assign({}, q.files, a.files || {})); box.innerHTML = checksTable(checks); el.disabled = false;
};
function checksTable(checks) {
  const tot = checks.reduce((x, c) => x + c.marks, 0), got = checks.filter((c) => c.pass).reduce((x, c) => x + c.marks, 0);
  return `<div class="small mt"><strong>Checks: ${got}/${tot} marks</strong></div><table class="tbl tests">${checks.map((c) => `<tr class="${c.pass ? "pass" : "fail"}"><td>${c.pass ? "✓" : "✗"}</td><td>${esc(c.desc)}${c.viewport ? ` <span class="muted">@${c.viewport}px</span>` : ""}${!c.pass && c.msg ? `<div class="muted small">${esc(c.msg)}</div>` : ""}</td><td>${c.marks}</td></tr>`).join("")}</table>`;
}
ACT.hint = async (el) => {
  const s = App.session, q = curItem().q; const lvl = s.hints[q.id] || 0; s.hintText = s.hintText || {}; const list = (s.hintText[q.id] = s.hintText[q.id] || []);
  let txt = lvl < 3 ? (q.hints || [])[lvl] : null;
  if (!txt && lvl === 3) txt = q.modelSolution || (q.reference ? "```\n" + (typeof q.reference === "string" ? q.reference : Object.values(q.reference).join("\n")) + "\n```" : null) || (q.type === "mcq" ? `Answer: ${Progress.correctText(q)}\n\n${q.explanation}` : q.answer != null ? `Answer: ${q.answer}\n\n${q.explanation || ""}` : null);
  if (!txt) { if (!AI.on) return toast("No stored hint and AI is unavailable here."); el.disabled = true; el.textContent = "Thinking…"; try { txt = await AI.hint(q, lvl, JSON.stringify(s.answers[q.id] ?? "")); } catch (e) { toast(e.message, "bad"); el.disabled = false; return; } }
  list.push(txt); s.hints[q.id] = lvl + 1; Store.touch("sessions:" + s.id); rerenderPane();
};
ACT.checkQ = async (el) => {
  const s = App.session, it = curItem(), q = it.q; const a = s.answers[q.id];
  if (!hasAnswer(q, a)) return toast("Answer the question first.");
  el.disabled = true; el.textContent = q.type === "subjective" && AI.on ? "Claude is marking…" : "Checking…";
  const res = await Grader.grade(q, a, { negative: it.negative });
  res.correctText = Progress.correctText(q);
  if ((s.hints[q.id] || 0) >= 4) res.assisted = true;
  s.results[q.id] = res;
  if (res.status !== "pending" && res.status !== "error") { const att = Progress.record(q, res, { mode: s.mode === "retest" ? "retest" : "practice", timeSec: s.timeSpent[q.id] || 0, answer: a, sessionId: s.id }); if (att) res.attemptId = att.id; }
  Store.touch("sessions:" + s.id); rerenderPane(); renderShell();
};
ACT.retryQ = () => { const s = App.session, q = curItem().q; delete s.results[q.id]; s.hints[q.id] = 0; if (s.hintText) delete s.hintText[q.id]; Store.touch("sessions:" + s.id); rerenderPane(); };

function resultBlock(q, res, a, { session, idx } = {}) {
  const cls = { correct: "ok", partial: "warn", wrong: "bad", unanswered: "", pending: "info", error: "bad" }[res.status];
  let h = `<div class="result ${cls}"><div class="row between"><strong>${{ correct: "Correct", partial: "Partially correct", wrong: "Incorrect", unanswered: "Not answered", pending: "Awaiting marking", error: "Could not evaluate" }[res.status]}</strong><span>${res.status === "pending" ? "" : fmtScore(res.score) + " / " + res.max + " marks"}${res.assisted ? " · used full solution" : ""}</span></div>`;
  if (res.detail) h += `<p class="small">${esc(res.detail)}</p>`;
  if (res.tests) h += testTable(res.tests, true);
  if (res.reasoning) h += `<div class="small mt"><strong>Explanation:</strong> ${res.reasoning.by === "ai" ? `${U.pct(res.reasoning.score)} (marked by Claude) — ${esc(res.reasoning.comment)}` : esc(res.reasoning.comment || "")}</div>`;
  if (res.checks) h += checksTable(res.checks) + (res.audit && res.audit.length ? `<details class="small"><summary>Structure & accessibility audit (${res.audit.length} note${res.audit.length > 1 ? "s" : ""}, not marked)</summary><ul>${res.audit.map((n) => `<li>${esc(n)}</li>`).join("")}</ul></details>` : "");
  if (res.ai) {
    h += `<table class="tbl mt"><tr><th>Criterion</th><th>Marks</th><th>Comment</th></tr>${res.ai.criteria.map((c) => `<tr><td>${esc(c.criterion)}</td><td>${fmtScore(c.awarded)}/${c.max}</td><td class="small">${md(c.comment)}</td></tr>`).join("")}</table>`;
    if (res.ai.firstIncorrectStep) h += `<p class="small"><strong>First incorrect step:</strong> ${md(res.ai.firstIncorrectStep)}</p>`;
    if (res.ai.errorType && res.ai.errorType !== "none") h += `<p class="small"><strong>Error type:</strong> ${esc(res.ai.errorType)}</p>`;
    if (res.ai.unsupported && res.ai.unsupported.length) h += `<p class="small"><strong>Unsupported conclusions:</strong> ${res.ai.unsupported.map(esc).join("; ")}</p>`;
    if (res.ai.feedback) h += `<div class="small">${md(res.ai.feedback)}</div>`;
    h += `<p class="muted small">Marked by Claude against the rubric (confidence: ${esc(res.ai.confidence)}). AI marking can be wrong — compare with the model solution and override below if needed.</p>`;
  }
  if (q.type === "subjective" && (res.status === "pending" || res.ai)) {
    h += `<details ${res.status === "pending" ? "open" : ""} class="selfmark"><summary>${res.status === "pending" ? "Self-mark against the rubric" : "Override marks"}</summary><table class="tbl">${(q.rubric || []).map((r, k) => `<tr><td>${esc(r.criterion)}</td><td><input type="number" class="sm-in" min="0" max="${r.marks}" step="0.5" value="${res.ai ? res.ai.criteria[k].awarded : 0}" data-k="${k}"> / ${r.marks}</td></tr>`).join("")}</table><button class="btn sm" data-act="selfMark" data-arg="${q.id}" data-session="${session ? session.id : ""}">Save marks</button></details>`;
  }
  if (q.type === "debug" && res.reasoning && res.reasoning.by === "pending") h += `<div class="selfmark small">Self-mark your explanation: <button class="btn sm" data-act="selfReason" data-arg="${q.id}" data-v="1">Matches model</button> <button class="btn sm" data-act="selfReason" data-arg="${q.id}" data-v="0.5">Partly</button> <button class="btn sm" data-act="selfReason" data-arg="${q.id}" data-v="0">Missed it</button></div>`;
  const showSol = res.status !== "correct" || q.explanation || q.modelSolution;
  if (showSol) {
    if (["mcq", "msq", "numerical", "output"].includes(q.type)) h += `<div class="sol"><strong>Correct answer:</strong> ${q.type === "output" ? `<pre class="code">${esc(q.answer)}</pre>` : md(Progress.correctText(q))}${q.explanation ? md(q.explanation) : ""}</div>`;
    if (q.type === "subjective") h += `<details class="sol" ${res.status !== "correct" ? "open" : ""}><summary>Model solution</summary>${md(q.modelSolution || "")}</details>`;
    if ((q.type === "coding" || q.type === "debug") && q.reference) h += `<details class="sol"><summary>Reference solution</summary><pre class="code">${esc(q.reference)}</pre>${q.bugExplanation ? md("**The bug:** " + q.bugExplanation) : ""}</details>`;
    if (q.type === "web" && q.reference) h += `<details class="sol"><summary>Reference implementation</summary><pre class="code">${esc(Progress.correctText(q))}</pre></details>`;
  }
  return h + "</div>";
}
ACT.selfMark = (el) => {
  const box = el.closest(".selfmark"); const vals = $$(".sm-in", box).map((i) => U.clamp(+i.value || 0, 0, +i.max));
  const sid = el.dataset.session; const s = sid ? Store.s.sessions[sid] : App.session; const it = s.items.find((x) => x.q.id === el.dataset.arg); const q = it.q;
  const res = s.results[q.id]; const score = vals.reduce((a, b) => a + b, 0);
  res.score = score; res.status = score >= q.marks ? "correct" : score > 0 ? "partial" : "wrong"; res.by = res.ai ? "ai+override" : "self"; res.selfMarks = vals;
  if (res.ai) res.ai.criteria.forEach((c, k) => { c.awarded = vals[k]; });
  if (res.attemptId) Progress.updateAttempt(res.attemptId, score, res.status);
  else { const att = Progress.record(q, res, { mode: s.kind === "exam" ? "exam" : "practice", timeSec: s.timeSpent[q.id] || 0, answer: s.answers[q.id], sessionId: s.id }); if (att) res.attemptId = att.id; }
  if (s.submittedAt) summarise(s);
  Store.touch("sessions:" + s.id); toast("Marks saved."); rerender();
};
ACT.selfReason = (el) => {
  const s = App.session && App.session.items.some((x) => x.q.id === el.dataset.arg) ? App.session : null; if (!s) return;
  const q = s.items.find((x) => x.q.id === el.dataset.arg).q; const res = s.results[q.id]; const v = +el.dataset.v;
  res.score = Math.round(((res.passed / (res.total || 1)) * 0.7 + v * 0.3) * q.marks * 100) / 100; res.reasoning = { by: "self", score: v, comment: "Self-assessed explanation." };
  res.status = res.score >= q.marks - 1e-9 ? "correct" : res.score > 0 ? "partial" : "wrong";
  if (res.attemptId) Progress.updateAttempt(res.attemptId, res.score, res.status); else { const att = Progress.record(q, res, { mode: s.kind === "exam" ? "exam" : "practice", answer: s.answers[q.id], sessionId: s.id }); if (att) res.attemptId = att.id; }
  if (s.submittedAt) summarise(s);
  Store.touch("sessions:" + s.id); rerender();
};
ACT.finishPractice = () => {
  const s = App.session; const unchecked = s.items.filter((x) => !s.results[x.q.id] && hasAnswer(x.q, s.answers[x.q.id])).length;
  const fin = async () => { if (s.feedback === "end" || unchecked) await gradeAll(s, s.feedback === "end"); s.submittedAt = Date.now(); summarise(s); Store.touch("sessions:" + s.id); rerender(); };
  if (unchecked && s.feedback === "instant") confirmDlg(`${unchecked} answered question(s) haven't been checked. They will be marked now.`, fin, "Finish"); else fin();
};
ACT.submitExam = () => {
  const s = App.session; const un = s.items.filter((x) => !hasAnswer(x.q, s.answers[x.q.id])).length; const fl = s.items.filter((x) => s.flags[x.q.id]).length;
  confirmDlg(`Submit the examination? <br>${un ? `<strong>${un} unanswered</strong>. ` : ""}${fl ? `${fl} flagged. ` : ""}<br>You will not be able to change answers after final submission.`, () => finalSubmit(false), "Submit finally");
};
async function gradeAll(s, all) {
  const pane = $("#qpane"); let n = 0;
  for (const it of s.items) {
    const q = it.q; n++; if (!all && s.results[q.id]) continue;
    if (pane) pane.innerHTML = `<div class="grading"><div class="spinner"></div><p>Evaluating ${n} of ${s.items.length}… ${q.type === "subjective" && AI.on ? "(Claude is marking a subjective answer)" : q.type === "coding" ? "(running test cases)" : q.type === "web" ? "(running functional checks)" : ""}</p></div>`;
    const a = s.answers[q.id];
    const res = await Grader.grade(q, a, { negative: it.negative }); res.correctText = Progress.correctText(q); s.results[q.id] = res;
    if (res.status !== "pending" && res.status !== "error") { const att = Progress.record(q, res, { mode: s.kind === "exam" ? "exam" : "practice", timeSec: s.timeSpent[q.id] || 0, answer: a, sessionId: s.id, timeUp: !!s.timeUp }); if (att) res.attemptId = att.id; }
  }
}
let submitting = false;
async function finalSubmit(auto) {
  if (submitting) return; submitting = true; const s = App.session; s.locking = true; s.timeUp = !!auto;
  App.timers.forEach(clearInterval); App.timers = [];
  await gradeAll(s, true); s.submittedAt = Date.now(); s.autoSubmitted = !!auto; summarise(s); Store.touch("sessions:" + s.id); submitting = false; renderShell(); rerender();
}
function summarise(s) {
  let score = 0, max = 0, pending = 0; const bySec = {}, byTopic = {};
  s.items.forEach((it) => { const r = s.results[it.q.id] || { score: 0, max: it.q.marks, status: "unanswered" }; max += it.q.marks; if (r.status === "pending") pending++; else score += r.score;
    const k = it.section || "All"; bySec[k] = bySec[k] || { score: 0, max: 0, n: 0, correct: 0 }; bySec[k].score += r.status === "pending" ? 0 : r.score; bySec[k].max += it.q.marks; bySec[k].n++; if (r.status === "correct") bySec[k].correct++;
    const t = it.q.topicId; byTopic[t] = byTopic[t] || { score: 0, max: 0, n: 0 }; byTopic[t].score += r.status === "pending" ? 0 : Math.max(0, r.score); byTopic[t].max += it.q.marks; byTopic[t].n++; });
  s.summary = { score: Math.round(score * 100) / 100, max, pending, bySec, byTopic, timeSec: Math.round(elapsed(s)) };
}
ACT.openReport = (el) => { App.session = Store.s.sessions[el.dataset.arg]; go("session"); };
function viewReport(s) {
  if (!s.summary) summarise(s); const S = s.summary;
  return `<div class="page-head"><div><div class="eyebrow">${s.kind === "exam" ? "Examination report" : "Practice report"}${s.autoSubmitted ? " · auto-submitted at time limit" : ""}</div><h1>${esc(s.title)}</h1><p class="muted">Submitted ${new Date(s.submittedAt).toLocaleString()} · time taken ${U.fmtTime(S.timeSec)}${s.durationSec ? " of " + U.fmtTime(s.durationSec) : ""}. Answers are locked.</p></div><button class="btn" data-act="goto" data-arg="${s.kind === "exam" ? "exams" : "practice"}">Back</button></div>
  <div class="grid kpis"><div class="card kpi"><div class="kpi-label">Score</div><div class="kpi-val">${fmtScore(S.score)}<span class="muted"> / ${S.max}</span></div>${bar(S.max ? S.score / S.max : 0)}<div class="muted small">${U.pct(S.max ? S.score / S.max : 0)}${S.pending ? ` · ${S.pending} answer(s) awaiting marking — score may rise` : ""}</div></div>
  <div class="card kpi"><div class="kpi-label">Correct</div><div class="kpi-val">${s.items.filter((x) => (s.results[x.q.id] || {}).status === "correct").length}<span class="muted"> / ${s.items.length}</span></div></div>
  <div class="card kpi"><div class="kpi-label">Unanswered</div><div class="kpi-val">${s.items.filter((x) => (s.results[x.q.id] || {}).status === "unanswered").length}</div></div>
  <div class="card kpi"><div class="kpi-label">Negative marks</div><div class="kpi-val">${fmtScore(-s.items.reduce((a, x) => a + Math.min(0, (s.results[x.q.id] || {}).score || 0), 0))}</div></div></div>
  <div class="grid two"><div class="card"><h2>By section</h2><table class="tbl"><tr><th>Section</th><th>Score</th><th>Correct</th></tr>${Object.entries(S.bySec).map(([k, v]) => `<tr><td>${esc(k)}</td><td>${fmtScore(v.score)}/${v.max} ${bar(v.max ? v.score / v.max : 0)}</td><td>${v.correct}/${v.n}</td></tr>`).join("")}</table></div>
  <div class="card"><h2>By topic</h2><table class="tbl"><tr><th>Topic</th><th>Score</th></tr>${Object.entries(S.byTopic).sort((a, b) => a[1].score / a[1].max - b[1].score / b[1].max).map(([k, v]) => `<tr><td>${esc(Cfg.topicName(k))}</td><td>${fmtScore(v.score)}/${v.max} ${bar(v.max ? v.score / v.max : 0)}</td></tr>`).join("")}</table></div></div>
  <h2>Question review</h2>${s.items.map((it, i) => { const q = it.q; const r = s.results[q.id] || { status: "unanswered", score: 0, max: q.marks }; const a = s.answers[q.id];
    return `<div class="card review"><div class="row between"><strong>Q${i + 1}. ${esc(q.title || TYPE_LABEL[q.type])}</strong><div class="row gap">${resPill(r.status, r.score, r.max)}<span class="muted small">${U.fmtTime(s.timeSpent[q.id] || 0)}</span></div></div>
    <div class="muted small">${esc(Cfg.topicName(q.topicId))}</div><details><summary class="small">Question & your answer</summary><div class="q-prompt">${md(q.prompt)}</div><div class="small"><strong>Your answer:</strong></div><pre class="code">${esc(Progress.answerText(q, a))}</pre></details>${resultBlock(q, r, a, { session: s, idx: i })}</div>`; }).join("")}`;
}
