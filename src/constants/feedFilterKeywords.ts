/**
 * Curation keywords for Paragraphenreiter, **per feed language** (`de` / `en` / `fr`).
 *
 * - German list: IGH / IStGH, ILO / labour, EU law (German labels).
 * - English list: ICJ / ICC, IHL, UNCLOS, ILO, EU law (English), plus a few French labels
 *   for mixed-language international copy.
 * - French list: CPI / CIJ, droit international, OIT, droit de l’UE (French labels).
 *
 * Matching is case-insensitive (see `src/lib/feedItems.ts`).
 */
export type FeedFilterLang = "de" | "en" | "fr";

/** Display / filter order for language buckets in the UI. */
export const FEED_FILTER_LANG_ORDER = ["de", "en", "fr"] as const satisfies readonly FeedFilterLang[];

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
  "EuGH",
  "Internationale Arbeitsorganisation",
  "ILO",
  "ILO-Übereinkommen",
  "ILO-Konvention",
  "Kernarbeitsnormen",
  "Arbeitsnormen der ILO",
  "Tripartismus",
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
  "International Labour Organization",
  "International Labor Organization",
  "ILO",
  "ILO Convention",
  "ILO Conventions",
  "ILO convention",
  "core labour standards",
  "core labor standards",
  "decent work",
  "tripartism",
  "Cour internationale de justice",
  "Cour pénale internationale",
  "droit international",
] as const;

const KEYWORDS_FR = [
  "droit international",
  "droit international public",
  "droit coutumier international",
  "Cour internationale de justice",
  "CIJ",
  "Cour mondiale",
  "Cour pénale internationale",
  "CPI",
  "droit international humanitaire",
  "DIH",
  "droit des conflits armés",
  "lois de la guerre",
  "Conventions de Genève",
  "Convention de Genève",
  "Charte des Nations unies",
  "Charte de l'Organisation des Nations unies",
  "immunité des États",
  "immunité souveraine",
  "immunité diplomatique",
  "droit de la mer",
  "Convention des Nations unies sur le droit de la mer",
  "CNUDM",
  "Tribunal international du droit de la mer",
  "TIDM",
  "délimitation maritime",
  "droit de l'Union européenne",
  "droit de l'Union",
  "législation de l'Union européenne",
  "jurisprudence de l'Union européenne",
  "Cour de justice de l'Union européenne",
  "CJUE",
  "Cour de justice des Communautés européennes",
  "Organisation internationale du Travail",
  "OIT",
  "Convention de l'OIT",
  "Conventions de l'OIT",
  "normes fondamentales du travail",
  "travail décent",
  "tripartisme",
] as const;

/** Keyword phrases grouped by feed language for server-side filtering. */
export const FEED_FILTER_KEYWORDS_BY_LANG: Record<
  FeedFilterLang,
  readonly string[]
> = {
  de: KEYWORDS_DE,
  en: KEYWORDS_EN,
  fr: KEYWORDS_FR,
};
