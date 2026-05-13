import { NextRequest } from "next/server"

import { fetchFilteredInsights } from "@/lib/insights-query"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { parseFilters } from "@/src/lib/filter-params"

export const dynamic = "force-dynamic"

const columns = [
  "id",
  "end_year",
  "intensity",
  "sector",
  "topic",
  "insight",
  "url",
  "region",
  "start_year",
  "impact",
  "added",
  "published",
  "country",
  "relevance",
  "pestle",
  "source",
  "title",
  "likelihood",
  "city",
  "swot",
] as const

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const rows = await fetchFilteredInsights(supabase, parseFilters(request.nextUrl.searchParams))
    const csv = [
      columns.join(","),
      ...rows.map((row) => columns.map((column) => escapeCsv(row[column])).join(",")),
    ].join("\n")

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="global-insights-export.csv"',
      },
    })
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to export insights." },
      { status: 500 }
    )
  }
}

function escapeCsv(value: unknown) {
  const text = value == null ? "" : String(value)
  if (!/[",\n\r]/.test(text)) return text
  return `"${text.replaceAll('"', '""')}"`
}
