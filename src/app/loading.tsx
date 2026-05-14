import { AmbientBackground } from "@/components/AmbientBackground";
import { FeedSkeleton } from "@/components/FeedSkeletom";

/** Route-level loading UI for the home segment (matches home layout shell). */
export default function Loading() {
  return (
    <div className="relative min-h-[50vh]">
      <AmbientBackground />
      <FeedSkeleton />
    </div>
  );
}
