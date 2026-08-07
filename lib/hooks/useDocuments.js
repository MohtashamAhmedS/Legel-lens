"use client";

import { useCallback, useEffect, useState } from "react";

const MOCK_DOCS = [
  { id: "1", title: "Employment_Agreement_Final.pdf", documentType: "employment_contract", fileType: "pdf", status: "ready", isFavourite: true, riskScore: 62, createdAt: "2026-07-28T10:00:00Z" },
  { id: "2", title: "NDA_Northgate.docx", documentType: "nda", fileType: "docx", status: "ready", isFavourite: false, riskScore: 24, createdAt: "2026-07-25T10:00:00Z" },
  { id: "3", title: "Apartment_Lease_2026.pdf", documentType: "rental_agreement", fileType: "pdf", status: "processing", isFavourite: false, riskScore: null, createdAt: "2026-07-30T14:00:00Z" },
  { id: "4", title: "Freelance_Scope_ClientX.pdf", documentType: "freelance_contract", fileType: "pdf", status: "failed", isFavourite: false, riskScore: null, createdAt: "2026-07-20T09:00:00Z" },
];

export function useDocuments() {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        // NOTE: app/api/documents route (GET) built separately.
        const res = await fetch("/api/documents");
        if (!res.ok) throw new Error("not-ready");
        const data = await res.json();
        if (!cancelled) setDocuments(data);
      } catch {
        if (!cancelled) setDocuments(MOCK_DOCS);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggleFavourite = useCallback((id) => {
    setDocuments((docs) =>
      docs.map((d) => (d.id === id ? { ...d, isFavourite: !d.isFavourite } : d))
    );
    fetch(`/api/documents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ toggleFavourite: true }),
    }).catch(() => {});
  }, []);

  const renameDocument = useCallback((id, newTitle) => {
    setDocuments((docs) => docs.map((d) => (d.id === id ? { ...d, title: newTitle } : d)));
    fetch(`/api/documents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle }),
    }).catch(() => {});
  }, []);

  const deleteDocument = useCallback((id) => {
    setDocuments((docs) => docs.filter((d) => d.id !== id));
    fetch(`/api/documents/${id}`, { method: "DELETE" }).catch(() => {});
  }, []);

  const duplicateDocument = useCallback((id) => {
    setDocuments((docs) => {
      const original = docs.find((d) => d.id === id);
      if (!original) return docs;
      const copy = {
        ...original,
        id: `${id}-copy-${Date.now()}`,
        title: `${original.title} (copy)`,
        createdAt: new Date().toISOString(),
      };
      return [copy, ...docs];
    });
    fetch(`/api/documents/${id}/duplicate`, { method: "POST" }).catch(() => {});
  }, []);

  const filtered = documents.filter((d) =>
    d.title.toLowerCase().includes(query.toLowerCase())
  );

  return {
    documents: filtered,
    isLoading,
    query,
    setQuery,
    toggleFavourite,
    renameDocument,
    deleteDocument,
    duplicateDocument,
  };
}
