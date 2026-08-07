const STYLES = {
  ready: "bg-success/10 text-success border-success/30",
  processing: "bg-warning/10 text-warning border-warning/30",
  failed: "bg-destructive/10 text-destructive border-destructive/30",
};

const LABELS = {
  ready: "Ready",
  processing: "Processing",
  failed: "Failed",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${STYLES[status] || STYLES.ready}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {LABELS[status] || status}
    </span>
  );
}
