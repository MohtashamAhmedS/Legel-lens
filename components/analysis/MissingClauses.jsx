export default function MissingClauses({ missingClauses }) {
  if (!missingClauses?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-sm font-bold text-foreground mb-1">Missing clauses</h2>
      <p className="text-xs text-muted-foreground mb-4">
        Standard protections that weren't found in this document.
      </p>
      <ul className="space-y-2.5">
        {missingClauses.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-warning mt-0.5 shrink-0">
              <path d="M12 9v4m0 4h.01M10.3 3.9L2.7 17a2 2 0 001.7 3h15.2a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
