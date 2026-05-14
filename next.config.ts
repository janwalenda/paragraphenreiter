import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";
import { feeds } from "./src/constants/feeds";

/**
 * Builds `images.remotePatterns` entries from feed URLs so article images can load
 * from each feed host (and a wildcard parent when the host has a subdomain).
 *
 * @param urls - Absolute feed URLs (same list as `src/constants/feeds.ts`).
 */
function remotePatternsFromFeeds(urls: readonly string[]): RemotePattern[] {
  const seen = new Set<string>();
  const patterns: RemotePattern[] = [];

  /** Registers a remote image hostname pattern if not already present. */
  const add = (protocol: "http" | "https", hostname: string) => {
    const key = `${protocol}://${hostname}`;
    if (seen.has(key)) return;
    seen.add(key);
    patterns.push({ protocol, hostname, pathname: "/**" });
  };

  for (const raw of urls) {
    let url: URL;
    try {
      url = new URL(raw);
    } catch {
      continue;
    }

    const protocol = url.protocol === "http:" ? "http" : "https";
    const host = url.hostname;
    add(protocol, host);

    const labels = host.split(".");
    if (labels.length >= 3) {
      add(protocol, `*.${labels.slice(1).join(".")}`);
    }
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
