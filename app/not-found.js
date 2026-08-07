import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-32">
      <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mb-6">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-primary">
          <path
            d="M9.5 9.5l5 5m0-5l-5 5M12 3l7 4v5c0 5-3.5 8.5-7 9.5-3.5-1-7-4.5-7-9.5V7l7-4z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-foreground mb-2">Page not found</h1>
      <p className="text-sm text-muted-foreground max-w-sm mb-8">
        The page you're looking for doesn't exist, or the document may have
        been deleted.
      </p>
      <Link href="/">
        <Button>Back to upload</Button>
      </Link>
    </main>
  );
}
