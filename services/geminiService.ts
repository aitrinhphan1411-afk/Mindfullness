
import { GoogleGenAI, Type } from "@google/genai";
import { InsightResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const analyzeFeedback = async (type: string, data: any): Promise<InsightResult> => {
  const prompt = `
    Analyze this HR survey feedback for a "${type}" event.
    Feedback: "${data.feedback || data.suggestions || 'No qualitative feedback provided'}"
    Scores: Sentiment Rating: ${data.sentiment || data.satisfaction}/5, Connection: ${data.connectionLevel || 'N/A'}/5.
    
    Provide a JSON response with:
    - sentimentScore: A number from 1-100.
    - summary: A concise 1-sentence summary of the employee's mood.
    - actionableStep: One practical suggestion for HR to improve the next event.
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

    return JSON.parse(response.text || "{}") as InsightResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      sentimentScore: 50,
      summary: "Phản hồi đã được ghi nhận thành công.",
      actionableStep: "Tiếp tục duy trì các hoạt động gắn kết hiện tại."
    };
  }
};
