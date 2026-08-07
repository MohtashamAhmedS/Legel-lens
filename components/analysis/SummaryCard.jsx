export default function SummaryCard({ executiveSummary, plainEnglishSummary }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-5">
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">
          Executive summary
        </h2>
        <p className="text-sm text-foreground leading-relaxed">{executiveSummary}</p>
      </div>
      <div className="border-t border-border pt-5">
        <h2 className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-2">
          In plain English
        </h2>
        <p className="text-sm text-foreground leading-relaxed">{plainEnglishSummary}</p>
      </div>
    </div>
  );
}
