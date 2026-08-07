"use client";

import { useCallback, useRef, useState } from "react";

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
];
const ACCEPTED_EXT = ".pdf,.docx,.png,.jpg,.jpeg";
const MAX_SIZE_MB = 20;

export default function Dropzone({ file, onFileSelected, error, disabled }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const validateAndSet = useCallback(
    (selected) => {
      if (!selected) return;
      if (!ACCEPTED_TYPES.includes(selected.type)) {
        onFileSelected(null, "Unsupported file type. Use PDF, DOCX, or an image.");
        return;
      }
      if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
        onFileSelected(null, `File is too large. Max size is ${MAX_SIZE_MB}MB.`);
        return;
      }
      onFileSelected(selected, null);
    },
    [onFileSelected]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const dropped = e.dataTransfer.files?.[0];
    validateAndSet(dropped);
  };

  const handleChange = (e) => {
    const selected = e.target.files?.[0];
    validateAndSet(selected);
  };

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload document. Drag and drop a file here, or press Enter to browse."
        onClick={() => !disabled && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center text-center
                    rounded-xl border-2 border-dashed px-6 py-14 cursor-pointer
                    transition-colors focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-ring
                    ${isDragging ? "border-primary bg-accent" : "border-input bg-muted/50"}
                    ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border-primary/60 hover:bg-accent/50"}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXT}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
          aria-hidden="true"
        />

        <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center mb-4">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            className="text-primary"
          >
            <path
              d="M12 16V4m0 0L7 9m5-5l5 5M5 20h14"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {file ? (
          <div className="animate-fade-in">
            <p className="text-sm font-semibold text-foreground">{file.name}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {(file.size / 1024 / 1024).toFixed(2)} MB — click to replace
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm font-semibold text-foreground">
              Drag & drop your document here
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              or click to browse — PDF, DOCX, or image, up to {MAX_SIZE_MB}MB
            </p>
          </>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
