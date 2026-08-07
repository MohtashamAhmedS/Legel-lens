"use client";

import { useEffect, useState } from "react";

const MOCK_ANALYSIS = {
  document: {
    id: "mock",
    title: "Employment_Agreement_Final.pdf",
    documentType: "employment_contract",
    fileType: "pdf",
    status: "ready",
    isFavourite: false,
    createdAt: new Date().toISOString(),
  },
  executiveSummary:
    "A standard employment agreement with an above-average non-compete term and an auto-renewing benefits clause worth negotiating.",
  plainEnglishSummary:
    "You're being hired full-time with a 90-day probation period. After leaving, you're restricted from joining a competitor for 24 months, which is longer than typical. Salary reviews happen annually but aren't guaranteed.",
  scores: {
    riskScore: 62,
    complexityScore: 48,
    confidenceScore: 91,
    estimatedReadingTimeMinutes: 14,
  },
  parties: [
    { role: "Employer", name: "Northgate Systems Inc." },
    { role: "Employee", name: "You" },
  ],
  governingLaw: "State of Delaware",
  jurisdiction: "Delaware courts",
  redFlags: [
    { type: "Non-compete", description: "24-month restriction — longer than the 12-month industry average.", severity: "high" },
    { type: "Auto-renewal", description: "Benefits package auto-renews annually unless cancelled in writing 30 days prior.", severity: "medium" },
    { type: "Unlimited liability", description: "No cap found on employee liability for IP disputes.", severity: "critical" },
  ],
  clauses: [
    {
      heading: "Termination",
      originalText: "Either party may terminate this agreement with 30 days written notice, or immediately for cause.",
      plainEnglish: "You or the company can end this with a month's notice — or instantly if there's a serious reason (like misconduct).",
      whyItMatters: "Standard, but worth knowing you also owe them 30 days notice if you resign.",
      possibleRisk: "Low — fairly balanced.",
      negotiationSuggestion: "None needed.",
      severity: "low",
      classification: "Termination",
    },
    {
      heading: "Non-Compete",
      originalText: "Employee agrees not to engage in competing business activities within 24 months of termination.",
      plainEnglish: "You can't work for a competitor for 2 years after leaving.",
      whyItMatters: "This can significantly limit your next job search in the same industry.",
      possibleRisk: "High — 24 months is above market standard (12 is typical).",
      negotiationSuggestion: "Ask to reduce to 12 months, or narrow the definition of 'competing business.'",
      severity: "high",
      classification: "Restrictive Covenant",
    },
    {
      heading: "IP Assignment",
      originalText: "All work product created during employment is the sole property of the Employer, without limitation.",
      plainEnglish: "Anything you create while employed — including outside work hours — belongs to the company.",
      whyItMatters: "No carve-out for personal projects unrelated to your job.",
      possibleRisk: "Critical — could cover side projects.",
      negotiationSuggestion: "Request a personal-projects carve-out clause.",
      severity: "critical",
      classification: "Intellectual Property",
    },
  ],
  missingClauses: [
    "Severance pay terms",
    "Remote work policy",
    "Dispute resolution / arbitration clause",
  ],
  obligations: [
    { party: "Employer", description: "Pay salary on the 1st of each month.", deadline: "Monthly" },
    { party: "Employer", description: "Provide 30 days written notice before termination without cause.", deadline: "Before termination" },
    { party: "Employee", description: "Complete 90-day probation period satisfactorily.", deadline: "Day 90" },
    { party: "Employee", description: "Return all company property upon termination.", deadline: "Within 5 days of termination" },
  ],
  financials: [
    { type: "Salary", description: "Base annual salary", amount: "$95,000", frequency: "Annually" },
    { type: "Bonus", description: "Discretionary performance bonus", amount: "Up to $10,000", frequency: "Annually" },
    { type: "Penalty", description: "Early termination of training agreement", amount: "$2,500", frequency: "One-time" },
  ],
  timeline: [
    { type: "start", description: "Employment start date", date: "2026-08-15" },
    { type: "milestone", description: "Probation period ends", date: "2026-11-13" },
    { type: "review", description: "First annual salary review", date: "2027-08-15" },
    { type: "renewal", description: "Benefits package auto-renewal deadline", date: "2027-07-15" },
  ],
  glossary: [
    { term: "Non-compete clause", definition: "A term restricting you from working for competitors for a period after leaving." },
    { term: "Indemnification", definition: "An agreement to compensate the other party for certain losses or damages." },
    { term: "Governing law", definition: "The state or country's laws used to interpret the contract." },
  ],
};

export function useAnalysis(documentId) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAnalysis() {
      try {
        // NOTE: app/api/documents/[id]/analysis route built separately.
        const res = await fetch(`/api/documents/${documentId}/analysis`);
        if (!res.ok) throw new Error("not-ready");
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch {
        // Fallback to mock so UI is buildable before backend route exists.
        if (!cancelled) setData(MOCK_ANALYSIS);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchAnalysis();
    return () => {
      cancelled = true;
    };
  }, [documentId]);

  return { data, isLoading, errorMsg };
}
