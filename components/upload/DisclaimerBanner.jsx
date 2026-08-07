export default function DisclaimerBanner() {
  return (
    <div
      role="note"
      className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        className="text-warning mt-0.5 shrink-0"
      >
        <path
          d="M12 9v4m0 4h.01M10.3 3.9L2.7 17a2 2 0 001.7 3h15.2a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p className="text-xs text-muted-foreground leading-relaxed">
        <span className="font-semibold text-foreground">
          Informational only, not legal advice.
        </span>{" "}
        LegalLens helps you understand a document's contents. It does not
        replace a licensed attorney. For decisions with real consequences,
        consult one.
      </p>
    </div>
  );
}
