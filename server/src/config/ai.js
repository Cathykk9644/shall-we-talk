// Unified AI helper supporting Google Gemini (1.5 Flash) and Groq chat models.
// Prefers Gemini 1.5 Flash first when configured, then falls back to Groq models.

// Groq model fallbacks (OpenAI-compatible endpoint)
const GROQ_DEFAULT_MODELS = [
  "llama-3.1-8b-instant",
  "llama-3.1-70b-versatile",
  "mixtral-8x7b-32768",
  "gemma2-9b-it",
  "llama3-8b-8192",
];

const GROQ_ENV_MODELS = (process.env.GROQ_MODELS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const GROQ_MODELS = GROQ_ENV_MODELS.length
  ? GROQ_ENV_MODELS
  : GROQ_DEFAULT_MODELS;

function mapMaxTokens(parameters) {
  const { max_tokens, max_new_tokens } = parameters || {};
  if (typeof max_tokens === "number") return max_tokens;
  if (typeof max_new_tokens === "number") return max_new_tokens;
  return undefined;
}

async function generateWithGroq({ inputs, parameters, timeoutMs }) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey)
    return { ok: false, raw: null, status: 0, error: "missing_groq_key" };

  const temperature = parameters?.temperature ?? 0.7;
  const resolvedMaxTokens = mapMaxTokens(parameters);

  for (const model of GROQ_MODELS) {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "user", content: String(inputs || "") }],
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
    } catch (err) {
      clearTimeout(t);
      console.error("Groq request failed", err);
      continue;
    }
  }

  return { ok: false, raw: null, status: 0, error: "groq_all_models_failed" };
}

async function generateWithGemini({ inputs, parameters, timeoutMs }) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey)
    return { ok: false, raw: null, status: 0, error: "missing_gemini_key" };

  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const temperature = parameters?.temperature ?? 0.7;
  const maxOutputTokens = mapMaxTokens(parameters);

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
      apiKey
    )}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: String(inputs || "") }],
          },
        ],
        generationConfig: {
          temperature,
          ...(typeof maxOutputTokens === "number" ? { maxOutputTokens } : {}),
        },
      }),
      signal: controller.signal,
    });
    clearTimeout(t);

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`Gemini API error (${model})`, res.status, text);
      return {
        ok: false,
        raw: null,
        status: res.status,
        error: "gemini_error",
      };
    }

    const data = await res.json();
    const parts = data?.candidates?.[0]?.content?.parts || [];
    const raw = parts
      .map((p) => p?.text || "")
      .join("")
      .trim();
    if (raw) return { ok: true, raw };
    return {
      ok: false,
      raw: null,
      status: 200,
      error: "empty_gemini_response",
    };
  } catch (err) {
    clearTimeout(t);
    console.error("Gemini request failed", err);
    return { ok: false, raw: null, status: 0, error: "gemini_exception" };
  }
}

export async function hfGenerateRaw({ inputs, parameters, timeoutMs = 15000 }) {
  // Preference: if provider explicitly set to gemini/google OR a Gemini key is present, try Gemini first
  const provider = (process.env.AI_PROVIDER || "").toLowerCase();
  const preferGemini = provider
    ? provider === "gemini" || provider === "google"
    : Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);

  if (preferGemini) {
    const gem = await generateWithGemini({ inputs, parameters, timeoutMs });
    if (gem.ok) return gem;
    // Fallback to Groq if available
    if (process.env.GROQ_API_KEY) {
      const groq = await generateWithGroq({ inputs, parameters, timeoutMs });
      if (groq.ok) return groq;
      return groq;
    }
    return gem;
  }

  // Default path: try Groq first, then Gemini if configured
  if (process.env.GROQ_API_KEY) {
    const groq = await generateWithGroq({ inputs, parameters, timeoutMs });
    if (groq.ok) return groq;
    if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) {
      const gem = await generateWithGemini({ inputs, parameters, timeoutMs });
      if (gem.ok) return gem;
      return gem;
    }
    return groq;
  }

  // If no Groq key, try Gemini as a last resort
  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY) {
    return await generateWithGemini({ inputs, parameters, timeoutMs });
  }

  return {
    ok: false,
    raw: null,
    status: 0,
    error: "no_ai_provider_configured",
  };
}
