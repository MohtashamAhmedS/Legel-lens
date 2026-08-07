"use client";

import { use } from "react";
import Link from "next/link";
import { useAnalysis } from "@/lib/hooks/useAnalysis";
import SummaryCard from "@/components/analysis/SummaryCard";
import ScoreGauges from "@/components/analysis/ScoreGauges";
import RedFlags from "@/components/analysis/RedFlags";
import ClauseAccordion from "@/components/analysis/ClauseAccordion";
import MissingClauses from "@/components/analysis/MissingClauses";
import ObligationsList from "@/components/analysis/ObligationsList";
import FinancialBreakdown from "@/components/analysis/FinancialBreakdown";
import Timeline from "@/components/analysis/Timeline";
import PartiesInfo from "@/components/analysis/PartiesInfo";
import Glossary from "@/components/analysis/Glossary";
import ExportButtons from "@/components/analysis/ExportButtons";
import ChatPanel from "@/components/chat/ChatPanel";
import { Button } from "@/components/ui/button";

export default function AnalysisPage({ params }) {
  const { documentId } = params;
  const { data, isLoading } = useAnalysis(documentId);

  if (isLoading || !data) {
    return (
      <main className="flex-1 flex items-center justify-center py-32">
        <div
          role="status"
          aria-label="Loading analysis"
          className="w-8 h-8 rounded-full border-2 border-border border-t-primary animate-spin"
        />
      </main>
    );
  }

  return (
    <main id="main-content" className="flex-1">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              ← New document
            </Link>
            <h1 className="text-lg font-bold text-foreground mt-1 truncate max-w-md">
              {data.document.title}
            </h1>
          </div>
          <ExportButtons documentId={documentId} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 grid lg:grid-cols-[1fr_380px] gap-6 items-start">
        {/* Left: report */}
        <div className="space-y-6 min-w-0">
          <SummaryCard
            executiveSummary={data.executiveSummary}
            plainEnglishSummary={data.plainEnglishSummary}
          />
          <ScoreGauges scores={data.scores} />
          <RedFlags redFlags={data.redFlags} />
          <ClauseAccordion clauses={data.clauses} />
          <MissingClauses missingClauses={data.missingClauses} />
          <ObligationsList obligations={data.obligations} />
          <FinancialBreakdown financials={data.financials} />
          <Timeline timeline={data.timeline} />
          <PartiesInfo
            parties={data.parties}
            governingLaw={data.governingLaw}
            jurisdiction={data.jurisdiction}
          />
          <Glossary glossary={data.glossary} />
        </div>

        {/* Right: sticky chat */}
        <div className="lg:sticky lg:top-[84px]">
          <ChatPanel documentId={documentId} />
        </div>
      </div>
    </main>
  );
}
