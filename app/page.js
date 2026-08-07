"use client";

import Dropzone from "@/components/upload/Dropzone";
import DocumentTypeSelector from "@/components/upload/DocumentTypeSelector";
import DisclaimerBanner from "@/components/upload/DisclaimerBanner";
import { Button } from "@/components/ui/button";
import { useUpload } from "@/lib/hooks/useUpload";

export default function HomePage() {
  const {
    file,
    documentType,
    setDocumentType,
    fileError,
    handleFileSelected,
    canSubmit,
    isSubmitting,
    submitError,
    submit,
  } = useUpload();

  return (
    <main id="main-content" className="flex-1">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="hero-grid" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-primary bg-accent px-3 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            No account needed — fully anonymous
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-4">
            Understand any contract<br className="hidden sm:block" />{" "}
            before you <span className="font-serif italic font-medium text-primary">sign it</span>
          </h1>
          <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Upload a legal document and get a plain-English summary, a risk
            score, and answers to your questions — in under a minute.
          </p>
        </div>
      </section>

      {/* Upload card */}
      <section className="max-w-2xl mx-auto px-6 py-14">
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
          <Dropzone
            file={file}
            error={fileError}
            disabled={isSubmitting}
            onFileSelected={handleFileSelected}
          />

          <DocumentTypeSelector
            value={documentType}
            onChange={setDocumentType}
            disabled={isSubmitting}
          />

          {submitError && (
            <p role="alert" className="text-sm text-destructive">
              {submitError}
            </p>
          )}

          <Button
            className="w-full"
            size="lg"
            disabled={!canSubmit || isSubmitting}
            onClick={submit}
          >
            {isSubmitting ? "Uploading…" : "Analyze document"}
          </Button>

          <DisclaimerBanner />
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Encrypted upload · Nothing stored under your name · Delete anytime
        </p>
      </section>
    </main>
  );
}
