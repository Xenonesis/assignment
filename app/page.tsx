import { Suspense } from "react";

import { Dashboard } from "@/components/dashboard/dashboard";
import {
  aggregateByName,
  aggregateTimeline,
  fetchFilterOptions,
  fetchFilteredInsights,
  fetchInsightsPage,
  summarizeStats,
} from "@/lib/insights-query";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { parseFilters } from "@/src/lib/filter-params";
import type { DashboardInitialData } from "@/src/types";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const filters = parseFilters(toURLSearchParams(await searchParams));
  const supabase = createServerSupabaseClient();
  const rowsPromise = fetchFilteredInsights(supabase, filters);
  const [insights, filterOptions, rows] = await Promise.all([
    fetchInsightsPage(supabase, filters),
    fetchFilterOptions(supabase),
    rowsPromise,
  ]);
  const initialData: DashboardInitialData = {
    insights,
    stats: summarizeStats(rows),
    filterOptions,
    intensity: aggregateByName(rows, "sector").slice(0, 15),
    topics: aggregateByName(rows, "topic").slice(0, 15),
    regions: aggregateByName(rows, "region").slice(0, 15),
    timeline: aggregateTimeline(rows),
    sources: aggregateByName(rows, "source").slice(0, 15),
    pestle: aggregateByName(rows, "pestle").slice(0, 15),
    countries: aggregateByName(rows, "country").slice(0, 15),
    sectors: aggregateByName(rows, "sector").slice(0, 15),
    scatter: rows
      .filter((row) => row.relevance !== null && row.likelihood !== null)
      .slice(0, 500)
      .map((row) => ({
        id: row.id,
        title: row.title || row.insight || "Untitled insight",
        relevance: row.relevance || 0,
        likelihood: row.likelihood || 0,
        intensity: row.intensity || 1,
        region: row.region || "Unknown",
        sector: row.sector || "Unknown",
      })),
  };

  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">Loading dashboard...</div>}>
      <Dashboard initialData={initialData} initialFilters={filters} />
    </Suspense>
  );
}

function toURLSearchParams(searchParams: { [key: string]: string | string[] | undefined }) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      params.set(key, value.join(","));
    } else if (value) {
      params.set(key, value);
    }
  }
  return params;
}
