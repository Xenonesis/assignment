import { create } from "zustand"

import type { DashboardFilters, FilterKey, Insight } from "@/src/types"

const emptyMultiFilters: Pick<
  DashboardFilters,
  "end_year" | "topic" | "sector" | "region" | "pestle" | "source" | "swot" | "country" | "city"
> = {
  end_year: [],
  topic: [],
  sector: [],
  region: [],
  pestle: [],
  source: [],
  swot: [],
  country: [],
  city: [],
}

export interface FiltersState extends DashboardFilters {
  setMultiFilter: (key: FilterKey, values: string[]) => void
  setScalarFilter: (
    key:
      | "start_year"
      | "published_year"
      | "min_intensity"
      | "max_intensity"
      | "min_relevance"
      | "max_relevance"
      | "min_likelihood"
      | "max_likelihood"
      | "q",
    value: string | undefined
  ) => void
  setPage: (page: number) => void
  setSort: (sortBy: keyof Insight, sortDir: "asc" | "desc") => void
  hydrate: (filters: Partial<DashboardFilters>) => void
  resetFilters: () => void
}

export const defaultFilters: DashboardFilters = {
  ...emptyMultiFilters,
  page: 1,
  pageSize: 25,
  sortBy: "published",
  sortDir: "desc",
}

export const useFiltersStore = create<FiltersState>((set) => ({
  ...defaultFilters,
  setMultiFilter: (key, values) =>
    set((state) => ({ ...state, [key]: values, page: 1 })),
  setScalarFilter: (key, value) =>
    set((state) => ({ ...state, [key]: value || undefined, page: 1 })),
  setPage: (page) => set({ page }),
  setSort: (sortBy, sortDir) => set({ sortBy, sortDir, page: 1 }),
  hydrate: (filters) => set((state) => ({ ...state, ...filters })),
  resetFilters: () => set(defaultFilters),
}))
