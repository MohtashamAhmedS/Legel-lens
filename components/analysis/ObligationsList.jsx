export default function ObligationsList({ obligations }) {
  if (!obligations?.length) return null;

  const grouped = obligations.reduce((acc, ob) => {
    acc[ob.party] = acc[ob.party] || [];
    acc[ob.party].push(ob);
    return acc;
  }, {});

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-sm font-bold text-foreground mb-4">Obligations by party</h2>
      <div className="grid sm:grid-cols-2 gap-5">
        {Object.entries(grouped).map(([party, items]) => (
          <div key={party}>
            <p className="text-xs font-bold uppercase tracking-wide text-primary mb-2.5">
              {party} must
            </p>
            <ul className="space-y-2.5">
              {items.map((ob, i) => (
                <li key={i} className="text-sm text-foreground leading-relaxed">
                  {ob.description}
                  <span className="block text-xs text-muted-foreground mt-0.5">{ob.deadline}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
