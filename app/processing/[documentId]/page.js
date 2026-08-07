"use client";

import Link from "next/link";
import StepIndicator from "@/components/upload/StepIndicator";
import { Button } from "@/components/ui/button";
import { useProcessingStatus } from "@/lib/hooks/useProcessingStatus";

export default function ProcessingPage({ params }) {
  const { documentId } = params;
  const { steps, currentIndex, errorMsg } = useProcessingStatus(documentId);

  return (
    <main
      id="main-content"
      className="flex-1 flex items-center justify-center px-6 py-24"
    >
      <div className="w-full max-w-md text-center">
        {errorMsg ? (
          <>
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-5">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="text-destructive"
              >
                <path
                  d="M12 9v4m0 4h.01M10.3 3.9L2.7 17a2 2 0 001.7 3h15.2a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-foreground mb-2">
              Analysis failed
            </h1>
            <p className="text-sm text-muted-foreground mb-8">{errorMsg}</p>
            <Link href="/">
              <Button>Try another document</Button>
            </Link>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mx-auto mb-5">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="text-primary animate-spin"
              >
                <path
                  d="M12 3a9 9 0 019 9"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-foreground mb-2">
              Reading your document
            </h1>
            <p className="text-sm text-muted-foreground mb-10">
              This usually takes under a minute. No need to keep this tab active
              — you can wait here.
            </p>
            <div className="text-left inline-block">
              <StepIndicator steps={steps} currentIndex={currentIndex} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
