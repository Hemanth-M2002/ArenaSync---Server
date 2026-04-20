const { GoogleGenerativeAI } = require('@google/generative-ai');
const ArenaKnowledge = require('../models/ArenaKnowledge');

// Initialize Gemini with explicit API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Model Fallback Chain
 * Ordered from most preferred to least preferred.
 * If a model returns 503 (overloaded), 429 (rate limit), or 404 (not found on this tier),
 * the next model in the chain is automatically tried.
 */
const MODEL_CHAIN = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite',
  'gemini-flash-latest',
];

// Errors that are worth retrying on the next model
const RETRIABLE_STATUSES = new Set([503, 429, 404]);

/**
 * Attempt to generate an AI response using a single model.
 * Throws on failure so the caller can try the next model.
 */
async function tryModel(modelName, systemPrompt, formattedHistory, prompt) {
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: systemPrompt,
  });

  const chat = model.startChat({
    history: formattedHistory,
    generationConfig: {
      maxOutputTokens: 400,
      temperature: 0.2, // Low temperature to stick to facts
    },
  });

  const result = await chat.sendMessage(prompt);
  const response = await result.response;
  return response.text();
}

const generateAIResponse = async (req, res) => {
  const { prompt, history, context } = req.body;

  if (!context || !context.venue) {
    return res.status(400).json({
      success: false,
      message: 'Active context missing. Cannot guide without venue info.',
    });
  }

  // ── 1. Fetch venue knowledge from MongoDB ──────────────────────────────────
  let knowledge = null;
  try {
    knowledge = await ArenaKnowledge.findOne({
      venueName: {
        $regex: new RegExp(
          `^${context.venue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
          'i'
        ),
      },
    });
  } catch (dbErr) {
    console.error('Arena AI Knowledge DB error:', dbErr);
  }

  const structuredRules = knowledge
    ? knowledge.structuredData
    : 'No verified structural data currently recorded for this venue map.';

  // ── 2. Build System Prompt (RAG injection) ─────────────────────────────────
  const systemPrompt = `
You are ArenaSync AI, an expert physical concierge companion for the ${context.venue}.
The user is currently attending a ${context.sport} event. 
Their ticket says they are seated in or near ${context.stand}, and entered through ${context.gate}.

CRITICAL INSTRUCTIONS:
1. ONLY answer questions related to the stadium layout, event navigation, crowd, queuing, seating, food stalls, or restrooms.
2. If the user asks something outside this scope (e.g., coding, general knowledge, movies, unrelated chats), politely decline and remind them you are specifically localized to the stadium environment.
3. DO NOT hallucinate facts. Rely entirely on the "STRUCTURED STADIUM DATA" below. 
4. If they ask about food or washrooms, use the structural data to provide the nearest one to ${context.stand} or ${context.gate}.
5. If the structural data does not explicitly state the answer to their question, politely admit you do not have that specific layout path rather than making up a generic stadium response!
6. Keep responses under 3 sentences unless it is a complex navigation instruction. Be extremely precise and human-like.
7. FORMATTING: Use **bold** markdown ONLY for proper nouns — specifically: food stall names, gate labels (e.g. Gate D), stand names, and location names. Do NOT bold common words, adjectives, or entire sentences. Bold should appear sparingly — maximum 2–3 bold phrases per response.

STRUCTURED STADIUM DATA (Source of Truth):
${structuredRules}
  `;

  // ── 3. Format chat history ─────────────────────────────────────────────────
  const formattedHistory = (history || []).map((msg) => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }));

  // ── 4. Try each model in the fallback chain ────────────────────────────────
  let lastError = null;

  for (const modelName of MODEL_CHAIN) {
    try {
      console.log(`🤖 Trying model: ${modelName}`);
      const aiText = await tryModel(modelName, systemPrompt, formattedHistory, prompt);

      console.log(`✅ Success with model: ${modelName}`);
      return res.status(200).json({
        success: true,
        role: 'model',
        text: aiText,
        modelUsed: modelName, // helpful for debugging
      });
    } catch (err) {
      lastError = err;
      const status = err.status || err.statusCode;

      if (RETRIABLE_STATUSES.has(status)) {
        console.warn(
          `⚠️  Model [${modelName}] failed with ${status} — trying next model in chain...`
        );
        continue; // try the next model
      }

      // Non-retriable error (e.g. bad API key, malformed request) — stop immediately
      console.error(`❌ Non-retriable error from model [${modelName}]:`, err.message);
      break;
    }
  }

  // ── 5. All models exhausted — respond with best error message ─────────────
  console.error('❌ All models in fallback chain failed. Last error:', lastError);

  const details = lastError && Array.isArray(lastError.errorDetails) ? lastError.errorDetails : [];
  const apiKeyIssue = details.find(
    (d) => d.reason === 'API_KEY_INVALID' || d.reason === 'API_KEY_EXPIRED'
  );

  if (apiKeyIssue) {
    return res.status(500).json({
      success: false,
      message:
        'ArenaSync AI cannot reach Gemini — the API key is invalid or expired. Please update GEMINI_API_KEY on the server and restart.',
    });
  }

  const finalStatus = lastError?.status || 500;

  if (finalStatus === 429) {
    return res.status(429).json({
      success: false,
      message:
        'All AI models are currently rate-limited. Please wait 10–15 seconds and try again.',
    });
  }

  if (finalStatus === 503) {
    return res.status(503).json({
      success: false,
      message:
        'All AI models are currently under extremely high load. Please try again in a moment.',
    });
  }

  return res.status(500).json({
    success: false,
    message:
      'ArenaSync AI encountered an unexpected error. Please try again shortly.',
    debug: lastError?.message || 'Unknown error',
  });
};

module.exports = { generateAIResponse };
