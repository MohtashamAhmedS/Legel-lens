import { SEVERITY_STYLES, SEVERITY_LABEL } from "@/lib/severity";

export default function SeverityBadge({ severity }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${SEVERITY_STYLES[severity] || SEVERITY_STYLES.low}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {SEVERITY_LABEL[severity] || severity}
    </span>
  );
}
