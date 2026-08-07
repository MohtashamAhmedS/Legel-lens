"use client";

import { useDocuments } from "@/lib/hooks/useDocuments";
import SearchBar from "@/components/history/SearchBar";
import DocumentCard from "@/components/history/DocumentCard";
import EmptyState from "@/components/history/EmptyState";

export default function HistoryPage() {
  const {
    documents,
    isLoading,
    query,
    setQuery,
    toggleFavourite,
    renameDocument,
    deleteDocument,
    duplicateDocument,
  } = useDocuments();

  return (
    <main id="main-content" className="flex-1 max-w-6xl mx-auto px-6 py-10 w-full">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Document history</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Everything you've analyzed, stored against this browser session only.
          </p>
        </div>
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <div
            role="status"
            aria-label="Loading documents"
            className="w-8 h-8 rounded-full border-2 border-border border-t-primary animate-spin"
          />
        </div>
      ) : documents.length === 0 ? (
        <EmptyState hasQuery={Boolean(query)} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onToggleFavourite={toggleFavourite}
              onRename={renameDocument}
              onDelete={deleteDocument}
              onDuplicate={duplicateDocument}
            />
          ))}
        </div>
      )}
    </main>
  );
}
