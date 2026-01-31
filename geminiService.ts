
import { GoogleGenAI } from "@google/genai";

export const getFitnessAdvice = async (userPrompt: string, history: { role: string; text: string }[]) => {
  // Always initialize GoogleGenAI with a named parameter using process.env.API_KEY directly
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';
  
  const systemInstruction = `
    أنت مدرب رياضي ذكي وخبير في اللياقة البدنية المنزلية. 
    وظيفتك هي تقديم نصائح قصيرة، محفزة، ودقيقة باللغة العربية.
    إذا طلب المستخدم برنامجا تدريبيا، اقترح تمارين بسيطة بدون معدات.
    حافظ على نبرة إيجابية ومشجعة.
  `;

  try {
    // Transform history into contents format expected by the SDK for multi-turn conversation
    const contents = [
      ...history.map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }]
      })),
      { role: 'user', parts: [{ text: userPrompt }] }
    ];

    // Use ai.models.generateContent to query with model name, prompt, and system instruction
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    // Access response.text property directly
    return response.text || "عذراً، لم أتمكن من الحصول على رد مفيد.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "عذراً، واجهت مشكلة في الاتصال بمدربك الذكي. حاول مرة أخرى لاحقاً.";
  }
};
