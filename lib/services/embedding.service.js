import Chunk from "@/lib/db/models/Chunk";
import { aiProvider } from "@/lib/ai/provider";

/**
 * Embeds and persists chunks for a document. Sequential, not Promise.all —
 * deliberate: Gemini's free tier is ~15 requests/minute, and a document
 * can easily produce 20-40 chunks. Firing them concurrently risks 429s
 * mid-pipeline with no partial-failure recovery. Slower, but reliable.
 */
export async function embedAndStoreChunks({ documentId, userId, chunks }) {
  const created = [];

  for (const chunk of chunks) {
    const embedding = await aiProvider.embed(chunk.text);
    const doc = await Chunk.create({
      documentId,
      userId,
      chunkIndex: chunk.chunkIndex,
      text: chunk.text,
      embedding,
    });
    created.push(doc);
  }

  return created;
}

/**
 * Retrieves the top-K most relevant chunks for a question, scoped to
 * one document. Requires an Atlas Vector Search index named
 * "chunk_vector_index" on the Chunk collection's `embedding` field
 * (created via Atlas UI/API — see README setup section).
 */
export async function retrieveRelevantChunks({ documentId, question, topK = 6 }) {
  const queryEmbedding = await aiProvider.embed(question);

  const results = await Chunk.aggregate([
    {
      $vectorSearch: {
        index: "chunk_vector_index",
        path: "embedding",
        queryVector: queryEmbedding,
        numCandidates: 100,
        limit: topK,
        filter: { documentId },
      },
    },
    {
      $project: {
        text: 1,
        chunkIndex: 1,
        documentId: 1,
        score: { $meta: "vectorSearchScore" },
      },
    },
  ]);

  return results;
}
