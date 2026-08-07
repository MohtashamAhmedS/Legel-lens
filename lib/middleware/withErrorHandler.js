import { fail } from "@/lib/utils/apiResponse";

export function withErrorHandler(handler) {
  return async (...args) => {
    try {
      return await handler(...args);
    } catch (err) {
      console.error("[API_ERROR]", err);

      if (err.name === "ValidationError") {
        return fail("Invalid request data", 400, { details: err.message });
      }
      if (err.name === "CastError") {
        return fail("Invalid document ID", 400);
      }
      if (err.code === 11000) {
        return fail("Duplicate resource", 409);
      }

      return fail("Something went wrong. Please try again.", 500);
    }
  };
}
