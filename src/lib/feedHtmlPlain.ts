/**
 * Turns feed HTML into a short plain-text line for UI snippets.
 * Avoids `dangerouslySetInnerHTML` so malformed RSS markup cannot break the DOM tree
 * (which otherwise causes hydration mismatches on following siblings).
 *
 * @param html - Raw HTML from RSS `content:encoded` / `content` / summary.
 * @param maxChars - Soft cap before adding an ellipsis.
 */
export function htmlToPlainTextSnippet(html: string, maxChars = 480): string {
  if (!html || typeof html !== "string") return "";

  let s = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "");

  s = s
    .replace(/<\/(p|div|h[1-6]|li|tr|blockquote)\s*>/gi, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ");

  s = decodeHtmlEntities(s);
  s = s.replace(/\s+/g, " ").trim();

  if (s.length <= maxChars) return s;
  return `${s.slice(0, maxChars).trimEnd()}…`;
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#(?:039|39);/g, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, n: string) => {
      const code = Number(n);
      return Number.isFinite(code) && code >= 32 && code < 0x11_0000
        ? String.fromCodePoint(code)
        : "";
    })
    .replace(/&#x([\da-f]+);/gi, (_, h: string) => {
      const code = parseInt(h, 16);
      return Number.isFinite(code) && code >= 32 && code < 0x11_0000
        ? String.fromCodePoint(code)
        : "";
    });
}
