# Product Requirements Document (PRD)

# Project Name
Global Insights Visualization Dashboard

---

# 1. Project Overview

Build a production-grade interactive analytics dashboard using the provided `jsondata.json` dataset.

The dashboard must:
- Use Supabase PostgreSQL as the database
- Read and process the provided dataset
- Provide interactive visualizations
- Support advanced filtering
- Generate meaningful insights
- Be fully responsive and modern

The application should resemble professional analytics dashboards such as:
- Tableau
- Power BI
- Stripe Analytics
- Vercel Dashboard

---

# 2. Assignment Objective

Create a visualization dashboard using ONLY the provided JSON dataset.

The dashboard should visualize:
- Intensity
- Likelihood
- Relevance
- Year
- Country
- Topics
- Region
- City
- Sector
- PESTLE
- Source
- SWOT
- Impact

The platform must allow users to:
- Explore data visually
- Filter data dynamically
- Analyze trends
- Compare regions/topics/sectors
- Discover patterns and insights

---

# 3. Tech Stack

## Frontend
- Next.js 14+
- React.js
- TypeScript
- TailwindCSS
- shadcn/ui
- Framer Motion
- Recharts OR D3.js

---

## Backend
Use:
- Next.js API Routes

Optional:
- Supabase Edge Functions

---

## Database
- Supabase PostgreSQL

---

## State Management
- Zustand

---

## Data Fetching
- TanStack Query (React Query)

---

## Form Handling
- React Hook Form

---

# 4. Supabase Configuration

## Database
Use Supabase PostgreSQL.

## Environment Variables

```env id="env-vars"
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
````

---

# 5. Database Schema

## Table Name

`insights`

## SQL Schema

```sql id="schema-sql"
CREATE TABLE insights (
  id BIGSERIAL PRIMARY KEY,

  end_year INT,
  intensity INT,
  sector TEXT,
  topic TEXT,
  insight TEXT,
  url TEXT,
  region TEXT,
  start_year INT,
  impact TEXT,
  added TIMESTAMP,
  published TIMESTAMP,
  country TEXT,
  relevance INT,
  pestle TEXT,
  source TEXT,
  title TEXT,
  likelihood INT,
  city TEXT,
  swot TEXT,

  created_at TIMESTAMP DEFAULT NOW()
);
```

---

# 6. Data Import Requirements

The provided `jsondata.json` must be imported into Supabase.

## Requirements

* Clean invalid values
* Convert numeric fields
* Parse dates properly
* Handle empty strings
* Normalize text values
* Avoid duplicate records

---

# 7. Suggested Data Cleaning Rules

## Numeric Fields

Convert empty values to:

* `null`

Fields:

* intensity
* relevance
* likelihood
* end_year
* start_year

---

## Date Fields

Convert:

* added
* published

To:

* PostgreSQL timestamps

---

## Text Cleanup

* Trim whitespace
* Standardize country names
* Standardize regions

---

# 8. Application Features

# 8.1 Dashboard Homepage

The homepage should contain:

* KPI cards
* Interactive charts
* Filters sidebar
* Analytics tables
* Responsive grid layout

---

# 8.2 KPI Cards

Display:

* Total Records
* Avg Intensity
* Avg Likelihood
* Avg Relevance
* Total Countries
* Total Topics
* Total Regions
* Total Sources

Features:

* Animated counters
* Icons
* Trend indicators

---

# 8.3 Required Charts

## A. Intensity by Sector

### Chart Type

Bar Chart

### X-axis

Sector

### Y-axis

Average Intensity

### Features

* Sorting
* Hover tooltips
* Animated bars
* Dynamic filtering

---

## B. Relevance vs Likelihood

### Chart Type

Scatter Plot

### X-axis

Relevance

### Y-axis

Likelihood

### Bubble Size

Intensity

### Bubble Color

Region OR Sector

---

## C. Topic Frequency Analysis

### Chart Type

Horizontal Bar Chart

### Data

Top topics frequency

---

## D. Region Heatmap

### Chart Type

Heatmap

### Data

Region vs Intensity/Relevance

---

## E. Timeline Trend Analysis

### Chart Type

Line Chart

### X-axis

Year

### Y-axis

Intensity / Likelihood / Relevance

### Features

* Multi-line comparison
* Zoom
* Hover insights

---

## F. Country Analytics

### Chart Type

Geo Map / Choropleth Map

### Data

Country-wise metrics

### Features

* Hover states
* Click-to-filter
* Drill-down support

---

## G. Sector Distribution

### Chart Type

Treemap

### Data

Sector distribution

---

## H. Source Analytics

### Chart Type

Table + Bar Chart

### Columns

* Source
* Total Records
* Avg Relevance
* Avg Likelihood
* Avg Intensity

---

## I. PESTLE Analysis

### Chart Type

Radar Chart OR Donut Chart

### Data

PESTLE distribution

---

# 9. Filters (MANDATORY)

Implement global filters.

## Required Filters

* End Year
* Topics
* Sector
* Region
* PESTLE
* Source
* SWOT
* Country
* City

---

## Advanced Filters

* Intensity Range
* Relevance Range
* Likelihood Range
* Start Year
* Published Year

---

## Filter Features

* Multi-select dropdown
* Search inside dropdown
* Reset filters
* URL persistence
* Real-time updates

---

# 10. Dashboard UX Requirements

## UI Style

Use:

* Modern analytics design
* Dark mode
* Glassmorphism
* Responsive cards
* Smooth animations

---

## Responsive Design

Must support:

* Desktop
* Tablet
* Mobile

---

## Accessibility

Include:

* Keyboard navigation
* ARIA labels
* Proper contrast
* Accessible charts

---

# 11. Backend API Requirements

# API Base Route

`/api`

---

## GET /api/insights

### Purpose

Fetch filtered insights

### Query Params

* country
* topic
* region
* sector
* pestle
* source
* end_year
* city

### Features

* Pagination
* Sorting
* Search

---

## GET /api/stats

Returns:

* Total records
* Average metrics
* Summary analytics

---

## GET /api/filters

Returns:

* Unique countries
* Topics
* Regions
* Sources
* Sectors

---

## GET /api/charts/intensity

Returns aggregated intensity data.

---

## GET /api/charts/timeline

Returns yearly analytics.

---

## GET /api/charts/regions

Returns regional statistics.

---

## GET /api/charts/topics

Returns topic frequency analytics.

---

# 12. Supabase Query Optimization

Use:

* Indexed columns
* Server-side aggregation
* Pagination
* Cached requests

---

## Recommended Indexed Fields

```sql id="indexes"
CREATE INDEX idx_country ON insights(country);
CREATE INDEX idx_topic ON insights(topic);
CREATE INDEX idx_region ON insights(region);
CREATE INDEX idx_sector ON insights(sector);
CREATE INDEX idx_end_year ON insights(end_year);
```

---

# 13. Folder Structure

## Frontend Structure

```bash id="frontend-structure"
src/
├── app/
│   ├── dashboard/
│   ├── api/
│   └── layout.tsx
│
├── components/
│   ├── charts/
│   ├── dashboard/
│   ├── filters/
│   ├── cards/
│   └── ui/
│
├── hooks/
├── services/
├── store/
├── lib/
├── utils/
├── types/
└── styles/
```

---

## Recommended Chart Components

```bash id="charts-folder"
charts/
├── intensity-chart.tsx
├── relevance-scatter.tsx
├── timeline-chart.tsx
├── country-map.tsx
├── topic-bar-chart.tsx
├── region-heatmap.tsx
├── sector-treemap.tsx
└── pestle-chart.tsx
```

---

# 14. Recommended Libraries

## UI

* shadcn/ui
* lucide-react
* framer-motion

---

## Charts

* recharts
  OR
* d3.js

---

## Data

* @supabase/supabase-js
* tanstack/react-query
* axios

---

## Utilities

* date-fns
* clsx
* zod

---

# 15. Dashboard Layout

## Sidebar

Contains:

* Filters
* Navigation
* Theme toggle

---

## Navbar

Contains:

* Search bar
* Export button
* User menu

---

## Main Dashboard

Contains:

* KPI cards
* Charts grid
* Tables
* Analytics panels

---

# 16. Advanced Features (BONUS)

Implement if possible.

## Recommended Bonus Features

* AI-generated insights summary
* CSV export
* PDF export
* Shareable dashboard URLs
* Saved filters
* Fullscreen charts
* Drill-down analytics
* Animated transitions
* Real-time updates

---

# 17. Important Functional Requirements

## Chart Behaviour

* All charts update together
* Filters affect entire dashboard
* Charts support tooltips
* Charts support legends
* Charts support hover states

---

## Performance Requirements

* Lazy-loaded charts
* Skeleton loading states
* Debounced search
* API caching
* Optimized rendering

---

# 18. Error Handling

Must include:

* API error states
* Empty chart states
* No-data UI
* Retry functionality

---

# 19. Loading States

Use:

* Skeleton loaders
* Animated placeholders
* Progressive loading

---

# 20. Dark Mode Requirements

Implement:

* Theme toggle
* Persistent theme state
* Proper contrast ratios

---

# 21. Deployment

## Frontend

Deploy on:

* Vercel

---

## Database

* Supabase Cloud

---

# 22. README Requirements

README must include:

* Project overview
* Tech stack
* Setup guide
* Environment variables
* Supabase setup
* Deployment instructions
* Screenshots
* Features list

---

# 23. Suggested Development Workflow

## Phase 1

* Setup Next.js project
* Configure Tailwind
* Configure Supabase

---

## Phase 2

* Import JSON dataset
* Create database schema

---

## Phase 3

* Build APIs
* Create reusable queries

---

## Phase 4

* Build dashboard layout
* Add filters

---

## Phase 5

* Build charts
* Connect live data

---

## Phase 6

* Add animations
* Optimize performance

---

## Phase 7

* Testing
* Deployment
* Documentation

---

# 24. Design Inspiration

Use inspiration from:

* Stripe Analytics
* Tableau
* Linear
* Vercel Dashboard
* Power BI

---

# 25. AI Editor Instructions

IMPORTANT:

Build this project as production-grade software.

Requirements:

* Use clean architecture
* Use reusable components
* Use TypeScript everywhere
* Use server-side aggregations
* Avoid unnecessary re-renders
* Create optimized Supabase queries
* Ensure responsive design
* Use modern UI patterns
* Create scalable folder structure
* Maintain clean code quality
* Use proper loading/error states
* Do not use mock data
* Use ONLY provided dataset
