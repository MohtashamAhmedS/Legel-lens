export default function FinancialBreakdown({ financials }) {
  if (!financials?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-sm font-bold text-foreground mb-4">Financial breakdown</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-bold uppercase tracking-wide text-muted-foreground border-b border-border">
              <th className="pb-2.5 pr-4">Type</th>
              <th className="pb-2.5 pr-4">Description</th>
              <th className="pb-2.5 pr-4">Amount</th>
              <th className="pb-2.5">Frequency</th>
            </tr>
          </thead>
          <tbody>
            {financials.map((f, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                <td className="py-3 pr-4 font-medium text-foreground">{f.type}</td>
                <td className="py-3 pr-4 text-muted-foreground">{f.description}</td>
                <td className="py-3 pr-4 font-semibold text-foreground">{f.amount}</td>
                <td className="py-3 text-muted-foreground">{f.frequency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
