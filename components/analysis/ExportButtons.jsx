"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const FORMATS = [
  { key: "pdf", label: "PDF" },
  { key: "markdown", label: "Markdown" },
  { key: "text", label: "Text" },
];

export default function ExportButtons({ documentId }) {
  const [downloadingKey, setDownloadingKey] = useState(null);

  async function handleExport(format) {
    setDownloadingKey(format);
    try {
      // NOTE: app/api/export route built separately.
      const res = await fetch(`/api/export?documentId=${documentId}&format=${format}`);
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `legallens-report.${format === "markdown" ? "md" : format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Silently no-op until export route exists; button stays usable.
    } finally {
      setDownloadingKey(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-2.5">
      {FORMATS.map((f) => (
        <Button
          key={f.key}
          variant="outline"
          size="sm"
          disabled={downloadingKey === f.key}
          onClick={() => handleExport(f.key)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 16V4m0 12l-4-4m4 4l4-4M5 20h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {downloadingKey === f.key ? "Exporting…" : `Export ${f.label}`}
        </Button>
      ))}
    </div>
  );
}
