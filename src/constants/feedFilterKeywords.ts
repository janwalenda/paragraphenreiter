/**
 * Curation keywords for Paragraphenreiter, **per feed language** (`de` / `en`).
 *
 * - German list: e.g. IGH / IStGH (German court acronyms and terms).
 * - English list: ICJ / ICC and related terms, plus a few French labels for
 *   international outlets (e.g. AFP / Le Monde).
 *
 * Matching is case-insensitive (see `src/lib/feedItems.ts`).
 */
export type FeedFilterLang = "de" | "en";

const KEYWORDS_DE = [
  "Völkerrecht",
  "Völkergewohnheitsrecht",
  "IGH",
  "Internationaler Gerichtshof",
  "ICJ",
  "ICC",
  "IStGH",
  "Internationaler Strafgerichtshof",
  "humanitäres Völkerrecht",
  "Kriegsvölkerrecht",
  "UN-Charta",
  "Charta der Vereinten Nationen",
  "Genfer Abkommen",
  "Genfer Konventionen",
  "Staatenimmunität",
  "diplomatische Immunität",
  "EU-Recht",
  "EU-Gesetzgebung",
  "EU-Rechtsprechung",
  "Europäischer Gerichtshof",
  "EuGH"
] as const;

const KEYWORDS_EN = [
  "international law",
  "public international law",
  "customary international law",
  "International Court of Justice",
  "ICJ",
  "World Court",
  "International Criminal Court",
  "ICC",
  "international humanitarian law",
  "IHL",
  "law of armed conflict",
  "laws of war",
  "Geneva Conventions",
  "Geneva Convention",
  "UN Charter",
  "Charter of the United Nations",
  "state immunity",
  "sovereign immunity",
  "diplomatic immunity",
  "Law of the Sea",
  "UNCLOS",
  "United Nations Convention on the Law of the Sea",
  "ITLOS",
  "maritime delimitation",
  "EU law",
  "European Union law",
  "EU legislation",
  "EU case law",
  "Court of Justice of the European Union",
  "CJEU",
  "European Court of Justice",
  "ECJ",
  "Cour internationale de justice",
  "Cour pénale internationale",
  "droit international",
] as const;

/** Keyword phrases grouped by feed language for server-side filtering. */
export const FEED_FILTER_KEYWORDS_BY_LANG: Record<
  FeedFilterLang,
  readonly string[]
> = {
  de: KEYWORDS_DE,
  en: KEYWORDS_EN,
};
