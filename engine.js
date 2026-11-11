/* ExamForge IDE — engine: utilities, storage, runners, grading, AI, analytics */
"use strict";

/* ===================== Utilities ===================== */
const U = {
  uid: (p = "") => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
  esc: (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])),
  today: (d = new Date()) => { const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000); return z.toISOString().slice(0, 10); },
  addDays: (iso, n) => { const d = new Date(iso + "T00:00:00"); d.setDate(d.getDate() + n); return U.today(d); },
  daysBetween: (a, b) => Math.round((new Date(b + "T00:00:00") - new Date(a + "T00:00:00")) / 86400000),
  pct: (x) => (x == null || isNaN(x) ? "—" : Math.round(x * 100) + "%"),
  clamp: (x, a, b) => Math.max(a, Math.min(b, x)),
  fmtDate: (iso) => { if (!iso) return "—"; const d = new Date(iso + "T00:00:00"); return d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" }); },
  fmtTime: (sec) => { sec = Math.max(0, Math.round(sec)); const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60; return (h ? h + ":" : "") + String(m).padStart(h ? 2 : 1, "0") + ":" + String(s).padStart(2, "0"); },
  clone: (o) => JSON.parse(JSON.stringify(o)),
  shuffle: (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
  normOut: (s) => String(s ?? "").replace(/\r/g, "").split("\n").map((l) => l.replace(/\s+$/, "")).join("\n").replace(/\n+$/, ""),
  normTokens: (s) => String(s ?? "").trim().split(/\s+/).join(" "),
  /* Small, safe markdown: fenced code, inline code, bold, italics, lists, paragraphs. Math ($…$) is left for MathJax. */
  md(src) {
    const out = []; const lines = String(src ?? "").replace(/\r/g, "").split("\n"); let i = 0; let list = null;
    const inline = (t) => U.esc(t).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[^*\w])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
    const closeList = () => { if (list) { out.push(`</${list}>`); list = null; } };
    while (i < lines.length) {
      const l = lines[i];
      const fence = l.match(/^```(\w*)/);
      if (fence) { closeList(); const buf = []; i++; while (i < lines.length && !/^```/.test(lines[i])) buf.push(lines[i++]); i++; out.push(`<pre class="code"><code>${U.esc(buf.join("\n"))}</code></pre>`); continue; }
      const ol = l.match(/^\s*\d+[.)]\s+(.*)/), ul = l.match(/^\s*[-*•]\s+(.*)/);
      if (ol || ul) { const t = ol ? "ol" : "ul"; if (list !== t) { closeList(); out.push(`<${t}>`); list = t; } out.push(`<li>${inline((ol || ul)[1])}</li>`); i++; continue; }
      closeList();
      if (/^#{1,4}\s/.test(l)) { out.push(`<p class="mdh"><strong>${inline(l.replace(/^#+\s*/, ""))}</strong></p>`); i++; continue; }
      if (!l.trim()) { i++; continue; }
      const buf = [l]; i++;
      while (i < lines.length && lines[i].trim() && !/^```|^\s*\d+[.)]\s|^\s*[-*•]\s|^#{1,4}\s/.test(lines[i])) buf.push(lines[i++]);
      out.push(`<p>${buf.map(inline).join("<br>")}</p>`);
    }
    closeList(); return out.join("");
  },
  parseNum(s) {
    s = String(s ?? "").trim().replace(/,/g, ""); if (!s) return NaN;
    const f = s.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)$/); if (f) return parseFloat(f[1]) / parseFloat(f[2]);
    const p = s.match(/^(-?\d+(?:\.\d+)?)%$/); if (p) return parseFloat(p[1]) / 100;
    return /^-?(\d+\.?\d*|\.\d+)(e-?\d+)?$/i.test(s) ? parseFloat(s) : NaN;
  },
};

/* ===================== Storage ===================== */
const Store = {
  LS: "examforge.v1", db: null, uid: null, mode: "local", status: "Loading…", dirty: new Set(), flushing: false, timer: null, listeners: [],
  s: null, // { config, meta, days:{date:{attempts:[]}}, mistakes:{}, cards:{}, sessions:{} }
  fresh() {
    const config = window.EF_DEFAULTS();
    const cards = {};
    (config.seedCards || []).forEach((c) => { const id = U.uid("c"); cards[id] = Object.assign({ id, source: "seed", difficulty: "medium" }, c, SRS.blank()); });
    delete config.seedCards;
    return { config, meta: { topicStatus: {}, opened: {}, activity: {}, createdAt: Date.now() }, days: {}, mistakes: {}, cards, sessions: {} };
  },
  loadLocal() {
    try { const raw = localStorage.getItem(this.LS); if (raw) return JSON.parse(raw); } catch (e) { /* storage unavailable */ }
    return null;
  },
  saveLocal() { try { localStorage.setItem(this.LS, JSON.stringify(this.s)); } catch (e) { /* quota or unavailable */ } },
  init() {
    this.s = this.loadLocal() || this.fresh();
    this.migrate();
    this.status = "Saved in this browser only";
  },
  migrate() {
    const d = window.EF_DEFAULTS();
    const c = this.s.config;
    c.settings = Object.assign({}, d.settings, c.settings || {});
    ["cycles", "subjects", "exams", "syllabus", "questions"].forEach((k) => { if (!Array.isArray(c[k])) c[k] = d[k]; });
    delete c.seedCards;
    ["days", "mistakes", "cards", "sessions"].forEach((k) => { this.s[k] = this.s[k] || {}; });
    this.s.meta = Object.assign({ topicStatus: {}, opened: {}, activity: {} }, this.s.meta || {});
  },
  async connect() {
    if (!window.claude || typeof window.claude.use !== "function") return;
    try {
      const [db, user] = await Promise.all([window.claude.use("db"), window.claude.use("user")]);
      if (!db || !user) return;
      const id = await user.id(); if (!id) return;
      this.db = db; this.uid = id;
      const base = `data/users/${id}`;
      const cfgSnap = await this.withTimeout(db.doc(`${base}/config`).get());
      if (!cfgSnap.exists) {
        // first visit with cloud storage: upload what this browser has (or the defaults)
        this.mode = "cloud"; this.markAll(); await this.flush(); this.status = "Saved to your Claude account"; this.emit(); return;
      }
      const cfg = U.clone(cfgSnap.data());
      const chunks = cfg.bankChunks || 0; delete cfg.bankChunks;
      const qs = [];
      for (let i = 0; i < chunks; i++) { const b = await db.doc(`${base}/bank-${i}`).get(); if (b.exists) qs.push(...(b.data().questions || [])); }
      cfg.questions = qs;
      const meta = await db.doc(`${base}/meta`).get();
      const p = db.doc(`${base}/p`);
      const coll = async (name) => { const out = {}; const snap = await p.collection(name).get(); snap.docs.forEach((d) => { out[d.id] = U.clone(d.data()); }); return out; };
      const [days, mistakes, cards, sessions] = await Promise.all([coll("days"), coll("mistakes"), coll("cards"), coll("sessions")]);
      this.s = { config: cfg, meta: meta.exists ? U.clone(meta.data()) : { topicStatus: {}, opened: {}, activity: {} }, days, mistakes, cards, sessions };
      this.migrate(); this.mode = "cloud"; this.status = "Saved to your Claude account"; this.saveLocal(); this.emit(true);
    } catch (e) {
      console.warn("db unavailable", e); this.db = null; this.mode = "local"; this.status = "Saved in this browser only (account storage unavailable)"; this.emit();
    }
  },
  withTimeout(p, ms = 10000) { return Promise.race([p, new Promise((_, r) => setTimeout(() => r({ code: "unavailable", message: "timeout" }), ms))]); },
  markAll() {
    ["config", "meta"].forEach((k) => this.dirty.add(k));
    Object.keys(this.s.days).forEach((k) => this.dirty.add("days:" + k));
    ["mistakes", "cards", "sessions"].forEach((c) => Object.keys(this.s[c]).forEach((k) => this.dirty.add(c + ":" + k)));
  },
  touch(key) { this.dirty.add(key); clearTimeout(this.timer); this.timer = setTimeout(() => this.flush(), 900); },
  remove(coll, id) { delete this.s[coll][id]; this.touch("del:" + coll + ":" + id); },
  async flush() {
    this.saveLocal();
    if (!this.db || this.flushing) return;
    this.flushing = true;
    const base = `data/users/${this.uid}`; const p = this.db.doc(`${base}/p`);
    try {
      while (this.dirty.size) {
        const key = this.dirty.values().next().value; this.dirty.delete(key);
        if (key === "config") {
          const cfg = U.clone(this.s.config); const qs = cfg.questions || []; delete cfg.questions;
          const chunks = []; let cur = [], size = 0;
          for (const q of qs) { const n = JSON.stringify(q).length; if (size + n > 180000 && cur.length) { chunks.push(cur); cur = []; size = 0; } cur.push(q); size += n; }
          if (cur.length) chunks.push(cur);
          for (let i = 0; i < chunks.length; i++) await this.db.doc(`${base}/bank-${i}`).set({ questions: chunks[i] });
          const old = this.s._chunks || 0;
          for (let i = chunks.length; i < old; i++) await this.db.doc(`${base}/bank-${i}`).delete();
          this.s._chunks = chunks.length; cfg.bankChunks = chunks.length;
          await this.db.doc(`${base}/config`).set(cfg);
        } else if (key === "meta") await this.db.doc(`${base}/meta`).set(this.s.meta);
        else if (key.startsWith("del:")) { const [, c, id] = key.split(":"); await p.collection(c).doc(id).delete(); }
        else { const [c, id] = key.split(/:(.+)/); const v = this.s[c] && this.s[c][id]; if (v) await p.collection(c).doc(id).set(this.trim(v)); }
      }
      this.status = "Saved to your Claude account";
    } catch (e) {
      console.warn("save failed", e);
      this.status = e && e.code === "quota_exceeded" ? "Account storage is full — export a backup and delete old sessions" : "Saved in this browser; account sync failed (" + ((e && e.code) || "error") + ")";
    }
    this.flushing = false; this.emit();
  },
  trim(v) { // keep documents under the 256 KiB store limit by shortening long stored answers
    if (JSON.stringify(v).length < 240000) return v;
    const c = U.clone(v);
    if (c.answers) Object.keys(c.answers).forEach((k) => { const a = c.answers[k]; if (a && typeof a === "object") ["code", "explanation"].forEach((f) => { if (typeof a[f] === "string") a[f] = a[f].slice(0, 8000); }); });
    if (c.items) c.items.forEach((it) => { if (it.q) { delete it.q.reference; delete it.q.checks; } });
    return c;
  },
  on(fn) { this.listeners.push(fn); },
  emit(reload) { this.listeners.forEach((f) => f(reload)); },
  get cfg() { return this.s.config; },
  replaceAll(obj) { this.s = obj; this.migrate(); if (this.db) this.markAll(); this.flush(); this.emit(true); },
};

/* ===================== Config helpers ===================== */
const Cfg = {
  subj: (id) => Store.cfg.subjects.find((s) => s.id === id) || { id, name: id },
  cycle: (id) => Store.cfg.cycles.find((c) => c.id === id) || { id, name: id },
  units: (subject, cycle) => Store.cfg.syllabus.filter((u) => (!subject || u.subject === subject) && (!cycle || u.cycle === cycle)),
  subtopics(subject, cycle) { return this.units(subject, cycle).flatMap((u) => u.subtopics.map((s) => Object.assign({ unit: u }, s))); },
  topic(id) { for (const u of Store.cfg.syllabus) for (const s of u.subtopics) if (s.id === id) return Object.assign({ unit: u }, s); return null; },
  topicName(id) { const t = this.topic(id); return t ? (t.title === t.unit.title ? t.title : t.unit.title + " › " + t.title) : "(unassigned topic)"; },
  q: (id) => Store.cfg.questions.find((q) => q.id === id),
  questions(f = {}) {
    return Store.cfg.questions.filter((q) => {
      if (f.subject && q.subject !== f.subject) return false;
      if (f.topics && f.topics.length && !f.topics.includes(q.topicId)) return false;
      if (f.cycle) { const t = this.topic(q.topicId); if (!t || t.unit.cycle !== f.cycle) return false; }
      if (f.type && f.type !== "any") { if (f.type === "mcq" ? !["mcq", "msq", "output"].includes(q.type) : q.type !== f.type) return false; }
      if (f.difficulty && f.difficulty !== "any" && q.difficulty !== f.difficulty) return false;
      return true;
    });
  },
  exams() { return Store.cfg.exams.slice().sort((a, b) => (a.date + (a.time || "")).localeCompare(b.date + (b.time || ""))); },
  examStart(e) { return new Date(e.date + "T" + (e.time || "00:00") + ":00"); },
  examName(e) { return `${this.subj(e.subject).name} — ${this.cycle(e.cycle).name}`; },
};
const TYPE_LABEL = { mcq: "MCQ", msq: "Multiple-select", numerical: "Numerical", output: "Output prediction", subjective: "Subjective / proof", coding: "Coding", debug: "Debugging", web: "Web lab" };
const MISTAKE_TYPES = { conceptual: "Conceptual misunderstanding", formula: "Incorrect formula", calculation: "Calculation error", syntax: "Syntax error", logic: "Logic error", edge: "Edge-case failure", misreading: "Misreading instructions", time: "Time-management issue", incomplete: "Incomplete answer", structure: "Poor code structure" };

/* ===================== Spaced repetition (SM-2) ===================== */
const SRS = {
  blank: () => ({ ease: 2.5, interval: 0, reps: 0, due: U.today(), status: "new", lapses: 0, lastReview: null }),
  review(card, q) { // q: 0 again, 3 hard, 4 good, 5 easy
    if (q < 3) { card.reps = 0; card.interval = 1; card.lapses = (card.lapses || 0) + 1; card.status = "learning"; }
    else { card.reps += 1; card.interval = card.reps === 1 ? 1 : card.reps === 2 ? (q === 5 ? 4 : 3) : Math.round(card.interval * card.ease * (q === 3 ? 0.8 : q === 5 ? 1.3 : 1)); card.status = card.interval >= 21 ? "mature" : "review"; }
    card.ease = Math.max(1.3, card.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
    card.due = U.addDays(U.today(), Math.max(1, card.interval)); card.lastReview = Date.now();
    return card;
  },
};

/* ===================== Python runner (Pyodide in a worker) ===================== */
const PY_URL = window.EF_PY_URL || "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js";
const PyRunner = {
  w: null, ready: null, pending: new Map(), seq: 0, state: "idle", error: null, listeners: [],
  on(fn) { this.listeners.push(fn); }, set(st) { this.state = st; this.listeners.forEach((f) => f(st)); },
  src() {
    return `importScripts(${JSON.stringify(PY_URL)});
const PYCODE = ${JSON.stringify(`
import sys, io, traceback, builtins
def __ef_run(code, stdin):
    out = io.StringIO()
    lines = io.StringIO(stdin)
    def _inp(prompt=''):
        l = lines.readline()
        if l == '':
            raise EOFError('EOF when reading a line')
        return l.rstrip('\\n')
    old = (sys.stdout, sys.stderr, sys.stdin, builtins.input)
    sys.stdout = out; sys.stderr = out; sys.stdin = lines; builtins.input = _inp
    err = None
    try:
        exec(compile(code, 'solution.py', 'exec'), {'__name__': '__main__'})
    except SystemExit:
        pass
    except BaseException as e:
        tb = traceback.format_exception(type(e), e, e.__traceback__)
        keep = []
        skip = False
        for part in tb:
            if 'File "<exec>"' in part or '_pyodide' in part:
                continue
            keep.append(part)
        err = [type(e).__name__, str(e), ''.join(keep)]
    finally:
        sys.stdout, sys.stderr, sys.stdin, builtins.input = old
    return [out.getvalue()[:200000], err]
`)};
let py = null;
loadPyodide({ indexURL: ${JSON.stringify(PY_URL.replace(/pyodide\.js$/, ""))} }).then(p => { py = p; py.runPython(PYCODE); postMessage({ ready: true }); }).catch(e => postMessage({ loadError: String(e) }));
onmessage = (e) => {
  const { id, code, stdin } = e.data;
  try {
    const fn = py.globals.get('__ef_run');
    const r = fn(code, stdin); const js = r.toJs(); r.destroy(); fn.destroy();
    postMessage({ id, stdout: js[0], err: js[1] ? Array.from(js[1]) : null });
  } catch (x) { postMessage({ id, stdout: '', err: ['InternalError', String(x), String(x)] }); }
};`;
  },
  ensure() {
    if (this.ready) return this.ready;
    this.set("loading");
    this.ready = new Promise((res, rej) => {
      try {
        this.w = new Worker(URL.createObjectURL(new Blob([this.src()], { type: "text/javascript" })));
      } catch (e) { this.set("error"); this.error = String(e); this.ready = null; rej(e); return; }
      this.w.onmessage = (e) => {
        const d = e.data;
        if (d.ready) { this.set("ready"); res(); return; }
        if (d.loadError) { this.error = d.loadError; this.set("error"); this.ready = null; this.w.terminate(); this.w = null; rej(new Error(d.loadError)); return; }
        const p = this.pending.get(d.id); if (p) { this.pending.delete(d.id); p(d); }
      };
      this.w.onerror = (e) => { this.error = e.message || "Worker error"; this.set("error"); this.ready = null; rej(new Error(this.error)); };
    });
    return this.ready;
  },
  kill() { if (this.w) this.w.terminate(); this.w = null; this.ready = null; this.pending.forEach((p) => p({ stdout: "", err: ["Killed", "", ""] })); this.pending.clear(); this.set("idle"); },
  async run(code, stdin, timeoutSec) {
    await this.ensure();
    const id = ++this.seq; const t0 = performance.now();
    return new Promise((res) => {
      const timer = setTimeout(() => { this.pending.delete(id); this.kill(); res({ stdout: "", error: { type: "TimeLimitExceeded", msg: `No result within ${timeoutSec}s (infinite loop or very slow code?)`, trace: "" }, timeout: true, ms: timeoutSec * 1000 }); }, timeoutSec * 1000);
      this.pending.set(id, (d) => { clearTimeout(timer); res({ stdout: d.stdout || "", error: d.err ? { type: d.err[0], msg: d.err[1], trace: d.err[2] } : null, timeout: false, ms: performance.now() - t0 }); });
      stdin = String(stdin || ""); if (!stdin.endsWith("\n")) stdin += "\n";
      this.w.postMessage({ id, code, stdin });
    });
  },
};

/* ===================== JavaScript runner (fresh worker per run) ===================== */
const JsRunner = {
  run(code, { call, stdin = "", mock = {}, timeoutSec = 5 } = {}) {
    const harness = `const __logs=[];const __fmt=v=>typeof v==='string'?v:(()=>{try{return v===undefined?'undefined':JSON.stringify(v)}catch(e){return String(v)}})();
console.log=(...a)=>__logs.push(a.map(__fmt).join(' '));console.error=console.log;console.warn=console.log;console.info=console.log;
const __mock=${JSON.stringify(mock || {})};
self.fetch=async(url)=>{await new Promise(r=>setTimeout(r,15));const m=__mock[url];if(!m)throw new TypeError('Failed to fetch: no mock response for '+url);if(m.throws)throw new TypeError(m.throws);const b=m.body;return{ok:m.status>=200&&m.status<300,status:m.status,json:async()=>JSON.parse(JSON.stringify(b)),text:async()=>JSON.stringify(b)};};
const __in=${JSON.stringify(String(stdin).split("\n"))};let __i=0;self.prompt=()=>__i<__in.length?__in[__i++]:null;self.readLine=self.prompt;
(async()=>{let __r,__e=null;try{
${code}
;__r=await (${call ? call : "undefined"});
}catch(e){__e={type:(e&&e.name)||'Error',msg:String(e&&e.message!==undefined?e.message:e),trace:String(e&&e.stack||'')}}
await new Promise(r=>setTimeout(r,30));
let rs;try{rs=__r===undefined?'undefined':JSON.stringify(__r)}catch(x){rs=String(__r)}
postMessage({logs:__logs,result:rs,err:__e});})();`;
    return new Promise((res) => {
      let w; const t0 = performance.now();
      try { w = new Worker(URL.createObjectURL(new Blob([harness], { type: "text/javascript" }))); } catch (e) { res({ stdout: "", error: { type: "RunnerError", msg: String(e) } }); return; }
      const timer = setTimeout(() => { w.terminate(); res({ stdout: "", result: "", error: { type: "TimeLimitExceeded", msg: `No result within ${timeoutSec}s` }, timeout: true }); }, timeoutSec * 1000);
      w.onmessage = (e) => { clearTimeout(timer); w.terminate(); res({ stdout: e.data.logs.join("\n"), result: e.data.result, error: e.data.err, ms: performance.now() - t0 }); };
      w.onerror = (e) => { e.preventDefault(); clearTimeout(timer); w.terminate(); res({ stdout: "", result: "", error: { type: /SyntaxError/.test(e.message) ? "SyntaxError" : "Error", msg: (e.message || "").replace(/^Uncaught\s*/, "") + (e.lineno ? ` (line ~${Math.max(1, e.lineno - 5)})` : "") } }); };
    });
  },
};

/* ===================== Web lab: preview + functional checks ===================== */
const WebLab = {
  fns: {},
  srcdoc(files, mock, channel) {
    const shim = `<script>(function(){var P=window.parent,C=${JSON.stringify(channel || "")};function send(k,a){try{P.__efLabLog&&P.__efLabLog(C,k,Array.prototype.map.call(a,function(v){try{return typeof v==='string'?v:JSON.stringify(v)}catch(e){return String(v)}}).join(' '))}catch(e){}}
['log','info','warn','error'].forEach(function(k){var o=console[k];console[k]=function(){send(k,arguments);try{o.apply(console,arguments)}catch(e){}}});
window.addEventListener('error',function(e){send('error',[(e.message||'Error')+(e.lineno?' (line '+e.lineno+')':'')])});
window.addEventListener('unhandledrejection',function(e){send('error',['Unhandled promise rejection: '+(e.reason&&e.reason.message||e.reason)])});
var M=${JSON.stringify(mock || {})};window.fetch=function(url){return new Promise(function(res,rej){setTimeout(function(){var m=M[String(url)];if(!m)return rej(new TypeError('Failed to fetch: no mock response for '+url));if(m.throws)return rej(new TypeError(m.throws));res({ok:m.status>=200&&m.status<300,status:m.status,json:function(){return Promise.resolve(JSON.parse(JSON.stringify(m.body)))},text:function(){return Promise.resolve(JSON.stringify(m.body))}})},20)})};
document.addEventListener('submit',function(e){setTimeout(function(){if(!e.defaultPrevented){send('warn',['Form submitted without preventDefault() — in a real browser the page would reload.'])}},0)});
})();<\/script>`;
    let html = files.html || "";
    const css = files.css ? `<style>\n${files.css}\n</style>` : "";
    const js = files.js ? `<script>\n${files.js.replace(/<\/script/gi, "<\\/script")}\n<\/script>` : "";
    if (/<head[^>]*>/i.test(html)) html = html.replace(/<head[^>]*>/i, (m) => m + shim);
    else if (/<html[^>]*>/i.test(html)) html = html.replace(/<html[^>]*>/i, (m) => m + shim);
    else html = shim + html;
    html = /<\/head>/i.test(html) ? html.replace(/<\/head>/i, css + "</head>") : css + html;
    html = /<\/body>/i.test(html) ? html.replace(/<\/body>(?![\s\S]*<\/body>)/i, js + "</body>") : html + js;
    return html;
  },
  compile(body) {
    const key = "f" + Math.abs([...body].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7));
    if (this.fns[key]) return this.fns[key];
    try { const AF = Object.getPrototypeOf(async function () {}).constructor; this.fns[key] = new AF("doc", "win", "h", body); return this.fns[key]; }
    catch (e) {
      if (e instanceof SyntaxError) throw e;
      // CSP without eval: register via an inline script element
      window.__efFns = window.__efFns || {};
      const s = document.createElement("script"); s.textContent = `window.__efFns[${JSON.stringify(key)}]=async function(doc,win,h){\n${body}\n};`;
      document.head.appendChild(s); s.remove();
      if (!window.__efFns[key]) throw new Error("Could not compile check");
      this.fns[key] = window.__efFns[key]; return this.fns[key];
    }
  },
  host() {
    let h = document.getElementById("ef-test-host");
    if (!h) { h = document.createElement("div"); h.id = "ef-test-host"; h.style.cssText = "position:fixed;left:-20000px;top:0;height:900px;width:1280px;overflow:hidden;visibility:hidden;pointer-events:none"; document.body.appendChild(h); }
    return h;
  },
  load(files, mock, width, channel) {
    return new Promise((res) => {
      const f = document.createElement("iframe");
      f.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms allow-modals");
      f.style.cssText = `width:${width}px;height:900px;border:0`;
      this.host().style.width = width + "px";
      let done = false; const fin = () => { if (!done) { done = true; setTimeout(() => res(f), 60); } };
      f.onload = fin; setTimeout(fin, 3000);
      f.srcdoc = this.srcdoc(files, mock, channel);
      this.host().appendChild(f);
    });
  },
  helpers(f, files, logs) {
    const doc = f.contentDocument, win = f.contentWindow;
    const $ = (s) => doc.querySelector(s), $$ = (s) => Array.from(doc.querySelectorAll(s));
    const h = {
      $, $$, src: files, logs,
      css: (s, p) => { const el = typeof s === "string" ? $(s) : s; return el ? win.getComputedStyle(el).getPropertyValue(p) : null; },
      text: (s) => { const el = $(s); return el ? el.textContent.trim() : ""; },
      wait: (ms) => new Promise((r) => setTimeout(r, ms)),
      type: (s, v) => { const el = $(s); if (!el) throw new Error("Element not found: " + s); el.value = v; el.dispatchEvent(new win.Event("input", { bubbles: true })); el.dispatchEvent(new win.Event("change", { bubbles: true })); return el; },
      click: (s) => { const el = $(s); if (!el) throw new Error("Element not found: " + s); el.click(); return el; },
      submit: (s) => { const form = $(s); if (!form) throw new Error("Form not found: " + s); const ev = new win.Event("submit", { bubbles: true, cancelable: true }); form.dispatchEvent(ev); return ev; },
      columns: (s) => {
        const el = $(s); if (!el) return 0; const cs = win.getComputedStyle(el);
        if (cs.display.includes("grid")) { const t = cs.gridTemplateColumns; return !t || t === "none" ? 1 : t.split(" ").filter(Boolean).length; }
        const kids = Array.from(el.children); if (!kids.length) return 0; const top = kids[0].offsetTop; return kids.filter((k) => Math.abs(k.offsetTop - top) < 2).length;
      },
    };
    return { doc, win, h };
  },
  async runChecks(q, files) {
    const results = []; const merged = Object.assign({}, q.files || {}, files);
    for (const c of q.checks || []) {
      const logs = []; const ch = U.uid("t"); window.__efLabSinks = window.__efLabSinks || {}; window.__efLabSinks[ch] = (k, m) => logs.push(k + ": " + m);
      let pass = false, msg = "";
      try {
        const fn = this.compile(c.code);
        const f = await this.load(merged, q.mock, c.viewport || 1280, ch);
        const { doc, win, h } = this.helpers(f, merged, logs);
        const out = await Promise.race([fn(doc, win, h), new Promise((_, r) => setTimeout(() => r(new Error("Check timed out")), 5000))]);
        if (out === true) pass = true; else if (out && typeof out === "object") { pass = !!out.pass; msg = out.msg || ""; } else if (typeof out === "string") msg = out;
        f.remove();
      } catch (e) { msg = (e && e.message) || String(e); }
      delete window.__efLabSinks[ch];
      results.push({ desc: c.desc, marks: c.marks || 0, pass, msg, viewport: c.viewport });
    }
    this.host().innerHTML = "";
    return results;
  },
  audit(files) { // generic structural/accessibility feedback, not marked
    const d = new DOMParser().parseFromString(files.html || "", "text/html"); const notes = [];
    if (!/^\s*<!doctype html>/i.test(files.html || "")) notes.push("Missing <!DOCTYPE html>.");
    if (!d.documentElement.getAttribute("lang")) notes.push("<html> has no lang attribute.");
    if (!d.querySelector("title")) notes.push("No <title>.");
    if (!d.querySelector('meta[name="viewport"]')) notes.push("No viewport meta tag (mobile layouts will be zoomed out).");
    const hs = [...d.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((x) => +x.tagName[1]);
    if (hs.filter((x) => x === 1).length > 1) notes.push("More than one <h1>.");
    for (let i = 1; i < hs.length; i++) if (hs[i] - hs[i - 1] > 1) { notes.push(`Heading level jumps from h${hs[i - 1]} to h${hs[i]}.`); break; }
    d.querySelectorAll("img:not([alt])").forEach(() => notes.push("An <img> has no alt attribute."));
    d.querySelectorAll("input:not([type=hidden]):not([type=submit]):not([type=button]), textarea, select").forEach((el) => {
      const id = el.getAttribute("id"); const lab = (id && d.querySelector(`label[for="${CSS.escape(id)}"]`)) || el.closest("label") || el.getAttribute("aria-label");
      if (!lab) notes.push(`A form control (${el.tagName.toLowerCase()}${el.name ? " name=" + el.name : ""}) has no label.`);
    });
    const ids = {}; d.querySelectorAll("[id]").forEach((e) => { ids[e.id] = (ids[e.id] || 0) + 1; }); Object.keys(ids).filter((k) => ids[k] > 1).forEach((k) => notes.push(`Duplicate id "${k}".`));
    if (!d.querySelector("main")) notes.push("No <main> landmark.");
    return [...new Set(notes)];
  },
};
window.__efLabLog = (ch, k, m) => { const s = window.__efLabSinks && window.__efLabSinks[ch]; if (s) s(k, m); };

/* ===================== AI (Claude via the page's sample capability) ===================== */
const AI = {
  fn: null, checked: false, denied: false,
  async init() { try { if (window.claude && window.claude.use) this.fn = await window.claude.use("sample"); } catch (e) { this.fn = null; } this.checked = true; },
  get on() { return !!this.fn && !this.denied && Store.cfg.settings.aiEnabled !== false; },
  err(e) { if (e && (e.code === "not_granted")) this.denied = true; return e && e.code === "rate_limited" ? "Claude is rate-limited right now — try again in a minute." : (e && e.message) || "Claude could not answer."; },
  async text(input, opts = {}) { if (!this.on) throw new Error("AI unavailable"); try { const r = await this.fn(input, Object.assign({ cache: false }, opts)); return r.text; } catch (e) { throw new Error(this.err(e)); } },
  async json(input, opts = {}) { if (!this.on) throw new Error("AI unavailable"); try { return await this.fn.json(input, Object.assign({ cache: false }, opts)); } catch (e) { throw new Error(this.err(e)); } },

  async gradeSubjective(q, answer) {
    const prompt = `You are a strict, fair mathematics examiner. Mark the student's answer against the rubric. Never mark by keyword matching: check every step for mathematical validity.
Rules: award marks per criterion (integers or halves, never above the criterion max); identify the FIRST incorrect step if any; flag conclusions not supported by the working; classify the main error as "arithmetic" (slip in computation with a correct method) or "conceptual" (wrong method/definition/logic) or one of "formula", "incomplete", "misreading"; give no credit for a correct final answer that does not follow from the working. If the answer is blank or irrelevant, award 0.
QUESTION:\n${q.prompt}\n\nRUBRIC (criterion — max marks):\n${(q.rubric || []).map((r, i) => `${i + 1}. ${r.criterion} — ${r.marks}`).join("\n")}\n\nREFERENCE SOLUTION (for the examiner only; other valid methods deserve full credit):\n${q.modelSolution || "(none)"}\n\nSTUDENT ANSWER:\n${answer || "(blank)"}\n
Reply with JSON only: {"criteria":[{"criterion":string,"max":number,"awarded":number,"comment":string}],"firstIncorrectStep":string|null,"errorType":"none"|"arithmetic"|"conceptual"|"formula"|"incomplete"|"misreading","unsupportedConclusions":[string],"feedback":string,"confidence":"low"|"medium"|"high"}`;
    const r = await this.json(prompt, { modelTier: "complex" });
    const crit = (q.rubric || []).map((rb, i) => { const g = (r.criteria || [])[i] || {}; return { criterion: rb.criterion, max: rb.marks, awarded: U.clamp(Math.round((+g.awarded || 0) * 2) / 2, 0, rb.marks), comment: g.comment || "" }; });
    return { criteria: crit, firstIncorrectStep: r.firstIncorrectStep || null, errorType: r.errorType || "none", unsupported: r.unsupportedConclusions || [], feedback: r.feedback || "", confidence: r.confidence || "medium" };
  },
  async gradeReasoning(q, explanation) {
    const r = await this.json(`A student was given this buggy program and asked to explain the bug.\nTASK: ${q.prompt}\nBUGGY CODE:\n${q.starter}\nEXAMINER'S EXPLANATION: ${q.bugExplanation || "(not provided)"}\nSTUDENT'S EXPLANATION: ${explanation || "(blank)"}\nScore how correctly and completely the student identified and explained the bug(s), 0 to 1 (0.5 if partially). Do not reward vague statements. JSON only: {"score":number,"comment":string}`, { modelTier: "default" });
    return { score: U.clamp(+r.score || 0, 0, 1), comment: r.comment || "" };
  },
  async hint(q, level, work) {
    const what = ["a conceptual direction only (no formulas, no steps)", "the relevant formula, rule or method, without applying it", "the very next step only, building on the student's work", "a complete worked solution"][level];
    return this.text(`You are a tutor. The student is attempting this question and asked for help. Give ${what}. Keep it under 120 words unless giving the full solution. Use $…$ for maths.\nQUESTION:\n${q.prompt}\n${q.type === "mcq" ? "OPTIONS: " + q.options.join(" | ") : ""}\nSTUDENT'S CURRENT WORK:\n${work || "(nothing yet)"}`);
  },
  async codeReview(q, code, results) {
    return this.text(`Review this ${q.lang === "js" ? "JavaScript" : "Python"} solution written by a student preparing for an exam. Comment briefly on correctness issues suggested by the failing tests, readability (names, structure), edge-case handling and efficiency. Bullet points, max 8. Do not rewrite the whole solution.\nPROBLEM: ${q.prompt}\nTEST SUMMARY: ${results}\nCODE:\n${code}`);
  },
  async explainMistake(m) {
    return this.text(`Explain to the student, in under 150 words, why their answer was wrong and the key idea to remember. Use $…$ for maths.\nQUESTION:\n${m.q.prompt}\nCORRECT ANSWER/SOLUTION:\n${m.correct}\nSTUDENT ANSWER:\n${m.answer}`);
  },
  async generateQuestions({ subject, topicId, type, difficulty, count, lang }) {
    const t = Cfg.topic(topicId); const subjName = Cfg.subj(subject).name;
    const schema = {
      mcq: `{"prompt":string,"options":[4 strings],"answer":index 0-3,"explanation":string,"hints":[3 strings]}`,
      msq: `{"prompt":string,"options":[4-5 strings],"answer":[indices],"explanation":string}`,
      numerical: `{"prompt":string,"answer":number,"tolerance":number,"explanation":string,"hints":[3 strings]}`,
      output: `{"prompt":string (include the code in a fenced block),"answer":string (exact output),"explanation":string}`,
      subjective: `{"prompt":string,"rubric":[{"criterion":string,"marks":integer}],"modelSolution":string,"hints":[3 strings]}`,
      coding: lang === "js"
        ? `{"title":string,"prompt":string (ask for a named function),"inputFormat":string,"outputFormat":string,"constraints":string,"steps":[strings],"starter":string,"reference":string (correct JS solution),"tests":[{"call":string (JS expression calling the function),"category":"basic"|"normal"|"boundary"|"edge","hidden":boolean}] (6-8 tests)}`
        : `{"title":string,"prompt":string,"inputFormat":string,"outputFormat":string,"constraints":string,"steps":[strings],"sampleInput":string,"starter":string,"reference":string (correct Python 3 program reading stdin with input() and printing),"tests":[{"input":string (stdin),"category":"basic"|"normal"|"boundary"|"edge","hidden":boolean}] (6-8 tests, include negative/empty/boundary cases where valid)}`,
      debug: `{"title":string,"prompt":string,"starter":string (a deliberately buggy ${lang === "js" ? "JavaScript" : "Python"} program, 5-15 lines, with 1-2 realistic bugs),"reference":string (the corrected program),"bugExplanation":string,"tests":[{"${lang === "js" ? "call" : "input"}":string,"category":string,"hidden":boolean}] (4-6 tests)}`,
    }[type];
    if (!schema) throw new Error("AI generation is not available for this question type");
    const r = await this.json(`Write ${count} new ${difficulty} exam-practice question(s) for a university student.\nSUBJECT: ${subjName}\nSYLLABUS TOPIC: ${t ? t.unit.title + " › " + t.title : topicId}\n${t && t.objectives.length ? "OBJECTIVES: " + t.objectives.join("; ") : ""}\nQUESTION TYPE: ${TYPE_LABEL[type]}\nStay strictly within this topic. Use $…$ for maths and fenced code blocks for code. Make distractors plausible. Do NOT include expected outputs for tests; they will be computed by running the reference solution.\nReply with JSON only: {"questions":[${schema}]}`, { modelTier: "complex" });
    const list = (r && r.questions) || [];
    const out = [];
    for (const g of list.slice(0, count)) {
      const q = Object.assign({ id: U.uid("ai"), type, subject, topicId, difficulty, marks: type === "coding" ? 10 : type === "debug" ? 8 : type === "subjective" ? 0 : type === "numerical" ? 2 : 1, negative: 0, hints: [], source: "ai", reviewed: false }, g);
      if (type === "coding" || type === "debug") { q.lang = lang || (subject === "fs" ? "js" : "python"); }
      if (type === "subjective") q.marks = (q.rubric || []).reduce((s, x) => s + (+x.marks || 0), 0);
      if (type === "mcq" && (!Array.isArray(q.options) || q.options.length < 2 || !(q.answer >= 0 && q.answer < q.options.length))) continue;
      if (type === "coding" || type === "debug") { const ok = await Grader.fillExpected(q); if (!ok) continue; }
      out.push(q);
    }
    return out;
  },
  async generateCards(topicId, count) {
    const t = Cfg.topic(topicId);
    const r = await this.json(`Create ${count} concise revision flashcards for the syllabus topic "${t.unit.title} › ${t.title}" (${Cfg.subj(t.unit.subject).name}). Focus on definitions, formulas, rules, syntax and common traps. Use $…$ for maths and \`code\` for code. JSON only: {"cards":[{"front":string,"back":string}]}`, { modelTier: "default" });
    return (r.cards || []).filter((c) => c.front && c.back);
  },
  async parseSyllabus(text) {
    const r = await this.json(`Convert this syllabus text into a structured list. Keep the wording of headings; do NOT add topics that are not in the text. JSON only: {"units":[{"group":string (part/section label or ""),"title":string,"subtopics":[string]}]}\n\nTEXT:\n${text}`, { modelTier: "default" });
    return r.units || [];
  },
};

/* ===================== Grading ===================== */
const Grader = {
  compare(q, got, exp) {
    const mode = q.compare || Store.cfg.settings.outputCompare || "trim";
    if (mode === "exact") return String(got).replace(/\r/g, "").replace(/\n$/, "") === String(exp);
    if (mode === "tokens") return U.normTokens(got) === U.normTokens(exp);
    if (mode === "float") { const a = U.normTokens(got).split(" "), b = U.normTokens(exp).split(" "); return a.length === b.length && a.every((x, i) => { const p = parseFloat(x), r = parseFloat(b[i]); return isNaN(r) ? x === b[i] : Math.abs(p - r) <= 1e-6 * Math.max(1, Math.abs(r)); }); }
    return U.normOut(got) === U.normOut(exp);
  },
  async runOne(q, code, t) {
    const to = Store.cfg.settings.codeTimeoutSec || 5;
    if (q.lang === "js") {
      const r = await JsRunner.run(code, { call: t.call, stdin: t.input || "", mock: t.mock || q.mock || {}, timeoutSec: to });
      const got = t.call ? r.result : r.stdout;
      return Object.assign(r, { got, pass: !r.error && this.compare(q, got, t.expected) });
    }
    const r = await PyRunner.run(code, t.input || "", to);
    return Object.assign(r, { got: r.stdout, pass: !r.error && this.compare(q, r.stdout, t.expected) });
  },
  async runTests(q, code, { visibleOnly = false } = {}) {
    const tests = (q.tests || []).filter((t) => !visibleOnly || !t.hidden);
    const res = [];
    for (const t of tests) res.push(Object.assign({ test: t }, await this.runOne(q, code, t)));
    return res;
  },
  async fillExpected(q) {
    try {
      for (const t of q.tests || []) {
        const r = await this.runOne(q, q.reference, Object.assign({}, t, { expected: "" }));
        if (r.error) return false;
        t.expected = q.lang === "js" && t.call ? r.result : U.normOut(r.stdout);
      }
      return (q.tests || []).length > 0;
    } catch (e) { return false; }
  },
  classifyCode(res) {
    const failed = res.filter((r) => !r.pass); if (!failed.length) return null;
    if (failed.some((r) => r.error && /SyntaxError|IndentationError|TabError/.test(r.error.type))) return "syntax";
    const basicFail = failed.some((r) => ["basic", "normal"].includes(r.test.category));
    return basicFail ? "logic" : "edge";
  },
  /* Grade any question. ctx: {negative, phase:"check"|"final"}. Returns result object. */
  async grade(q, ans, ctx = {}) {
    const max = +q.marks || 0; const neg = ctx.negative != null ? +ctx.negative : +q.negative || 0;
    const blank = ans == null || ans === "" || (Array.isArray(ans) && !ans.length) || (typeof ans === "object" && !Array.isArray(ans) && ans.blank);
    const R = (score, status, extra = {}) => Object.assign({ score, max, status }, extra);
    switch (q.type) {
      case "mcq": if (ans == null || ans === "") return R(0, "unanswered");
        return +ans === +q.answer ? R(max, "correct") : R(-neg, "wrong", { mistakeType: "conceptual" });
      case "msq": {
        if (!Array.isArray(ans) || !ans.length) return R(0, "unanswered");
        const right = new Set(q.answer), pick = new Set(ans.map(Number));
        if (right.size === pick.size && [...right].every((x) => pick.has(x))) return R(max, "correct");
        if (Store.cfg.settings.msqPartial) { const good = [...pick].filter((x) => right.has(x)).length, bad = pick.size - good; const sc = bad ? 0 : (good / right.size) * max; return R(Math.round(sc * 100) / 100, sc > 0 ? "partial" : "wrong", { mistakeType: "conceptual" }); }
        return R(-neg, "wrong", { mistakeType: "conceptual" });
      }
      case "numerical": {
        if (blank) return R(0, "unanswered");
        const exp = U.parseNum(q.answer), got = U.parseNum(ans);
        if (isNaN(exp)) return U.normTokens(ans).toLowerCase() === U.normTokens(q.answer).toLowerCase() ? R(max, "correct") : R(-neg, "wrong", { mistakeType: "conceptual" });
        if (isNaN(got)) return R(-neg, "wrong", { mistakeType: "misreading", detail: "Answer is not a number." });
        const tol = q.tolerance != null ? +q.tolerance : 1e-6;
        if (Math.abs(got - exp) <= tol + 1e-9 * Math.abs(exp)) return R(max, "correct");
        const near = Math.abs(got - exp) <= 0.1 * Math.max(1, Math.abs(exp));
        return R(-neg, "wrong", { mistakeType: near ? "calculation" : "conceptual" });
      }
      case "output": if (blank) return R(0, "unanswered");
        return this.compare(Object.assign({ compare: "trim" }, q), ans, q.answer) ? R(max, "correct") : R(-neg, "wrong", { mistakeType: "logic" });
      case "coding": case "debug": {
        const code = (ans && ans.code) || "";
        if (!code.trim() || (q.type === "debug" && code === q.starter && !(ans && ans.explanation))) return R(0, "unanswered");
        let res;
        try { res = await this.runTests(q, code); } catch (e) { return R(0, "error", { detail: "Runner failed to start: " + e.message + ". Your answer is saved; re-evaluate later.", pendingRun: true }); }
        const total = res.length, passed = res.filter((r) => r.pass).length;
        const codeShare = q.type === "debug" ? 0.7 : 1;
        let score = total ? (passed / total) * max * codeShare : 0;
        const out = { tests: res.map((r) => ({ category: r.test.category, hidden: !!r.test.hidden, input: r.test.input, call: r.test.call, expected: r.test.expected, got: r.got, pass: r.pass, error: r.error, timeout: r.timeout })), passed, total, mistakeType: this.classifyCode(res) };
        if (q.type === "debug") {
          const expl = (ans && ans.explanation) || "";
          if (AI.on && expl.trim()) { try { const g = await AI.gradeReasoning(q, expl); out.reasoning = Object.assign({ by: "ai" }, g); score += g.score * max * 0.3; } catch (e) { out.reasoning = { by: "pending", comment: e.message }; } }
          else out.reasoning = { by: expl.trim() ? "pending" : "blank", score: 0, comment: expl.trim() ? "Explanation not auto-marked (AI unavailable). Compare with the model explanation and self-mark." : "No explanation written." };
        }
        score = Math.round(score * 100) / 100;
        const status = score >= max - 1e-9 ? "correct" : score > 0 ? "partial" : "wrong";
        return R(score, out.reasoning && out.reasoning.by === "pending" ? "pending" : status, out);
      }
      case "subjective": {
        if (blank) return R(0, "unanswered");
        if (AI.on && ctx.phase !== "self") {
          try { const g = await AI.gradeSubjective(q, ans); const score = g.criteria.reduce((s, c) => s + c.awarded, 0);
            const mt = { arithmetic: "calculation", conceptual: "conceptual", formula: "formula", incomplete: "incomplete", misreading: "misreading" }[g.errorType] || (score < max ? "incomplete" : null);
            return R(score, score >= max ? "correct" : score > 0 ? "partial" : "wrong", { ai: g, by: "ai", mistakeType: mt }); }
          catch (e) { return R(0, "pending", { by: "pending", detail: "AI marking failed: " + e.message + " — self-mark against the rubric." }); }
        }
        return R(0, "pending", { by: "pending", detail: AI.on ? "" : "AI marking is unavailable here — self-mark against the rubric." });
      }
      case "web": {
        const files = (ans && ans.files) || {};
        const edited = (q.editable || ["html", "css", "js"]).some((k) => (files[k] || "") !== ((q.files || {})[k] || ""));
        if (!edited) return R(0, "unanswered");
        const checks = await WebLab.runChecks(q, files);
        const totalMarks = checks.reduce((s, c) => s + c.marks, 0) || 1;
        const got = checks.filter((c) => c.pass).reduce((s, c) => s + c.marks, 0);
        const score = Math.round((got / totalMarks) * max * 100) / 100;
        return R(score, score >= max ? "correct" : score > 0 ? "partial" : "wrong", { checks, audit: WebLab.audit(Object.assign({}, q.files, files)), mistakeType: score < max ? "incomplete" : null });
      }
    }
    return R(0, "unanswered");
  },
};

/* ===================== Progress: attempts, mistakes, mastery ===================== */
const Progress = {
  record(q, result, { mode = "practice", timeSec = 0, answer = null, sessionId = null, timeUp = false } = {}) {
    if (result.status === "unanswered" && mode === "practice") return;
    const day = U.today();
    const a = { id: U.uid("a"), qid: q.id, subject: q.subject, topicId: q.topicId, type: q.type, ts: Date.now(), score: Math.max(0, result.score), max: result.max, status: result.status, timeSec: Math.round(timeSec), mode, sessionId };
    if (q.type === "coding" || q.type === "debug") { a.passed = result.passed; a.total = result.total; }
    const d = (Store.s.days[day] = Store.s.days[day] || { attempts: [] }); d.attempts.push(a); Store.touch("days:" + day);
    Store.s.meta.activity[day] = (Store.s.meta.activity[day] || 0) + 1; Store.touch("meta");
    if (["wrong", "partial"].includes(result.status) && result.max > 0) this.logMistake(q, result, answer, mode);
    else if (result.status === "unanswered" && timeUp && result.max > 0) this.logMistake(q, result, answer, mode);
    else if (result.status === "correct") this.resolveRetest(q.id);
    return a;
  },
  answerText(q, ans) {
    if (ans == null) return "(no answer)";
    if (q.type === "mcq") return ans === "" ? "(no answer)" : `${String.fromCharCode(65 + +ans)}. ${q.options[+ans]}`;
    if (q.type === "msq") return (ans || []).map((i) => `${String.fromCharCode(65 + i)}. ${q.options[i]}`).join("; ") || "(no answer)";
    if (q.type === "coding") return ans.code || "";
    if (q.type === "debug") return (ans.code || "") + (ans.explanation ? "\n\n# Explanation: " + ans.explanation : "");
    if (q.type === "web") return Object.entries(ans.files || {}).map(([k, v]) => `/* ${k} */\n${v}`).join("\n\n");
    return String(ans);
  },
  correctText(q) {
    if (q.type === "mcq") return `${String.fromCharCode(65 + q.answer)}. ${q.options[q.answer]}`;
    if (q.type === "msq") return q.answer.map((i) => `${String.fromCharCode(65 + i)}. ${q.options[i]}`).join("; ");
    if (q.type === "subjective") return q.modelSolution || "";
    if (q.type === "coding" || q.type === "debug") return q.reference || "";
    if (q.type === "web") return Object.entries(q.reference || {}).filter(([, v]) => v).map(([k, v]) => `/* ${k} */\n${v}`).join("\n\n");
    return String(q.answer);
  },
  logMistake(q, result, answer, mode) {
    const existing = Object.values(Store.s.mistakes).find((m) => m.qid === q.id && !m.resolved);
    const why = result.ai ? [result.ai.firstIncorrectStep && "First incorrect step: " + result.ai.firstIncorrectStep, result.ai.feedback].filter(Boolean).join("\n")
      : result.tests ? `${result.passed}/${result.total} test cases passed.` + (result.tests.find((t) => t.error) ? " Error: " + result.tests.find((t) => t.error).error.type : "")
      : result.checks ? result.checks.filter((c) => !c.pass).map((c) => "✗ " + c.desc).join("\n") : q.explanation || "";
    const type = result.status === "unanswered" && mode !== "practice" ? "time" : result.mistakeType || "conceptual";
    if (existing) {
      existing.repeats = (existing.repeats || 0) + 1; existing.lastWrong = Date.now(); existing.answer = this.answerText(q, answer); existing.why = why; existing.retestDue = U.addDays(U.today(), 1); existing.streak = 0;
      existing.history = (existing.history || []).concat({ ts: Date.now(), correct: false, mode }); Store.touch("mistakes:" + existing.id); return existing;
    }
    const m = { id: U.uid("m"), qid: q.id, subject: q.subject, topicId: q.topicId, qType: q.type, prompt: q.prompt, title: q.title || "", answer: this.answerText(q, answer), correct: this.correctText(q),
      explanation: q.explanation || q.bugExplanation || "", why, category: type, autoCategory: type, ts: Date.now(), retestDue: U.addDays(U.today(), Store.cfg.settings.retestDays || 2), interval: Store.cfg.settings.retestDays || 2,
      repeats: 0, streak: 0, resolved: false, history: [{ ts: Date.now(), correct: false, mode }], notes: "" };
    Store.s.mistakes[m.id] = m; Store.touch("mistakes:" + m.id);
    if (!Object.values(Store.s.cards).some((c) => c.mistakeId === m.id) && ["mcq", "msq", "numerical", "output"].includes(q.type)) {
      const id = U.uid("c"); Store.s.cards[id] = Object.assign({ id, subject: q.subject, topicId: q.topicId, front: q.prompt, back: m.correct + (m.explanation ? "\n\n" + m.explanation : ""), source: "mistake", mistakeId: m.id, difficulty: q.difficulty }, SRS.blank()); Store.touch("cards:" + id);
    }
    return m;
  },
  resolveRetest(qid) {
    const m = Object.values(Store.s.mistakes).find((x) => x.qid === qid && !x.resolved); if (!m) return;
    m.history.push({ ts: Date.now(), correct: true }); m.streak = (m.streak || 0) + 1; m.interval = (m.interval || 2) * 2; m.retestDue = U.addDays(U.today(), m.interval);
    if (m.streak >= 2) m.resolved = true;
    Store.touch("mistakes:" + m.id);
  },
  updateAttempt(attemptId, score, status) {
    for (const d of Object.keys(Store.s.days)) { const a = (Store.s.days[d].attempts || []).find((x) => x.id === attemptId); if (a) { a.score = Math.max(0, score); a.status = status; Store.touch("days:" + d); return a; } }
  },
  all() { return Object.keys(Store.s.days).sort().flatMap((d) => Store.s.days[d].attempts || []); },
  topicStats(topicId, list) {
    const S = Store.cfg.settings; const at = (list || this.all()).filter((a) => a.topicId === topicId && a.status !== "pending");
    const sum = (xs) => xs.reduce((s, a) => s + a.score, 0), mx = (xs) => xs.reduce((s, a) => s + a.max, 0);
    const recent = at.slice(-S.masteryWindow);
    const days = new Set(at.map((a) => U.today(new Date(a.ts)))).size;
    const acc = mx(at) ? sum(at) / mx(at) : null, racc = mx(recent) ? sum(recent) / mx(recent) : null;
    const evidence = at.length >= S.masteryMinAttempts && racc >= S.masteryAccuracy && days >= S.masteryMinDays;
    const opened = !!Store.s.meta.opened[topicId];
    const auto = evidence ? "mastered" : at.length ? "practising" : opened ? "learning" : "not-started";
    const manual = Store.s.meta.topicStatus[topicId];
    return { attempts: at.length, acc, recentAcc: racc, days, evidence, auto, manual, status: manual || auto, last: at.length ? at[at.length - 1].ts : null };
  },
  streak() {
    const act = Store.s.meta.activity; let n = 0; let d = U.today();
    if (!act[d]) d = U.addDays(d, -1);
    while (act[d]) { n++; d = U.addDays(d, -1); }
    return n;
  },
  dueCards() { const t = U.today(); return Object.values(Store.s.cards).filter((c) => c.due <= t); },
  dueRetests() { const t = U.today(); return Object.values(Store.s.mistakes).filter((m) => !m.resolved && m.retestDue <= t && Cfg.q(m.qid)); },
};
