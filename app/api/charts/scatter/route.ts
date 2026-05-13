import { NextRequest } from "next/server"

import { fetchFilteredInsights } from "@/lib/insights-query"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { parseFilters } from "@/src/lib/filter-params"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const rows = await fetchFilteredInsights(supabase, parseFilters(request.nextUrl.searchParams))
    return Response.json(
      rows
        .filter((row) => row.relevance !== null && row.likelihood !== null)
        .slice(0, 500)
        .map((row) => ({
          id: row.id,
          title: row.title || row.insight || "Untitled insight",
          relevance: row.relevance,
          likelihood: row.likelihood,
          intensity: row.intensity || 1,
          region: row.region || "Unknown",
          sector: row.sector || "Unknown",
        }))
    )
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to fetch scatter chart." },
      { status: 500 }
    )
  }
}
