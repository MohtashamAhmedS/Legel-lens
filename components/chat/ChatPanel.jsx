"use client";

import { useState } from "react";
import { useChat } from "@/lib/hooks/useChat";
import { Button } from "@/components/ui/button";

const SUGGESTED = [
  "What happens if I quit?",
  "Who owns the IP?",
  "What happens if I pay late?",
  "What clauses should I negotiate?",
];

export default function ChatPanel({ documentId }) {
  const { messages, sendMessage, isSending, errorMsg } = useChat(documentId);
  const [input, setInput] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim() || isSending) return;
    sendMessage(input);
    setInput("");
  }

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card h-[560px]">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-sm font-bold text-foreground">Ask this document</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Answers are grounded only in the uploaded document.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4" aria-live="polite">
        {messages.length === 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2.5">Try asking</p>
            <div className="flex flex-col gap-2">
              {SUGGESTED.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => sendMessage(q)}
                  className="text-left text-sm text-foreground rounded-lg border border-border px-3.5 py-2.5
                             hover:border-primary/50 hover:bg-accent/50 transition-colors
                             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : m.wasAnswerable === false
                  ? "bg-muted text-muted-foreground italic border border-border"
                  : "bg-muted text-foreground"
              }`}
            >
              {m.wasAnswerable === false ? "Not found in document. " : ""}
              {m.content}
            </div>
          </div>
        ))}

        {isSending && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-3.5 py-2.5 flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse-soft" />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse-soft [animation-delay:0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse-soft [animation-delay:0.3s]" />
            </div>
          </div>
        )}

        {errorMsg && (
          <p role="alert" className="text-xs text-destructive">
            {errorMsg}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="border-t border-border p-3.5 flex gap-2">
        <label htmlFor="chat-input" className="sr-only">
          Ask a question about this document
        </label>
        <input
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question…"
          disabled={isSending}
          className="flex-1 h-10 rounded-md border border-input bg-background px-3 text-sm
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
                     disabled:opacity-50"
        />
        <Button type="submit" size="sm" disabled={isSending || !input.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
}
