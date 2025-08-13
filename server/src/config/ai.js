// Lightweight helper to call Groq Chat Completions API with fallback models
// Tries models in order until one returns 200 OK, then extracts a raw text string

const DEFAULT_MODELS = [
  // Common Groq-hosted, OpenAI-compatible chat models
  "llama-3.1-8b-instant",
  "llama-3.1-70b-versatile",
  "mixtral-8x7b-32768",
  "gemma2-9b-it",
  "llama3-8b-8192",
];

const ENV_MODELS = (process.env.GROQ_MODELS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const MODELS = ENV_MODELS.length ? ENV_MODELS : DEFAULT_MODELS;

export async function hfGenerateRaw({ inputs, parameters, timeoutMs = 15000 }) {
  // Backward-compatible export name; now uses Groq
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey)
    return { ok: false, raw: null, status: 0, error: "missing_api_key" };

  // Map incoming HF-style params to Groq/OpenAI-compatible ones
  const {
    temperature = 0.7,
    max_new_tokens,
    max_tokens,
    // return_full_text is ignored for chat APIs
  } = parameters || {};

  const resolvedMaxTokens =
    typeof max_tokens === "number"
      ? max_tokens
      : typeof max_new_tokens === "number"
      ? max_new_tokens
      : undefined;

  for (const model of MODELS) {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(
        `https://api.groq.com/openai/v1/chat/completions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [
              // We only have a single combined prompt string
              { role: "user", content: String(inputs || "") },
            ],
            temperature,
            ...(resolvedMaxTokens ? { max_tokens: resolvedMaxTokens } : {}),
          }),
          signal: controller.signal,
        }
      );
      clearTimeout(t);

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error(`Groq API error (${model})`, res.status, text);
        continue; // try next model
      }

      const data = await res.json();
      const raw =
        data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.text ?? "";

      if (raw) return { ok: true, raw };
      // If empty, try next model
    } catch (err) {
      clearTimeout(t);
      console.error("Groq request failed", err);
      continue; // try next model
    }
  }

  return { ok: false, raw: null, status: 0, error: "all_models_failed" };
}
