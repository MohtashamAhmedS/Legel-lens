import mongoose from "mongoose";

const ChatMessageSchema = new mongoose.Schema(
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
      index: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
      maxlength: 4000, // guards against prompt-stuffing abuse of the chat input
    },
    // Which chunks were retrieved and used to ground this answer —
    // lets the UI show "sourced from clause X" and lets us audit
    // whether the "not found in document" rule is behaving correctly.
    sourceChunkIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chunk",
      },
    ],
    wasAnswerable: {
      type: Boolean, // false when the model correctly declined to answer
      default: true,
    },
  },
  { timestamps: true }
);

ChatMessageSchema.index({ documentId: 1, createdAt: 1 });

export default mongoose.models.ChatMessage || mongoose.model("ChatMessage", ChatMessageSchema);
