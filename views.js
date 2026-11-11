/* ExamForge IDE — tutor, flashcards, mistakes, analytics, exam setup, boot */
"use strict";

/* ===================== AI Tutor ===================== */
App.ui.tutor = { subject: "math", topicId: "", mode: "beginner", msgs: [], busy: false };
const TUTOR_MODES = { beginner: "Beginner explanation", detailed: "Detailed conceptual explanation", derivation: "Step-by-step derivation / walkthrough", exam: "Exam-oriented explanation", mistakes: "Common mistakes", examples: "Practical examples", challenge: "Challenge questions" };
function viewTutor() {
  const t = App.ui.tutor; if (!Cfg.subj(t.subject)) t.subject = Store.cfg.subjects[0]?.id;
  const topic = t.topicId ? Cfg.topic(t.topicId) : null; const st = topic ? Progress.topicStats(topic.id) : null;
  return `<div class="page-head"><div><h1>AI Tutor</h1><p class="muted">Explanations adapt to your recorded accuracy and mistakes on the chosen topic. When you are attempting a question, use the hints inside the Practice Arena instead — the tutor gives full explanations.</p></div></div>
  ${AI.on ? "" : `<div class="card callout warn">Claude isn't available in this view (it needs the published page opened on claude.ai, with permission granted). Everything else in ExamForge works without it.</div>`}
  <div class="tutor"><div class="card form">
    <label>Subject<select data-chg="tuSet" data-k="subject">${subjOpts(t.subject)}</select></label>
    <label>Topic<select data-chg="tuSet" data-k="topicId">${topicOpts(t.subject, "", t.topicId, false).replace(/^/, '<option value="">Choose a topic…</option>')}</select></label>
    <label>Explanation mode<select data-chg="tuSet" data-k="mode">${opts(Object.entries(TUTOR_MODES), t.mode)}</select></label>
    ${st ? `<div class="small muted">Your evidence: ${st.attempts} attempts · recent accuracy ${U.pct(st.recentAcc)} · ${statusPill(st)}</div>` : ""}
    <button class="btn primary" data-act="tuExplain" ${t.topicId && AI.on && !t.busy ? "" : "disabled"}>Explain this topic</button>
    <button class="btn ghost" data-act="tuClear">Clear conversation</button></div>
  <div class="card chat"><div class="chat-log" id="chat-log">${t.msgs.length ? t.msgs.map((m) => `<div class="msg ${m.role}">${m.role === "assistant" ? md(m.content) : esc(m.content)}</div>`).join("") : `<p class="muted">Choose a topic and a mode, then ask anything — “why does floor division round down?”, “give me 3 K-map problems”, “quiz me on promises”.</p>`}</div>
    <form class="chat-in" data-form="tutor"><textarea id="tu-in" rows="2" placeholder="Ask the tutor…" ${AI.on ? "" : "disabled"}></textarea><button class="btn primary" data-act="tuSend" ${AI.on && !t.busy ? "" : "disabled"}>Send</button></form></div></div>`;
}
ACT.tuSet = (el) => { const t = App.ui.tutor; t[el.dataset.k] = el.value; if (el.dataset.k === "subject") t.topicId = ""; if (el.dataset.k === "topicId" && el.value) { Store.s.meta.opened[el.value] = Store.s.meta.opened[el.value] || Date.now(); Store.touch("meta"); } rerender(); };
ACT.tuClear = () => { App.ui.tutor.msgs = []; rerender(); };
function tutorSystem() {
  const t = App.ui.tutor; const topic = t.topicId ? Cfg.topic(t.topicId) : null;
  const st = topic ? Progress.topicStats(topic.id) : null;
  const mist = topic ? Object.values(Store.s.mistakes).filter((m) => m.topicId === topic.id && !m.resolved).slice(-4) : [];
  const level = !st || !st.attempts ? "no evidence yet (treat as new to the topic)" : st.recentAcc < 0.5 ? "struggling (recent accuracy " + U.pct(st.recentAcc) + ")" : st.recentAcc < 0.8 ? "developing (" + U.pct(st.recentAcc) + ")" : "strong (" + U.pct(st.recentAcc) + ")";
  return `You are ExamForge's tutor for a university student preparing for ${topic ? Cfg.subj(topic.unit.subject).name + " — " + Cfg.cycle(topic.unit.cycle).name : "exams"}.
Topic: ${topic ? topic.unit.title + " › " + topic.title : "(none chosen)"}${topic && topic.objectives.length ? "\nObjectives: " + topic.objectives.join("; ") : ""}
Current mode: ${TUTOR_MODES[t.mode]}.
Student level on this topic: ${level}.${mist.length ? "\nRecent unresolved mistakes on this topic: " + mist.map((m) => `[${MISTAKE_TYPES[m.category]}] ${m.prompt.slice(0, 160)}`).join(" | ") : ""}
Rules: stay within this syllabus topic; be accurate and honest about uncertainty; use $…$ for maths and fenced code blocks for code; for challenge questions do NOT reveal answers until the student replies; keep answers focused (under 350 words unless a derivation needs more).`;
}
async function tutorAsk(text) {
  const t = App.ui.tutor; if (t.busy) return; t.msgs.push({ role: "user", content: text }); t.busy = true;
  const msgs = [{ role: "user", content: tutorSystem() + "\n\n---\n" + t.msgs[0].content }].concat(t.msgs.slice(1));
  t.msgs.push({ role: "assistant", content: "…" }); rerender();
  const log = $("#chat-log"); const last = () => $$(".msg.assistant", log).pop();
  try {
    const out = await AI.text(msgs.slice(-14), { onText: ({ text }) => { const el = last(); if (el && App.view === "tutor") { el.innerHTML = md(text); log.scrollTop = log.scrollHeight; } } });
    t.msgs[t.msgs.length - 1].content = out;
  } catch (e) { t.msgs[t.msgs.length - 1].content = "⚠ " + e.message; }
  t.busy = false; if (App.view === "tutor") { rerender(); const l = $("#chat-log"); if (l) l.scrollTop = l.scrollHeight; }
}
ACT.tuExplain = () => { const t = App.ui.tutor; const topic = Cfg.topic(t.topicId); tutorAsk(`${TUTOR_MODES[t.mode]} of "${topic.title}", please.`); };
ACT.tuSend = () => { const v = $("#tu-in").value.trim(); if (v) tutorAsk(v); };

/* ===================== Flashcards ===================== */
App.ui.cards = { subject: "", topicId: "", tab: "review", flipped: false, queue: null, idx: 0 };
function cardFilter(c) { const u = App.ui.cards; return (!u.subject || c.subject === u.subject) && (!u.topicId || c.topicId === u.topicId); }
function viewCards() {
  const u = App.ui.cards; const all = Object.values(Store.s.cards).filter(cardFilter); const due = all.filter((c) => c.due <= U.today());
  const head = `<div class="page-head"><div><h1>Flashcards</h1><p class="muted">Spaced repetition (SM-2): cards you find hard come back sooner. Mistakes on objective questions become cards automatically.</p></div></div>
  <div class="row gap wrap"><select data-chg="cdSet" data-k="subject">${subjOpts(u.subject, true)}</select><select data-chg="cdSet" data-k="topicId">${topicOpts(u.subject, "", u.topicId)}</select>
  <div class="tabs inline">${[["review", `Review (${due.length} due)`], ["manage", `All cards (${all.length})`]].map(([k, l]) => `<button class="tab ${u.tab === k ? "on" : ""}" data-act="cdTab" data-arg="${k}">${l}</button>`).join("")}</div></div>`;
  if (u.tab === "manage") {
    return head + `<div class="row gap mt"><button class="btn primary" data-act="cdNew">New card</button>${AI.on ? `<button class="btn" data-act="cdGen" ${u.topicId ? "" : "disabled title='Choose a topic first'"}>Generate for topic (Claude)</button>` : ""}</div>
    <table class="tbl mt"><tr><th>Front</th><th>Topic</th><th>Status</th><th>Due</th><th></th></tr>${all.sort((a, b) => a.due.localeCompare(b.due)).map((c) => `<tr><td class="small">${md(c.front.slice(0, 220))}</td><td class="small">${esc(Cfg.topicName(c.topicId))}</td><td>${pill(c.status)} ${pill(c.source)}</td><td class="small">${c.due}</td><td class="nowrap"><button class="btn sm ghost" data-act="cdEdit" data-arg="${c.id}">Edit</button> <button class="btn sm ghost" data-act="cdDel" data-arg="${c.id}" aria-label="Delete">✕</button></td></tr>`).join("") || `<tr><td colspan="5" class="muted">No cards for this filter.</td></tr>`}</table>`;
  }
  if (!u.queue) { u.queue = U.shuffle(due.map((c) => c.id)); u.idx = 0; u.flipped = false; }
  const id = u.queue[u.idx]; const c = id && Store.s.cards[id];
  if (!c) return head + `<div class="card empty mt">Nothing due${all.length ? " — next card due " + all.map((x) => x.due).sort()[0] : ""}. <button class="btn sm" data-act="cdTab" data-arg="manage">Manage cards</button> <button class="btn sm ghost" data-act="cdAll">Review all anyway</button></div>`;
  return head + `<div class="flash-wrap"><div class="muted small">Card ${u.idx + 1} of ${u.queue.length} · ${esc(Cfg.topicName(c.topicId))} · ${pill(c.difficulty || "medium")}</div>
    <button class="card flash ${u.flipped ? "flipped" : ""}" data-act="cdFlip"><div class="eyebrow">${u.flipped ? "Answer" : "Question"}</div><div class="flash-body">${md(u.flipped ? c.back : c.front)}</div>${u.flipped ? "" : `<div class="muted small">Click or press space to reveal</div>`}</button>
    ${u.flipped ? `<div class="row gap center">${[[0, "Again", "bad"], [3, "Hard", "warn"], [4, "Good", "ok"], [5, "Easy", "ok"]].map(([q, l, cls]) => `<button class="btn ${cls}" data-act="cdRate" data-arg="${q}">${l}<span class="muted small"> ${preview(c, q)}</span></button>`).join("")}</div>` : ""}</div>`;
}
function preview(c, q) { const x = SRS.review(U.clone(c), q); const d = U.daysBetween(U.today(), x.due); return d <= 1 ? "1d" : d + "d"; }
ACT.cdSet = (el) => { App.ui.cards[el.dataset.k] = el.value; if (el.dataset.k === "subject") App.ui.cards.topicId = ""; App.ui.cards.queue = null; rerender(); };
ACT.cdTab = (el) => { App.ui.cards.tab = el.dataset.arg; App.ui.cards.queue = null; rerender(); };
ACT.cdAll = () => { const u = App.ui.cards; u.queue = U.shuffle(Object.values(Store.s.cards).filter(cardFilter).map((c) => c.id)); u.idx = 0; u.flipped = false; rerender(); };
ACT.cdFlip = () => { App.ui.cards.flipped = !App.ui.cards.flipped; rerender(); };
ACT.cdRate = (el) => { const u = App.ui.cards; const c = Store.s.cards[u.queue[u.idx]]; SRS.review(c, +el.dataset.arg); Store.touch("cards:" + c.id); const d = U.today(); Store.s.meta.activity[d] = (Store.s.meta.activity[d] || 0) + 1; Store.touch("meta"); if (+el.dataset.arg === 0) u.queue.push(c.id); u.idx++; u.flipped = false; renderShell(); rerender(); };
document.addEventListener("keydown", (e) => { if (App.view === "flashcards" && App.ui.cards.tab === "review" && e.key === " " && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); ACT.cdFlip(); } });
function cardForm(c) {
  return `<h2>${c.id ? "Edit card" : "New card"}</h2><div class="form"><label>Subject<select id="cf-subj">${subjOpts(c.subject || App.ui.cards.subject || Store.cfg.subjects[0].id)}</select></label>
  <label>Topic<select id="cf-topic">${topicOpts(c.subject || App.ui.cards.subject || Store.cfg.subjects[0].id, "", c.topicId || App.ui.cards.topicId, false)}</select></label>
  <label>Front (question)<textarea id="cf-front" rows="3">${esc(c.front || "")}</textarea></label><label>Back (answer)<textarea id="cf-back" rows="4">${esc(c.back || "")}</textarea></label>
  <label>Difficulty<select id="cf-diff">${diffOpts(c.difficulty || "medium", false)}</select></label></div>`;
}
function saveCardForm(m, c) {
  const front = $("#cf-front", m).value.trim(), back = $("#cf-back", m).value.trim(); if (!front || !back) { toast("Front and back are required."); return false; }
  const card = Object.assign(c.id ? c : Object.assign({ id: U.uid("c"), source: "manual" }, SRS.blank()), { subject: $("#cf-subj", m).value, topicId: $("#cf-topic", m).value, front, back, difficulty: $("#cf-diff", m).value });
  Store.s.cards[card.id] = card; Store.touch("cards:" + card.id); App.ui.cards.queue = null; rerender();
}
ACT.cdNew = () => { const m = modal(cardForm({}), { okText: "Save", onOk: (m) => saveCardForm(m, {}) }); $("#cf-subj", m).addEventListener("change", (e) => { $("#cf-topic", m).innerHTML = topicOpts(e.target.value, "", "", false); }); };
ACT.cdEdit = (el) => { const c = Store.s.cards[el.dataset.arg]; modal(cardForm(c), { okText: "Save", onOk: (m) => saveCardForm(m, c) }); };
ACT.cdDel = (el) => confirmDlg("Delete this card?", () => { Store.remove("cards", el.dataset.arg); rerender(); }, "Delete");
ACT.cdGen = async (el) => {
  const u = App.ui.cards; el.disabled = true; el.textContent = "Generating…";
  try { const cards = await AI.generateCards(u.topicId, 8); const t = Cfg.topic(u.topicId);
    cards.forEach((x) => { const id = U.uid("c"); Store.s.cards[id] = Object.assign({ id, subject: t.unit.subject, topicId: t.id, front: x.front, back: x.back, source: "ai", difficulty: "medium" }, SRS.blank()); Store.touch("cards:" + id); });
    toast(`${cards.length} cards added. Review them for accuracy — they were written by Claude.`); }
  catch (e) { toast(e.message, "bad"); }
  App.ui.cards.queue = null; rerender();
};

/* ===================== Mistake Notebook ===================== */
App.ui.mk = { subject: "", category: "", state: "open" };
function viewMistakes() {
  const f = App.ui.mk; const all = Object.values(Store.s.mistakes).sort((a, b) => (b.lastWrong || b.ts) - (a.lastWrong || a.ts));
  const list = all.filter((m) => (!f.subject || m.subject === f.subject) && (!f.category || m.category === f.category) && (f.state === "all" || (f.state === "open" ? !m.resolved : f.state === "resolved" ? m.resolved : f.state === "repeated" ? m.repeats > 0 : m.retestDue <= U.today() && !m.resolved)));
  const counts = {}; all.filter((m) => !m.resolved).forEach((m) => { counts[m.category] = (counts[m.category] || 0) + 1; });
  return `<div class="page-head"><div><h1>Mistake Notebook</h1><p class="muted">Every incorrect, partial or unanswered (timed) response is recorded with your answer, the correct solution and a scheduled retest. A mistake is resolved after two correct retests in a row.</p></div>${Progress.dueRetests().length ? `<button class="btn primary" data-act="retestDue">Retest ${Progress.dueRetests().length} due</button>` : ""}</div>
  <div class="row gap wrap"><select data-chg="mkSet" data-k="subject">${subjOpts(f.subject, true)}</select><select data-chg="mkSet" data-k="category">${opts([["", "All categories"]].concat(Object.entries(MISTAKE_TYPES).map(([k, v]) => [k, v + (counts[k] ? ` (${counts[k]})` : "")])), f.category)}</select>
  <select data-chg="mkSet" data-k="state">${opts([["open", "Open"], ["due", "Retest due"], ["repeated", "Repeated"], ["resolved", "Resolved"], ["all", "All"]], f.state)}</select><span class="muted small">${list.length} shown</span></div>
  ${list.length ? list.map((m) => `<div class="card mistake ${m.resolved ? "resolved" : ""}"><div class="row between"><div><strong>${esc(m.title || TYPE_LABEL[m.qType])}</strong> <span class="muted small">· ${esc(Cfg.topicName(m.topicId))} · ${new Date(m.ts).toLocaleDateString()}</span></div>
    <div class="row gap">${m.repeats ? pill(`Repeated ×${m.repeats}`, "bad") : ""}${m.resolved ? pill("Resolved", "ok") : pill("Retest " + (m.retestDue <= U.today() ? "due now" : m.retestDue), m.retestDue <= U.today() ? "warn" : "")}</div></div>
    <details><summary class="small">Question, your answer and the solution</summary><div class="q-prompt">${md(m.prompt)}</div><div class="grid two"><div><div class="small strong">Your answer</div><pre class="code">${esc(m.answer)}</pre></div><div><div class="small strong">Correct solution</div><div class="code-ish">${m.qType === "subjective" ? md(m.correct) : `<pre class="code">${esc(m.correct)}</pre>`}</div></div></div>
    ${m.explanation ? `<div class="small">${md(m.explanation)}</div>` : ""}</details>
    ${m.why ? `<div class="small why"><strong>Why it failed:</strong> ${md(m.why)}</div>` : ""}<div id="mx-${m.id}"></div>
    <div class="row gap wrap mt"><label class="small">Category <select class="mini" data-chg="mkCat" data-arg="${m.id}">${opts(Object.entries(MISTAKE_TYPES), m.category)}</select></label>
    <input class="grow small-in" placeholder="Your note (what to remember)" value="${esc(m.notes || "")}" data-chg="mkNote" data-arg="${m.id}">
    ${Cfg.q(m.qid) ? `<button class="btn sm" data-act="mkRetest" data-arg="${m.id}">Retest now</button>` : `<span class="muted small">question deleted</span>`}
    ${AI.on ? `<button class="btn sm ghost" data-act="mkExplain" data-arg="${m.id}">Explain (Claude)</button>` : ""}
    <button class="btn sm ghost" data-act="mkResolve" data-arg="${m.id}">${m.resolved ? "Reopen" : "Mark resolved"}</button><button class="btn sm ghost" data-act="mkDel" data-arg="${m.id}" aria-label="Delete">✕</button></div></div>`).join("") : `<div class="card empty">No mistakes for this filter${all.length ? "" : " yet — they'll appear here automatically as you practise"}.</div>`}`;
}
ACT.mkSet = (el) => { App.ui.mk[el.dataset.k] = el.value; rerender(); };
ACT.mkCat = (el) => { const m = Store.s.mistakes[el.dataset.arg]; m.category = el.value; Store.touch("mistakes:" + m.id); };
ACT.mkNote = (el) => { const m = Store.s.mistakes[el.dataset.arg]; m.notes = el.value; Store.touch("mistakes:" + m.id); };
ACT.mkResolve = (el) => { const m = Store.s.mistakes[el.dataset.arg]; m.resolved = !m.resolved; if (!m.resolved) m.retestDue = U.today(); Store.touch("mistakes:" + m.id); renderShell(); rerender(); };
ACT.mkDel = (el) => confirmDlg("Delete this mistake record?", () => { Store.remove("mistakes", el.dataset.arg); renderShell(); rerender(); }, "Delete");
ACT.mkRetest = (el) => { const m = Store.s.mistakes[el.dataset.arg]; const q = Cfg.q(m.qid); newSession({ kind: "practice", mode: "retest", feedback: "instant", title: "Retest · " + (q.title || TYPE_LABEL[q.type]), items: [{ q: U.clone(q), marks: q.marks, negative: 0, section: "" }] }); };
ACT.mkExplain = async (el) => { const m = Store.s.mistakes[el.dataset.arg]; const box = $("#mx-" + m.id); el.disabled = true; box.innerHTML = `<div class="muted small">Asking Claude…</div>`;
  try { const t = await AI.explainMistake({ q: { prompt: m.prompt }, correct: m.correct, answer: m.answer }); box.innerHTML = `<div class="ai-box">${md(t)}</div>`; typeset(box); } catch (e) { box.innerHTML = `<div class="err small">${esc(e.message)}</div>`; } el.disabled = false; };

/* ===================== Analytics ===================== */
App.ui.an = { subject: "", cycle: "" };
function viewAnalytics() {
  const f = App.ui.an; const all = Progress.all().filter((a) => a.status !== "pending" && (!f.subject || a.subject === f.subject) && (!f.cycle || (Cfg.topic(a.topicId) || { unit: {} }).unit.cycle === f.cycle));
  const acc = (xs) => { const m = xs.reduce((s, a) => s + a.max, 0); return m ? xs.reduce((s, a) => s + a.score, 0) / m : null; };
  const head = `<div class="page-head"><div><h1>Performance Analytics</h1><p class="muted">Accuracy = marks earned ÷ marks available. Questions awaiting marking are excluded.</p></div></div>
  <div class="row gap"><select data-chg="anSet" data-k="subject">${subjOpts(f.subject, true)}</select><select data-chg="anSet" data-k="cycle">${cycleOpts(f.cycle, true)}</select></div>`;
  if (!all.length) return head + `<div class="card empty mt">No attempts recorded for this filter yet.</div>`;
  const code = all.filter((a) => a.total); const passRate = code.length ? code.reduce((s, a) => s + a.passed, 0) / code.reduce((s, a) => s + a.total, 0) : null;
  const avgTime = all.filter((a) => a.timeSec).reduce((s, a, _, arr) => s + a.timeSec / arr.length, 0);
  const subjects = Store.cfg.subjects.map((s) => ({ name: s.name, xs: all.filter((a) => a.subject === s.id) })).filter((s) => s.xs.length);
  const types = Object.keys(TYPE_LABEL).map((t) => ({ t, xs: all.filter((a) => a.type === t) })).filter((x) => x.xs.length);
  const topics = {}; all.forEach((a) => { (topics[a.topicId] = topics[a.topicId] || []).push(a); });
  const days = []; for (let i = 29; i >= 0; i--) { const d = U.addDays(U.today(), -i); days.push({ d, n: (Store.s.days[d]?.attempts || []).filter((a) => (!f.subject || a.subject === f.subject)).length }); }
  const maxDay = Math.max(1, ...days.map((d) => d.n));
  const sessions = Object.values(Store.s.sessions).filter((s) => s.submittedAt && s.summary && s.summary.max).sort((a, b) => a.submittedAt - b.submittedAt).slice(-12);
  const mistakes = Object.values(Store.s.mistakes); const cats = {}; mistakes.forEach((m) => { cats[m.category] = (cats[m.category] || 0) + 1; }); const maxCat = Math.max(1, ...Object.values(cats));
  const hbars = (rows) => `<div class="hbars">${rows.map((r) => `<div class="hbar-row" title="${esc(r.tip || "")}"><span class="hbar-label">${esc(r.label)}</span><span class="hbar"><span style="width:${U.clamp(r.v, 0, 1) * 100}%"></span></span><span class="hbar-val">${esc(r.text)}</span></div>`).join("")}</div>`;
  return head + `<div class="grid kpis mt"><div class="card kpi"><div class="kpi-label">Attempts</div><div class="kpi-val">${all.length}</div></div><div class="card kpi"><div class="kpi-label">Overall accuracy</div><div class="kpi-val">${U.pct(acc(all))}</div></div>
  <div class="card kpi"><div class="kpi-label">Coding test pass rate</div><div class="kpi-val">${U.pct(passRate)}</div><div class="muted small">${code.reduce((s, a) => s + a.passed, 0)}/${code.reduce((s, a) => s + a.total, 0)} test cases</div></div><div class="card kpi"><div class="kpi-label">Avg time / question</div><div class="kpi-val">${U.fmtTime(avgTime)}</div></div></div>
  <div class="grid two"><div class="card"><h2>Subject-wise accuracy</h2>${hbars(subjects.map((s) => ({ label: s.name, v: acc(s.xs), text: U.pct(acc(s.xs)) + " · " + s.xs.length, tip: s.xs.length + " attempts" })))}</div>
  <div class="card"><h2>By question type</h2>${hbars(types.map((x) => { const ts = x.xs.filter((a) => a.timeSec); return { label: TYPE_LABEL[x.t], v: acc(x.xs), text: U.pct(acc(x.xs)) + " · " + x.xs.length, tip: `avg ${U.fmtTime(ts.reduce((s, a) => s + a.timeSec, 0) / (ts.length || 1))} per question` }; }))}<p class="muted small">MCQ = objective accuracy; Subjective = rubric marks earned; Coding/Debugging include partial marks from test cases.</p></div></div>
  <div class="card"><h2>Activity — last 30 days</h2><div class="cols" role="img" aria-label="Attempts per day for the last 30 days">${days.map((d) => `<div class="col" title="${d.d}: ${d.n} attempts"><span style="height:${(d.n / maxDay) * 100}%"></span></div>`).join("")}</div><div class="row between muted small"><span>${days[0].d}</span><span>today</span></div></div>
  <div class="grid two"><div class="card"><h2>Session scores</h2>${sessions.length ? hbars(sessions.map((s) => ({ label: new Date(s.submittedAt).toLocaleDateString() + " · " + s.title.slice(0, 28), v: s.summary.score / s.summary.max, text: U.pct(s.summary.score / s.summary.max) }))) : `<p class="muted small">Complete a practice or exam session to see trends.</p>`}</div>
  <div class="card"><h2>Mistake patterns</h2>${Object.keys(cats).length ? hbars(Object.entries(cats).sort((a, b) => b[1] - a[1]).map(([k, n]) => ({ label: MISTAKE_TYPES[k], v: n / maxCat, text: String(n) }))) : `<p class="muted small">No mistakes recorded.</p>`}<p class="small mt">Repeated mistakes: <strong>${mistakes.filter((m) => m.repeats).length}</strong> · Resolved: <strong>${mistakes.filter((m) => m.resolved).length}</strong> of ${mistakes.length}</p></div></div>
  <div class="card"><h2>Topic-wise accuracy</h2><table class="tbl"><tr><th>Topic</th><th>Attempts</th><th>Accuracy</th><th>Recent</th><th>Status</th></tr>${Object.entries(topics).map(([id, xs]) => ({ id, xs, st: Progress.topicStats(id) })).sort((a, b) => (acc(a.xs) ?? 0) - (acc(b.xs) ?? 0)).map((r) => `<tr><td>${esc(Cfg.topicName(r.id))}</td><td>${r.xs.length}</td><td>${U.pct(acc(r.xs))} ${bar(acc(r.xs))}</td><td>${U.pct(r.st.recentAcc)}</td><td>${statusPill(r.st)}</td></tr>`).join("")}</table></div>`;
}
ACT.anSet = (el) => { App.ui.an[el.dataset.k] = el.value; rerender(); };

/* ===================== Exam Setup (customisation) ===================== */
App.ui.su = { tab: "calendar", subject: "math", cycle: "mid", qf: { subject: "", cycle: "", topic: "", type: "any", source: "" }, openExam: null };
function viewSetup() {
  const u = App.ui.su;
  const tabs = [["calendar", "Calendar & patterns"], ["syllabus", "Syllabus"], ["bank", "Question bank"], ["rules", "Rules & settings"], ["backup", "Backup & reset"]];
  const body = { calendar: setupCalendar, syllabus: setupSyllabus, bank: setupBank, rules: setupRules, backup: setupBackup }[u.tab]();
  return `<div class="page-head"><div><h1>Exam Setup</h1><p class="muted">Customise ExamForge to your exams: dates, patterns, marking, syllabus, questions and rules. Changes save automatically.</p></div></div>
  <div class="tabs">${tabs.map(([k, l]) => `<button class="tab ${u.tab === k ? "on" : ""}" data-act="suTab" data-arg="${k}">${l}</button>`).join("")}</div>${body}`;
}
ACT.suTab = (el) => { App.ui.su.tab = el.dataset.arg; rerender(); };
function saveCfg() { Store.touch("config"); }

/* ---- calendar & patterns ---- */
function setupCalendar() {
  const c = Store.cfg; const u = App.ui.su;
  return `<div class="grid two"><div class="card"><h2>Subjects</h2>${c.subjects.map((s, i) => `<div class="row gap"><input value="${esc(s.name)}" data-chg="suSubjName" data-i="${i}" aria-label="Subject name"><span class="muted small">id: ${esc(s.id)}</span><button class="btn sm ghost" data-act="suSubjDel" data-i="${i}" aria-label="Delete subject">✕</button></div>`).join("")}<button class="btn sm mt" data-act="suSubjAdd">+ Add subject</button></div>
  <div class="card"><h2>Examination cycles</h2>${c.cycles.map((s, i) => `<div class="row gap"><input value="${esc(s.name)}" data-chg="suCycName" data-i="${i}" aria-label="Cycle name"><span class="muted small">id: ${esc(s.id)}</span><button class="btn sm ghost" data-act="suCycDel" data-i="${i}" aria-label="Delete cycle">✕</button></div>`).join("")}<button class="btn sm mt" data-act="suCycAdd">+ Add cycle</button><p class="muted small">e.g. a makeup exam or Unit Test 3. The second document labels the 23–26 Nov papers “Unit Test 2”.</p></div></div>
  <div class="card"><div class="row between"><h2>Examinations</h2><button class="btn sm" data-act="suExAdd">+ Add examination</button></div>
  <table class="tbl"><tr><th>Subject</th><th>Cycle</th><th>Date</th><th>Start time</th><th>Duration (min)</th><th>Pattern</th><th></th></tr>${Cfg.exams().map((e) => `<tr>
    <td><select data-chg="suEx" data-id="${e.id}" data-k="subject">${subjOpts(e.subject)}</select></td><td><select data-chg="suEx" data-id="${e.id}" data-k="cycle">${cycleOpts(e.cycle)}</select></td>
    <td><input type="date" value="${e.date}" data-chg="suEx" data-id="${e.id}" data-k="date"></td><td><input type="time" value="${e.time || ""}" data-chg="suEx" data-id="${e.id}" data-k="time"></td>
    <td><input type="number" min="1" value="${e.durationMin || ""}" data-chg="suEx" data-id="${e.id}" data-k="durationMin" style="width:80px"></td>
    <td>${e.pattern.length} sections · ${e.pattern.reduce((s, x) => s + x.count * x.marks, 0)} marks ${e.official ? pill("official", "ok") : pill("blueprint", "warn")}</td>
    <td class="nowrap"><button class="btn sm" data-act="suExOpen" data-arg="${e.id}">${u.openExam === e.id ? "Close" : "Edit pattern"}</button> <button class="btn sm ghost" data-act="suExDel" data-arg="${e.id}" aria-label="Delete exam">✕</button></td></tr>
    ${u.openExam === e.id ? `<tr><td colspan="7">${patternEditor(e)}</td></tr>` : ""}`).join("")}</table></div>`;
}
function patternEditor(e) {
  const tps = Cfg.subtopics(e.subject, e.cycle);
  return `<div class="pattern"><label class="chk"><input type="checkbox" data-chg="suEx" data-id="${e.id}" data-k="official" ${e.official ? "checked" : ""}> This is the institution's official pattern</label>
  <label class="small">Notes<input value="${esc(e.notes || "")}" data-chg="suEx" data-id="${e.id}" data-k="notes" placeholder="e.g. venue, allowed materials, instructions"></label>
  <table class="tbl"><tr><th>Section label</th><th>Question type</th><th>Count</th><th>Marks each</th><th>Negative</th><th>Difficulty</th><th>Topics (empty = whole cycle)</th><th>Available</th><th></th></tr>
  ${e.pattern.map((s, i) => { const av = Cfg.questions({ subject: e.subject, cycle: e.cycle, type: s.type, difficulty: s.difficulty, topics: s.topics }).length; return `<tr>
    <td><input value="${esc(s.label)}" data-chg="suSec" data-id="${e.id}" data-i="${i}" data-k="label"></td>
    <td><select data-chg="suSec" data-id="${e.id}" data-i="${i}" data-k="type">${opts(Object.entries(TYPE_LABEL).map(([k, v]) => [k, k === "mcq" ? "MCQ (incl. multi-select & output)" : v]), s.type)}</select></td>
    <td><input type="number" min="1" value="${s.count}" data-chg="suSec" data-id="${e.id}" data-i="${i}" data-k="count" style="width:64px"></td>
    <td><input type="number" min="0" step="0.5" value="${s.marks}" data-chg="suSec" data-id="${e.id}" data-i="${i}" data-k="marks" style="width:64px"></td>
    <td><input type="number" min="0" step="0.25" value="${s.negative || 0}" data-chg="suSec" data-id="${e.id}" data-i="${i}" data-k="negative" style="width:64px"></td>
    <td><select data-chg="suSec" data-id="${e.id}" data-i="${i}" data-k="difficulty">${diffOpts(s.difficulty || "any")}</select></td>
    <td><select multiple size="3" data-chg="suSecTopics" data-id="${e.id}" data-i="${i}">${tps.map((t) => `<option value="${t.id}" ${(s.topics || []).includes(t.id) ? "selected" : ""}>${esc(t.unit.title + " › " + t.title)}</option>`).join("")}</select></td>
    <td class="${av < s.count ? "warn-text" : ""}">${av}</td><td><button class="btn sm ghost" data-act="suSecDel" data-id="${e.id}" data-i="${i}" aria-label="Delete section">✕</button></td></tr>`; }).join("")}</table>
  <button class="btn sm" data-act="suSecAdd" data-id="${e.id}">+ Add section</button> <span class="muted small">Marks set here override each question's own marks inside generated papers.</span></div>`;
}
const exById = (id) => Store.cfg.exams.find((e) => e.id === id);
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 20) || U.uid("x");
ACT.suSubjName = (el) => { Store.cfg.subjects[+el.dataset.i].name = el.value; saveCfg(); };
ACT.suCycName = (el) => { Store.cfg.cycles[+el.dataset.i].name = el.value; saveCfg(); };
ACT.suSubjAdd = () => modal(`<label>Subject name<input id="nm"></label>`, { okText: "Add", onOk: (m) => { const n = $("#nm", m).value.trim(); if (!n) return false; let id = slug(n); while (Cfg.subj(id).name !== id || Store.cfg.subjects.some((s) => s.id === id)) id += "x"; Store.cfg.subjects.push({ id, name: n }); saveCfg(); rerender(); } });
ACT.suCycAdd = () => modal(`<label>Cycle name (e.g. Unit Test 3, End-Semester)<input id="nm"></label>`, { okText: "Add", onOk: (m) => { const n = $("#nm", m).value.trim(); if (!n) return false; let id = slug(n); while (Store.cfg.cycles.some((s) => s.id === id)) id += "x"; Store.cfg.cycles.push({ id, name: n }); saveCfg(); rerender(); } });
ACT.suSubjDel = (el) => { const s = Store.cfg.subjects[+el.dataset.i]; const n = Cfg.questions({ subject: s.id }).length + Cfg.units(s.id).length; confirmDlg(`Delete subject “${esc(s.name)}”${n ? ` and its ${Cfg.units(s.id).length} syllabus units and ${Cfg.questions({ subject: s.id }).length} questions` : ""}?`, () => { const c = Store.cfg; c.subjects.splice(+el.dataset.i, 1); c.syllabus = c.syllabus.filter((u) => u.subject !== s.id); c.questions = c.questions.filter((q) => q.subject !== s.id); c.exams = c.exams.filter((e) => e.subject !== s.id); saveCfg(); rerender(); }, "Delete"); };
ACT.suCycDel = (el) => { const cy = Store.cfg.cycles[+el.dataset.i]; confirmDlg(`Delete cycle “${esc(cy.name)}”, its syllabus units and exams? Questions linked to its topics stay in the bank but become unassigned.`, () => { const c = Store.cfg; c.cycles.splice(+el.dataset.i, 1); c.syllabus = c.syllabus.filter((u) => u.cycle !== cy.id); c.exams = c.exams.filter((e) => e.cycle !== cy.id); saveCfg(); rerender(); }, "Delete"); };
ACT.suExAdd = () => { const c = Store.cfg; const e = { id: U.uid("ex"), subject: c.subjects[0].id, cycle: c.cycles[0].id, date: U.today(), time: "", durationMin: 60, official: false, notes: "", pattern: [{ label: "Section A", type: "mcq", count: 10, marks: 1, negative: 0, topics: [], difficulty: "any" }] }; c.exams.push(e); App.ui.su.openExam = e.id; saveCfg(); rerender(); };
ACT.suExDel = (el) => confirmDlg("Delete this examination from the calendar?", () => { Store.cfg.exams = Store.cfg.exams.filter((e) => e.id !== el.dataset.arg); saveCfg(); rerender(); }, "Delete");
ACT.suExOpen = (el) => { App.ui.su.openExam = App.ui.su.openExam === el.dataset.arg ? null : el.dataset.arg; rerender(); };
ACT.suEx = (el) => { const e = exById(el.dataset.id); const k = el.dataset.k; e[k] = k === "official" ? el.checked : k === "durationMin" ? +el.value || null : el.value; if (k === "subject" || k === "cycle") e.pattern.forEach((s) => { s.topics = []; }); saveCfg(); if (["subject", "cycle", "official"].includes(k)) rerender(); };
ACT.suSec = (el) => { const s = exById(el.dataset.id).pattern[+el.dataset.i]; const k = el.dataset.k; s[k] = ["count", "marks", "negative"].includes(k) ? +el.value || 0 : el.value; saveCfg(); rerender(); };
ACT.suSecTopics = (el) => { exById(el.dataset.id).pattern[+el.dataset.i].topics = Array.from(el.selectedOptions).map((o) => o.value); saveCfg(); };
ACT.suSecAdd = (el) => { exById(el.dataset.id).pattern.push({ label: "New section", type: "mcq", count: 5, marks: 1, negative: 0, topics: [], difficulty: "any" }); saveCfg(); rerender(); };
ACT.suSecDel = (el) => { exById(el.dataset.id).pattern.splice(+el.dataset.i, 1); saveCfg(); rerender(); };

/* ---- syllabus editor ---- */
function setupSyllabus() {
  const u = App.ui.su; if (!Cfg.subj(u.subject)) u.subject = Store.cfg.subjects[0]?.id;
  const units = Cfg.units(u.subject, u.cycle);
  const types = Object.keys(TYPE_LABEL);
  return `<div class="row gap mt"><select data-chg="suSyl" data-k="subject">${subjOpts(u.subject)}</select><select data-chg="suSyl" data-k="cycle">${cycleOpts(u.cycle)}</select>
  <button class="btn sm" data-act="suUnitAdd">+ Add unit</button><button class="btn sm ghost" data-act="suSylImport">Import from text</button></div>
  ${units.length ? units.map((un, ui) => `<div class="card unit-edit"><div class="row gap"><input class="grow strong" value="${esc(un.title)}" data-chg="suUnit" data-id="${un.id}" data-k="title" aria-label="Unit title"><input value="${esc(un.group || "")}" placeholder="Part / group label" data-chg="suUnit" data-id="${un.id}" data-k="group">
    <button class="btn sm ghost" data-act="suUnitMove" data-id="${un.id}" data-d="-1" ${ui ? "" : "disabled"} aria-label="Move up">↑</button><button class="btn sm ghost" data-act="suUnitMove" data-id="${un.id}" data-d="1" ${ui < units.length - 1 ? "" : "disabled"} aria-label="Move down">↓</button><button class="btn sm ghost" data-act="suUnitDel" data-id="${un.id}" aria-label="Delete unit">✕</button></div>
    <table class="tbl"><tr><th>Subtopic</th><th>Learning objectives (one per line)</th><th>Difficulty</th><th>Assessment types</th><th>Qs</th><th></th></tr>${un.subtopics.map((s, si) => `<tr>
      <td><input value="${esc(s.title)}" data-chg="suSub" data-u="${un.id}" data-i="${si}" data-k="title"></td>
      <td><textarea rows="2" data-chg="suSub" data-u="${un.id}" data-i="${si}" data-k="objectives">${esc(s.objectives.join("\n"))}</textarea></td>
      <td><select data-chg="suSub" data-u="${un.id}" data-i="${si}" data-k="difficulty">${diffOpts(s.difficulty, false)}</select></td>
      <td class="small">${types.map((t) => `<label class="chk"><input type="checkbox" data-chg="suSubType" data-u="${un.id}" data-i="${si}" value="${t}" ${(s.types || []).includes(t) ? "checked" : ""}>${TYPE_LABEL[t]}</label>`).join("")}</td>
      <td>${Cfg.questions({ topics: [s.id] }).length}</td><td><button class="btn sm ghost" data-act="suSubDel" data-u="${un.id}" data-i="${si}" aria-label="Delete subtopic">✕</button></td></tr>`).join("")}</table>
    <button class="btn sm ghost" data-act="suSubAdd" data-u="${un.id}">+ Add subtopic</button></div>`).join("") : `<div class="card empty mt">No units for this subject and cycle yet.</div>`}`;
}
const unitById = (id) => Store.cfg.syllabus.find((u) => u.id === id);
ACT.suSyl = (el) => { App.ui.su[el.dataset.k] = el.value; rerender(); };
ACT.suUnit = (el) => { unitById(el.dataset.id)[el.dataset.k] = el.value; saveCfg(); };
ACT.suSub = (el) => { const s = unitById(el.dataset.u).subtopics[+el.dataset.i]; s[el.dataset.k] = el.dataset.k === "objectives" ? el.value.split("\n").map((x) => x.trim()).filter(Boolean) : el.value; saveCfg(); };
ACT.suSubType = (el) => { const s = unitById(el.dataset.u).subtopics[+el.dataset.i]; s.types = s.types || []; if (el.checked) s.types.push(el.value); else s.types = s.types.filter((t) => t !== el.value); saveCfg(); };
function newUnit(subject, cycle, title, group, subs) { const id = `${subject}.${cycle}.${U.uid("u")}`; return { id, subject, cycle, group: group || "", title, subtopics: subs.map((t) => ({ id: id + "." + U.uid("s"), title: t, objectives: [], difficulty: "medium", types: [] })) }; }
ACT.suUnitAdd = () => { const u = App.ui.su; Store.cfg.syllabus.push(newUnit(u.subject, u.cycle, "New unit", "", ["New subtopic"])); saveCfg(); rerender(); };
ACT.suUnitDel = (el) => { const un = unitById(el.dataset.id); const n = un.subtopics.reduce((s, t) => s + Cfg.questions({ topics: [t.id] }).length, 0); confirmDlg(`Delete unit “${esc(un.title)}”?${n ? ` ${n} question(s) linked to it will become unassigned (not deleted).` : ""}`, () => { Store.cfg.syllabus = Store.cfg.syllabus.filter((x) => x.id !== un.id); saveCfg(); rerender(); }, "Delete"); };
ACT.suUnitMove = (el) => { const S = Store.cfg.syllabus; const un = unitById(el.dataset.id); const sib = S.filter((x) => x.subject === un.subject && x.cycle === un.cycle); const j = sib.indexOf(un) + +el.dataset.d; const other = sib[j]; if (!other) return; const a = S.indexOf(un), b = S.indexOf(other); [S[a], S[b]] = [S[b], S[a]]; saveCfg(); rerender(); };
ACT.suSubAdd = (el) => { const un = unitById(el.dataset.u); un.subtopics.push({ id: un.id + "." + U.uid("s"), title: "New subtopic", objectives: [], difficulty: "medium", types: [] }); saveCfg(); rerender(); };
ACT.suSubDel = (el) => { const un = unitById(el.dataset.u); un.subtopics.splice(+el.dataset.i, 1); saveCfg(); rerender(); };
function parsePlainSyllabus(text) {
  const units = []; let group = "", cur = null;
  text.replace(/\r/g, "").split("\n").forEach((raw) => {
    const l = raw.replace(/\t/g, "    "); if (!l.trim()) return;
    const t = l.trim().replace(/^\d+[.)]\s*/, "");
    if (/^#{1,2}\s|^(part|section)\b/i.test(l.trim())) { group = t.replace(/^#+\s*/, ""); return; }
    if (/^\s+|^[-*•]/.test(l)) { if (!cur) { cur = { group, title: "Topics", subtopics: [] }; units.push(cur); } cur.subtopics.push(t.replace(/^[-*•]\s*/, "").replace(/\.$/, "")); return; }
    cur = { group, title: t.replace(/^#+\s*/, ""), subtopics: [] }; units.push(cur);
  });
  units.forEach((u) => { if (!u.subtopics.length) u.subtopics = [u.title]; });
  return units;
}
ACT.suSylImport = () => {
  const u = App.ui.su;
  const m = modal(`<h2>Import syllabus — ${esc(Cfg.subj(u.subject).name)} · ${esc(Cfg.cycle(u.cycle).name)}</h2><p class="small muted">Paste the syllabus. Plain format: one unit per line, subtopics indented or starting with “-”. Lines starting with “Part …” or “## …” set a group label.${AI.on ? " Or let Claude structure messy text (copied from a PDF)." : ""}</p>
    <textarea id="imp" rows="12" placeholder="Part A — Bridge&#10;Numbers and Reasoning&#10;  - Word Problems decoding&#10;  - Number Theory and Mental Math"></textarea>
    <div class="row gap mt"><button class="btn sm" id="imp-plain">Preview (plain)</button>${AI.on ? `<button class="btn sm ghost" id="imp-ai">Structure with Claude</button>` : ""}<label class="chk small"><input type="checkbox" id="imp-replace"> Replace existing units for this subject & cycle</label></div><div id="imp-prev" class="mt"></div>`,
    { okText: "Import", wide: true, onOk: (m) => { const p = m._parsed; if (!p || !p.length) { toast("Preview first."); return false; } const c = Store.cfg; if ($("#imp-replace", m).checked) c.syllabus = c.syllabus.filter((x) => !(x.subject === u.subject && x.cycle === u.cycle)); p.forEach((x) => c.syllabus.push(newUnit(u.subject, u.cycle, x.title, x.group, x.subtopics))); saveCfg(); toast(`${p.length} units imported.`); rerender(); } });
  const show = (p) => { m._parsed = p; $("#imp-prev", m).innerHTML = p.length ? p.map((x) => `<div class="small">${x.group ? `<span class="muted">${esc(x.group)} · </span>` : ""}<strong>${esc(x.title)}</strong><ul>${x.subtopics.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></div>`).join("") : `<p class="muted">Nothing parsed.</p>`; };
  $("#imp-plain", m).onclick = () => show(parsePlainSyllabus($("#imp", m).value));
  const ai = $("#imp-ai", m); if (ai) ai.onclick = async () => { ai.disabled = true; ai.textContent = "Structuring…"; try { show(await AI.parseSyllabus($("#imp", m).value)); } catch (e) { toast(e.message, "bad"); } ai.disabled = false; ai.textContent = "Structure with Claude"; };
};

/* ---- question bank ---- */
function setupBank() {
  const f = App.ui.su.qf; const list = Cfg.questions({ subject: f.subject, cycle: f.cycle, topics: f.topic ? [f.topic] : [], type: f.type }).filter((q) => !f.source || q.source === f.source);
  const orphan = Store.cfg.questions.filter((q) => !Cfg.topic(q.topicId)).length;
  return `<div class="row gap wrap mt"><select data-chg="suQf" data-k="subject">${subjOpts(f.subject, true)}</select><select data-chg="suQf" data-k="cycle">${cycleOpts(f.cycle, true)}</select><select data-chg="suQf" data-k="topic">${topicOpts(f.subject, f.cycle, f.topic)}</select>
  <select data-chg="suQf" data-k="type">${typeOptsFor("", f.type)}</select><select data-chg="suQf" data-k="source">${opts([["", "Any source"], ["seed", "Starter"], ["manual", "Mine"], ["ai", "AI-generated"]], f.source)}</select></div>
  <div class="row gap mt"><button class="btn primary sm" data-act="qNew">+ New question</button>${AI.on ? `<button class="btn sm" data-act="qGen">Generate with Claude</button>` : ""}<button class="btn sm ghost" data-act="qImport">Import JSON</button><button class="btn sm ghost" data-act="qExport">Export shown (${list.length})</button><span class="muted small">${Store.cfg.questions.length} questions total${orphan ? ` · ${orphan} not linked to a syllabus topic` : ""}</span></div>
  <table class="tbl mt"><tr><th>Question</th><th>Type</th><th>Topic</th><th>Marks</th><th>Source</th><th></th></tr>${list.map((q) => `<tr><td class="small"><strong>${esc(q.title || "")}</strong> ${esc(q.prompt.replace(/```[\s\S]*?```/g, "[code]").slice(0, 110))}</td><td class="small">${TYPE_LABEL[q.type]}${q.lang ? " · " + q.lang : ""}${q.lab ? " · " + q.lab : ""}</td><td class="small">${esc(Cfg.topicName(q.topicId))}</td><td>${q.marks}</td>
    <td>${pill(q.source === "seed" ? "starter" : q.source === "ai" ? (q.reviewed ? "AI · reviewed" : "AI · unreviewed") : "mine", q.source === "ai" && !q.reviewed ? "warn" : "")}</td>
    <td class="nowrap"><button class="btn sm ghost" data-act="qTry" data-arg="${q.id}">Try</button> <button class="btn sm ghost" data-act="qEdit" data-arg="${q.id}">Edit</button> <button class="btn sm ghost" data-act="qDup" data-arg="${q.id}">Copy</button> <button class="btn sm ghost" data-act="qDel" data-arg="${q.id}" aria-label="Delete">✕</button></td></tr>`).join("") || `<tr><td colspan="6" class="muted">No questions match.</td></tr>`}</table>`;
}
ACT.suQf = (el) => { const f = App.ui.su.qf; f[el.dataset.k] = el.value; if (el.dataset.k !== "topic" && el.dataset.k !== "type" && el.dataset.k !== "source") f.topic = ""; rerender(); };
ACT.qTry = (el) => { const q = Cfg.q(el.dataset.arg); newSession({ kind: "practice", feedback: "instant", title: "Preview · " + (q.title || TYPE_LABEL[q.type]), items: [{ q: U.clone(q), marks: q.marks, negative: 0, section: "" }] }); };
ACT.qDup = (el) => { const q = U.clone(Cfg.q(el.dataset.arg)); q.id = U.uid("q"); q.source = "manual"; q.title = (q.title || "") + " (copy)"; Store.cfg.questions.push(q); saveCfg(); rerender(); };
ACT.qDel = (el) => confirmDlg("Delete this question? Past attempts stay in analytics.", () => { Store.cfg.questions = Store.cfg.questions.filter((q) => q.id !== el.dataset.arg); saveCfg(); rerender(); }, "Delete");
ACT.qExport = () => { const f = App.ui.su.qf; const list = Cfg.questions({ subject: f.subject, cycle: f.cycle, topics: f.topic ? [f.topic] : [], type: f.type }).filter((q) => !f.source || q.source === f.source); exportJson("examforge-questions.json", { questions: list }); };
ACT.qImport = () => importJson("Import questions", (obj) => {
  const qs = Array.isArray(obj) ? obj : obj.questions; if (!Array.isArray(qs)) throw new Error("Expected an array of questions or {questions:[…]}");
  let n = 0; qs.forEach((q) => { if (!q.type || !q.prompt) return; q.id = q.id && !Cfg.q(q.id) ? q.id : U.uid("q"); q.source = q.source || "manual"; q.marks = +q.marks || 1; Store.cfg.questions.push(q); n++; }); saveCfg(); toast(`${n} questions imported.`); rerender();
});
const TYPE_FIELDS = {
  mcq: ["options", "answer", "explanation"], msq: ["options", "answer", "explanation"], numerical: ["answer", "tolerance", "explanation"], output: ["answer", "explanation"],
  subjective: ["rubric", "modelSolution"], coding: ["lang", "inputFormat", "outputFormat", "constraints", "steps", "sampleInput", "sampleOutput", "complexity", "starter", "reference", "compare", "tests"],
  debug: ["lang", "starter", "reference", "bugExplanation", "compare", "tests"], web: ["lab", "files", "editable", "reference", "mock", "checks"],
};
function qForm(q) {
  const subj = q.subject || Store.cfg.subjects[0].id; const F = TYPE_FIELDS[q.type] || [];
  const ta = (k, label, val, rows = 3, mono = false) => `<label>${label}<textarea data-f="${k}" rows="${rows}" class="${mono ? "mono" : ""}" spellcheck="${!mono}">${esc(val ?? "")}</textarea></label>`;
  const inp = (k, label, val, type = "text") => `<label>${label}<input data-f="${k}" type="${type}" value="${esc(val ?? "")}"></label>`;
  let x = `<div class="form qform"><div class="row gap"><label>Type<select data-f="type" id="qf-type">${opts(Object.entries(TYPE_LABEL), q.type)}</select></label><label>Subject<select data-f="subject" id="qf-subj">${subjOpts(subj)}</select></label>
    <label class="grow">Topic<select data-f="topicId" id="qf-topic">${topicOpts(subj, "", q.topicId, false)}</select></label></div>
    <div class="row gap"><label>Difficulty<select data-f="difficulty">${diffOpts(q.difficulty || "medium", false)}</select></label>${inp("marks", "Marks", q.marks ?? 1, "number")}${inp("negative", "Negative marks", q.negative ?? 0, "number")}<label class="grow">Title (optional)<input data-f="title" value="${esc(q.title || "")}"></label></div>
    ${ta("prompt", "Question / problem statement (markdown, $maths$, ```code```)", q.prompt, 6)}${ta("hints", "Progressive hints (one per line: direction, method, next step)", (q.hints || []).join("\n"), 3)}`;
  if (F.includes("options")) x += ta("options", "Options (one per line)", (q.options || []).join("\n"), 4) + inp("answer", q.type === "msq" ? "Correct options (e.g. A,C)" : "Correct option (A, B, C…)", q.answer != null ? [].concat(q.answer).map((i) => String.fromCharCode(65 + +i)).join(",") : "");
  else if (q.type === "numerical") x += `<div class="row gap">${inp("answer", "Correct answer", q.answer)}${inp("tolerance", "Tolerance (±)", q.tolerance ?? 0.001, "number")}</div>`;
  else if (q.type === "output") x += ta("answer", "Exact expected output", q.answer, 4, true);
  if (F.includes("explanation")) x += ta("explanation", "Explanation (shown after submission)", q.explanation, 3);
  if (q.type === "subjective") x += ta("rubric", "Rubric — one criterion per line as “criterion | marks”. Total marks = sum.", (q.rubric || []).map((r) => `${r.criterion} | ${r.marks}`).join("\n"), 5) + ta("modelSolution", "Model solution", q.modelSolution, 6);
  if (q.type === "coding" || q.type === "debug") {
    x += `<div class="row gap"><label>Language<select data-f="lang">${opts([["python", "Python"], ["js", "JavaScript"]], q.lang || (subj === "fs" ? "js" : "python"))}</select></label><label>Output comparison<select data-f="compare">${opts([["", "Default (ignore trailing whitespace)"], ["exact", "Exact"], ["tokens", "Whitespace-insensitive"], ["float", "Numeric tolerance"]], q.compare || "")}</select></label></div>`;
    if (q.type === "coding") x += `<div class="row gap">${ta("inputFormat", "Input format", q.inputFormat, 2)}${ta("outputFormat", "Output format", q.outputFormat, 2)}</div><div class="row gap">${ta("constraints", "Constraints", q.constraints, 2)}${inp("complexity", "Expected complexity", q.complexity)}</div>${ta("steps", "Step-by-step instructions (one per line)", (q.steps || []).join("\n"), 3)}<div class="row gap">${ta("sampleInput", "Sample input", q.sampleInput, 3, true)}${ta("sampleOutput", "Sample output", q.sampleOutput, 3, true)}</div>`;
    x += ta("starter", q.type === "debug" ? "Buggy program given to the student" : "Starter code", q.starter, 6, true) + ta("reference", "Reference solution (used to compute expected outputs)", q.reference, 6, true);
    if (q.type === "debug") x += ta("bugExplanation", "Model explanation of the bug", q.bugExplanation, 3);
    x += ta("tests", `Test cases (JSON). Python: {"input","expected","category","hidden"}. JS: {"call","expected",…} or {"input","expected"} for console output; optional "mock":{url:{status,body}}.`, JSON.stringify(q.tests || [], null, 1), 8, true) + `<button class="btn sm ghost" data-act="qfFill" type="button">Compute expected outputs from reference</button> <span class="muted small" id="qf-fill-msg"></span>`;
  }
  if (q.type === "web") {
    x += `<div class="row gap"><label>Lab<select data-f="lab">${opts([["html", "HTML"], ["css", "CSS"], ["js", "JavaScript / DOM"], ["integrated", "Integrated practical"]], q.lab || "html")}</select></label>${inp("editable", "Editable files (comma list of html, css, js)", (q.editable || ["html", "css", "js"]).join(","))}</div>
    ${ta("files", "Starter files (JSON {html, css, js})", JSON.stringify(q.files || { html: "", css: "", js: "" }, null, 1), 6, true)}${ta("reference", "Reference implementation (JSON {html, css, js})", JSON.stringify(q.reference || { html: "", css: "", js: "" }, null, 1), 6, true)}
    ${ta("mock", "Mock API responses (JSON {url: {status, body}})", JSON.stringify(q.mock || {}, null, 1), 3, true)}
    ${ta("checks", `Functional checks (JSON [{desc, marks, viewport?, code}]). "code" is an async function body with doc, win and h (h.$, h.$$, h.css, h.text, h.type, h.submit, h.click, h.wait, h.columns, h.src) returning true, false or a failure message.`, JSON.stringify(q.checks || [], null, 1), 10, true)}
    <button class="btn sm ghost" data-act="qfCheckRef" type="button">Run checks against reference</button> <span class="muted small" id="qf-fill-msg"></span>`;
  }
  return x + `<details class="small"><summary>Edit raw JSON instead</summary><textarea id="qf-raw" rows="10" class="mono">${esc(JSON.stringify(q, null, 1))}</textarea><button class="btn sm" type="button" data-act="qfRaw">Apply raw JSON</button></details></div>`;
}
function readQForm(m, base) {
  const q = U.clone(base); const g = (k) => { const el = $(`[data-f="${k}"]`, m); return el ? el.value : undefined; };
  ["type", "subject", "topicId", "difficulty", "title", "prompt"].forEach((k) => { if (g(k) !== undefined) q[k] = g(k); });
  q.marks = +g("marks") || 0; q.negative = +g("negative") || 0; q.hints = (g("hints") || "").split("\n").map((s) => s.trim()).filter(Boolean);
  const lines = (k) => (g(k) || "").split("\n").map((s) => s.trim()).filter(Boolean); const J = (k, d) => { const v = g(k); if (v === undefined) return d; try { return JSON.parse(v); } catch (e) { throw new Error(`“${k}” is not valid JSON: ${e.message}`); } };
  if (["mcq", "msq"].includes(q.type)) { q.options = lines("options"); const idx = (g("answer") || "").toUpperCase().split(/[\s,]+/).filter(Boolean).map((c) => c.charCodeAt(0) - 65); if (idx.some((i) => i < 0 || i >= q.options.length) || !idx.length) throw new Error("Correct option must be a letter matching the options."); q.answer = q.type === "msq" ? idx : idx[0]; }
  if (q.type === "numerical") { q.answer = U.parseNum(g("answer")); if (isNaN(q.answer)) q.answer = g("answer"); q.tolerance = +g("tolerance") || 0; }
  if (q.type === "output") q.answer = g("answer");
  ["explanation", "modelSolution", "bugExplanation", "inputFormat", "outputFormat", "constraints", "complexity", "sampleInput", "sampleOutput", "starter", "lang", "lab"].forEach((k) => { if (g(k) !== undefined) q[k] = g(k); });
  if (g("compare") !== undefined) { if (g("compare")) q.compare = g("compare"); else delete q.compare; }
  if (q.type === "subjective") { q.rubric = lines("rubric").map((l) => { const [c, mk] = l.split("|"); return { criterion: (c || "").trim(), marks: +mk || 0 }; }).filter((r) => r.criterion); q.marks = q.rubric.reduce((s, r) => s + r.marks, 0); }
  if (q.type === "coding" || q.type === "debug") { q.steps = g("steps") !== undefined ? lines("steps") : q.steps; q.reference = g("reference"); q.tests = J("tests", []); }
  if (q.type === "web") { q.files = J("files", {}); q.reference = J("reference", {}); q.mock = J("mock", {}); q.checks = J("checks", []); q.editable = (g("editable") || "").split(/[\s,]+/).filter((x) => ["html", "css", "js"].includes(x)); }
  if (!q.prompt || !q.prompt.trim()) throw new Error("The question text is required.");
  return q;
}
function openQEditor(q, isNew) {
  let cur = U.clone(q);
  const m = modal(`<h2>${isNew ? "New question" : "Edit question"}</h2><div id="qf-wrap">${qForm(cur)}</div>`, { okText: "Save question", wide: true, onOk: (m) => {
    try { const nq = readQForm(m, cur); if (nq.source === "ai") nq.reviewed = true; if (isNew) { nq.id = U.uid("q"); nq.source = nq.source || "manual"; Store.cfg.questions.push(nq); } else { const i = Store.cfg.questions.findIndex((x) => x.id === q.id); Store.cfg.questions[i] = nq; } saveCfg(); toast("Question saved."); rerender(); }
    catch (e) { toast(e.message, "bad"); return false; } } });
  const wire = () => {
    $("#qf-type", m).onchange = (e) => { try { cur = readQForm(m, cur); } catch (x) {} cur.type = e.target.value; $("#qf-wrap", m).innerHTML = qForm(cur); wire(); };
    $("#qf-subj", m).onchange = (e) => { $("#qf-topic", m).innerHTML = topicOpts(e.target.value, "", "", false); };
  };
  wire(); m._getQ = () => readQForm(m, cur);
}
ACT.qNew = () => { const f = App.ui.su.qf; openQEditor({ type: "mcq", subject: f.subject || Store.cfg.subjects[0].id, topicId: f.topic, difficulty: "medium", marks: 1, options: ["", "", "", ""], answer: 0, prompt: "", source: "manual" }, true); };
ACT.qEdit = (el) => openQEditor(Cfg.q(el.dataset.arg), false);
ACT.qfRaw = (el) => { const m = el.closest(".modal-back"); try { const q = JSON.parse($("#qf-raw", m).value); const i = Store.cfg.questions.findIndex((x) => x.id === q.id); if (i >= 0) Store.cfg.questions[i] = q; else { q.id = q.id || U.uid("q"); Store.cfg.questions.push(q); } saveCfg(); m.remove(); toast("Saved from raw JSON."); rerender(); } catch (e) { toast("Invalid JSON: " + e.message, "bad"); } };
ACT.qfFill = async (el) => { const m = el.closest(".modal-back"); const msg = $("#qf-fill-msg", m); try { const q = m._getQ(); msg.textContent = "Running reference…"; const ok = await Grader.fillExpected(q); if (!ok) throw new Error("Reference solution raised an error or there are no tests."); $('[data-f="tests"]', m).value = JSON.stringify(q.tests, null, 1); msg.textContent = `Expected outputs computed for ${q.tests.length} tests.`; } catch (e) { msg.textContent = e.message; } };
ACT.qfCheckRef = async (el) => { const m = el.closest(".modal-back"); const msg = $("#qf-fill-msg", m); try { const q = m._getQ(); msg.textContent = "Running checks…"; const r = await WebLab.runChecks(q, q.reference || {}); const bad = r.filter((c) => !c.pass); msg.textContent = bad.length ? `Reference fails ${bad.length}: ` + bad.map((c) => c.desc + (c.msg ? " (" + c.msg + ")" : "")).join("; ") : `All ${r.length} checks pass on the reference.`; } catch (e) { msg.textContent = e.message; } };
function openGenerator(d = {}) {
  const subj = d.subject || Store.cfg.subjects[0].id;
  const m = modal(`<h2>Generate questions with Claude</h2><p class="small muted">Questions stay inside the chosen syllabus topic. For coding and debugging, expected outputs are computed by actually running Claude's reference solution — anything that fails to run is discarded. Generated questions are marked “AI · unreviewed” until you edit and save them.</p>
    <div class="form"><div class="row gap"><label>Subject<select id="g-subj">${subjOpts(subj)}</select></label><label class="grow">Topic<select id="g-topic">${topicOpts(subj, "", d.topicId, false)}</select></label></div>
    <div class="row gap"><label>Type<select id="g-type">${opts(["mcq", "msq", "numerical", "output", "subjective", "coding", "debug"].map((t) => [t, TYPE_LABEL[t]]), TYPE_FIELDS[d.type] && d.type !== "web" ? d.type : "mcq")}</select></label><label>Language (code)<select id="g-lang">${opts([["python", "Python"], ["js", "JavaScript"]], subj === "fs" ? "js" : "python")}</select></label><label>Difficulty<select id="g-diff">${diffOpts("medium", false)}</select></label><label>How many<input id="g-n" type="number" min="1" max="10" value="5"></label></div></div><div id="g-msg" class="small mt"></div>`,
    { okText: "Generate", onOk: async (m) => {
      const ok = $("[data-m=ok]", m); ok.disabled = true; const msg = $("#g-msg", m); msg.textContent = "Claude is writing questions…";
      try { const topicId = $("#g-topic", m).value; if (!topicId) throw new Error("Choose a topic.");
        const qs = await AI.generateQuestions({ subject: $("#g-subj", m).value, topicId, type: $("#g-type", m).value, difficulty: $("#g-diff", m).value, count: U.clamp(+$("#g-n", m).value || 5, 1, 10), lang: $("#g-lang", m).value });
        qs.forEach((q) => Store.cfg.questions.push(q)); saveCfg(); toast(`${qs.length} question(s) added to your bank.`); rerender(); return true; }
      catch (e) { msg.textContent = e.message; ok.disabled = false; return false; } } });
  $("#g-subj", m).onchange = (e) => { $("#g-topic", m).innerHTML = topicOpts(e.target.value, "", "", false); };
}
ACT.qGen = () => openGenerator({ subject: App.ui.su.qf.subject, topicId: App.ui.su.qf.topic });

/* ---- rules ---- */
function setupRules() {
  const S = Store.cfg.settings; const f = (k, label, type = "number", extra = "") => `<label>${label}<input type="${type}" ${extra} value="${esc(S[k])}" data-chg="suRule" data-k="${k}"></label>`;
  return `<div class="grid two"><div class="card form"><h2>You</h2>${f("studentName", "Your name (shown on the dashboard)", "text")}${f("dailyTarget", "Daily target (questions)", "number", 'min="1"')}${f("retestDays", "First retest after (days)", "number", 'min="1"')}</div>
  <div class="card form"><h2>Mastery rule</h2><p class="muted small">A subtopic is “mastered” only when all of these hold.</p>${f("masteryMinAttempts", "Minimum attempts", "number", 'min="1"')}<label>Minimum recent accuracy (%)<input type="number" min="1" max="100" value="${Math.round(S.masteryAccuracy * 100)}" data-chg="suRule" data-k="masteryAccuracy" data-pct="1"></label>${f("masteryWindow", "“Recent” = last N attempts", "number", 'min="1"')}${f("masteryMinDays", "Practised on at least N different days", "number", 'min="1"')}</div>
  <div class="card form"><h2>Marking</h2><label>Multiple-select partial marks<select data-chg="suRule" data-k="msqPartial">${opts([["false", "No — all-or-nothing"], ["true", "Yes — proportional if no wrong option picked"]], String(S.msqPartial))}</select></label>
  <label>Default output comparison for code<select data-chg="suRule" data-k="outputCompare">${opts([["trim", "Ignore trailing whitespace"], ["exact", "Exact"], ["tokens", "Whitespace-insensitive"]], S.outputCompare)}</select></label>${f("codeTimeoutSec", "Time limit per test case (seconds)", "number", 'min="1" max="30"')}
  <p class="muted small">Negative marking is set per exam section (Calendar & patterns) or when starting an exam.</p></div>
  <div class="card form"><h2>AI (Claude)</h2><label>Use Claude for marking, hints, tutoring and generation<select data-chg="suRule" data-k="aiEnabled">${opts([["true", "On (when available)"], ["false", "Off — self-marking only"]], String(S.aiEnabled !== false))}</select></label><p class="muted small">Status: ${AI.fn ? (AI.denied ? "permission declined" : "available") : "not available in this view"}. With AI off, subjective answers and debugging explanations are self-marked against the rubric.</p></div></div>`;
}
ACT.suRule = (el) => { const S = Store.cfg.settings; const k = el.dataset.k; let v = el.value; if (["msqPartial", "aiEnabled"].includes(k)) v = v === "true"; else if (el.type === "number") v = el.dataset.pct ? U.clamp(+v / 100, 0.01, 1) : Math.max(1, +v || 1); S[k] = v; saveCfg(); renderShell(); };

/* ---- backup ---- */
async function exportJson(name, obj) {
  const text = JSON.stringify(obj, null, 1);
  let dl = null; try { dl = await window.claude?.use?.("downloads"); } catch (e) {}
  if (dl) { try { await dl.save({ filename: name, data: text }); toast("Saved " + name); return; } catch (e) { if (e && e.code !== "declined") toast("Download failed — showing the JSON to copy instead."); else return; } }
  const m = modal(`<h2>${esc(name)}</h2><p class="small muted">Copy this JSON and save it somewhere safe.</p><textarea class="mono" rows="14" readonly>${esc(text)}</textarea>`, { okText: "Copy", onOk: async (m) => { try { await navigator.clipboard.writeText(text); toast("Copied."); } catch (e) { $("textarea", m).select(); toast("Select-all is ready — press Ctrl+C."); return false; } } });
}
function importJson(title, apply) {
  const m = modal(`<h2>${esc(title)}</h2><input type="file" accept=".json,application/json" id="imp-file"><p class="small muted">…or paste JSON:</p><textarea id="imp-text" rows="8" class="mono"></textarea>`, { okText: "Import", onOk: (m) => { try { apply(JSON.parse($("#imp-text", m).value)); } catch (e) { toast(e.message, "bad"); return false; } } });
  $("#imp-file", m).onchange = (e) => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { $("#imp-text", m).value = r.result; }; r.readAsText(f); };
}
function setupBackup() {
  return `<div class="grid two"><div class="card"><h2>Storage</h2><p>${esc(Store.status)}.</p><p class="small muted">${Store.mode === "cloud" ? "Your configuration and progress are saved privately to your Claude account and follow you across devices. A copy is also kept in this browser." : "Account storage isn't available in this view, so data is kept only in this browser. Export regularly."}</p></div>
  <div class="card"><h2>Backup</h2><div class="row gap wrap"><button class="btn" data-act="bkExport">Export everything</button><button class="btn" data-act="bkExportCfg">Export setup only (no progress)</button><button class="btn ghost" data-act="bkImport">Import backup</button></div><p class="small muted mt">Setup = calendar, patterns, syllabus, question bank and rules — shareable with classmates.</p></div>
  <div class="card"><h2>Reset</h2><div class="row gap wrap"><button class="btn bad" data-act="bkResetProgress">Clear progress (keep setup)</button><button class="btn bad" data-act="bkResetAll">Restore factory defaults</button></div></div></div>`;
}
ACT.bkExport = () => exportJson(`examforge-backup-${U.today()}.json`, Object.assign({ kind: "examforge-backup" }, Store.s));
ACT.bkExportCfg = () => exportJson("examforge-setup.json", { kind: "examforge-setup", config: Store.cfg });
ACT.bkImport = () => importJson("Import backup or setup", (obj) => {
  if (obj.kind === "examforge-setup" && obj.config) { Store.s.config = obj.config; Store.migrate(); saveCfg(); toast("Setup imported; your progress was kept."); rerender(); return; }
  if (!obj.config || !obj.meta) throw new Error("This doesn't look like an ExamForge backup.");
  delete obj.kind; Store.replaceAll(obj); toast("Backup restored.");
});
ACT.bkResetProgress = () => confirmDlg("Delete all attempts, mistakes, sessions and card progress? Your setup stays. This cannot be undone.", () => {
  const old = Store.s; const f = Store.fresh(); Object.keys(old.days).forEach((k) => Store.touch("del:days:" + k)); ["mistakes", "sessions", "cards"].forEach((c) => Object.keys(old[c]).forEach((k) => Store.touch("del:" + c + ":" + k)));
  Store.s = { config: old.config, meta: f.meta, days: {}, mistakes: {}, sessions: {}, cards: f.cards }; Object.keys(f.cards).forEach((k) => Store.touch("cards:" + k)); Store.touch("meta"); App.session = null; renderShell(); toast("Progress cleared."); rerender(); }, "Clear progress");
ACT.bkResetAll = () => confirmDlg("Restore the original syllabus, calendar and starter questions and clear all progress? This cannot be undone.", () => {
  const old = Store.s; Object.keys(old.days).forEach((k) => Store.touch("del:days:" + k)); ["mistakes", "sessions", "cards"].forEach((c) => Object.keys(old[c]).forEach((k) => Store.touch("del:" + c + ":" + k)));
  Store.s = Store.fresh(); Store.markAll(); Store.touch("config"); App.session = null; toast("Factory defaults restored."); rerender(); }, "Restore defaults");

/* ===================== Boot ===================== */
(function boot() {
  Store.init();
  Store.on((reload) => { renderShell(); if (reload && App.view !== "session") rerender(); });
  route();
  Store.connect();
  AI.init().then(() => { renderShell(); if (["tutor", "practice", "exam-setup", "flashcards", "mistakes"].includes(App.view)) rerender(); });
  window.addEventListener("beforeunload", () => { Store.saveLocal(); });
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") Store.flush(); });
  document.addEventListener("submit", (e) => { if (e.target.closest("[data-form=tutor]")) { e.preventDefault(); ACT.tuSend(); } });
  document.addEventListener("keydown", (e) => { if (e.target.id === "tu-in" && e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ACT.tuSend(); } });
})();
