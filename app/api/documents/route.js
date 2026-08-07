import { withSession } from "@/lib/middleware/withSession";
import { withErrorHandler } from "@/lib/middleware/withErrorHandler";
import { ok, fail } from "@/lib/utils/apiResponse";
import Document from "@/lib/db/models/Document";
import { validateUpload } from "@/lib/validators/document.validators";
import { processDocument } from "@/lib/services/document.service";

function serializeDocument(doc) {
  return {
    id: doc._id.toString(),
    title: doc.title,
    documentType: doc.documentType,
    fileType: doc.fileType,
    status: doc.status,
    isFavourite: doc.isFavourite,
    riskScore: doc.riskScore ?? null,
    createdAt: doc.createdAt,
    ...(doc.status === "failed" ? { errorMessage: doc.errorMessage } : {}),
  };
}

export const POST = withErrorHandler(
  withSession(async (req, _context, session) => {
    const formData = await req.formData();
    const file = formData.get("file");
    const documentType = formData.get("documentType");

    const { valid, errors, fileType } = validateUpload(file, documentType);
    if (!valid) {
      return fail(errors.join(" "), 422);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Synchronous, full pipeline — see document.service.js for the
    // reasoning/tradeoff. Response only comes back once status is
    // "ready" or "failed".
    const document = await processDocument({
      userId: session._id,
      fileBuffer: buffer,
      fileType,
      documentType,
      originalFilename: file.name?.replace(/\.[^/.]+$/, "") || "Untitled Document",
    });

    session.documentCount += 1;
    await session.save();

    return ok(serializeDocument(document), 201);
  })
);

export const GET = withErrorHandler(
  withSession(async (_req, _context, session) => {
    const documents = await Document.find({ userId: session._id }).sort({ createdAt: -1 });
    return ok(documents.map(serializeDocument));
  })
);
