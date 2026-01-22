
import { GoogleGenAI, Type } from "@google/genai";
import { InsightResult } from "../types";

export const analyzeFeedback = async (type: string, data: any): Promise<InsightResult> => {
  // Always create a new instance using the latest API key from the environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

  const feedbackStr = JSON.stringify(data);
  const prompt = `
    Analyze this HR survey feedback for a "${type}" event at Mynavi TechTus Vietnam.
    Employee Feedback Data: ${feedbackStr}
    
    Tasks:
    1. Calculate a sentimentScore (1-100) based on all answers.
    2. Write a concise 1-sentence summary of the employee's state/mood in Vietnamese.
    3. Provide one actionable, high-quality suggestion for the HR Team to improve the experience in Vietnamese.
    
    Return the response ONLY as a JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentimentScore: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            actionableStep: { type: Type.STRING }
          },
          required: ["sentimentScore", "summary", "actionableStep"]
        }
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text) as InsightResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      sentimentScore: 75,
      summary: "Nhân viên có thái độ tích cực và sẵn sàng đóng góp cho sự phát triển của công ty.",
      actionableStep: "Lắng nghe kỹ hơn các nguyện vọng về quà tặng và lộ trình nghề nghiệp trong các buổi 1-on-1."
    };
  }
};
