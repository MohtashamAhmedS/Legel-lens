export default function PartiesInfo({ parties, governingLaw, jurisdiction }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-sm font-bold text-foreground mb-4">Parties & jurisdiction</h2>
      <dl className="space-y-3">
        {parties?.map((p, i) => (
          <div key={i} className="flex justify-between text-sm">
            <dt className="text-muted-foreground">{p.role}</dt>
            <dd className="font-medium text-foreground">{p.name}</dd>
          </div>
        ))}
        <div className="flex justify-between text-sm border-t border-border pt-3">
          <dt className="text-muted-foreground">Governing law</dt>
          <dd className="font-medium text-foreground">{governingLaw}</dd>
        </div>
        <div className="flex justify-between text-sm">
          <dt className="text-muted-foreground">Jurisdiction</dt>
          <dd className="font-medium text-foreground">{jurisdiction}</dd>
        </div>
      </dl>
    </div>
  );
}
