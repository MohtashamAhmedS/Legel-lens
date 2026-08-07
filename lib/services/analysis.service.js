import Analysis from "@/lib/db/models/Analysis";
import Document from "@/lib/db/models/Document";
import { aiProvider } from "@/lib/ai/provider";
import { buildAnalysisPrompt } from "@/lib/ai/prompts/analysis.prompts";

export async function generateAnalysis({ documentId, userId, text, documentType }) {
  const prompt = buildAnalysisPrompt(text, documentType);
  const result = await aiProvider.generateStructured(prompt);

  const analysis = await Analysis.create({
    documentId,
    userId,
    ...result,
    generatedBy: {
      provider: aiProvider.name,
      model: aiProvider.model,
      generatedAt: new Date(),
    },
  });

  // Denormalize riskScore onto Document for the history list view
  await Document.findByIdAndUpdate(documentId, {
    riskScore: result?.scores?.riskScore ?? null,
  });

  return analysis;
}
