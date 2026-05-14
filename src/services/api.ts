import type {
  DashboardFilters,
  FilterOptionsResponse,
  InsightsResponse,
  NamedMetric,
  ScatterPoint,
  StatsResponse,
  TimelinePoint,
} from "@/src/types"
import { filtersToSearchParams } from "@/src/lib/filter-params"

export function toQueryString(filters: DashboardFilters) {
  const query = filtersToSearchParams(filters).toString()
  return query ? `?${query}` : ""
}

export async function fetchInsights(filters: DashboardFilters): Promise<InsightsResponse> {
  return fetchJson(`/api/insights${toQueryString(filters)}`)
}

export async function fetchStats(filters: DashboardFilters): Promise<StatsResponse> {
  return fetchJson(`/api/stats${toQueryString(filters)}`)
}

export async function fetchFilterOptions(): Promise<FilterOptionsResponse> {
  return fetchJson("/api/filters")
}

export async function fetchNamedChart(
  endpoint: string,
  filters: DashboardFilters
): Promise<NamedMetric[]> {
  return fetchJson(`/api/charts/${endpoint}${toQueryString(filters)}`)
}

export async function fetchTimeline(filters: DashboardFilters): Promise<TimelinePoint[]> {
  return fetchJson(`/api/charts/timeline${toQueryString(filters)}`)
}

export async function fetchScatter(filters: DashboardFilters) {
  return fetchJson<ScatterPoint[]>(`/api/charts/scatter${toQueryString(filters)}`)
}

export async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  })
  const payload = await response.json()
  if (!response.ok) {
    throw new Error(payload.error || "Request failed")
  }
  return payload
}
