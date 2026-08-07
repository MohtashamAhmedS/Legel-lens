import mongoose from "mongoose";

// Sub-schemas — kept as embedded (not refs) because they're always read/
// written as part of the whole Analysis, never queried independently.

const ClauseSchema = new mongoose.Schema(
  {
    heading: String,
    originalText: String,
    plainEnglish: String,
    whyItMatters: String,
    possibleRisk: String,
    negotiationSuggestion: String,
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
    },
    confidence: {
      type: Number, // 0-1
      min: 0,
      max: 1,
    },
    classification: {
      type: String,
      enum: ["standard", "favourable_to_user", "favourable_to_other_party", "unusual"],
    },
  },
  { _id: false }
);

const ObligationSchema = new mongoose.Schema(
  {
    party: String, // e.g. "Employer", "Tenant"
    description: String,
    deadline: String,
  },
  { _id: false }
);

const FinancialItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["payment", "deposit", "tax", "fee", "late_charge", "penalty", "recurring_payment"],
    },
    description: String,
    amount: String, // stored as string — source docs rarely give clean parseable numbers/currency
    frequency: String,
  },
  { _id: false }
);

const TimelineEventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["payment_date", "renewal_date", "expiry_date", "notice_period", "deadline", "duration"],
    },
    description: String,
    date: String,
  },
  { _id: false }
);

const AnalysisSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
      unique: true, // one analysis per document
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    executiveSummary: String,
    plainEnglishSummary: String,

    scores: {
      riskScore: { type: Number, min: 0, max: 100 },
      complexityScore: { type: Number, min: 0, max: 100 },
      confidenceScore: { type: Number, min: 0, max: 1 },
      estimatedReadingTimeMinutes: Number,
    },

    parties: [
      {
        role: String, // e.g. "Landlord", "Freelancer"
        name: String,
      },
    ],

    governingLaw: String,
    jurisdiction: String,

    clauses: [ClauseSchema],
    missingClauses: [String],
    obligations: [ObligationSchema],
    financials: [FinancialItemSchema],
    timeline: [TimelineEventSchema],

    redFlags: [
      {
        type: {
          type: String,
          enum: [
            "unlimited_liability",
            "automatic_renewal",
            "hidden_fees",
            "non_compete",
            "broad_confidentiality",
            "indemnification",
            "high_penalties",
            "one_sided_clause",
            "missing_protection",
            "impossible_obligation",
            "ambiguous_wording",
            "conflicting_clauses",
          ],
        },
        description: String,
        severity: { type: String, enum: ["low", "medium", "high", "critical"] },
      },
    ],

    glossary: [
      {
        term: String,
        definition: String,
      },
    ],

    // Raw model metadata for debugging/reproducibility — not shown to users
    generatedBy: {
      provider: String, // "gemini", swappable later
      model: String,
      generatedAt: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Analysis || mongoose.model("Analysis", AnalysisSchema);
