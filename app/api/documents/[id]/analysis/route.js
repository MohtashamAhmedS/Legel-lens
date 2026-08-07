import { withSession } from "@/lib/middleware/withSession";
import { withErrorHandler } from "@/lib/middleware/withErrorHandler";
import { ok, fail } from "@/lib/utils/apiResponse";
import Document from "@/lib/db/models/Document";
import Analysis from "@/lib/db/models/Analysis";

export const GET = withErrorHandler(
  withSession(async (_req, { params }, session) => {
    const { id } = await params;

    const document = await Document.findOne({ _id: id, userId: session._id });
    if (!document) return fail("Document not found.", 404);

    if (document.status !== "ready") {
      return fail(`Analysis not ready yet (status: ${document.status}).`, 409);
    }

    const analysis = await Analysis.findOne({ documentId: id }).lean();
    if (!analysis) return fail("Analysis not found.", 404);

    const {
      _id,
      __v,
      documentId,
      userId,
      createdAt,
      updatedAt,
      generatedBy,
      ...payload
    } = analysis;

    return ok({
      document: {
        id: document._id.toString(),
        title: document.title,
        documentType: document.documentType,
        fileType: document.fileType,
        status: document.status,
        isFavourite: document.isFavourite,
        createdAt: document.createdAt,
      },
      ...payload,
    });
  }),
);
