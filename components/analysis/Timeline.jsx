export default function Timeline({ timeline }) {
  if (!timeline?.length) return null;

  const sorted = [...timeline].sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-sm font-bold text-foreground mb-5">Timeline</h2>
      <ol className="relative border-l-2 border-border ml-2 space-y-6">
        {sorted.map((item, i) => (
          <li key={i} className="ml-5">
            <span className="absolute -left-[7px] w-3.5 h-3.5 rounded-full bg-primary border-2 border-background" />
            <p className="text-xs font-semibold text-primary">
              {new Date(item.date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
            <p className="text-sm text-foreground mt-0.5">{item.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
