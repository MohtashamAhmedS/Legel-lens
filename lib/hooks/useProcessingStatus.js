"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = [
  { key: "extracting", label: "Extracting text" },
  { key: "analyzing", label: "Analyzing clauses" },
  { key: "generating", label: "Generating report" },
];

export function useProcessingStatus(documentId) {
  const router = useRouter();
  const [status, setStatus] = useState("extracting");
  const [errorMsg, setErrorMsg] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!documentId) return;

    async function poll() {
      try {
        // NOTE: app/api/documents/[id] route built separately.
        // Stub shape: { status: "extracting" | "analyzing" | "generating" | "ready" | "failed" }
        const res = await fetch(`/api/documents/${documentId}`);
        if (!res.ok) throw new Error("Could not check status.");
        const data = await res.json();

        setStatus(data.status);

        if (data.status === "ready") {
          clearInterval(intervalRef.current);
          router.push(`/analysis/${documentId}`);
        }
        if (data.status === "failed") {
          clearInterval(intervalRef.current);
          setErrorMsg(data.errorMessage || "Analysis failed. Try uploading again.");
        }
      } catch (err) {
        clearInterval(intervalRef.current);
        setErrorMsg(err.message || "Something went wrong.");
      }
    }

    poll();
    intervalRef.current = setInterval(poll, 2500);
    return () => clearInterval(intervalRef.current);
  }, [documentId, router]);

  const currentIndex = STEPS.findIndex((s) => s.key === status);

  return { steps: STEPS, currentIndex, status, errorMsg };
}
