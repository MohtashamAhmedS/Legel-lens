"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import StatusBadge from "./StatusBadge";

export default function DocumentCard({ doc, onToggleFavourite, onRename, onDelete, onDuplicate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [titleDraft, setTitleDraft] = useState(doc.title);
  const inputRef = useRef(null);

  function commitRename() {
    setIsRenaming(false);
    if (titleDraft.trim() && titleDraft !== doc.title) {
      onRename(doc.id, titleDraft.trim());
    } else {
      setTitleDraft(doc.title);
    }
  }

  const href = doc.status === "ready" ? `/analysis/${doc.id}` : doc.status === "processing" ? `/processing/${doc.id}` : "#";

  return (
    <div className="relative rounded-xl border border-border bg-card p-5 hover:border-primary/40 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <StatusBadge status={doc.status} />
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label={doc.isFavourite ? "Remove from favourites" : "Add to favourites"}
            aria-pressed={doc.isFavourite}
            onClick={() => onToggleFavourite(doc.id)}
            className="p-1.5 rounded-md hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={doc.isFavourite ? "currentColor" : "none"}
              className={doc.isFavourite ? "text-warning" : "text-muted-foreground"}
            >
              <path d="M12 17.3l-6.2 3.6 1.6-7L2 9.2l7.1-.6L12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="relative">
            <button
              type="button"
              aria-label="More actions"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              className="p-1.5 rounded-md hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-muted-foreground">
                <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                <circle cx="12" cy="19" r="1.5" fill="currentColor" />
              </svg>
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-9 z-10 w-40 rounded-md border border-border bg-card shadow-lg py-1 animate-fade-in"
              >
                <button
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    setIsRenaming(true);
                    setTimeout(() => inputRef.current?.focus(), 0);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-accent"
                >
                  Rename
                </button>
                <button
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onDuplicate(doc.id);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-accent"
                >
                  Duplicate
                </button>
                <button
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(doc.id);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isRenaming ? (
        <input
          ref={inputRef}
          value={titleDraft}
          onChange={(e) => setTitleDraft(e.target.value)}
          onBlur={commitRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") commitRename();
            if (e.key === "Escape") {
              setTitleDraft(doc.title);
              setIsRenaming(false);
            }
          }}
          className="w-full text-sm font-semibold rounded-md border border-input px-2 py-1 mb-2
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      ) : (
        <Link href={href} className="block text-sm font-semibold text-foreground mb-2 truncate hover:text-primary">
          {doc.title}
        </Link>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {new Date(doc.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
        </span>
        {doc.riskScore != null && (
          <span className="font-semibold text-foreground">Risk {doc.riskScore}</span>
        )}
      </div>
    </div>
  );
}
