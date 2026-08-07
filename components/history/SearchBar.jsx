export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative max-w-sm w-full">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
      >
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
        <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <label htmlFor="doc-search" className="sr-only">
        Search documents
      </label>
      <input
        id="doc-search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search documents…"
        className="w-full h-10 rounded-md border border-input bg-background pl-9 pr-3 text-sm
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  );
}
