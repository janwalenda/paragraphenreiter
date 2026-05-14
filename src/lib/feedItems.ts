import { cache } from "react";
import RSSParser from "rss-parser";
import { feeds } from "@/constants/feeds";
import {
  FEED_FILTER_KEYWORDS_BY_LANG,
  type FeedFilterLang,
} from "@/constants/feedFilterKeywords";

/**
 * Maps the RSS channel `<language>` tag (BCP 47 / RFC 3066) to a keyword list language.
 * Primary subtags `de`, `fr`, and `it` use dedicated lists; everything else uses English.
 *
 * @param language - Raw `language` value from the feed, if present.
 * @returns `"de"`, `"fr"`, `"it"`, or `"en"` for keyword matching.
 */
function keywordLangFromRssLanguage(
  language: string | undefined,
): FeedFilterLang {
  if (!language || typeof language !== "string") return "en";
  const primary = language.trim().split(/[-_]/)[0]?.toLowerCase();
  if (primary === "de") return "de";
  if (primary === "fr") return "fr";
  if (primary === "it") return "it";
  return "en";
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
  /** Channel `<title>` from the feed XML (fallback: feed URL host). */
  sourceFeedTitle: string;
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

/** Regex metacharacters in keyword strings (after whitespace split). */
function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * True if `keyword` occurs in `text` as a whole word or phrase, not as a substring inside
 * a longer token (e.g. "IGH" must not match "highlights"; "ILO" must not match "philosophie").
 *
 * Uses Unicode letter/number boundaries so German/French text matches correctly with the `u` flag.
 *
 * @param text - Haystack (typically RSS title + body fields).
 * @param keyword - Configured phrase; internal runs of whitespace match any `\s+` in the feed.
 */
function textMatchesKeyword(text: string, keyword: string): boolean {
  const parts = keyword.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return false;
  const inner = parts.map(escapeRegExp).join("\\s+");
  const pattern = `(?<![\\p{L}\\p{N}_])${inner}(?![\\p{L}\\p{N}_])`;
  try {
    return new RegExp(pattern, "iu").test(text);
  } catch {
    return text.toLowerCase().includes(keyword.toLowerCase());
  }
}

/** Returns the keyword list for the given feed language. */
function keywordsFor(lang: FeedFilterLang): readonly string[] {
  return FEED_FILTER_KEYWORDS_BY_LANG[lang];
}

/**
 * Collects configured keywords that appear in `text` (case-insensitive, word/phrase boundaries).
 *
 * @param text - Combined title/body fields from the RSS item.
 * @param lang - Which keyword list to use.
 */
function getMatchedKeywords(text: string, lang: FeedFilterLang): string[] {
  const hits: string[] = [];
  for (const kw of keywordsFor(lang)) {
    if (textMatchesKeyword(text, kw)) hits.push(kw);
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

const HTML_IMG_SCAN_MAX = 120_000;

/**
 * Reads a double- or single-quoted HTML attribute value from a tag fragment.
 *
 * @param tagOpen - Opening tag substring (e.g. `<img ...>` without closing `>`).
 * @param attr - Lowercase attribute name.
 */
function extractQuotedHtmlAttr(tagOpen: string, attr: string): string | undefined {
  const re = new RegExp(
    `\\b${attr}\\s*=\\s*(["'])((?:\\\\.|(?!\\1).)*)\\1`,
    "i",
  );
  const m = tagOpen.match(re);
  return m?.[2]?.trim();
}

/**
 * First candidate URL from a `srcset` value (descriptor after URL is ignored).
 *
 * @param srcset - Raw `srcset` attribute string.
 */
function firstUrlFromSrcset(srcset: string): string | undefined {
  const part = srcset.split(",")[0]?.trim();
  if (!part) return undefined;
  const url = part.split(/\s+/)[0]?.trim();
  return url || undefined;
}

/**
 * Finds the first `<img>` in HTML and returns a usable absolute image URL.
 * Used when the item has no `enclosure` / `media:thumbnail` but embeds a lead image in body HTML.
 *
 * @param html - Raw `content:encoded` or `content` HTML.
 * @param baseUrl - Item link for resolving relative `src` / `srcset` URLs.
 */
function firstImageUrlFromHtml(html: string, baseUrl: string): string | undefined {
  if (!html) return undefined;
  const slice = html.slice(0, HTML_IMG_SCAN_MAX);
  const lower = slice.toLowerCase();
  let pos = 0;
  while (pos < slice.length) {
    const i = lower.indexOf("<img", pos);
    if (i === -1) break;
    const gt = slice.indexOf(">", i);
    if (gt === -1) break;
    const tag = slice.slice(i, gt);
    let raw =
      extractQuotedHtmlAttr(tag, "src") ??
      firstUrlFromSrcset(extractQuotedHtmlAttr(tag, "srcset") ?? "");
    if (raw && !/^https?:\/\//i.test(raw) && !/^data:/i.test(raw)) {
      try {
        raw = new URL(raw, baseUrl).href;
      } catch {
        raw = "";
      }
    }
    if (raw && !/^data:/i.test(raw) && /^https?:\/\//i.test(raw)) {
      return raw;
    }
    pos = i + 4;
  }
  return undefined;
}

/**
 * Resolves hero image: RSS fields first, then first `<img>` in item HTML.
 *
 * @param item - Parsed item.
 * @param baseLink - Article URL for resolving relative image paths.
 */
function resolveHeroImageUrl(
  item: ParsedItem,
  baseLink: string,
): string | undefined {
  const fromMeta = pickImageUrl(item);
  if (fromMeta) return fromMeta;
  const rawHtml =
    (typeof item["content:encoded"] === "string" && item["content:encoded"]) ||
    (typeof item.content === "string" && item.content) ||
    "";
  return firstImageUrlFromHtml(rawHtml, baseLink);
}

/**
 * Converts a parsed RSS item into a `FeedArticle`, or `null` if required fields are missing.
 *
 * @param item - Parsed rss-parser item.
 * @param sourceFeedUrl - Feed URL this item came from.
 * @param sourceFeedTitle - Channel title (or host fallback) for UI.
 * @param sourceLang - Keyword bucket inferred from channel language.
 * @param matchedKeywords - Keywords that matched in the item text.
 */
function toArticle(
  item: ParsedItem,
  sourceFeedUrl: string,
  sourceFeedTitle: string,
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
    imageUrl: resolveHeroImageUrl(item, link),
    sourceFeedUrl,
    sourceFeedTitle,
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

/** Human-readable feed label for UI when the channel omits `<title>`. */
function feedChannelDisplayTitle(
  feedUrl: string,
  channelTitle: string | undefined,
): string {
  const t = channelTitle?.trim();
  if (t) return t;
  try {
    return new URL(feedUrl).hostname.replace(/^www\./, "");
  } catch {
    return feedUrl;
  }
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
      if (!res.ok) {
        console.warn(
          "[loadFilteredFeedArticles] Skipping feed (HTTP error):",
          res.status,
          url,
        );
        return {
          url,
          lang: "en" as FeedFilterLang,
          items: [] as ParsedItem[],
          channelTitle: undefined as string | undefined,
        };
      }
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
          channelTitle: undefined as string | undefined,
        };
      }
      const parsed = (await parser.parseString(
        xml,
      )) as ParsedFeed;
      const lang = keywordLangFromRssLanguage(parsed.language);
      const channelTitle =
        typeof parsed.title === "string" ? parsed.title : undefined;
      return {
        url,
        lang,
        items: parsed.items as ParsedItem[],
        channelTitle,
      };
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
    const { url: feedUrl, lang, items, channelTitle } = result.value;
    const sourceFeedTitle = feedChannelDisplayTitle(feedUrl, channelTitle);
    for (const item of items) {
      const blob = getItemSearchBlob(item);
      if (!textMatchesAnyKeyword(blob, lang)) continue;
      const matchedKeywords = getMatchedKeywords(blob, lang);
      const article = toArticle(
        item,
        feedUrl,
        sourceFeedTitle,
        lang,
        matchedKeywords,
      );
      if (!article) continue;
      if (seenLinks.has(article.link)) continue;
      seenLinks.add(article.link);
      collected.push({ article, t: parseItemDate(item) });
    }
  }

  collected.sort((a, b) => b.t - a.t);
  return collected.map((c) => c.article);
});
