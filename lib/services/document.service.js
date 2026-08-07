import Document from "@/lib/db/models/Document";
import Chunk from "@/lib/db/models/Chunk";
import Analysis from "@/lib/db/models/Analysis";
import { uploadBuffer, deleteAsset } from "@/lib/storage/cloudinary";
import { extractText } from "@/lib/services/extraction.service";
import { chunkText } from "@/lib/services/chunking.service";
import { embedAndStoreChunks } from "@/lib/services/embedding.service";
import { generateAnalysis } from "@/lib/services/analysis.service";

/**
 * Fully synchronous, end to end, inside a single API route invocation —
 * matches the "no job queue" decision. This means the POST /api/documents
 * response won't come back until the whole pipeline finishes (extract,
 * chunk, embed every chunk sequentially, then analyze) — for a typical
 * few-page contract that's usually low double-digit seconds, but it WILL
 * hold the connection open the whole time. The processing page's polling
 * still works correctly, it'll just likely see "ready" on the very first
 * poll rather than a slow crawl through each status. Flagging this now:
 * if you ever plan to demo with genuinely large documents, this is the
 * first thing that needs to become a background job.
 */
export async function processDocument({ userId, fileBuffer, fileType, documentType, originalFilename }) {
  let document;

  try {
    const uploadResult = await uploadBuffer(fileBuffer, {
      resourceType: fileType === "image" ? "image" : "raw",
    });

    document = await Document.create({
      userId,
      title: originalFilename,
      documentType,
      fileType,
      cloudinaryUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
      status: "extracting",
    });

    const { text, pageCount, requiredOCR } = await extractText(fileBuffer, fileType);

    document.extractedText = text;
    document.pageCount = pageCount;
    document.requiredOCR = requiredOCR;
    document.status = "analyzing";
    await document.save();

    const chunks = chunkText(text);
    await embedAndStoreChunks({ documentId: document._id, userId, chunks });

    document.status = "generating";
    await document.save();

    await generateAnalysis({ documentId: document._id, userId, text, documentType });

    document.status = "ready";
    await document.save();

    return document;
  } catch (err) {
    if (document) {
      document.status = "failed";
      document.errorMessage = err.message;
      await document.save();
    }
    throw err;
  }
}

export async function deleteDocumentCascade(documentId) {
  const document = await Document.findById(documentId);
  if (!document) return null;

  if (document.cloudinaryPublicId) {
    await deleteAsset(document.cloudinaryPublicId, document.fileType === "image" ? "image" : "raw").catch(() => {});
  }

  await Promise.all([
    Chunk.deleteMany({ documentId }),
    Analysis.deleteOne({ documentId }),
    Document.findByIdAndDelete(documentId),
  ]);

  return document;
}

export async function duplicateDocument(documentId, userId) {
  const original = await Document.findById(documentId).select("+extractedText");
  if (!original) return null;

  const originalAnalysis = await Analysis.findOne({ documentId }).lean();
  const originalChunks = await Chunk.find({ documentId }).select("+embedding").lean();

  const copy = await Document.create({
    userId,
    title: `${original.title} (copy)`,
    documentType: original.documentType,
    fileType: original.fileType,
    cloudinaryUrl: original.cloudinaryUrl,
    cloudinaryPublicId: original.cloudinaryPublicId,
    extractedText: original.extractedText,
    pageCount: original.pageCount,
    requiredOCR: original.requiredOCR,
    status: original.status,
    riskScore: original.riskScore,
  });

  if (originalChunks.length > 0) {
    await Chunk.insertMany(
      originalChunks.map(({ _id, ...c }) => ({ ...c, documentId: copy._id, userId }))
    );
  }

  if (originalAnalysis) {
    const { _id, ...analysisData } = originalAnalysis;
    await Analysis.create({ ...analysisData, documentId: copy._id, userId });
  }

  return copy;
}
