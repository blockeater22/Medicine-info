# Doctors Hub

India's trusted free medical information platform — medicines, diseases, symptoms, lab tests, calculators, first aid guides, and health articles.

**Domain:** https://doctors-hub.in

## Tech Stack

- Next.js 15 (App Router, Static Export)
- TypeScript
- Tailwind CSS 4
- Shadcn UI (Radix)
- Fuse.js (client-side search)
- Framer Motion
- next-sitemap

## Getting Started

```bash
npm install
npm run dev      # Development server
npm run build    # Static export + sitemap
```

## Project Structure

```
app/           # Next.js App Router pages
components/    # Reusable UI components
lib/           # Data loaders, SEO, search, constants
hooks/         # Custom React hooks
types/         # TypeScript interfaces
utils/         # Helper functions
data/          # JSON content (medicines, diseases, etc.)
public/        # Static assets + search index
scripts/       # Content & search index generators
styles/        # Global CSS
```

## Content

All content is stored as JSON in `data/`. Add new JSON files to generate new static pages automatically via `generateStaticParams`.

Run content generator:
```bash
node scripts/generate-content.js
node scripts/generate-search-index.js
```

## Deployment

Deploy directly to Vercel. Static export outputs to `out/` directory.

Set environment variables:
- `SITE_URL=https://doctors-hub.in`
- `NEXT_PUBLIC_SITE_URL=https://doctors-hub.in`
- `NEXT_PUBLIC_ENABLE_ADS=false` (set `true` after Google AdSense approval)

After AdSense approval, also set:
- `NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-xxxxxxxxxxxxxxxx`
- Optional slot IDs: `NEXT_PUBLIC_AD_SLOT_TOP_BANNER`, `NEXT_PUBLIC_AD_SLOT_SIDEBAR`, etc.

## Scale

Architecture supports 100,000+ pages via JSON data + `generateStaticParams`. No database or backend required.
