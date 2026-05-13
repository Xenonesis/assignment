import { NextRequest } from "next/server"

import { aggregateTimeline, fetchFilteredInsights } from "@/lib/insights-query"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { parseFilters } from "@/src/lib/filter-params"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const rows = await fetchFilteredInsights(supabase, parseFilters(request.nextUrl.searchParams))
    return Response.json(aggregateTimeline(rows))
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to fetch timeline chart." },
      { status: 500 }
    )
  }
}
