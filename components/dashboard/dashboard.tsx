"use client"

import type { ReactNode } from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { useShallow } from "zustand/react/shallow"
import {
  Bar,
  BarChart,
  Brush,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  Treemap,
  XAxis,
  YAxis,
} from "recharts"
import {
  Activity,
  BarChart3,
  Database,
  Download,
  Globe2,
  Moon,
  RefreshCcw,
  Search,
  Share2,
  SlidersHorizontal,
  Sun,
} from "lucide-react"

import { MultiSelectFilter } from "@/components/dashboard/multi-select-filter"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { useDashboardData } from "@/src/hooks/useInsights"
import { filtersToSearchParams, parseFilters } from "@/src/lib/filter-params"
import { useFiltersStore } from "@/src/store/filters"
import type { DashboardFilters, DashboardInitialData, FilterKey, NamedMetric, StatsResponse } from "@/src/types"
import { toQueryString } from "@/src/services/api"

const chartColors = ["#38bdf8", "#34d399", "#f59e0b", "#f472b6", "#a78bfa", "#f87171"]

const filterLabels: Array<{ key: FilterKey; label: string }> = [
  { key: "end_year", label: "End Year" },
  { key: "topic", label: "Topics" },
  { key: "sector", label: "Sector" },
  { key: "region", label: "Region" },
  { key: "pestle", label: "PESTLE" },
  { key: "source", label: "Source" },
  { key: "swot", label: "SWOT" },
  { key: "country", label: "Country" },
  { key: "city", label: "City" },
]

export function Dashboard({
  initialData,
  initialFilters,
}: {
  initialData?: DashboardInitialData
  initialFilters?: DashboardFilters
}) {
  useState(() => {
    if (initialFilters) useFiltersStore.setState((state) => ({ ...state, ...initialFilters }))
    return true
  })
  const router = useRouter()
  const searchParams = useSearchParams()
  const store = useFiltersStore(
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
      setMultiFilter: state.setMultiFilter,
      setScalarFilter: state.setScalarFilter,
      setPage: state.setPage,
      hydrate: state.hydrate,
      resetFilters: state.resetFilters,
    }))
  )
  const setScalarFilter = useFiltersStore((state) => state.setScalarFilter)
  const data = useDashboardData(initialData)
  const hasHydrated = useRef(false)
  const [theme, setTheme] = useState<"dark" | "light">("dark")
  const [searchDraft, setSearchDraft] = useState(store.q || "")

  useEffect(() => {
    if (hasHydrated.current) return
    hasHydrated.current = true
    store.hydrate(parseFilters(searchParams))
  }, [searchParams, store])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const storedTheme = window.localStorage.getItem("theme")
      if (storedTheme === "dark" || storedTheme === "light") {
        setTheme(storedTheme)
      }
    }, 0)

    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  useEffect(() => {
    const next = filtersToSearchParams(data.filters).toString()
    const current = searchParams.toString()
    if (next !== current) router.replace(next ? `/?${next}` : "/", { scroll: false })
  }, [data.filters, router, searchParams])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setScalarFilter("q", searchDraft)
    }, 350)
    return () => window.clearTimeout(timer)
  }, [searchDraft, setScalarFilter])

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark"
    setTheme(next)
    window.localStorage.setItem("theme", next)
  }

  const anyError = [
    data.insights.error,
    data.stats.error,
    data.filterOptions.error,
    data.intensity.error,
    data.topics.error,
    data.regions.error,
    data.timeline.error,
    data.sources.error,
    data.pestle.error,
    data.countries.error,
    data.sectors.error,
    data.scatter.error,
  ].find(Boolean)

  const filterOptions = data.filterOptions.data
  const insights = data.insights.data
  const stats = data.stats.data

  const statsLoading = data.stats.isLoading && !stats

  const activeFilterCount = useMemo(() => {
    return filterLabels.reduce((count, item) => count + store[item.key].length, 0)
  }, [store])

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-border bg-sidebar/80 p-4 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:w-80 lg:overflow-y-auto lg:border-b-0 lg:border-r">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Global</p>
              <h1 className="text-xl font-semibold">Insights Dashboard</h1>
            </div>
            <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggleTheme}>
              {theme === "dark" ? <Sun /> : <Moon />}
            </Button>
          </div>

          <div className="mb-4 rounded-lg border border-border bg-background/50 p-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium">
              <SlidersHorizontal className="size-4" />
              Global filters
            </div>
            <p className="text-xs text-muted-foreground">
              {activeFilterCount} selected filters affect every panel.
            </p>
          </div>

          <div className="space-y-2">
            {filterLabels.map(({ key, label }) => (
              <MultiSelectFilter
                key={key}
                label={label}
                values={filterOptions?.[key] || []}
                selected={store[key]}
                onChange={(values) => store.setMultiFilter(key, values)}
              />
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <Input
              aria-label="Start year"
              placeholder="Start year"
              value={store.start_year || ""}
              onChange={(event) => store.setScalarFilter("start_year", event.target.value)}
            />
            <Input
              aria-label="Published year"
              placeholder="Published year"
              value={store.published_year || ""}
              onChange={(event) => store.setScalarFilter("published_year", event.target.value)}
            />
            <Input
              aria-label="Minimum intensity"
              placeholder="Min intensity"
              value={store.min_intensity || ""}
              onChange={(event) => store.setScalarFilter("min_intensity", event.target.value)}
            />
            <Input
              aria-label="Maximum intensity"
              placeholder="Max intensity"
              value={store.max_intensity || ""}
              onChange={(event) => store.setScalarFilter("max_intensity", event.target.value)}
            />
            <Input
              aria-label="Minimum relevance"
              placeholder="Min relevance"
              value={store.min_relevance || ""}
              onChange={(event) => store.setScalarFilter("min_relevance", event.target.value)}
            />
            <Input
              aria-label="Maximum relevance"
              placeholder="Max relevance"
              value={store.max_relevance || ""}
              onChange={(event) => store.setScalarFilter("max_relevance", event.target.value)}
            />
            <Input
              aria-label="Minimum likelihood"
              placeholder="Min likelihood"
              value={store.min_likelihood || ""}
              onChange={(event) => store.setScalarFilter("min_likelihood", event.target.value)}
            />
            <Input
              aria-label="Maximum likelihood"
              placeholder="Max likelihood"
              value={store.max_likelihood || ""}
              onChange={(event) => store.setScalarFilter("max_likelihood", event.target.value)}
            />
          </div>

          <Button variant="outline" className="mt-4 w-full" onClick={store.resetFilters}>
            <RefreshCcw />
            Reset filters
          </Button>
        </aside>

        <section className="flex-1 p-4 sm:p-6">
          <header className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Market signals and trends</h2>
              <p className="text-sm text-muted-foreground">
                Interactive analytics from the Supabase insights dataset.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative min-w-64">
                <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  aria-label="Search dashboard"
                  className="pl-9"
                  placeholder="Search insights"
                  value={searchDraft}
                  onChange={(event) => setSearchDraft(event.target.value)}
                />
              </label>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href)
                }}
              >
                <Share2 />
                Share
              </Button>
              <a className={buttonVariants()} href={`/api/export${toQueryString(data.filters)}`}>
                <Download />
                CSV
              </a>
            </div>
          </header>

          {anyError ? (
            <Card className="mb-4 border-destructive/30 bg-destructive/10">
              <CardContent>
                <p className="font-medium text-destructive">Dashboard data could not load.</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {anyError instanceof Error ? anyError.message : "Check Supabase settings and table setup."}
                </p>
              </CardContent>
            </Card>
          ) : null}

          <KpiGrid stats={stats} loading={statsLoading} />

          <div className="mt-4 grid gap-4 xl:grid-cols-12">
            <ChartCard className="xl:col-span-7" title="Intensity by Sector" description="Average intensity, sorted by record volume">
              <ResponsiveBar data={data.intensity.data || []} dataKey="avgIntensity" />
            </ChartCard>
            <ChartCard className="xl:col-span-5" title="Relevance vs Likelihood" description="Bubble size reflects intensity">
              <ResponsiveContainer width="100%" height={310}>
                <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="relevance" name="Relevance" type="number" />
                  <YAxis dataKey="likelihood" name="Likelihood" type="number" />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                  <Scatter data={data.scatter.data || []} fill="#38bdf8" />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard className="xl:col-span-6" title="Topic Frequency" description="Top topics by record count">
              <ResponsiveBar data={data.topics.data || []} dataKey="count" layout="vertical" />
            </ChartCard>
            <ChartCard className="xl:col-span-6" title="Region Heatmap" description="Region intensity and relevance">
              <RegionHeatmap rows={data.regions.data || []} />
            </ChartCard>

            <ChartCard className="xl:col-span-8" title="Timeline Trend Analysis" description="Intensity, likelihood, and relevance over time">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={data.timeline.data || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="intensity" stroke="#38bdf8" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="likelihood" stroke="#34d399" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="relevance" stroke="#f59e0b" strokeWidth={2} dot={false} />
                  <Brush height={24} stroke="#38bdf8" />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard className="xl:col-span-4" title="PESTLE Analysis" description="Distribution by PESTLE category">
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={data.pestle.data || []}
                    dataKey="count"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={2}
                  >
                    {(data.pestle.data || []).map((entry, index) => (
                      <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard className="xl:col-span-4" title="Country Analytics" description="Top countries by record count">
              <RankedList rows={data.countries.data || []} />
            </ChartCard>
            <ChartCard className="xl:col-span-4" title="Sector Distribution" description="Treemap by sector volume">
              <ResponsiveContainer width="100%" height={320}>
                <Treemap
                  data={(data.sectors.data || []).slice(0, 18).map((row) => ({ ...row }))}
                  dataKey="count"
                  nameKey="name"
                  stroke="var(--background)"
                  fill="#34d399"
                />
              </ResponsiveContainer>
            </ChartCard>
            <ChartCard className="xl:col-span-4" title="Source Analytics" description="Source records and average relevance">
              <SourceAnalytics rows={data.sources.data || []} />
            </ChartCard>
          </div>

          <InsightsTable
            loading={data.insights.isLoading && !insights}
            rows={insights?.data || []}
            total={insights?.total || 0}
            page={store.page}
            pageSize={store.pageSize}
            onPageChange={store.setPage}
          />
        </section>
      </div>
    </main>
  )
}

function KpiGrid({ stats, loading }: { stats?: StatsResponse; loading: boolean }) {
  const items = [
    { label: "Total Records", value: stats?.totalRecords, icon: Database },
    { label: "Avg Intensity", value: stats?.avgIntensity, icon: Activity },
    { label: "Avg Likelihood", value: stats?.avgLikelihood, icon: BarChart3 },
    { label: "Avg Relevance", value: stats?.avgRelevance, icon: BarChart3 },
    { label: "Countries", value: stats?.totalCountries, icon: Globe2 },
    { label: "Topics", value: stats?.totalTopics, icon: BarChart3 },
    { label: "Regions", value: stats?.totalRegions, icon: Globe2 },
    { label: "Sources", value: stats?.totalSources, icon: Database },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item, index) => {
        const Icon = item.icon
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
          >
            <Card>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold">
                    {loading ? "..." : item.value ?? "0"}
                  </p>
                </div>
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Icon className="size-5" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

function ChartCard({
  title,
  description,
  className,
  children,
}: {
  title: string
  description: string
  className?: string
  children: ReactNode
}) {
  return (
    <Card className={cn("min-h-[380px]", className)}>
      <CardHeader>
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription className="mt-1">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function ResponsiveBar({
  data,
  dataKey,
  layout,
}: {
  data: NamedMetric[]
  dataKey: "count" | "avgIntensity" | "avgLikelihood" | "avgRelevance"
  layout?: "horizontal" | "vertical"
}) {
  if (data.length === 0) return <EmptyState />

  return (
    <ResponsiveContainer width="100%" height={310}>
      <BarChart data={data} layout={layout} margin={{ left: layout === "vertical" ? 48 : 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis type={layout === "vertical" ? "number" : "category"} dataKey={layout === "vertical" ? undefined : "name"} tick={{ fontSize: 11 }} />
        <YAxis type={layout === "vertical" ? "category" : "number"} dataKey={layout === "vertical" ? "name" : undefined} width={layout === "vertical" ? 96 : 32} tick={{ fontSize: 11 }} />
        <Tooltip />
        <Bar dataKey={dataKey} fill="#38bdf8" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

function RegionHeatmap({ rows }: { rows: NamedMetric[] }) {
  if (rows.length === 0) return <EmptyState />
  const max = Math.max(...rows.map((row) => row.avgIntensity || 0), 1)

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {rows.slice(0, 12).map((row) => {
        const strength = ((row.avgIntensity || 0) / max) * 0.75 + 0.12
        return (
          <button
            type="button"
            key={row.name}
            className="rounded-lg border border-border p-3 text-left transition hover:border-primary"
            style={{ backgroundColor: `rgb(56 189 248 / ${strength})` }}
          >
            <p className="truncate text-sm font-medium">{row.name}</p>
            <p className="mt-2 text-xs text-muted-foreground">
              {row.count} records · {row.avgIntensity ?? 0} intensity · {row.avgRelevance ?? 0} relevance
            </p>
          </button>
        )
      })}
    </div>
  )
}

function RankedList({ rows }: { rows: NamedMetric[] }) {
  if (rows.length === 0) return <EmptyState />
  const max = Math.max(...rows.map((row) => row.count), 1)

  return (
    <div className="space-y-3">
      {rows.slice(0, 10).map((row) => (
        <div key={row.name}>
          <div className="mb-1 flex items-center justify-between gap-2 text-xs">
            <span className="truncate font-medium">{row.name}</span>
            <span className="text-muted-foreground">{row.count}</span>
          </div>
          <div className="h-2 rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary"
              style={{ width: `${Math.max((row.count / max) * 100, 4)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function SourceAnalytics({ rows }: { rows: NamedMetric[] }) {
  if (rows.length === 0) return <EmptyState />
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Source</TableHead>
          <TableHead>Records</TableHead>
          <TableHead>Rel.</TableHead>
          <TableHead>Lik.</TableHead>
          <TableHead>Int.</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.slice(0, 8).map((row) => (
          <TableRow key={row.name}>
            <TableCell className="max-w-36 truncate">{row.name}</TableCell>
            <TableCell>{row.count}</TableCell>
            <TableCell>{row.avgRelevance ?? "-"}</TableCell>
            <TableCell>{row.avgLikelihood ?? "-"}</TableCell>
            <TableCell>{row.avgIntensity ?? "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function InsightsTable({
  rows,
  total,
  page,
  pageSize,
  loading,
  onPageChange,
}: {
  rows: NonNullable<ReturnType<typeof useDashboardData>["insights"]["data"]>["data"]
  total: number
  page: number
  pageSize: number
  loading: boolean
  onPageChange: (page: number) => void
}) {
  const pages = Math.max(Math.ceil(total / pageSize), 1)

  return (
    <Card className="mt-4">
      <CardHeader>
        <div>
          <CardTitle>Analytics Table</CardTitle>
          <CardDescription className="mt-1">Filtered insight records with pagination</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">Loading records...</p>
        ) : rows.length === 0 ? (
          <EmptyState />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Intensity</TableHead>
                <TableHead>Likelihood</TableHead>
                <TableHead>Relevance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="max-w-80 whitespace-normal font-medium">
                    {row.title || row.insight || "Untitled"}
                  </TableCell>
                  <TableCell>{row.sector || "-"}</TableCell>
                  <TableCell>{row.topic || "-"}</TableCell>
                  <TableCell>{row.region || "-"}</TableCell>
                  <TableCell>{row.country || "-"}</TableCell>
                  <TableCell>{row.intensity ?? "-"}</TableCell>
                  <TableCell>{row.likelihood ?? "-"}</TableCell>
                  <TableCell>{row.relevance ?? "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <div className="mt-4 flex items-center justify-between gap-3 text-sm">
          <span className="text-muted-foreground">
            Page {page} of {pages} · {total} records
          </span>
          <div className="flex gap-2">
            <Button variant="outline" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={page >= pages}
              onClick={() => onPageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  return (
    <div className="flex min-h-52 items-center justify-center rounded-lg border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
      No data matches the current filters.
    </div>
  )
}
