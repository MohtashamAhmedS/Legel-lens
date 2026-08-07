import { geminiProvider } from "@/lib/ai/providers/gemini.provider";

/**
 * The interface every AI provider must implement:
 *   - generateStructured(prompt, schemaHint) => parsed JSON object
 *   - generateText(prompt) => string
 *   - embed(text) => number[]
 *
 * Swapping providers later means writing one new file in
 * lib/ai/providers/ and changing the export below — nothing in
 * lib/services/ or lib/ai/prompts/ needs to change.
 */
const activeProvider = geminiProvider;

export const aiProvider = activeProvider;
