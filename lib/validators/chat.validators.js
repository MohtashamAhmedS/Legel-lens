export function validateChatRequest(body) {
  const errors = [];

  if (!body.documentId || typeof body.documentId !== "string") {
    errors.push("documentId is required.");
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (message.length === 0) {
    errors.push("message cannot be empty.");
  } else if (message.length > 4000) {
    errors.push("message is too long (max 4000 characters).");
  }

  return { valid: errors.length === 0, errors, message };
}
