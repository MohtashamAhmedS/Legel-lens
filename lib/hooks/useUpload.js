"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export function useUpload() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState("");
  const [fileError, setFileError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleFileSelected = useCallback((selectedFile, error) => {
    setFile(selectedFile);
    setFileError(error);
  }, []);

  const canSubmit = Boolean(file) && Boolean(documentType) && !fileError;

  const submit = useCallback(async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentType", documentType);

      // NOTE: app/api/documents route is built separately.
      // Stubbed response shape matches: { id, title, documentType, fileType, status, isFavourite, createdAt }
      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Upload failed. Try again.");
      }

      const data = await res.json();
      router.push(`/processing/${data.id}`);
    } catch (err) {
      setSubmitError(err.message || "Something went wrong. Try again.");
      setIsSubmitting(false);
    }
  }, [canSubmit, file, documentType, router]);

  return {
    file,
    documentType,
    setDocumentType,
    fileError,
    handleFileSelected,
    canSubmit,
    isSubmitting,
    submitError,
    submit,
  };
}
