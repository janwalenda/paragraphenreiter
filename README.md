# Paragraphenreiter

Next.js web app that loads stories from configured international RSS feeds, filters them by curated keywords, and shows them on the home page plus an **aggregated RSS feed** at `/feed.rss`.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). For correct absolute URLs in the generated RSS, optionally set `NEXT_PUBLIC_SITE_URL` (no trailing slash), e.g. `http://localhost:3000`.

## Stack

- Next.js App Router, React 19, Tailwind CSS v4, daisyUI
- RSS aggregation and filter logic under `src/lib/`
