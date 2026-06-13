const GROQ_API_KEY = process.env.GROQ_API_KEY || "";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const SYSTEM_PROMPT = `
You are an empathetic, supportive mental wellness assistant tailored specifically for students in India preparing for high-stakes competitive examinations (such as JEE, NEET, CBSE/State Board exams, UPSC, GATE, and CUET) and dealing with intense coaching class environments (e.g., Kota, coaching centers, dummy schools).
Your sole mission is to offer stress management advice, emotional grounding, time-management tips, exam anxiety control strategies, and warm reassurance.
You must ground your advice in clinical wellness frameworks (such as CBT techniques, progressive muscle relaxation, mindfulness, and breathing exercises).
Always tailor your responses to the Indian student context. Refer to support initiatives in India such as NIMHANS (National Institute of Mental Health and Neurosciences), the Government's Tele-MANAS initiative, and the Ministry of Health and Family Welfare (MoHFW) student wellness advisories.
If any financial aspects or pricing of study/wellness tools are mentioned, always refer to costs in Indian Rupees (₹).
Provide short, structured, and warm suggestions.
If the user asks academic syllabus questions (e.g. solving equations, organic chemistry steps, coding, or homework queries), politely decline, reminding them that your role is strictly to support their mental and emotional well-being during their preparation journey.
Never prescribe or suggest specific medical drugs (e.g., anti-depressants, sleeping pills) - instruct them to consult a qualified medical professional or contact the Kiran Helpline (1800-599-0019) or Tele-MANAS (14416).
`;

// Helper list of mock responses based on keywords when Groq is unreachable
const MOCK_COPING_RESPONSES = [
  {
    keywords: ["mock", "test", "exam", "score", "fail", "cutoff", "result"],
    response: "It is completely normal to feel stressed about mock test scores or coaching class rank lists. In India's competitive exam setup (NEET/JEE/UPSC), mock tests are diagnostic tools to help you identify areas for improvement, not definitions of your worth. Take a deep breath. Try breaking your syllabus down into smaller topics. According to Ministry of Health & Family Welfare (MoHFW) student wellness advisories, prioritizing structured study breaks (e.g., 50 minutes study, 10 minutes rest) can significantly reduce cognitive fatigue."
  },
  {
    keywords: ["tired", "sleep", "exhausted", "burnout", "fatigue"],
    response: "Burnout is a serious signal that your body and mind need rest, especially under intense study schedules (12-14 hours of daily prep). Academic preparation is a marathon, not a sprint. Try to set a strict wind-down time at night, avoiding screens 30 minutes before sleep. NIMHANS guidelines emphasize that regular 7-8 hour sleep patterns are vital for memory consolidation and focus."
  },
  {
    keywords: ["parent", "family", "pressure", "expectation"],
    response: "Navigating expectations from parents or family while preparing for competitive exams in India adds a heavy emotional load. Your pressure is valid. Try writing down your feelings or having an honest, calm conversation with them about how you are doing. Remember that your well-being is the most important foundation for any exam. The Kiran Helpline (1800-599-0019) or Tele-MANAS (14416) also offer free, confidential counseling if you need a professional to talk to."
  },
  {
    keywords: ["chemistry", "physics", "math", "syllabus", "subject", "stuck"],
    response: "Getting stuck on specific subjects like Chemistry, Physics, or Mathematics can trigger intense anxiety, especially under tight coaching timelines. When this happens, shift your focus to what you *do* understand, or take a 10-minute break. A simple 5-4-3-2-1 grounding exercise can help: identify 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste. This shifts your brain out of panic mode so you can approach the concept with a fresh perspective."
  }
];

const DEFAULT_MOCK_RESPONSE = "I hear you, and it sounds like you are carrying a lot of weight right now. Preparing for these Indian competitive milestones is incredibly challenging, and feeling overwhelmed is a natural response. Remember to take it one day, one study session at a time. What is one small thing you can do to take care of yourself right now, even if it's just drinking a glass of water, taking three deep breaths, or connecting with friends? For professional guidance, you can also reach out to NIMHANS counseling lines or call the Government's Tele-MANAS helpline at 14416. I am here to support you.";

/**
 * Calls the Groq API or falls back to local rule-based parsing.
 */
export async function extractJournalAnalytics(text: string): Promise<{ dominant_emotion: string, triggers: string[] }> {
  if (GROQ_API_KEY) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 6000); // 6s timeout

      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          response_format: { type: "json_object" },
          messages: [
            {
              role: "system",
              content: "You are an analytical assistant. You analyze student journal entries and return a JSON object with: { \"dominant_emotion\": \"string (anxiety/burnout/stress/hope/sadness)\", \"triggers\": [\"string (list of 1-4 short noun-phrase triggers extracted from text, e.g. physics test, mock score, sleep deprivation, peer pressure)\"] }"
            },
            {
              role: "user",
              content: text
            }
          ]
        }),
        signal: controller.signal
      });
      clearTimeout(id);

      if (response.ok) {
        const json = await response.json();
        const content = JSON.parse(json.choices[0].message.content);
        if (content.dominant_emotion && Array.isArray(content.triggers)) {
          return {
            dominant_emotion: content.dominant_emotion,
            triggers: content.triggers
          };
        }
      }
    } catch (err) {
      console.warn("Groq API trigger extraction failed, using mock parser:", err);
    }
  }

  // Local Mock Parser (Offline Fallback)
  const normalized = text.toLowerCase();
  const triggers: string[] = [];
  let dominant_emotion = "stress";

  if (normalized.includes("mock") || normalized.includes("test") || normalized.includes("exam")) {
    triggers.push("mock exams");
  }
  if (normalized.includes("physics") || normalized.includes("chemistry") || normalized.includes("math") || normalized.includes("biology")) {
    triggers.push("subject difficulty");
  }
  if (normalized.includes("sleep") || normalized.includes("tired") || normalized.includes("exhaust")) {
    triggers.push("sleep deprivation");
    dominant_emotion = "burnout";
  }
  if (normalized.includes("parent") || normalized.includes("expect") || normalized.includes("family")) {
    triggers.push("parental pressure");
    dominant_emotion = "anxiety";
  }
  if (normalized.includes("friend") || normalized.includes("coaching") || normalized.includes("peer")) {
    triggers.push("peer pressure");
    dominant_emotion = "anxiety";
  }
  if (normalized.includes("time") || normalized.includes("schedule") || normalized.includes("hour")) {
    triggers.push("time management");
    dominant_emotion = "stress";
  }

  if (triggers.length === 0) {
    triggers.push("exam pressure");
  }

  return { dominant_emotion, triggers };
}

/**
 * Calls Groq API for companion response, enforcing system prompt and negative prompts.
 * Falls back to local rule-based empathetic response if unreachable.
 */
export async function generateEmpatheticResponse(
  message: string,
  history: Array<{ role: "user" | "assistant"; content: string }>
): Promise<string> {
  // Negative Prompt pre-scan: Reject academic homework/coding queries
  const isAcademicQuery = /solve|equation|python|code|write a script|formula|derivation|biology cycle|citric acid|explain photosynthesis|integration/i.test(message);
  if (isAcademicQuery) {
    return "I want to support you, but my role is focused solely on your mental wellness, stress relief, and emotional support. I cannot help with homework questions, coding, or subject-specific problem solving. If you are feeling overwhelmed by your syllabus, let me know, and we can practice a quick relaxation technique together.";
  }

  if (GROQ_API_KEY) {
    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 8000); // 8s timeout

      const messages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...history.slice(-10), // Send last 10 messages max
        { role: "user", content: message }
      ];

      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: messages,
          temperature: 0.7,
          max_tokens: 400
        }),
        signal: controller.signal
      });
      clearTimeout(id);

      if (response.ok) {
        const json = await response.json();
        return json.choices[0].message.content;
      }
    } catch (err) {
      console.warn("Groq API chat failed, using mock responder:", err);
    }
  }

  // Local Mock Responder (Offline Fallback)
  const normalized = message.toLowerCase();
  for (const item of MOCK_COPING_RESPONSES) {
    if (item.keywords.some(k => normalized.includes(k))) {
      return item.response;
    }
  }

  return DEFAULT_MOCK_RESPONSE;
}
