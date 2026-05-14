import { Suspense } from "react";
import { AmbientBackground } from "@/components/AmbientBackground";
import { FeedSkeleton } from "@/components/FeedSkeletom";
import FeedGrid from "../components/FeedGrid";

export const revalidate = 120;

/** Home page: background, suspense shell, and server-fetched feed grid. */
export default function Home() {
  return (
    <div className="relative min-h-[50vh]">
      <AmbientBackground />
      <Suspense fallback={<FeedSkeleton />}>
        <FeedGrid />
      </Suspense>
    </div>
  );
}
