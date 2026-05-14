import { generateRSS } from "@/lib/generateRSS";

/** GET `/feed.rss` — returns curated articles as RSS 2.0 XML. */
export async function GET() {
  const body = await generateRSS();
  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
    },
  });
}
