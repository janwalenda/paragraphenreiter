import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";
import { feeds } from "./src/constants/feeds";

const MAX_REMOTE_PATTERNS = 50;

/**
 * Typical image CDNs in news RSS (`<media:thumbnail>`, enclosures, HTML `img`).
 * These count toward the same 50-entry limit as feed hosts (Next.js 16 cap).
 */
const COMMON_IMAGE_CDN_PATTERNS: readonly RemotePattern[] = [
  { protocol: "https", hostname: "**.cloudfront.net", pathname: "/**" },
  { protocol: "https", hostname: "**.amazonaws.com", pathname: "/**" },
  { protocol: "https", hostname: "**.akamaized.net", pathname: "/**" },
  { protocol: "https", hostname: "**.fastly.net", pathname: "/**" },
  { protocol: "https", hostname: "**.imgix.net", pathname: "/**" },
  { protocol: "https", hostname: "**.wp.com", pathname: "/**" },
  { protocol: "https", hostname: "**.googleusercontent.com", pathname: "/**" },
];

/**
 * Publishers that serve RSS from one subdomain but hero images from another
 * (e.g. `newsfeed.zeit.de` vs `img.zeit.de`). One `**.example.com` pattern covers both.
 */
const PUBLISHER_IMAGE_SUFFIXES: readonly string[] = [
  "zeit.de",
  "spiegel.de",
  "tagesschau.de",
  "sueddeutsche.de",
  "welt.de",
  "faz.net",
  "lemonde.fr",
];

function hostUnderSuffix(hostname: string, suffix: string): boolean {
  return hostname === suffix || hostname.endsWith(`.${suffix}`);
}

function stripHostsUnderSuffix(hosts: readonly string[], suffix: string): string[] {
  return hosts.filter((h) => !hostUnderSuffix(h, suffix));
}

/**
 * Builds `images.remotePatterns` from feed URLs, staying within Next.js’s
 * {@link MAX_REMOTE_PATTERNS} cap. Feed hostnames are deduped (first occurrence
 * order). Publisher `**` suffixes replace matching feed literals so sibling image
 * hosts (e.g. `img.zeit.de`) stay allowed without a separate entry.
 *
 * @param urls - Absolute feed URLs (same list as `src/constants/feeds.ts`).
 */
function remotePatternsFromFeeds(urls: readonly string[]): RemotePattern[] {
  const orderedHosts: string[] = [];
  const seen = new Set<string>();
  for (const raw of urls) {
    try {
      const host = new URL(raw).hostname.toLowerCase();
      if (seen.has(host)) continue;
      seen.add(host);
      orderedHosts.push(host);
    } catch {
      continue;
    }
  }

  const patterns: RemotePattern[] = [...COMMON_IMAGE_CDN_PATTERNS];
  let hostList = [...orderedHosts];

  for (const suffix of PUBLISHER_IMAGE_SUFFIXES) {
    if (patterns.length >= MAX_REMOTE_PATTERNS) break;
    if (!hostList.some((h) => hostUnderSuffix(h, suffix))) continue;
    hostList = stripHostsUnderSuffix(hostList, suffix);
    patterns.push({
      protocol: "https",
      hostname: `**.${suffix}`,
      pathname: "/**",
    });
  }

  const budget = MAX_REMOTE_PATTERNS - patterns.length;
  for (let i = 0; i < Math.min(budget, hostList.length); i++) {
    const hostname = hostList[i]!;
    patterns.push({
      protocol: hostname === "rss.cnn.com" ? "http" : "https",
      hostname,
      pathname: "/**",
    });
  }

  if (hostList.length > budget) {
    console.warn(
      `[next.config] images.remotePatterns: ${orderedHosts.length} unique feed hosts; only ${budget} literal slots after ${patterns.length - budget} non-literal pattern(s). Reorder \`feeds\` to prioritize same-origin images.`,
    );
  }

  return patterns;
}

/** Next.js configuration: image remote patterns derived from RSS feed hosts. */
const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    remotePatterns: remotePatternsFromFeeds(feeds),
  },
};

export default nextConfig;
