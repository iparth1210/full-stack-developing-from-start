
import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an audio briefing for the daily lesson using Gemini TTS.
 */
export const getVoiceBriefing = async (text: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: `Explain this tech lesson concisely and professionally like a senior engineer: ${text}` }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("Audio generation failed");
  return base64Audio;
};

/**
 * Generates a visual architectural blueprint for the user's project idea.
 * Supports style variants: 'blueprint', 'neon', 'minimalist', 'cyberpunk'.
 */
export const generateProjectBlueprint = async (idea: string, style: 'blueprint' | 'neon' | 'minimalist' | 'cyberpunk' = 'blueprint') => {
  const styleDescriptions = {
    blueprint: "architectural, blueprint lines, sophisticated data visualization, technical schematic",
    neon: "high-contrast neon accents, glowing holographic interfaces, dark futuristic dashboard",
    minimalist: "clean white lines on deep charcoal, ultra-minimalist, focused typography, sparse architectural details",
    cyberpunk: "complex mechanical overlays, gritty high-tech aesthetic, dense data clusters, terminal-inspired UI"
  };

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: `A high-fidelity, cinematic UI/UX concept blueprint for a web application. 
          Topic: ${idea}. 
          Style: Dark mode, ${styleDescriptions[style]}, 
          ultra-modern developer aesthetic, 8k resolution, clean professional typography.`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
      }
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

export const getMentorResponseStream = async (prompt: string, context: string, onChunk: (text: string) => void) => {
  const response = await ai.models.generateContentStream({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      systemInstruction: `You are the Lead Architect Mentor. 
      The student is on a high-stakes journey to full-stack mastery. 
      Context: ${context}.
      Response Style:
      1. Use technical precision mixed with inspiring metaphors.
      2. Provide production-grade code snippets.
      3. Challenge the student's assumptions.
      4. Always explain the architectural "Why".`
    }
  });

  let fullText = "";
  for await (const chunk of response) {
    const chunkText = chunk.text;
    if (chunkText) {
      fullText += chunkText;
      onChunk(fullText);
    }
  }
  return fullText;
};

export const generateProjectTasks = async (projectIdea: string, currentMonth: number) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Project: "${projectIdea}". Month: ${currentMonth}. Suggest 5 fundamental engineering tasks.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            category: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            description: { type: Type.STRING }
          },
          required: ['id', 'title', 'category', 'difficulty', 'description']
        }
      }
    }
  });
  return JSON.parse(response.text?.trim() || '[]');
};
