const required = [
  "MONGODB_URI",
  "GEMINI_API_KEY",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

function getEnv() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }

  return {
    mongodbUri: process.env.MONGODB_URI,
    geminiApiKey: process.env.GEMINI_API_KEY,
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
    },
    sessionCookieName: "legallens_session",
    // free-tier guardrails
    maxFileSizeBytes: 20 * 1024 * 1024, // 20MB, matches frontend
    maxOcrPages: 5, // hard cap for scanned/image docs — Tesseract + Vercel timeout
    maxPagesTotal: 60, // sane ceiling for text-based docs too
  };
}

export const env = getEnv();
