/**
 * Configured RSS/Atom feed URLs (also drives `remotePatterns` in `next.config.ts`).
 */
export const feeds = [
  "https://www.lto.de/rss/feed.xml?tx_ltorss_pi1[rechtsgebiet]=08",
  "https://www.spiegel.de/schlagzeilen/tops/index.rss",
  "https://www.tagesschau.de/index~rss2.xml",
  "https://www.spiegel.de/schlagzeilen/index.rss",
  "https://www.lemonde.fr/rss/une.xml",
  "https://www.lemonde.fr/en/rss/une.xml",
  "https://feeds.bbci.co.uk/news/world/rss.xml",
  "https://www.theguardian.com/world/rss",
  "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
  "https://www.aljazeera.com/xml/rss/all.xml",
  "https://rss.dw.com/xml/rss-en-world",
  "https://www.france24.com/en/rss",
  "https://www.euronews.com/rss?format=mrss&level=theme&name=news",
  "https://www.972mag.com/feed/",
  "https://www.japantimes.co.jp/feed/",
  "https://www.al-monitor.com/rss",
  "https://news.un.org/feed/subscribe/en/news/topic/law-and-crime-prevention/rss.xml",
  /** BBC ICC topic feed: official `icc-cpi.int` RSS often returns 403 for server requests (Cloudflare). */
  "https://feeds.bbci.co.uk/news/topics/cjnwl8q4xdet/rss.xml",
  "https://www.hrw.org/rss/news"
] as const;
