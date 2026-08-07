export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center py-32">
      <div
        role="status"
        aria-label="Loading"
        className="w-8 h-8 rounded-full border-2 border-border border-t-primary animate-spin"
      />
    </div>
  );
}
