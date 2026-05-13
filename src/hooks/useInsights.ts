import { useQuery } from '@tanstack/react-query';
import { useShallow } from "zustand/react/shallow"
import { useFiltersStore } from '../store/filters';
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

export function useDashboardData() {
  const filters = useDashboardFilters()

  return {
    filters,
    insights: useQuery({
      queryKey: ["insights", filters],
      queryFn: () => fetchInsights(filters),
    }),
    stats: useQuery({
      queryKey: ["stats", filters],
      queryFn: () => fetchStats(filters),
    }),
    filterOptions: useQuery({
      queryKey: ["filters"],
      queryFn: fetchFilterOptions,
      staleTime: 5 * 60 * 1000,
    }),
    intensity: useQuery({
      queryKey: ["chart", "intensity", filters],
      queryFn: () => fetchNamedChart("intensity", filters),
    }),
    topics: useQuery({
      queryKey: ["chart", "topics", filters],
      queryFn: () => fetchNamedChart("topics", filters),
    }),
    regions: useQuery({
      queryKey: ["chart", "regions", filters],
      queryFn: () => fetchNamedChart("regions", filters),
    }),
    timeline: useQuery({
      queryKey: ["chart", "timeline", filters],
      queryFn: () => fetchTimeline(filters),
    }),
    sources: useQuery({
      queryKey: ["chart", "source", filters],
      queryFn: () => fetchNamedChart("source", filters),
    }),
    pestle: useQuery({
      queryKey: ["chart", "pestle", filters],
      queryFn: () => fetchNamedChart("pestle", filters),
    }),
    countries: useQuery({
      queryKey: ["chart", "countries", filters],
      queryFn: () => fetchNamedChart("countries", filters),
    }),
    sectors: useQuery({
      queryKey: ["chart", "sectors", filters],
      queryFn: () => fetchNamedChart("sectors", filters),
    }),
    scatter: useQuery({
      queryKey: ["chart", "scatter", filters],
      queryFn: () => fetchScatter(filters),
    }),
  }
}
