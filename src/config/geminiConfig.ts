export const GEMINI_CONFIG = {
  apiKey: 'AIzaSyBjA6us5-WORF-TF5f4wdoSW9l9uo3IVcg',
  model: 'gemini-2.5-flash',
  defaultConfig: {
    responseMimeType: "text/plain" as const,
  }
};

export const createGeminiClient = () => {
  const { GoogleGenAI } = require('@google/genai');
  return new GoogleGenAI({ apiKey: GEMINI_CONFIG.apiKey });
};
