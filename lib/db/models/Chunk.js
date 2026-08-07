import mongoose from "mongoose";

const ChunkSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // lets us scope/filter searches per user as a safety net
    },
    chunkIndex: {
      type: Number,
      required: true, // preserves original document order for citations
    },
    text: {
      type: String,
      required: true,
    },
    // Gemini's text-embedding-004 outputs 768-dim vectors.
    // Stored as a plain array; the Atlas Vector Search index (created via
    // Atlas UI/API, not Mongoose) points at this field.
    embedding: {
      type: [Number],
      required: true,
      select: false, // never needed in normal reads, only in the $vectorSearch stage
    },
    metadata: {
      pageNumber: Number,
      clauseHeading: String, // best-effort, populated during chunking if detectable
    },
  },
  { timestamps: true }
);

ChunkSchema.index({ documentId: 1, chunkIndex: 1 });

export default mongoose.models.Chunk || mongoose.model("Chunk", ChunkSchema);
