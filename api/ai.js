// Vercel serverless function: proxies ExamForge AI requests to an LLM provider.
// API keys live only in environment variables — they are never sent to the browser.
//
// Provider selection (first match wins):
//   AI_PROVIDER=nvidia|anthropic  – force a provider
//   NVIDIA_API_KEY                – NVIDIA API Catalog (build.nvidia.com), OpenAI-compatible
//   ANTHROPIC_API_KEY             – Claude API
// Optional:
//   NVIDIA_MODEL / NVIDIA_MODEL_COMPLEX       (default: meta/llama-3.3-70b-instruct)
//   CLAUDE_MODEL / CLAUDE_MODEL_COMPLEX       (default: claude-sonnet-5-5)
//   APP_PASSCODE – if set, callers must send it in the x-app-passcode header
const MAX_INPUT_CHARS = 120000;

function pickProvider() {
  const forced = (process.env.AI_PROVIDER || "").toLowerCase();
  if (forced === "nvidia" && process.env.NVIDIA_API_KEY) return "nvidia";
  if (forced === "anthropic" && process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (process.env.NVIDIA_API_KEY) return "nvidia";
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  return null;
}
function modelFor(provider, tier) {
  if (provider === "nvidia") {
    const base = process.env.NVIDIA_MODEL || "meta/llama-3.3-70b-instruct";
    return tier === "complex" ? process.env.NVIDIA_MODEL_COMPLEX || base : base;
  }
  const base = process.env.CLAUDE_MODEL || "claude-sonnet-5-5";
  return tier === "complex" ? process.env.CLAUDE_MODEL_COMPLEX || base : base;
}
// Some open models emit their reasoning inside <think>…</think>; the app only wants the answer.
const stripThinking = (t) => String(t || "").replace(/<think>[\s\S]*?<\/think>/gi, "").replace(/^[\s\S]*<\/think>/i, "").trim();

async function callNvidia(model, messages, maxTokens) {
  const r = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: { authorization: "Bearer " + process.env.NVIDIA_API_KEY, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({ model, messages, max_tokens: maxTokens, temperature: 0.3, stream: false }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) return { ok: false, status: r.status, error: (data.error && (data.error.message || data.error)) || data.detail || data.title || "NVIDIA API error " + r.status };
  const ch = (data.choices || [])[0] || {};
  return { ok: true, text: stripThinking(ch.message && ch.message.content), model: data.model || model, truncated: ch.finish_reason === "length" };
}
async function callAnthropic(model, messages, maxTokens) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": process.env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model, max_tokens: maxTokens, messages }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) return { ok: false, status: r.status, error: (data.error && data.error.message) || "Claude API error " + r.status };
  return { ok: true, text: (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join(""), model: data.model || model, truncated: data.stop_reason === "max_tokens" };
}

module.exports = async (req, res) => {
  const provider = pickProvider();
  const passcode = process.env.APP_PASSCODE || "";
  if (req.method === "GET") {
    return res.status(200).json({ configured: !!provider, provider, model: provider ? modelFor(provider, "default") : null, passcodeRequired: !!passcode });
  }
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });
  if (!provider) return res.status(503).json({ error: "No AI key is set on the server (NVIDIA_API_KEY or ANTHROPIC_API_KEY)", code: "not_configured" });
  if (passcode && req.headers["x-app-passcode"] !== passcode) return res.status(401).json({ error: "Wrong or missing passcode", code: "passcode" });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = null; } }
  const { messages, tier, maxTokens } = body || {};
  if (!Array.isArray(messages) || !messages.length || messages.some((m) => !["user", "assistant"].includes(m.role) || typeof m.content !== "string"))
    return res.status(400).json({ error: "messages must be a non-empty array of {role, content}" });
  if (messages.reduce((s, m) => s + m.content.length, 0) > MAX_INPUT_CHARS) return res.status(413).json({ error: "Request too large" });

  const model = modelFor(provider, tier);
  const mt = Math.min(Math.max(+maxTokens || 4096, 256), 8192);
  try {
    const out = provider === "nvidia" ? await callNvidia(model, messages, mt) : await callAnthropic(model, messages, mt);
    if (!out.ok) {
      const code = out.status === 429 ? "rate_limited" : out.status === 401 || out.status === 403 ? "bad_key" : "api_error";
      return res.status(code === "bad_key" ? 502 : out.status).json({ error: String(out.error), code, provider });
    }
    return res.status(200).json({ text: out.text, model: out.model, provider, stop_reason: out.truncated ? "max_tokens" : "end_turn" });
  } catch (e) {
    return res.status(502).json({ error: "Could not reach the AI provider: " + e.message, code: "unavailable", provider });
  }
};
