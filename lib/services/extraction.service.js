import mammoth from "mammoth";
import { createWorker } from "tesseract.js";
import pdf from "pdf-parse";
import { env } from "@/lib/config/env";

/**
 * Returns { text, pageCount, requiredOCR }
 * Throws with a user-facing message on failure — the caller sets
 * Document.status = "failed" + errorMessage from this.
 */
export async function extractText(buffer, fileType) {
  if (fileType === "pdf") {
    return extractFromPdf(buffer);
  }
  if (fileType === "docx") {
    return extractFromDocx(buffer);
  }
  if (fileType === "image") {
    return extractFromImage(buffer);
  }
  throw new Error(`Unsupported file type: ${fileType}`);
}

async function extractFromPdf(buffer) {
  const data = await pdf(buffer);
  const pageCount = data.numpages;

  // If pdf-parse got almost no text back, this is very likely a scanned
  // PDF (image-based pages) rather than a text PDF — fall through to OCR
  // territory. For v1 we don't rasterize PDF pages for OCR (that's a
  // heavier pipeline); we cap and inform instead.
  const trimmed = (data.text || "").trim();
  if (trimmed.length < 50) {
    if (pageCount > env.maxOcrPages) {
      throw new Error(
        `This looks like a scanned PDF with ${pageCount} pages. Scanned documents are capped at ${env.maxOcrPages} pages on this demo (free-tier OCR is slow) — please upload a shorter excerpt.`
      );
    }
    throw new Error(
      "This PDF appears to be scanned/image-based. Scanned PDF OCR isn't supported yet — please upload a text-based PDF, DOCX, or a plain image file instead."
    );
  }

  if (pageCount > env.maxPagesTotal) {
    throw new Error(`Document has ${pageCount} pages, which exceeds the ${env.maxPagesTotal}-page limit for this demo.`);
  }

  return { text: trimmed, pageCount, requiredOCR: false };
}

async function extractFromDocx(buffer) {
  const result = await mammoth.extractRawText({ buffer });
  const text = (result.value || "").trim();

  if (text.length < 20) {
    throw new Error("Couldn't extract readable text from this DOCX file.");
  }

  // DOCX has no native page count; estimate for the reading-time/UI display.
  const estimatedPages = Math.max(1, Math.ceil(text.split(/\s+/).length / 500));

  return { text, pageCount: estimatedPages, requiredOCR: false };
}

async function extractFromImage(buffer) {
  const worker = await createWorker("eng");
  try {
    const { data } = await worker.recognize(buffer);
    const text = (data.text || "").trim();

    if (text.length < 10) {
      throw new Error("Couldn't read any text from this image — try a clearer photo or scan.");
    }

    return { text, pageCount: 1, requiredOCR: true };
  } finally {
    await worker.terminate();
  }
}
