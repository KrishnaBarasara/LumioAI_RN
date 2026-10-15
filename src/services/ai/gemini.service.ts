import { env, isGeminiConfigured } from '@/config/env';

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

export type GeminiSummaryJson = {
  summary: string;
  keyPoints: string[];
  decisions: string[];
  actionItems: Array<{
    title: string;
    assignee?: string;
    dueDate?: string;
    priority?: 'low' | 'medium' | 'high';
  }>;
  risks: string[];
  followUps: string[];
  sentiment: { score: number; label: string; description: string };
};

async function callGemini(
  prompt: string,
  options?: { json?: boolean; system?: string },
): Promise<string> {
  if (!isGeminiConfigured) {
    throw new Error('Gemini API key is not configured (EXPO_PUBLIC_GEMINI_API_KEY)');
  }

  const model = 'gemini-2.0-flash';
  const url = `${GEMINI_BASE}/${model}:generateContent?key=${env.geminiApiKey}`;

  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: options?.system ? `${options.system}\n\n${prompt}` : prompt }],
      },
    ],
    generationConfig: options?.json
      ? { responseMimeType: 'application/json' }
      : undefined,
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error: ${res.status} ${errText}`);
  }

  const json = await res.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty Gemini response');
  return text;
}

export const geminiService = {
  async generateMeetingSummary(transcript: string): Promise<GeminiSummaryJson> {
    const prompt = `Analyze this meeting transcript and return JSON only with keys:
summary, keyPoints (array), decisions (array), actionItems (array of {title, assignee?, dueDate?, priority?}),
risks (array), followUps (array), sentiment ({score 0-100, label, description}).

Transcript:
${transcript}`;

    const raw = await callGemini(prompt, { json: true });
    const parsed = JSON.parse(raw) as GeminiSummaryJson;
    return parsed;
  },

  async chat(messages: Array<{ role: string; content: string }>, context?: string) {
    const system = context
      ? `You are Lumio AI, a productivity assistant. Context:\n${context}`
      : 'You are Lumio AI, a helpful productivity assistant for meetings and interviews.';

    const history = messages
      .map((m) => `${m.role}: ${m.content}`)
      .join('\n');

    return callGemini(history, { system });
  },

  async *streamChat(messages: Array<{ role: string; content: string }>, context?: string) {
    const full = await this.chat(messages, context);
    const chunkSize = 24;
    for (let i = 0; i < full.length; i += chunkSize) {
      yield full.slice(i, i + chunkSize);
      await new Promise((r) => setTimeout(r, 16));
    }
  },

  async generateInterviewQuestion(roleType: string, index: number) {
    return callGemini(
      `Generate interview question #${index + 1} for a ${roleType} role. Return only the question text.`,
    );
  },

  async evaluateInterviewAnswer(roleType: string, question: string, answer: string) {
    const raw = await callGemini(
      `Evaluate this interview answer. Return JSON: confidenceScore, technicalScore, communicationScore, fillerWordsEstimate, feedback (string), suggestedAnswer (string), suggestions (array of strings).
Role: ${roleType}
Question: ${question}
Answer: ${answer}`,
      { json: true },
    );
    return JSON.parse(raw);
  },

  async analyzeResumeText(resumeText: string) {
    const raw = await callGemini(
      `Analyze resume. Return JSON: score (0-100), skills (array), missingSkills (array), interviewQuestions (array), suggestions (array).

Resume:
${resumeText.slice(0, 12000)}`,
      { json: true },
    );
    return JSON.parse(raw);
  },

  async generateFollowUpEmail(type: string, meetingSummary: string) {
    return callGemini(
      `Write a professional ${type} email based on this meeting summary. Return only the email body.\n\n${meetingSummary}`,
    );
  },
};
