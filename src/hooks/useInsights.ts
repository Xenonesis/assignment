import { useQuery } from '@tanstack/react-query';
import { useShallow } from "zustand/react/shallow"
import { useFiltersStore } from '../store/filters';
import type { DashboardInitialData } from "@/src/types"
import {
  fetchFilterOptions,
  fetchInsights,
  fetchNamedChart,
  fetchScatter,
  fetchStats,
  fetchTimeline,
} from "@/src/services/api"

export function useInsights() {
  const filters = useDashboardFilters()

  return useQuery({
    queryKey: ['insights', filters],
    queryFn: () => fetchInsights(filters),
  });
}

export function useDashboardFilters() {
  return useFiltersStore(
    useShallow((state) => ({
      end_year: state.end_year,
      topic: state.topic,
      sector: state.sector,
      region: state.region,
      pestle: state.pestle,
      source: state.source,
      swot: state.swot,
      country: state.country,
      city: state.city,
      start_year: state.start_year,
      published_year: state.published_year,
      min_intensity: state.min_intensity,
      max_intensity: state.max_intensity,
      min_relevance: state.min_relevance,
      max_relevance: state.max_relevance,
      min_likelihood: state.min_likelihood,
      max_likelihood: state.max_likelihood,
      q: state.q,
      page: state.page,
      pageSize: state.pageSize,
      sortBy: state.sortBy,
      sortDir: state.sortDir,
    }))
  )
}

export function useDashboardData(initialData?: DashboardInitialData) {
  const filters = useDashboardFilters()

  return {
    filters,
    insights: useQuery({
      queryKey: ["insights", filters],
      queryFn: () => fetchInsights(filters),
      initialData: initialData?.insights,
      staleTime: initialData ? 30 * 1000 : 0,
    }),
    stats: useQuery({
      queryKey: ["stats", filters],
      queryFn: () => fetchStats(filters),
      initialData: initialData?.stats,
      staleTime: initialData ? 30 * 1000 : 0,
    }),
    filterOptions: useQuery({
      queryKey: ["filters"],
      queryFn: fetchFilterOptions,
      initialData: initialData?.filterOptions,
      staleTime: 5 * 60 * 1000,
    }),
    intensity: useQuery({
      queryKey: ["chart", "intensity", filters],
      queryFn: () => fetchNamedChart("intensity", filters),
      initialData: initialData?.intensity,
      staleTime: initialData ? 30 * 1000 : 0,
    }),
    topics: useQuery({
      queryKey: ["chart", "topics", filters],
      queryFn: () => fetchNamedChart("topics", filters),
      initialData: initialData?.topics,
      staleTime: initialData ? 30 * 1000 : 0,
    }),
    regions: useQuery({
      queryKey: ["chart", "regions", filters],
      queryFn: () => fetchNamedChart("regions", filters),
      initialData: initialData?.regions,
      staleTime: initialData ? 30 * 1000 : 0,
    }),
    timeline: useQuery({
      queryKey: ["chart", "timeline", filters],
      queryFn: () => fetchTimeline(filters),
      initialData: initialData?.timeline,
      staleTime: initialData ? 30 * 1000 : 0,
    }),
    sources: useQuery({
      queryKey: ["chart", "source", filters],
      queryFn: () => fetchNamedChart("source", filters),
      initialData: initialData?.sources,
      staleTime: initialData ? 30 * 1000 : 0,
    }),
    pestle: useQuery({
      queryKey: ["chart", "pestle", filters],
      queryFn: () => fetchNamedChart("pestle", filters),
      initialData: initialData?.pestle,
      staleTime: initialData ? 30 * 1000 : 0,
    }),
    countries: useQuery({
      queryKey: ["chart", "countries", filters],
      queryFn: () => fetchNamedChart("countries", filters),
      initialData: initialData?.countries,
      staleTime: initialData ? 30 * 1000 : 0,
    }),
    sectors: useQuery({
      queryKey: ["chart", "sectors", filters],
      queryFn: () => fetchNamedChart("sectors", filters),
      initialData: initialData?.sectors,
      staleTime: initialData ? 30 * 1000 : 0,
    }),
    scatter: useQuery({
      queryKey: ["chart", "scatter", filters],
      queryFn: () => fetchScatter(filters),
      initialData: initialData?.scatter,
      staleTime: initialData ? 30 * 1000 : 0,
    }),
  }
}
