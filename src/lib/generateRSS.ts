import RSS from "rss";
import { loadFilteredFeedArticles } from "@/lib/feedItems";

/**
 * Public site base URL for absolute links in the generated feed.
 * Uses `NEXT_PUBLIC_SITE_URL` when set, otherwise production default.
 */
function siteBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  return "https://paragraphenreiter.de";
}

/**
 * Converts a millisecond timestamp to a `Date` for RSS `pubDate`.
 * Falls back to “now” when the value is missing or invalid.
 */
function itemPubDate(ms: number): Date {
  return Number.isFinite(ms) && ms > 0 ? new Date(ms) : new Date();
}

/**
 * Builds an RSS enclosure object for `rss` when the article has an image URL.
 *
 * @param url - Remote image URL from the article.
 */
function enclosureForImage(url: string | undefined): RSS.EnclosureObject | undefined {
  if (!url?.trim()) return undefined;
  const lower = url.toLowerCase();
  let type = "image/jpeg";
  if (lower.includes(".png")) type = "image/png";
  else if (lower.includes(".webp")) type = "image/webp";
  else if (lower.includes(".gif")) type = "image/gif";
  return { url, type };
}

/**
 * Builds the full RSS 2.0 XML document for the curated article list.
 *
 * @returns XML string with UTF-8 content suitable for `application/rss+xml`.
 */
export async function generateRSS(): Promise<string> {
  const articles = await loadFilteredFeedArticles();
  const base = siteBaseUrl();
  const feedUrl = `${base}/feed.rss`;

  const feed = new RSS({
    title: "Paragraphenreiter",
    description:
      "Paragraphenreiter — curated headlines from international RSS feeds.",
    site_url: base,
    feed_url: feedUrl,
    copyright: "Paragraphenreiter",
    language: "en",
    pubDate: new Date(),
    ttl: 120,
    generator: "Paragraphenreiter",
  });

  for (const article of articles) {
    const enc = enclosureForImage(article.imageUrl);
    feed.item({
      title: article.title,
      description: article.description,
      url: article.link,
      guid: article.id,
      date: itemPubDate(article.publishedAt),
      categories: article.matchedKeywords,
      author: article.sourceFeedTitle,
      ...(enc ? { enclosure: enc } : {}),
    });
  }

  return feed.xml({ indent: true });
}
