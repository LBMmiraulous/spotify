
import { GoogleGenAI, Type } from "@google/genai";
import { DailyPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateStudyPlan = async (topic: string, goal: string, durationDays: number = 1): Promise<DailyPlan[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `请为主题 "${topic}" 生成一个详细的学习计划，目标是 "${goal}"，持续 ${durationDays} 天。
    输出必须是一个 DailyPlan 对象的 JSON 数组。
    所有文本（focus, motivation, task title, priority, duration）必须使用中文。
    priority 只能是 "高"、"中" 或 "低" 之一。
    duration 应如 "45分钟" 这样描述。
    每个任务应包含具体的开始时间 time（如 "09:00"）。`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING },
            focus: { type: Type.STRING },
            motivation: { type: Type.STRING },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  priority: { type: Type.STRING },
                  time: { type: Type.STRING },
                  completed: { type: Type.BOOLEAN }
                },
                required: ["id", "title", "duration", "priority", "time", "completed"]
              }
            }
          },
          required: ["date", "focus", "motivation", "tasks"]
        }
      }
    }
  });

  try {
    const data = JSON.parse(response.text);
    return data;
  } catch (error) {
    console.error("解析 Gemini 响应失败:", error);
    return [];
  }
};
