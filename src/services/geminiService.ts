import { GoogleGenAI } from '@google/genai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''; // Ensure you set this in your .env file

let genAI: GoogleGenAI | null = null;

const getGenAI = () => {
    if (!genAI) {
        if (!API_KEY) {
            throw new Error("La clé API Gemini (VITE_GEMINI_API_KEY) n'est pas configurée.");
        }
        genAI = new GoogleGenAI({ apiKey: API_KEY });
    }
    return genAI;
};

const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });

export const geminiService = {
    generateImage: async (prompt: string, aspectRatio: string = '1:1') => {
        const ai = getGenAI();
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-001', // Updated to a stable model if needed, or stick to 'imagen-4.0-generate-001' if available
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9",
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        } else {
            throw new Error("Aucune image n'a été générée.");
        }
    },

    analyzeImage: async (file: File, prompt: string) => {
        const ai = getGenAI();
        const base64Data = await fileToBase64(file);

        const imagePart = {
            inlineData: {
                mimeType: file.type,
                data: base64Data,
            },
        };
        const textPart = { text: prompt };

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: { parts: [imagePart, textPart] },
        });

        return response.text();
    }
};
