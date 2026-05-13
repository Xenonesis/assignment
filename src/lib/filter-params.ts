import type { DashboardFilters, FilterKey, Insight } from "@/src/types"
import { defaultFilters } from "@/src/store/filters"

export const multiFilterKeys: FilterKey[] = [
  "end_year",
  "topic",
  "sector",
  "region",
  "pestle",
  "source",
  "swot",
  "country",
  "city",
]

export const scalarFilterKeys = [
  "start_year",
  "published_year",
  "min_intensity",
  "max_intensity",
  "min_relevance",
  "max_relevance",
  "min_likelihood",
  "max_likelihood",
  "q",
] as const

export function parseFilters(searchParams: URLSearchParams): DashboardFilters {
  const filters: DashboardFilters = { ...defaultFilters }

  for (const key of multiFilterKeys) {
    filters[key] = splitParam(searchParams.get(key))
  }

  for (const key of scalarFilterKeys) {
    const value = searchParams.get(key)
    if (value) filters[key] = value
  }

  const pageParam = searchParams.get("page")
  const pageSizeParam = searchParams.get("pageSize")
  const page = pageParam ? Number(pageParam) : Number.NaN
  const pageSize = pageSizeParam ? Number(pageSizeParam) : Number.NaN
  const sortBy = searchParams.get("sortBy") as keyof Insight | null
  const sortDir = searchParams.get("sortDir")

  filters.page = Number.isFinite(page) && page > 0 ? page : 1
  filters.pageSize = Number.isFinite(pageSize)
    ? Math.min(Math.max(pageSize, 1), 100)
    : defaultFilters.pageSize
  if (sortBy) filters.sortBy = sortBy
  if (sortDir === "asc" || sortDir === "desc") filters.sortDir = sortDir

  return filters
}

export function filtersToSearchParams(filters: DashboardFilters) {
  const params = new URLSearchParams()

  for (const key of multiFilterKeys) {
    if (filters[key].length > 0) params.set(key, filters[key].join(","))
  }

  for (const key of scalarFilterKeys) {
    const value = filters[key]
    if (value) params.set(key, value)
  }

  if (filters.page !== defaultFilters.page) params.set("page", String(filters.page))
  if (filters.pageSize !== defaultFilters.pageSize) {
    params.set("pageSize", String(filters.pageSize))
  }
  if (filters.sortBy !== defaultFilters.sortBy) params.set("sortBy", String(filters.sortBy))
  if (filters.sortDir !== defaultFilters.sortDir) params.set("sortDir", filters.sortDir)

  return params
}

function splitParam(value: string | null) {
  if (!value) return []
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
}
