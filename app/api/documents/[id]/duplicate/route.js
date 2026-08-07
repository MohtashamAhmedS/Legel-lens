import { withSession } from "@/lib/middleware/withSession";
import { withErrorHandler } from "@/lib/middleware/withErrorHandler";
import { ok, fail } from "@/lib/utils/apiResponse";
import Document from "@/lib/db/models/Document";
import { duplicateDocument } from "@/lib/services/document.service";

export const POST = withErrorHandler(
  withSession(async (_req, { params }, session) => {
    const { id } = await params;

    const original = await Document.findOne({ _id: id, userId: session._id });
    if (!original) return fail("Document not found.", 404);

    const copy = await duplicateDocument(id, session._id);

    return ok(
      {
        id: copy._id.toString(),
        title: copy.title,
        documentType: copy.documentType,
        fileType: copy.fileType,
        status: copy.status,
        isFavourite: copy.isFavourite,
        riskScore: copy.riskScore ?? null,
        createdAt: copy.createdAt,
      },
      201
    );
  })
);
