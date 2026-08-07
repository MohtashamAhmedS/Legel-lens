export function buildAnalysisPrompt(documentText, documentType) {
  return `You are a legal document analysis engine. Analyze the following ${documentType.replace(/_/g, " ")} and return a SINGLE valid JSON object — no markdown, no commentary, no code fences.

Return exactly this shape:
{
  "executiveSummary": "string",
  "plainEnglishSummary": "string",
  "scores": {
    "riskScore": number (0-100),
    "complexityScore": number (0-100),
    "confidenceScore": number (0-1),
    "estimatedReadingTimeMinutes": number
  },
  "parties": [{ "role": "string", "name": "string" }],
  "governingLaw": "string or null",
  "jurisdiction": "string or null",
  "clauses": [{
    "heading": "string",
    "originalText": "string (verbatim excerpt)",
    "plainEnglish": "string",
    "whyItMatters": "string",
    "possibleRisk": "string or null",
    "negotiationSuggestion": "string or null",
    "severity": "low|medium|high|critical",
    "classification": "standard|favourable_to_user|favourable_to_other_party|unusual"
  }],
  "missingClauses": ["string"],
  "obligations": [{ "party": "string", "description": "string", "deadline": "string or null" }],
  "financials": [{ "type": "payment|deposit|tax|fee|late_charge|penalty|recurring_payment", "description": "string", "amount": "string", "frequency": "string or null" }],
  "timeline": [{ "type": "payment_date|renewal_date|expiry_date|notice_period|deadline|duration", "description": "string", "date": "string" }],
  "redFlags": [{ "type": "unlimited_liability|automatic_renewal|hidden_fees|non_compete|broad_confidentiality|indemnification|high_penalties|one_sided_clause|missing_protection|impossible_obligation|ambiguous_wording|conflicting_clauses", "description": "string", "severity": "low|medium|high|critical" }],
  "glossary": [{ "term": "string", "definition": "string" }]
}

Rules:
- Do NOT give legal advice — describe risks and implications, never tell the user what to legally do.
- Base every field strictly on the document text below. Do not invent parties, dates, or amounts not present in the text.
- If a section has nothing applicable, return an empty array, not a fabricated entry.

DOCUMENT TEXT:
"""
${documentText}
"""`;
}
