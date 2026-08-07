import { withSession } from "@/lib/middleware/withSession";
import { withErrorHandler } from "@/lib/middleware/withErrorHandler";
import { ok, fail } from "@/lib/utils/apiResponse";
import Document from "@/lib/db/models/Document";
import { validatePatch } from "@/lib/validators/document.validators";
import { deleteDocumentCascade } from "@/lib/services/document.service";

async function findOwnedDocument(id, userId) {
  return Document.findOne({ _id: id, userId });
}

export const GET = withErrorHandler(
  withSession(async (_req, { params }, session) => {
    const { id } = await params;
    const document = await findOwnedDocument(id, session._id);
    if (!document) return fail("Document not found.", 404);

    return ok({
      status: document.status,
      ...(document.status === "failed" ? { errorMessage: document.errorMessage } : {}),
    });
  })
);

export const PATCH = withErrorHandler(
  withSession(async (req, { params }, session) => {
    const { id } = await params;
    const document = await findOwnedDocument(id, session._id);
    if (!document) return fail("Document not found.", 404);

    const body = await req.json();
    const { valid, errors, update } = validatePatch(body);
    if (!valid) return fail(errors.join(" "), 422);

    if (update.title !== undefined) document.title = update.title;
    if (update.__toggleFavourite) document.isFavourite = !document.isFavourite;

    await document.save();

    return ok({
      id: document._id.toString(),
      title: document.title,
      isFavourite: document.isFavourite,
    });
  })
);

export const DELETE = withErrorHandler(
  withSession(async (_req, { params }, session) => {
    const { id } = await params;
    const document = await findOwnedDocument(id, session._id);
    if (!document) return fail("Document not found.", 404);

    await deleteDocumentCascade(id);

    return ok({ success: true });
  })
);
