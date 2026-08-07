import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "@/lib/config/env";

const client = new GoogleGenerativeAI(env.geminiApiKey);

const TEXT_MODEL = "gemini-3-flash-preview";
const EMBEDDING_MODEL = "gemini-embedding-001"; // text-embedding-004 was retired Nov 2025

function stripCodeFences(text) {
  return text.replace(/```json|```/g, "").trim();
}

export const geminiProvider = {
  name: "gemini",
  model: TEXT_MODEL,

  async generateStructured(prompt) {
    const model = client.getGenerativeModel({ model: TEXT_MODEL });
    const result = await model.generateContent(prompt);
    const raw = result.response.text();

    try {
      return JSON.parse(stripCodeFences(raw));
    } catch (err) {
      throw new Error(`Gemini returned non-JSON output: ${raw.slice(0, 200)}`);
    }
  },

  async generateText(prompt) {
    const model = client.getGenerativeModel({ model: TEXT_MODEL });
    const result = await model.generateContent(prompt);
    return result.response.text();
  },

  async embed(text) {
    const model = client.getGenerativeModel({ model: EMBEDDING_MODEL });
    const result = await model.embedContent({
      content: { parts: [{ text }] },
      outputDimensionality: 768,
    });
    return result.embedding.values;
  },

  async extractTextFromImage(base64Image, mimeType) {
    const model = client.getGenerativeModel({ model: TEXT_MODEL });
    const result = await model.generateContent([
      { inlineData: { data: base64Image, mimeType } },
      {
        text: "Extract all text from this image exactly as written. Return only the extracted text, no commentary.",
      },
    ]);
    return result.response.text();
  },
};
