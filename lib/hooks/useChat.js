"use client";

import { useCallback, useState } from "react";

export function useChat(documentId) {
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const sendMessage = useCallback(
    async (content) => {
      if (!content.trim()) return;
      const userMsg = { role: "user", content, wasAnswerable: true };
      setMessages((prev) => [...prev, userMsg]);
      setIsSending(true);
      setErrorMsg(null);

      try {
        // NOTE: app/api/chat route built separately.
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ documentId, message: content }),
        });
        if (!res.ok) throw new Error("Could not get a response.");
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.content, wasAnswerable: data.wasAnswerable },
        ]);
      } catch (err) {
        setErrorMsg(err.message || "Something went wrong.");
      } finally {
        setIsSending(false);
      }
    },
    [documentId]
  );

  return { messages, sendMessage, isSending, errorMsg };
}
