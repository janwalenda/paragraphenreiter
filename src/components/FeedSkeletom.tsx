const SKELETON_CARD_KEYS = [
  "s-1",
  "s-2",
  "s-3",
  "s-4",
  "s-5",
  "s-6",
  "s-7",
  "s-8",
  "s-9",
] as const;

/** Placeholder layout shown while the async feed grid is loading. */
export function FeedSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 h-10 max-w-md rounded-lg bg-base-content/10 shimmer" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SKELETON_CARD_KEYS.map((key) => (
          <div
            key={key}
            className="flex flex-col overflow-hidden rounded-2xl border border-base-content/10 bg-base-200/60 shadow-lg"
          >
            <div className="aspect-video w-full bg-base-content/10 shimmer" />
            <div className="flex flex-1 flex-col gap-3 p-5">
              <div className="h-6 w-4/5 rounded bg-base-content/10 shimmer" />
              <div className="h-3 w-full rounded bg-base-content/5 shimmer" />
              <div className="h-3 w-full rounded bg-base-content/5 shimmer" />
              <div className="h-3 w-2/3 rounded bg-base-content/5 shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
