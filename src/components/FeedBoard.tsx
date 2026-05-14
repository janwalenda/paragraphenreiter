"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardBody, CardTitle } from "@/components/ui/card";
import { Filter, FilterRadio } from "@/components/ui/filter";
import type { FeedFilterLang } from "@/constants/feedFilterKeywords";
import type { FeedArticle } from "@/lib/feedItems";

/** Host part of a URL for compact UI labels (drops leading `www.`). */
function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

const FEED_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

/**
 * Formats a publication timestamp for display and `<time dateTime>`.
 *
 * @param ms - Epoch milliseconds from the feed item.
 */
function feedPublishedMeta(ms: number): { iso?: string; label: string } {
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) {
    return { label: "—" };
  }
  return {
    iso: d.toISOString(),
    label: d.toLocaleDateString("de-DE", FEED_DATE_FORMAT),
  };
}

/**
 * Client UI: filterable grid of curated RSS articles with images and keyword badges.
 *
 * @param articles - Pre-filtered list from `loadFilteredFeedArticles`.
 */
export default function FeedBoard({ articles }: { articles: FeedArticle[] }) {
  const [source, setSource] = useState<string>("all");
  const [keyword, setKeyword] = useState<string>("all");
  const [langFilter, setLangFilter] = useState<"all" | FeedFilterLang>("all");

  const sources = useMemo(() => {
    const s = new Set(articles.map((a) => a.sourceFeedUrl));
    return [...s].sort((a, b) =>
      hostnameOf(a).localeCompare(hostnameOf(b), "en"),
    );
  }, [articles]);

  const keywords = useMemo(() => {
    const k = new Set<string>();
    for (const a of articles) {
      for (const w of a.matchedKeywords) k.add(w);
    }
    return [...k].sort((a, b) => a.localeCompare(b, "en"));
  }, [articles]);

  const sourceCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const a of articles) {
      m.set(a.sourceFeedUrl, (m.get(a.sourceFeedUrl) ?? 0) + 1);
    }
    return m;
  }, [articles]);

  const keywordCounts = useMemo(() => {
    const m = new Map<string, number>();
    for (const a of articles) {
      for (const w of a.matchedKeywords) {
        m.set(w, (m.get(w) ?? 0) + 1);
      }
    }
    return m;
  }, [articles]);

  const langCounts = useMemo(() => {
    const m = new Map<FeedFilterLang, number>();
    for (const a of articles) {
      m.set(a.sourceLang, (m.get(a.sourceLang) ?? 0) + 1);
    }
    return m;
  }, [articles]);

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      if (source !== "all" && a.sourceFeedUrl !== source) return false;
      if (langFilter !== "all" && a.sourceLang !== langFilter) return false;
      if (keyword !== "all" && !a.matchedKeywords.includes(keyword))
        return false;
      return true;
    });
  }, [articles, source, keyword, langFilter]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-5">
        <fieldset className="min-w-0 space-y-2">
          <legend className="text-sm font-semibold tracking-wide text-base-content">
            Source
          </legend>
          <Filter>
            <FilterRadio
              name="feed-source"
              reset
              checked={source === "all"}
              onChange={() => setSource("all")}
              value="X"
            />
            {sources.map((url) => (
              <FilterRadio
                key={url}
                name="feed-source"
                aria-label={`${hostnameOf(url)} (${sourceCounts.get(url) ?? 0})`}
                checked={source === url}
                onChange={() => setSource(url)}
              />
            ))}
          </Filter>
        </fieldset>

        <fieldset className="min-w-0 space-y-2">
          <legend className="text-sm font-semibold tracking-wide text-base-content">
            Keyword in article
          </legend>
          <Filter>
            <FilterRadio
              name="feed-keyword"
              reset
              checked={keyword === "all"}
              onChange={() => setKeyword("all")}
              value="X"
            />
            {keywords.map((kw) => (
              <FilterRadio
                key={kw}
                name="feed-keyword"
                aria-label={`${kw} (${keywordCounts.get(kw) ?? 0})`}
                title={kw}
                checked={keyword === kw}
                onChange={() => setKeyword(kw)}
                className="max-w-[min(100%,14rem)] truncate"
              />
            ))}
          </Filter>
        </fieldset>

        <fieldset className="min-w-0 space-y-2">
          <legend className="text-sm font-semibold tracking-wide text-base-content">
            Keyword list (curation)
          </legend>
          <p className="text-xs text-base-content/60">
            From the channel RSS <code className="text-[0.7rem]">language</code>{" "}
            field: primary tag <code className="text-[0.7rem]">de</code> uses the
            German keyword list; otherwise the English list (e.g. ICJ / ICC).
          </p>
          <Filter>
            <FilterRadio
              name="feed-lang"
              reset
              checked={langFilter === "all"}
              onChange={() => setLangFilter("all")}
              value="X"
            />
            <FilterRadio
              name="feed-lang"
              aria-label={`German (${langCounts.get("de") ?? 0})`}
              title="German keyword list (e.g. ICJ/ICC terms in German)"
              checked={langFilter === "de"}
              onChange={() => setLangFilter("de")}
            />
            <FilterRadio
              name="feed-lang"
              aria-label={`English (${langCounts.get("en") ?? 0})`}
              title="English keyword list (e.g. ICJ, ICC)"
              checked={langFilter === "en"}
              onChange={() => setLangFilter("en")}
            />
          </Filter>
        </fieldset>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-box border border-base-content/10 bg-base-200/60 px-4 py-8 text-center text-base-content/70">
          No articles match this filter combination.
        </p>
      ) : (
        <p className="mb-4 text-sm text-base-content/60">
          {filtered.length} of {articles.length} articles
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item, index) => {
          const published = feedPublishedMeta(item.publishedAt);
          return (
            <Card
              key={item.id}
              className={
                "card-enter group relative overflow-hidden border border-base-content/10 " +
                "bg-base-200/70 shadow-lg backdrop-blur-sm transition-all duration-300 " +
                "motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-2xl " +
                "motion-safe:hover:border-primary/25 motion-safe:hover:ring-2 motion-safe:hover:ring-primary/10 " +
                "motion-reduce:transition-none"
              }
              style={{ animationDelay: `${Math.min(index, 12) * 45}ms` }}
            >
              {item.imageUrl ? (
                <Link
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-inherit no-underline outline-offset-2 focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <figure className="relative aspect-video overflow-hidden bg-base-300">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={
                        "object-cover transition-transform duration-700 ease-out " +
                        "motion-safe:group-hover:scale-105 motion-reduce:transition-none"
                      }
                    />
                    <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-base-200/80 via-transparent to-transparent opacity-60" />
                    <span
                      className={
                        "absolute right-3 top-3 flex size-9 items-center justify-center rounded-full " +
                        "bg-base-100/80 text-base-content opacity-0 shadow-md backdrop-blur-sm " +
                        "transition-all duration-300 motion-safe:group-hover:opacity-100"
                      }
                      aria-hidden
                    >
                      <ExternalLink className="size-4" />
                    </span>
                  </figure>
                </Link>
              ) : (
                <Link
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-inherit no-underline outline-offset-2 focus-visible:ring-2 focus-visible:ring-primary/40"
                >
                  <div className="relative flex aspect-video items-center justify-center bg-linear-to-br from-primary/15 via-base-300 to-secondary/10">
                    <ExternalLink
                      className="size-8 text-base-content/30"
                      aria-hidden
                    />
                  </div>
                </Link>
              )}
              <CardBody className="gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5 text-xs text-base-content/50">
                    <span className="font-medium uppercase tracking-wide">
                      {hostnameOf(item.sourceFeedUrl)}
                    </span>
                    <span className="text-base-content/30" aria-hidden>
                      ·
                    </span>
                    <time
                      {...(published.iso ? { dateTime: published.iso } : {})}
                      className="font-normal normal-case tabular-nums tracking-normal"
                    >
                      {published.label}
                    </time>
                  </p>
                  <Badge
                    variant="accent"
                    style="outline"
                    size="xs"
                    className="font-mono uppercase"
                    title="Keyword list from RSS channel language (de vs. default en)"
                  >
                    {item.sourceLang}
                  </Badge>
                </div>
                <CardTitle className="line-clamp-2 text-lg leading-snug transition-colors duration-200 group-hover:text-primary">
                  <Link
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-inherit no-underline hover:text-primary"
                  >
                    {item.title}
                  </Link>
                </CardTitle>
                <div className="flex flex-wrap gap-1">
                  {item.matchedKeywords.slice(0, 5).map((kw) => (
                    <Badge
                      key={kw}
                      variant="accent"
                      style="outline"
                      size="xs"
                      className="font-normal"
                    >
                      {kw}
                    </Badge>
                  ))}
                  {item.matchedKeywords.length > 5 ? (
                    <Badge variant="neutral" style="outline" size="xs">
                      +{item.matchedKeywords.length - 5}
                    </Badge>
                  ) : null}
                </div>
                <div
                  suppressHydrationWarning
                  className={
                    "line-clamp-4 text-sm text-base-content/75 max-w-none " +
                    "[&_a]:text-primary [&_a]:underline [&_p]:mb-2 [&_p:last-child]:mb-0"
                  }
                  dangerouslySetInnerHTML={{
                    __html: item.description,
                  }}
                />
                <div className="mt-1 flex justify-end border-t border-base-content/5 pt-2">
                  <Link
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="link link-primary inline-flex items-center gap-1 text-sm font-medium"
                  >
                    Open source
                    <ExternalLink className="size-3.5 shrink-0" aria-hidden />
                  </Link>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
