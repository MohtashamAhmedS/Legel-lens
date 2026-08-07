export default function StepIndicator({ steps, currentIndex }) {
  return (
    <ol className="space-y-4" aria-label="Analysis progress">
      {steps.map((step, i) => {
        const isDone = i < currentIndex;
        const isActive = i === currentIndex;
        return (
          <li key={step.key} className="flex items-center gap-4">
            <div
              className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center border-2 transition-colors
                ${isDone ? "bg-success border-success" : isActive ? "border-primary" : "border-border"}`}
            >
              {isDone ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : isActive ? (
                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse-soft" />
              ) : (
                <span className="w-2 h-2 rounded-full bg-border" />
              )}
            </div>
            <span
              aria-current={isActive ? "step" : undefined}
              className={`text-sm font-medium ${
                isDone ? "text-foreground" : isActive ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {step.label}
              {isActive && <span className="sr-only"> — in progress</span>}
              {isDone && <span className="sr-only"> — complete</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
