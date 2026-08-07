function Gauge({ label, value, colorClass }) {
  const circumference = 2 * Math.PI * 34;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 80 80" className="w-20 h-20 -rotate-90">
          <circle cx="40" cy="40" r="34" fill="none" stroke="hsl(var(--border))" strokeWidth="7" />
          <circle
            cx="40"
            cy="40"
            r="34"
            fill="none"
            stroke="currentColor"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={colorClass}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
          {value}
        </span>
      </div>
      <span className="text-xs font-medium text-muted-foreground text-center">{label}</span>
    </div>
  );
}

export default function ScoreGauges({ scores }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 rounded-xl border border-border bg-card p-6">
      <Gauge label="Risk score" value={scores.riskScore} colorClass="text-destructive" />
      <Gauge label="Complexity" value={scores.complexityScore} colorClass="text-warning" />
      <Gauge label="Confidence" value={scores.confidenceScore} colorClass="text-success" />
      <div className="flex flex-col items-center justify-center gap-2">
        <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center">
          <span className="text-base font-bold text-primary">{scores.estimatedReadingTimeMinutes}m</span>
        </div>
        <span className="text-xs font-medium text-muted-foreground text-center">Reading time</span>
      </div>
    </div>
  );
}
