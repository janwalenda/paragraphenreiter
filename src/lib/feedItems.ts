import { cache } from "react";
import RSSParser from "rss-parser";
import { feeds } from "@/constants/feeds";
import {
  FEED_FILTER_KEYWORDS_BY_LANG,
  type FeedFilterLang,
} from "@/constants/feedFilterKeywords";

/**
 * Maps the RSS channel `<language>` tag (BCP 47 / RFC 3066) to a keyword list language.
 * Only the primary subtag `de` uses the German keyword list; everything else uses English.
 *
 * @param language - Raw `language` value from the feed, if present.
 * @returns `"de"` or `"en"` for keyword matching.
 */
function keywordLangFromRssLanguage(
  language: string | undefined,
): FeedFilterLang {
  if (!language || typeof language !== "string") return "en";
  const primary = language.trim().split(/[-_]/)[0]?.toLowerCase();
  return primary === "de" ? "de" : "en";
}

/** Single article after aggregation, filtering, and normalization. */
export type FeedArticle = {
  id: string;
  title: string;
  link: string;
  description: string;
  publishedAt: number;
  imageUrl?: string;
  /** RSS feed URL this entry was parsed from. */
  sourceFeedUrl: string;
  /** Derived from feed metadata `language` for keyword curation. */
  sourceLang: FeedFilterLang;
  /** Configured keywords that matched in the item text (for the feed language). */
  matchedKeywords: string[];
};

type ParsedItem = RSSParser.Item & {
  "content:encoded"?: string;
  mediaThumbnail?: { $?: { url?: string } } | Array<{ $?: { url?: string } }>;
};

const parser = new RSSParser({
  customFields: {
    item: [["media:thumbnail", "mediaThumbnail"]],
  },
});

/** BCP 47 locale string used for case folding when matching keywords. */
function normalizeLocale(lang: FeedFilterLang): string {
  return lang === "de" ? "de" : "en";
}

/**
 * Lowercases text for keyword search using the appropriate locale.
 *
 * @param s - Haystack or keyword text.
 * @param lang - Feed language bucket (`de` / `en`).
 */
function normalizeForMatch(s: string, lang: FeedFilterLang): string {
  return s.toLocaleLowerCase(normalizeLocale(lang));
}

/** Returns the keyword list for the given feed language. */
function keywordsFor(lang: FeedFilterLang): readonly string[] {
  return FEED_FILTER_KEYWORDS_BY_LANG[lang];
}

/**
 * Collects configured keywords that appear in `text` (case-insensitive, locale-aware).
 *
 * @param text - Combined title/body fields from the RSS item.
 * @param lang - Which keyword list to use.
 */
function getMatchedKeywords(text: string, lang: FeedFilterLang): string[] {
  const haystack = normalizeForMatch(text, lang);
  const hits: string[] = [];
  for (const kw of keywordsFor(lang)) {
    if (haystack.includes(normalizeForMatch(kw, lang))) hits.push(kw);
  }
  return hits;
}

/** True if at least one configured keyword matches in `text`. */
function textMatchesAnyKeyword(text: string, lang: FeedFilterLang): boolean {
  return getMatchedKeywords(text, lang).length > 0;
}

/**
 * Builds one searchable string from common RSS/Atom item fields.
 *
 * @param item - Parsed rss-parser item with optional `content:encoded` and media fields.
 */
function getItemSearchBlob(item: ParsedItem): string {
  const encoded =
    typeof item["content:encoded"] === "string" ? item["content:encoded"] : "";
  const content = typeof item.content === "string" ? item.content : "";
  const summary = typeof item.summary === "string" ? item.summary : "";
  const snippet =
    typeof item.contentSnippet === "string" ? item.contentSnippet : "";
  const title = typeof item.title === "string" ? item.title : "";
  return [title, encoded, content, summary, snippet].join("\n");
}

/**
 * Picks a hero image URL from `enclosure` or `media:thumbnail`, if any.
 *
 * @param item - Parsed item.
 * @returns Image URL or `undefined`.
 */
function pickImageUrl(item: ParsedItem): string | undefined {
  const enc = item.enclosure;
  if (enc?.url) {
    const t = enc.type ?? "";
    if (
      t.startsWith("image") ||
      /\.(jpe?g|png|gif|webp|avif)(\?|$)/i.test(enc.url)
    ) {
      return enc.url;
    }
  }

  const mt = item.mediaThumbnail;
  if (!mt) return undefined;
  const first = Array.isArray(mt) ? mt[0] : mt;
  const url = first?.$?.url;
  return typeof url === "string" ? url : undefined;
}

/**
 * Converts a parsed RSS item into a `FeedArticle`, or `null` if required fields are missing.
 *
 * @param item - Parsed rss-parser item.
 * @param sourceFeedUrl - Feed URL this item came from.
 * @param sourceLang - Keyword bucket inferred from channel language.
 * @param matchedKeywords - Keywords that matched in the item text.
 */
function toArticle(
  item: ParsedItem,
  sourceFeedUrl: string,
  sourceLang: FeedFilterLang,
  matchedKeywords: string[],
): FeedArticle | null {
  const link = item.link?.trim();
  if (!link) return null;

  const title = item.title?.trim() ?? "";
  const rawDesc =
    (typeof item["content:encoded"] === "string" && item["content:encoded"]) ||
    (typeof item.content === "string" && item.content) ||
    "";
  const description = rawDesc.trim() || (item.contentSnippet ?? "").trim();

  const guid = item.guid ?? link;
  const id = String(guid).trim();

  return {
    id,
    title,
    link,
    description,
    publishedAt: parseItemDate(item),
    imageUrl: pickImageUrl(item),
    sourceFeedUrl,
    sourceLang,
    matchedKeywords,
  };
}

/**
 * Best-effort publication timestamp in milliseconds since epoch.
 *
 * @param item - Parsed item with optional `isoDate` / `pubDate`.
 * @returns Parsed time, or `0` if missing/invalid.
 */
function parseItemDate(item: ParsedItem): number {
  if (item.isoDate) return Date.parse(item.isoDate);
  if (item.pubDate) return Date.parse(item.pubDate);
  return 0;
}

type ParsedFeed = RSSParser.Output<ParsedItem> & { language?: string };

/**
 * Heuristic: response body looks like RSS, Atom, or RSS 1.0 RDF before running xml2js.
 * Avoids parsing empty bodies, HTML error pages, or bot challenges as XML.
 *
 * @param xml - Response body (trimmed).
 */
function looksLikeFeedXml(xml: string): boolean {
  const probe = xml.slice(0, 4096).toLowerCase();
  return (
    probe.includes("<rss") ||
    probe.includes("<feed") ||
    probe.includes("<rdf:rdf")
  );
}

/**
 * Fetches all configured feeds on the server, keeps items that match configured keywords,
 * deduplicates by article link, and sorts newest first. Cached per request (React `cache`).
 *
 * @returns Aggregated, filtered articles.
 */
export const loadFilteredFeedArticles = cache(async (): Promise<FeedArticle[]> => {
  const results = await Promise.allSettled(
    feeds.map(async (url) => {
      const res = await fetch(url, {
        headers: {
          Accept:
            "application/rss+xml, application/atom+xml, application/xml, text/xml, */*",
          "User-Agent": "Paragraphenreiter/1.0 (RSS reader)",
        },
        next: { revalidate: 120 },
      });
      if (!res.ok) throw new Error(`${res.status} ${url}`);
      const xml = (await res.text()).replace(/^\uFEFF/, "").trim();
      if (!xml || !looksLikeFeedXml(xml)) {
        console.warn(
          "[loadFilteredFeedArticles] Skipping empty or non-RSS response:",
          url,
        );
        return {
          url,
          lang: "en" as FeedFilterLang,
          items: [] as ParsedItem[],
        };
      }
      const parsed = (await parser.parseString(
        xml,
      )) as ParsedFeed;
      const lang = keywordLangFromRssLanguage(parsed.language);
      return { url, lang, items: parsed.items as ParsedItem[] };
    }),
  );

  const collected: { article: FeedArticle; t: number }[] = [];
  const seenLinks = new Set<string>();

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.status !== "fulfilled") {
      console.warn("[loadFilteredFeedArticles]", result.reason);
      continue;
    }
    const { url: feedUrl, lang, items } = result.value;
    for (const item of items) {
      const blob = getItemSearchBlob(item);
      if (!textMatchesAnyKeyword(blob, lang)) continue;
      const matchedKeywords = getMatchedKeywords(blob, lang);
      const article = toArticle(item, feedUrl, lang, matchedKeywords);
      if (!article) continue;
      if (seenLinks.has(article.link)) continue;
      seenLinks.add(article.link);
      collected.push({ article, t: parseItemDate(item) });
    }
  }

  collected.sort((a, b) => b.t - a.t);
  return collected.map((c) => c.article);
});
