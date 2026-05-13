export interface Insight {
  id: number;
  end_year: number | null;
  intensity: number | null;
  sector: string;
  topic: string;
  insight: string;
  url: string;
  region: string;
  start_year: number | null;
  impact: string;
  added: string;
  published: string;
  country: string;
  relevance: number | null;
  pestle: string;
  source: string;
  title: string;
  likelihood: number | null;
  city: string;
  swot: string;
  created_at: string;
}

export type FilterKey =
  | "end_year"
  | "topic"
  | "sector"
  | "region"
  | "pestle"
  | "source"
  | "swot"
  | "country"
  | "city";

export type MetricKey = "intensity" | "likelihood" | "relevance";

export interface DashboardFilters {
  end_year: string[];
  topic: string[];
  sector: string[];
  region: string[];
  pestle: string[];
  source: string[];
  swot: string[];
  country: string[];
  city: string[];
  start_year?: string;
  published_year?: string;
  min_intensity?: string;
  max_intensity?: string;
  min_relevance?: string;
  max_relevance?: string;
  min_likelihood?: string;
  max_likelihood?: string;
  q?: string;
  page: number;
  pageSize: number;
  sortBy: keyof Insight;
  sortDir: "asc" | "desc";
}

export interface StatsResponse {
  totalRecords: number;
  avgIntensity: number | null;
  avgLikelihood: number | null;
  avgRelevance: number | null;
  totalCountries: number;
  totalTopics: number;
  totalRegions: number;
  totalSources: number;
}

export interface FilterOptionsResponse {
  end_year: string[];
  topic: string[];
  sector: string[];
  region: string[];
  pestle: string[];
  source: string[];
  swot: string[];
  country: string[];
  city: string[];
  published_year: string[];
  start_year: string[];
}

export interface InsightsResponse {
  data: Insight[];
  page: number;
  pageSize: number;
  total: number;
}

export interface NamedMetric {
  name: string;
  count: number;
  avgIntensity: number | null;
  avgLikelihood: number | null;
  avgRelevance: number | null;
}

export interface TimelinePoint {
  year: number;
  intensity: number | null;
  likelihood: number | null;
  relevance: number | null;
}
