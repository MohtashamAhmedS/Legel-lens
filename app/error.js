"use client";

import { Button } from "@/components/ui/button";

export default function Error({ error, reset }) {
  return (
    <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-32">
      <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-destructive">
          <path
            d="M12 9v4m0 4h.01M10.3 3.9L2.7 17a2 2 0 001.7 3h15.2a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h1>
      <p className="text-sm text-muted-foreground max-w-sm mb-8">
        {error?.message || "An unexpected error occurred. Try again."}
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </main>
  );
}
