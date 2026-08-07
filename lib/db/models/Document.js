import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    documentType: {
      type: String,
      enum: [
        "employment_contract",
        "rental_agreement",
        "nda",
        "service_agreement",
        "purchase_agreement",
        "privacy_policy",
        "terms_and_conditions",
        "loan_agreement",
        "partnership_agreement",
        "freelance_contract",
        "legal_notice",
        "custom",
      ],
      default: "custom",
    },
    fileType: {
      type: String,
      enum: ["pdf", "docx", "image"],
      required: true,
    },
    cloudinaryUrl: {
      type: String,
      required: true,
    },
    cloudinaryPublicId: {
      type: String,
      required: true,
    },
    // Extracted text lives here, once — Chunk documents reference this
    // by index range rather than duplicating the text, to stay inside
    // Atlas M0's 512MB free tier.
    extractedText: {
      type: String,
      select: false, // large field, opt-in only via .select("+extractedText")
    },
    pageCount: {
      type: Number,
    },
    requiredOCR: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["extracting", "analyzing", "generating", "ready", "failed"],
      default: "extracting",
      index: true,
    },
    errorMessage: {
      type: String,
    },
    // Denormalized from Analysis.scores.riskScore so GET /api/documents
    // (history list) never needs to join/populate Analysis just for a badge.
    riskScore: {
      type: Number,
    },
    isFavourite: {
      type: Boolean,
      default: false,
      index: true,
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
      index: true, // supports the auto-purge cleanup job for non-favourites
    },
  },
  { timestamps: true }
);

DocumentSchema.index({ userId: 1, createdAt: -1 });
DocumentSchema.index({ title: "text" }); // supports document title search

export default mongoose.models.Document || mongoose.model("Document", DocumentSchema);
