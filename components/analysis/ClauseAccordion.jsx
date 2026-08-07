"use client";

import { useState } from "react";
import SeverityBadge from "./SeverityBadge";

function ClauseItem({ clause }) {
  const [open, setOpen] = useState(false);
  const panelId = `clause-panel-${clause.heading.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-4 py-3.5 text-left
                   hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="flex items-center gap-3 min-w-0">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className={`shrink-0 text-muted-foreground transition-transform ${open ? "rotate-90" : ""}`}
          >
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-sm font-semibold text-foreground truncate">{clause.heading}</span>
        </div>
        <SeverityBadge severity={clause.severity} />
      </button>

      {open && (
        <div id={panelId} className="px-4 pb-5 pt-1 space-y-4 animate-fade-in">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">
              Original text
            </p>
            <p className="text-sm text-foreground/80 italic leading-relaxed border-l-2 border-border pl-3">
              "{clause.originalText}"
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">
              Plain English
            </p>
            <p className="text-sm text-foreground leading-relaxed">{clause.plainEnglish}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">
              Why it matters
            </p>
            <p className="text-sm text-foreground leading-relaxed">{clause.whyItMatters}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1.5">
              Possible risk
            </p>
            <p className="text-sm text-foreground leading-relaxed">{clause.possibleRisk}</p>
          </div>
          <div className="rounded-lg bg-accent/60 p-3.5">
            <p className="text-xs font-bold uppercase tracking-wide text-primary mb-1.5">
              Negotiation suggestion
            </p>
            <p className="text-sm text-foreground leading-relaxed">{clause.negotiationSuggestion}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ClauseAccordion({ clauses }) {
  if (!clauses?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-sm font-bold text-foreground mb-4">Clause-by-clause breakdown</h2>
      <div className="space-y-2">
        {clauses.map((clause, i) => (
          <ClauseItem key={i} clause={clause} />
        ))}
      </div>
    </div>
  );
}
