/**
 * Configured RSS/Atom feed URLs (also drives `remotePatterns` in `next.config.ts`).
 * Order: German → French → English/world → other languages → law & policy → prior picks.
 * Note: Many outlets dropped or restricted RSS; Reuters is included via a generated rss.app feed.
 */
export const feeds = [
  // —— German ——
  "https://www.lto.de/rss/feed.xml?tx_ltorss_pi1[rechtsgebiet]=08",
  "https://www.tagesschau.de/xml/rss2/",
  "https://www.spiegel.de/schlagzeilen/tops/index.rss",
  "https://www.spiegel.de/schlagzeilen/index.rss",
  "https://www.spiegel.de/international/index.rss",
  "https://newsfeed.zeit.de/index",
  "https://www.faz.net/rss/aktuell/politik/ausland/",
  "https://rss.sueddeutsche.de/rss/Politik",
  "https://taz.de/!p4608;rss",
  "https://rss.dw.com/rdf/rss-de-all",
  "https://www.n-tv.de/politik/rss",
  "https://www.welt.de/feeds/latest.rss",
  "https://www.jungewelt.de/feeds/newsticker.rss",
  "https://www.telepolis.de/news-atom.xml",
  "https://jacobin.de/rss.xml",
  "https://www.rosalux.de/publication_rss.xml",
  "https://www.rosalux.de/documentation_rss.xml",
  "https://www.nd-aktuell.de/rss/neues-deutschland.xml",
  "https://www.freitag.de/@@RSS",
  "https://www.surplusmagazin.de/rss/",

  // —— French ——
  "https://www.lemonde.fr/rss/une.xml",
  "https://www.lemonde.fr/en/rss/une.xml",
  "https://www.lemonde.fr/international/rss_full.xml",
  "https://mondediplo.com/backend",
  "https://www.liberation.fr/arc/outboundfeeds/rss/category/international/",
  "https://www.lefigaro.fr/rss/figaro_international.xml",
  "https://www.mediapart.fr/articles/feed",
  "https://www.humanite.fr/rss/actu.rss",

  // —— English-language / international ——
  "https://feeds.bbci.co.uk/news/world/rss.xml",
  "https://www.theguardian.com/world/rss",
  "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
  /** Official Reuters RSS discontinued; generated feed (rss.app). */
  "https://rss.app/feeds/o7tC18LHQHyrXOHI.xml",
  "https://feeds.washingtonpost.com/rss/world",
  "http://rss.cnn.com/rss/edition_world.rss",
  "https://feeds.npr.org/1004/rss.xml",
  "https://www.aljazeera.com/xml/rss/all.xml",
  "https://www.france24.com/en/rss",
  "https://feeds.skynews.com/feeds/rss/world.xml",
  "https://www.rfi.fr/en/international/rss",
  "https://rss.dw.com/xml/rss-en-world",
  "https://rss.dw.com/rdf/rss-en-all",
  "https://feeds.feedburner.com/time/world",
  "https://www.politico.eu/feed/",
  "https://www.economist.com/the-world-this-week/rss.xml",
  "https://www.euronews.com/rss?format=mrss&level=theme&name=news",
  "https://jacobin.com/feed/",
  "https://www.thenation.com/feed/",
  "https://truthout.org/feed/",
  "https://www.motherjones.com/feed/",
  "https://www.commondreams.org/feeds/feed.rss",

  // —— Italian & Spanish ——
  "https://xml2.corriereobjects.it/rss/esteri.xml",
  "https://www.repubblica.it/rss/esteri/rss2.0.xml",
  "https://www.ilsole24ore.com/rss/mondo.xml",
  "https://www.ansa.it/sito/notizie/mondo/mondo_rss.xml",
  "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/internacional/portada",
  "https://e00-elmundo.uecdn.es/elmundo/rss/internacional.xml",

  // —— Global / non-Western English ——
  "https://www.chinadaily.com.cn/rss/world_rss.xml",
  "https://tass.com/rss/v2.xml",
  "https://www.thehindu.com/news/international/feeder/default.rss",
  "https://timesofindia.indiatimes.com/rssfeeds/296589292.cms",
  "https://www.haaretz.com/cmlink/1.628752",
  "https://www.middleeasteye.net/rss",
  "https://www.japantimes.co.jp/feed/",
  "https://theprint.in/feed/",

  // —— Law, foreign policy, commentary ——
  "https://foreignpolicy.com/feed/",
  "https://www.foreignaffairs.com/rss.xml",
  "https://www.opendemocracy.net/feed",
  "https://jacobin.com/feed",
  "https://globalvoices.org/feed/",
  "https://www.ejiltalk.org/feed/",

  // —— Already in use (ICC proxy, rights, regional) ——
  /** BBC ICC topic: official `icc-cpi.int` RSS often 403 for server requests (Cloudflare). */
  "https://feeds.bbci.co.uk/news/topics/cjnwl8q4xdet/rss.xml",
  "https://www.972mag.com/feed/",
  "https://www.al-monitor.com/rss",
  "https://news.un.org/feed/subscribe/en/news/topic/law-and-crime-prevention/rss.xml",
  "https://www.hrw.org/rss/news",
] as const;
