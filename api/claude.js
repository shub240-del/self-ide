// Vercel serverless function: proxies ExamForge AI requests to the Claude API.
// The API key lives only in the ANTHROPIC_API_KEY environment variable — it is never sent to the browser.
// Optional env vars:
//   APP_PASSCODE          – if set, callers must send it in the x-app-passcode header (stops strangers using your key)
//   CLAUDE_MODEL          – default model (default: claude-sonnet-5-5)
//   CLAUDE_MODEL_COMPLEX  – model for marking & question generation (default: CLAUDE_MODEL)
//   CLAUDE_MODEL_QUICK    – model for quick tasks (default: CLAUDE_MODEL)
const MAX_INPUT_CHARS = 120000;

module.exports = async (req, res) => {
  const key = process.env.ANTHROPIC_API_KEY;
  const passcode = process.env.APP_PASSCODE || "";
  if (req.method === "GET") {
    return res.status(200).json({ configured: !!key, passcodeRequired: !!passcode });
  }
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });
  if (!key) return res.status(503).json({ error: "ANTHROPIC_API_KEY is not set on the server", code: "not_configured" });
  if (passcode && req.headers["x-app-passcode"] !== passcode) return res.status(401).json({ error: "Wrong or missing passcode", code: "passcode" });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = null; } }
  const { messages, system, tier, maxTokens } = body || {};
  if (!Array.isArray(messages) || !messages.length || messages.some((m) => !["user", "assistant"].includes(m.role) || typeof m.content !== "string"))
    return res.status(400).json({ error: "messages must be a non-empty array of {role, content}" });
  const size = messages.reduce((s, m) => s + m.content.length, 0) + (system ? String(system).length : 0);
  if (size > MAX_INPUT_CHARS) return res.status(413).json({ error: "Request too large" });

  const base = process.env.CLAUDE_MODEL || "claude-sonnet-5-5";
  const model = tier === "complex" ? process.env.CLAUDE_MODEL_COMPLEX || base : tier === "quick" ? process.env.CLAUDE_MODEL_QUICK || base : base;
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify(Object.assign({ model, max_tokens: Math.min(Math.max(+maxTokens || 4096, 256), 8192), messages }, system ? { system: String(system) } : {})),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      const code = r.status === 429 ? "rate_limited" : r.status === 401 ? "bad_key" : "api_error";
      return res.status(r.status === 401 ? 502 : r.status).json({ error: (data.error && data.error.message) || "Claude API error " + r.status, code });
    }
    const text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
    return res.status(200).json({ text, model: data.model, stop_reason: data.stop_reason, usage: data.usage });
  } catch (e) {
    return res.status(502).json({ error: "Could not reach the Claude API: " + e.message, code: "unavailable" });
  }
};
