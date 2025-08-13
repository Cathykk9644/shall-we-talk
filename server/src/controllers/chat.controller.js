import { generateStreamToken } from "../config/stream.js";
import User from "../models/User.js";
import { hfGenerateRaw } from "../config/ai.js";

export async function getStreamToken(req, res) {
  try {
    const streamToken = generateStreamToken(req.user.id);

    res.status(200).json({ streamToken });
  } catch (error) {
    console.log("Error in getStreamToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// Generate smart reply suggestions using Groq models via shared helper
export async function suggestReplies(req, res) {
  try {
    const safeFallbacks = [
      "Could you tell me a bit more?",
      "That sounds interesting!",
      "I'm here—what do you think?",
    ];

    const { messages } = req.body || {};
    if (!Array.isArray(messages)) {
      return res.status(400).json({ message: "messages array is required" });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        message: "AI key missing; returning generic suggestions",
        suggestions: safeFallbacks,
      });
    }

    // Normalize and limit to last 10 messages
    const normalized = messages
      .filter((m) => m && typeof m.content === "string" && m.content.trim())
      .slice(-10)
      .map((m) => ({
        role: m.role === "me" || m.role === "user" ? "me" : "friend",
        content: m.content.trim(),
      }));

    const conversation = normalized
      .map((m) => `${m.role === "me" ? "Me" : "Friend"}: ${m.content}`)
      .join("\n");

    const systemPrompt = `You are assisting a user in a casual 1:1 chat. Generate 3 short, friendly, helpful reply suggestions (max 120 characters each) the user could send next. Avoid emojis and quotes, keep a warm tone, do not invent facts. Return STRICT JSON of the form: { "suggestions": ["...", "...", "..."] } with exactly 3 items and nothing else.`;

    const inputs = `${systemPrompt}\n\nConversation so far:\n${conversation}\n\nJSON:`;

    // Use shared helper (now backed by Groq) with multiple fallback models
    const gen = await hfGenerateRaw({
      inputs,
      parameters: {
        max_new_tokens: 120,
        temperature: 0.7,
        return_full_text: false,
      },
      timeoutMs: 15000,
    });

    if (!gen.ok) {
      console.error("Groq API error (suggestReplies)", gen.error || gen.status);
      return res.status(200).json({
        message: "Using fallback suggestions",
        suggestions: safeFallbacks,
      });
    }

    const raw = gen.raw || "";

    let suggestions = [];
    try {
      const start = raw.indexOf("{");
      const end = raw.lastIndexOf("}") + 1;
      if (start !== -1 && end !== -1) {
        const jsonStr = raw.slice(start, end);
        const parsed = JSON.parse(jsonStr);
        if (Array.isArray(parsed?.suggestions)) {
          suggestions = parsed.suggestions;
        }
      }
    } catch (e) {
      // ignore and fallback to heuristic parsing
    }

    if (!suggestions.length) {
      // fallback: split lines
      suggestions = raw
        .split(/\r?\n/)
        .map((l) => l.replace(/^[-*\d.\s]+/, "").trim())
        .filter(Boolean)
        .slice(0, 3);
    }

    // Final sanitize and enforce constraints
    suggestions = suggestions
      .map((s) =>
        String(s)
          .replace(/^["']|["']$/g, "")
          .trim()
      )
      .filter(Boolean)
      .map((s) => (s.length > 120 ? s.slice(0, 117).trimEnd() + "..." : s));

    while (suggestions.length < 3)
      suggestions.push(
        safeFallbacks[suggestions.length] || "Sounds good to me!"
      );
    suggestions = suggestions.slice(0, 3);

    return res.status(200).json({ suggestions });
  } catch (error) {
    console.error("Error in suggestReplies controller:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", suggestions: [] });
  }
}

// New: Suggest conversation topics tailored to both users
export async function suggestIcebreakers(req, res) {
  try {
    const { partnerUserId } = req.body || {};
    if (!partnerUserId) {
      return res.status(400).json({ message: "partnerUserId is required" });
    }

    const me = req.user; // from auth middleware
    const partner = await User.findById(partnerUserId).select(
      "fullName bio nativeLanguage learningLanguage location"
    );
    if (!partner) {
      return res.status(404).json({ message: "Partner user not found" });
    }

    const safeFallbacks = [
      "What's a favorite place to visit in your city?",
      "What music are you listening to lately?",
      "Tell me a fun fact about your culture",
      "What TV show or movie are you into right now?",
      "What's a small goal you're working on this week?",
    ];

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        message: "AI key missing; returning generic topics",
        topics: safeFallbacks,
      });
    }

    const profileContext = `
Me:
- Native: ${me.nativeLanguage || ""}
- Learning: ${me.learningLanguage || ""}
- Location: ${me.location || ""}
- Bio: ${me.bio || ""}

Partner (${partner.fullName || "Friend"}):
- Native: ${partner.nativeLanguage || ""}
- Learning: ${partner.learningLanguage || ""}
- Location: ${partner.location || ""}
- Bio: ${partner.bio || ""}
`.trim();

    const systemPrompt = `You are helping two language exchange partners start a conversation. Generate 5 friendly, culturally respectful icebreaker TOPICS tailored to their languages, locations, and bios. Each topic must be a short one-line prompt (<= 90 chars), avoid emojis and quotes, and be suitable for beginners. Return STRICT JSON: { "topics": ["...", "...", "...", "...", "..."] } with exactly 5 items.`;

    const inputs = `${systemPrompt}\n\nProfiles:\n${profileContext}\n\nJSON:`;

    // Use shared helper (now backed by Groq) with multiple fallback models
    const gen = await hfGenerateRaw({
      inputs,
      parameters: {
        max_new_tokens: 150,
        temperature: 0.7,
        return_full_text: false,
      },
      timeoutMs: 15000,
    });

    if (!gen.ok) {
      console.error("Groq API error (icebreakers)", gen.error || gen.status);
      return res
        .status(200)
        .json({ message: "Using fallback topics", topics: safeFallbacks });
    }

    const raw = gen.raw || "";

    let topics = [];
    try {
      const start = raw.indexOf("{");
      const end = raw.lastIndexOf("}") + 1;
      if (start !== -1 && end !== -1) {
        const jsonStr = raw.slice(start, end);
        const parsed = JSON.parse(jsonStr);
        if (Array.isArray(parsed?.topics)) topics = parsed.topics;
      }
    } catch {}

    if (!topics.length) {
      topics = raw
        .split(/\r?\n/)
        .map((l) => l.replace(/^[-*\d.\s]+/, "").trim())
        .filter(Boolean)
        .slice(0, 5);
    }

    topics = topics
      .map((s) =>
        String(s)
          .replace(/^["']|["']$/g, "")
          .trim()
      )
      .filter(Boolean)
      .map((s) => (s.length > 90 ? s.slice(0, 87).trimEnd() + "..." : s));

    while (topics.length < 5)
      topics.push(safeFallbacks[topics.length] || "Tell me about your day");
    topics = topics.slice(0, 5);

    return res.status(200).json({ topics });
  } catch (error) {
    console.error("Error in suggestIcebreakers controller:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", topics: [] });
  }
}
