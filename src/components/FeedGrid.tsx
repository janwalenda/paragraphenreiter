import FeedBoard from "@/components/FeedBoard";
import { loadFilteredFeedArticles } from "@/lib/feedItems";

/** Server component that loads curated articles and renders the client feed board. */
export default async function FeedGrid() {
  const articles = await loadFilteredFeedArticles();
  return <FeedBoard articles={articles} />;
}
