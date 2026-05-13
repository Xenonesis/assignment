import type { SupabaseClient } from "@supabase/supabase-js"

import type {
  DashboardFilters,
  FilterOptionsResponse,
  Insight,
  NamedMetric,
  StatsResponse,
  TimelinePoint,
} from "@/src/types"
import { multiFilterKeys } from "@/src/lib/filter-params"

const searchableFields = ["title", "insight", "topic", "sector", "region", "country", "source"]

export function applyInsightFilters(
  query: ReturnType<SupabaseClient["from"]> extends { select: infer Select }
    ? ReturnType<Extract<Select, (...args: never[]) => unknown>>
    : never,
  filters: DashboardFilters
) {
  let nextQuery = query

  for (const key of multiFilterKeys) {
    const values = filters[key]
    if (values.length === 0) continue
    if (key === "end_year") {
      nextQuery = nextQuery.in(
        key,
        values.map((value) => Number(value)).filter(Number.isFinite)
      )
    } else {
      nextQuery = nextQuery.in(key, values)
    }
  }

  nextQuery = applyNumberRange(nextQuery, "start_year", filters.start_year, undefined)
  nextQuery = applyNumberRange(nextQuery, "intensity", filters.min_intensity, filters.max_intensity)
  nextQuery = applyNumberRange(nextQuery, "relevance", filters.min_relevance, filters.max_relevance)
  nextQuery = applyNumberRange(nextQuery, "likelihood", filters.min_likelihood, filters.max_likelihood)

  if (filters.published_year) {
    const year = Number(filters.published_year)
    if (Number.isFinite(year)) {
      nextQuery = nextQuery
        .gte("published", `${year}-01-01T00:00:00.000Z`)
        .lte("published", `${year}-12-31T23:59:59.999Z`)
    }
  }

  if (filters.q) {
    const term = filters.q.replaceAll("%", "").replaceAll(",", " ").trim()
    if (term) {
      nextQuery = nextQuery.or(
        searchableFields.map((field) => `${field}.ilike.%${term}%`).join(",")
      )
    }
  }

  return nextQuery
}

export async function fetchInsightsPage(supabase: SupabaseClient, filters: DashboardFilters) {
  const from = (filters.page - 1) * filters.pageSize
  const to = from + filters.pageSize - 1

  let query = supabase.from("insights").select("*", { count: "exact" })
  query = applyInsightFilters(query, filters)
  query = query
    .order(String(filters.sortBy), { ascending: filters.sortDir === "asc", nullsFirst: false })
    .range(from, to)

  const { data, error, count } = await query
  if (error) throw error

  return {
    data: (data || []) as Insight[],
    page: filters.page,
    pageSize: filters.pageSize,
    total: count || 0,
  }
}

export async function fetchFilteredInsights(supabase: SupabaseClient, filters: DashboardFilters) {
  let query = supabase.from("insights").select("*")
  query = applyInsightFilters(query, filters)
  query = query.limit(10000)

  const { data, error } = await query
  if (error) throw error
  return (data || []) as Insight[]
}

export async function fetchFilterOptions(supabase: SupabaseClient): Promise<FilterOptionsResponse> {
  const { data, error } = await supabase
    .from("insights")
    .select("end_year,topic,sector,region,pestle,source,swot,country,city,published,start_year")
    .limit(10000)

  if (error) throw error
  const rows = (data || []) as Insight[]

  return {
    end_year: unique(rows.map((row) => row.end_year)),
    topic: unique(rows.map((row) => row.topic)),
    sector: unique(rows.map((row) => row.sector)),
    region: unique(rows.map((row) => row.region)),
    pestle: unique(rows.map((row) => row.pestle)),
    source: unique(rows.map((row) => row.source)),
    swot: unique(rows.map((row) => row.swot)),
    country: unique(rows.map((row) => row.country)),
    city: unique(rows.map((row) => row.city)),
    published_year: unique(rows.map((row) => yearFromDate(row.published))),
    start_year: unique(rows.map((row) => row.start_year)),
  }
}

export function summarizeStats(rows: Insight[]): StatsResponse {
  return {
    totalRecords: rows.length,
    avgIntensity: average(rows.map((row) => row.intensity)),
    avgLikelihood: average(rows.map((row) => row.likelihood)),
    avgRelevance: average(rows.map((row) => row.relevance)),
    totalCountries: unique(rows.map((row) => row.country)).length,
    totalTopics: unique(rows.map((row) => row.topic)).length,
    totalRegions: unique(rows.map((row) => row.region)).length,
    totalSources: unique(rows.map((row) => row.source)).length,
  }
}

export function aggregateByName(rows: Insight[], key: keyof Insight): NamedMetric[] {
  const buckets = new Map<string, Insight[]>()
  for (const row of rows) {
    const raw = row[key]
    const name = raw == null || raw === "" ? "Unknown" : String(raw)
    buckets.set(name, [...(buckets.get(name) || []), row])
  }

  return Array.from(buckets.entries())
    .map(([name, bucket]) => ({
      name,
      count: bucket.length,
      avgIntensity: average(bucket.map((row) => row.intensity)),
      avgLikelihood: average(bucket.map((row) => row.likelihood)),
      avgRelevance: average(bucket.map((row) => row.relevance)),
    }))
    .sort((a, b) => b.count - a.count)
}

export function aggregateTimeline(rows: Insight[]): TimelinePoint[] {
  const buckets = new Map<number, Insight[]>()
  for (const row of rows) {
    const year = row.end_year || row.start_year || yearFromDate(row.published)
    if (!year) continue
    buckets.set(Number(year), [...(buckets.get(Number(year)) || []), row])
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a - b)
    .map(([year, bucket]) => ({
      year,
      intensity: average(bucket.map((row) => row.intensity)),
      likelihood: average(bucket.map((row) => row.likelihood)),
      relevance: average(bucket.map((row) => row.relevance)),
    }))
}

function applyNumberRange(
  query: ReturnType<SupabaseClient["from"]> extends { select: infer Select }
    ? ReturnType<Extract<Select, (...args: never[]) => unknown>>
    : never,
  field: string,
  min?: string,
  max?: string
) {
  let nextQuery = query
  const minValue = Number(min)
  const maxValue = Number(max)
  if (Number.isFinite(minValue)) nextQuery = nextQuery.gte(field, minValue)
  if (Number.isFinite(maxValue)) nextQuery = nextQuery.lte(field, maxValue)
  return nextQuery
}

function average(values: Array<number | null>) {
  const cleaned = values.filter((value): value is number => typeof value === "number")
  if (cleaned.length === 0) return null
  return Number((cleaned.reduce((sum, value) => sum + value, 0) / cleaned.length).toFixed(2))
}

function unique(values: Array<string | number | null | undefined>) {
  return Array.from(
    new Set(
      values
        .filter((value) => value !== null && value !== undefined && String(value).trim() !== "")
        .map((value) => String(value).trim())
    )
  ).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
}

function yearFromDate(value: string | null | undefined) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date.getUTCFullYear()
}
