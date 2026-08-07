import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EmptyState({ hasQuery }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 rounded-xl border border-dashed border-border">
      <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-4">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-primary">
          <path d="M6 3h9l5 5v13a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      </div>
      {hasQuery ? (
        <>
          <p className="text-sm font-semibold text-foreground mb-1">No matches</p>
          <p className="text-sm text-muted-foreground">Try a different search term.</p>
        </>
      ) : (
        <>
          <p className="text-sm font-semibold text-foreground mb-1">No documents yet</p>
          <p className="text-sm text-muted-foreground mb-6">Upload your first contract to see it here.</p>
          <Link href="/">
            <Button size="sm">Upload a document</Button>
          </Link>
        </>
      )}
    </div>
  );
}
