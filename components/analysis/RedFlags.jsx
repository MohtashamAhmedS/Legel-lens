import SeverityBadge from "./SeverityBadge";

export default function RedFlags({ redFlags }) {
  if (!redFlags?.length) return null;

  const sorted = [...redFlags].sort((a, b) => {
    const order = { critical: 0, high: 1, medium: 2, low: 3 };
    return order[a.severity] - order[b.severity];
  });

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-sm font-bold text-foreground mb-4">Red flags</h2>
      <ul className="space-y-3">
        {sorted.map((flag, i) => (
          <li
            key={i}
            className="flex items-start justify-between gap-4 rounded-lg border border-border p-3.5"
          >
            <div>
              <p className="text-sm font-semibold text-foreground">{flag.type}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{flag.description}</p>
            </div>
            <SeverityBadge severity={flag.severity} />
          </li>
        ))}
      </ul>
    </div>
  );
}
