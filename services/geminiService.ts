import { GoogleGenAI, Type } from "@google/genai";
import type { SentimentCoordinates } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const moderateText = async (text: string): Promise<string> => {
  const prompt = `다음 한국어 스포츠 팬 다이어리 내용을 분석해주세요.
1. 선수나 감독 개인을 겨냥한 과도한 인신공격, 욕설, 혐오 발언이 포함되어 있는지 판단해주세요. 단순한 실망감이나 분노 표출은 괜찮습니다.
2. 만약 인신공격성 내용이 있다면, 원래의 감정선(예: 분노, 실망)은 유지하되 공격적인 표현을 순화하여 텍스트를 수정해주세요.
3. 인신공격성 내용이 없다면, 원본 텍스트를 그대로 반환해주세요.
4. 결과를 반드시 {"is_hate_speech": <boolean>, "moderated_text": "<string>"} 형식의 JSON으로 반환해주세요.

텍스트: "${text}"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            is_hate_speech: { type: Type.BOOLEAN },
            moderated_text: { type: Type.STRING },
          },
          required: ["is_hate_speech", "moderated_text"],
        },
      },
    });

    const resultText = response.text.trim();
    const resultJson = JSON.parse(resultText);

    return resultJson.moderated_text;
  } catch (error) {
    console.error("Error in moderateText:", error);
    // If moderation fails, return the original text to avoid breaking the flow.
    return text;
  }
};


export const analyzeSentiment = async (text: string): Promise<SentimentCoordinates> => {
  const prompt = `다음 텍스트의 감정을 분석하여 2차원 벡터 좌표로 반환해주세요. x축은 감정의 긍정/부정을 나타내며, -1(극도의 부정, 분노)부터 +1(극도의 긍정, 환희)까지의 값을 가집니다. y축은 감정의 각성 수준을 나타내며, -1(저각성, 차분함)부터 +1(고각성, 격양됨)까지의 값을 가집니다. 반드시 JSON 형식으로 {"x": <number>, "y": <number>} 형태의 좌표값만 반환해주세요.\n\n텍스트: "${text}"`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            x: { type: Type.NUMBER, description: "Valence: -1 (negative) to +1 (positive)" },
            y: { type: Type.NUMBER, description: "Arousal: -1 (calm) to +1 (excited)" },
          },
          required: ["x", "y"],
        },
      },
    });
    
    const resultText = response.text.trim();
    const resultJson = JSON.parse(resultText);

    if (
      typeof resultJson.x === 'number' &&
      typeof resultJson.y === 'number' &&
      resultJson.x >= -1 && resultJson.x <= 1 &&
      resultJson.y >= -1 && resultJson.y <= 1
    ) {
        return resultJson;
    } else {
        throw new Error("Invalid coordinate format received from API.");
    }

  } catch (error) {
    console.error("Error in analyzeSentiment:", error);
    throw new Error("Failed to analyze sentiment.");
  }
};