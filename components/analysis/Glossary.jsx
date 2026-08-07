export default function Glossary({ glossary }) {
  if (!glossary?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-sm font-bold text-foreground mb-4">Glossary</h2>
      <dl className="space-y-4">
        {glossary.map((g, i) => (
          <div key={i}>
            <dt className="text-sm font-semibold text-foreground">{g.term}</dt>
            <dd className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{g.definition}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
