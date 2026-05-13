# Global Insights Visualization Dashboard

Production-style analytics dashboard for the assignment `jsondata.json` dataset. The app uses Next.js App Router, TypeScript, Tailwind CSS, shadcn-style primitives, TanStack Query, Zustand, Recharts, Framer Motion, and Supabase PostgreSQL.

## Features

- Supabase-backed `insights` table with setup SQL in `supabase/schema.sql`
- Repeatable JSON import script with numeric, date, empty-value, text, and duplicate cleanup
- Route handlers under `/api` for insights, stats, filters, chart aggregations, and CSV export
- Global filters for year, topic, sector, region, PESTLE, source, SWOT, country, city, metric ranges, published year, and search
- URL-persisted shareable filters
- KPI cards, bar charts, scatter plot, heatmap, timeline with brush zoom, ranked country analytics, treemap, PESTLE donut, source analytics, and insights table
- Dark mode with persisted theme state
- Responsive desktop, tablet, and mobile layout

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Vite-style names are also accepted for local compatibility:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```

3. In Supabase SQL Editor, run:

```sql
-- contents of supabase/schema.sql
```

4. Add the assignment dataset:

```text
data/jsondata.json
```

5. Import data:

```bash
npm run import:data
```

6. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## API Routes

- `GET /api/insights`
- `GET /api/stats`
- `GET /api/filters`
- `GET /api/charts/intensity`
- `GET /api/charts/timeline`
- `GET /api/charts/regions`
- `GET /api/charts/topics`
- `GET /api/charts/source`
- `GET /api/charts/pestle`
- `GET /api/charts/countries`
- `GET /api/charts/sectors`
- `GET /api/charts/scatter`
- `GET /api/export`

Filters use URL query params. Multi-select params are comma-separated, for example `?country=India,United%20States&topic=oil`.

## Verification

```bash
npm run lint
npm run build
```

## Deployment

Deploy the Next.js app on Vercel and configure the same environment variables. Use Supabase Cloud for PostgreSQL and run `supabase/schema.sql` before importing `data/jsondata.json`.
