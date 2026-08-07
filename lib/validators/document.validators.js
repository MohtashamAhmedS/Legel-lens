import { env } from "@/lib/config/env";

const DOCUMENT_TYPES = [
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
];

const MIME_TO_FILETYPE = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "image/png": "image",
  "image/jpeg": "image",
  "image/jpg": "image",
};

export function validateUpload(file, documentType) {
  const errors = [];

  if (!file) {
    errors.push("No file provided.");
    return { valid: false, errors };
  }

  if (file.size > env.maxFileSizeBytes) {
    errors.push(`File exceeds the ${env.maxFileSizeBytes / (1024 * 1024)}MB limit.`);
  }

  const fileType = MIME_TO_FILETYPE[file.type];
  if (!fileType) {
    errors.push("Unsupported file type. Please upload a PDF, DOCX, PNG, or JPG.");
  }

  if (!DOCUMENT_TYPES.includes(documentType)) {
    errors.push("Invalid document type.");
  }

  return { valid: errors.length === 0, errors, fileType };
}

export function validatePatch(body) {
  const errors = [];
  const update = {};

  if (body.title !== undefined) {
    const title = String(body.title).trim();
    if (title.length === 0 || title.length > 200) {
      errors.push("Title must be between 1 and 200 characters.");
    } else {
      update.title = title;
    }
  }

  if (body.toggleFavourite !== undefined) {
    update.__toggleFavourite = true;
  }

  return { valid: errors.length === 0, errors, update };
}
