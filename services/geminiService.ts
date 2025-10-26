
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const runAiAnalysis = async (prompt: string, file?: File): Promise<string> => {
    if (!API_KEY) {
        return "Gemini API key is not configured. Please set up the API_KEY environment variable.";
    }

    try {
        const model = 'gemini-2.5-flash';
        
        if (file) {
            const imagePart = await fileToGenerativePart(file);
            const textPart = { text: prompt };
            const response = await ai.models.generateContent({
                model: model,
                contents: { parts: [textPart, imagePart] },
            });
            return response.text;
        } else {
            const response = await ai.models.generateContent({
                model: model,
                contents: prompt,
                config: {
                    systemInstruction: "You are Docu-Rex AI, a helpful assistant for healthcare. Explain medical concepts clearly and concisely. When summarizing documents, be precise and focus on key findings. Always state that you are an AI and not a medical professional, and the user should consult a doctor."
                }
            });
            return response.text;
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return `An error occurred while contacting the AI assistant. Details: ${error instanceof Error ? error.message : 'Unknown error'}`;
    }
};
