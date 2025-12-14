
import { GoogleGenAI, Type } from "https://esm.sh/@google/genai@^1.33.0";
import { DailyPlan } from "../types";

export const generateStudyPlan = async (topic: string, goal: string, durationDays: number = 1): Promise<DailyPlan[]> => {
  // 增强版 API Key 获取，兼容各种部署环境
  const apiKey = (window as any).process?.env?.API_KEY || (window as any).API_KEY || "";
  
  if (!apiKey) {
    console.warn("未检测到 API_KEY，请确保已在环境变量中配置。");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `请为主题 "${topic}" 生成一个详细的学习计划，目标是 "${goal}"，持续 ${durationDays} 天。
    输出必须是一个 DailyPlan 对象的 JSON 数组。
    所有文本必须使用中文。
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
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini 解析失败:", error);
    return [];
  }
};
