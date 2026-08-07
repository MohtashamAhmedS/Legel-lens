import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-[68px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-[17px] tracking-tight">
          <span className="w-6.5 h-6.5 w-[26px] h-[26px] rounded-[7px] bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 12l2 2 4-4M12 3l7 4v5c0 5-3.5 8.5-7 9.5-3.5-1-7-4.5-7-9.5V7l7-4z"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          LegalLens
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Upload
          </Link>
          <Link href="/history" className="hover:text-foreground transition-colors">
            History
          </Link>
          <a href="#security" className="hover:text-foreground transition-colors">
            Security
          </a>
        </div>

        <Link
          href="/"
          className="inline-flex h-10 items-center justify-center rounded-md bg-foreground px-4 text-sm font-semibold text-background hover:bg-foreground/90 transition-colors"
        >
          Analyze a document
        </Link>
      </div>
    </nav>
  );
}
