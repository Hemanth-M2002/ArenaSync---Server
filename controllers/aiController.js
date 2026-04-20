const { GoogleGenerativeAI } = require('@google/generative-ai');
const ArenaKnowledge = require('../models/ArenaKnowledge');

// Initialize Gemini with explicit API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateAIResponse = async (req, res, next) => {
  try {
    const { prompt, history, context } = req.body;
    
    if (!context || !context.venue) {
       return res.status(400).json({ success: false, message: 'Active context missing. Cannot guide without venue info.' });
    }

    let knowledge = null;
    try {
      knowledge = await ArenaKnowledge.findOne({
        venueName: context.venue,
      });
    } catch (dbErr) {
      console.error('Arena AI Knowledge DB error:', dbErr);
    }
    
    let structuredRules = knowledge 
      ? knowledge.structuredData 
      : 'No verified structural data currently recorded for this venue map.';
    
    // 2. Build the System Rules
    // Using system instruction capabilities newly added to Gemini models
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

STRUCTURED STADIUM DATA (Source of Truth):
${structuredRules}
    `;

    // 3. Initialize Gemini
    // Using gemini-1.5-flash for the fastest Hackathon response
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash', 
      systemInstruction: systemPrompt 
    });

    // Format chat history for Gemini
    const formattedHistory = (history || []).map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 400,
        temperature: 0.2, // Low temperature to stick to facts
      },
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const aiText = response.text();

    res.status(200).json({
      success: true,
      role: 'model',
      text: aiText
    });
  } catch (err) {
    console.error('AI Generation Error:', err);

    const details = err && Array.isArray(err.errorDetails) ? err.errorDetails : [];
    const apiKeyIssue = details.find(
      (d) => d.reason === 'API_KEY_INVALID' || d.reason === 'API_KEY_EXPIRED'
    );

    if (apiKeyIssue) {
      return res.status(500).json({
        success: false,
        message:
          'ArenaSync AI backend cannot reach Gemini because the API key is invalid or expired. Please update GEMINI_API_KEY on the server and restart.',
      });
    }

    res.status(500).json({
      success: false,
      message:
        'ArenaSync AI system is currently recalibrating due to an internal error. Please try again in a moment.',
    });
  }
};

module.exports = {
  generateAIResponse
};
