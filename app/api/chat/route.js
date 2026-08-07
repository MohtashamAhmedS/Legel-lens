import { withSession } from "@/lib/middleware/withSession";
import { withErrorHandler } from "@/lib/middleware/withErrorHandler";
import { ok, fail } from "@/lib/utils/apiResponse";
import Document from "@/lib/db/models/Document";
import ChatMessage from "@/lib/db/models/ChatMessage";
import { validateChatRequest } from "@/lib/validators/chat.validators";
import { retrieveRelevantChunks } from "@/lib/services/embedding.service";
import { aiProvider } from "@/lib/ai/provider";
import { buildChatPrompt } from "@/lib/ai/prompts/chat.prompts";

export const POST = withErrorHandler(
  withSession(async (req, _context, session) => {
    const body = await req.json();
    const { valid, errors, message } = validateChatRequest(body);
    if (!valid) return fail(errors.join(" "), 422);

    const document = await Document.findOne({ _id: body.documentId, userId: session._id });
    if (!document) return fail("Document not found.", 404);
    if (document.status !== "ready") return fail("Document isn't ready for chat yet.", 409);

    await ChatMessage.create({
      documentId: document._id,
      userId: session._id,
      role: "user",
      content: message,
    });

    const chunks = await retrieveRelevantChunks({ documentId: document._id, question: message });

    let content, wasAnswerable;

    if (chunks.length === 0) {
      content = "I couldn't find anything relevant to that question in this document.";
      wasAnswerable = false;
    } else {
      const prompt = buildChatPrompt(chunks, message);
      const result = await aiProvider.generateStructured(prompt);
      wasAnswerable = result.wasAnswerable !== false && result.content !== "NOT_FOUND_IN_DOCUMENT";
      content = wasAnswerable
        ? result.content
        : "That doesn't appear to be answered anywhere in this document.";
    }

    await ChatMessage.create({
      documentId: document._id,
      userId: session._id,
      role: "assistant",
      content,
      sourceChunkIds: chunks.map((c) => c._id),
      wasAnswerable,
    });

    return ok({ role: "assistant", content, wasAnswerable });
  })
);
