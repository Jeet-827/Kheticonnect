
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const API_KEY = process.env.HUGGINGFACE_API_KEY || process.env.HF_TOKEN || process.env.API_KEY_MODEL;
const MODEL = process.env.HF_MODEL || 'Qwen/Qwen2.5-72B-Instruct';

const API_URL = 'https://router.huggingface.co/v1/chat/completions';

// AI Instructions
function getPrompt(language, role) {
  return `
You are KhetiBot, the AI assistant of KhetiConnect.

Help users with:
- Buying and selling crops
- Crop auctions and bidding
- Farming advice and pest control
- Government schemes
- Mandi rates
- Using the KhetiConnect platform

User role: ${role || 'user'}
Preferred language: ${language}

Rules:
- Answer in the user's preferred language.
- Use simple words and short answers.
- Use bullet points when useful.
- Do not invent live prices or platform data.
- If you do not know something, say so.
`;
}

// Chat API
router.post('/', async (req, res) => {
  try {
    const {
      message,
      messages,
      language = 'auto',
      userContext = {}
    } = req.body;

    const conversation = messages?.length
      ? messages
      : [{ role: 'user', content: message }];

    if (!conversation[0]?.content) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a message'
      });
    }

    if (!API_KEY) {
      const fallbackReply = `नमस्ते! मैं KhetiBot हूँ। KhetiConnect पर आप अपनी फसल सीधे बेच सकते हैं, लाइव बोली लगा सकते हैं, और कृषि सलाह व मंडी भाव जान सकते हैं।`;
      return res.json({
        success: true,
        reply: fallbackReply,
        model: 'Fallback Model',
        language
      });
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: getPrompt(language, userContext.role)
          },
          ...conversation.slice(-10)
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const fallbackReply = `नमस्ते! मैं KhetiBot हूँ। KhetiConnect पर आप अपनी फसल सीधे बेच सकते हैं, लाइव बोली लगा सकते हैं, और कृषि सलाह व मंडी भाव जान सकते हैं।`;
      return res.json({
        success: true,
        reply: fallbackReply,
        model: 'Fallback Model',
        language
      });
    }

    const reply = data.choices?.[0]?.message?.content;

    res.json({
      success: true,
      reply,
      model: MODEL,
      language
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Suggested Questions
router.get('/suggested', (req, res) => {
  const suggestions = {
    en: [
      'How do I sell crops?',
      'How does crop bidding work?',
      'What government schemes are available?',
      'How can I control crop pests?',
      'How does escrow payment work?'
    ],
    hi: [
      'फसल कैसे बेचें?',
      'फसल की बोली कैसे लगाएं?',
      'सरकारी योजनाएं कौन सी हैं?',
      'जैविक कीट नियंत्रण कैसे करें?'
    ],
    gu: [
      'પાક કેવી રીતે વેચવો?',
      'પાકની હરાજી કેવી રીતે થાય?',
      'સરકારી યોજનાઓ કઈ છે?'
    ],
    pa: [
      'ਫਸਲ ਕਿਵੇਂ ਵੇਚੀਏ?',
      'ਫਸਲ ਦੀ ਬੋਲੀ ਕਿਵੇਂ ਲਗਾਈਏ?',
      'ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਕਿਹੜੀਆਂ ਹਨ?'
    ],
    mr: [
      'शेतमाल कसा विकावा?',
      'लिलावात कशी बोली लावावी?',
      'सरकारी योजना कोणत्या आहेत?'
    ]
  };

  const lang = req.query.lang || 'en';

  res.json({
    success: true,
    suggestions: suggestions[lang] || suggestions.en
  });
});

export default router;
