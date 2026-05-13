import { NextRequest } from "next/server"

import { aggregateByName, fetchFilteredInsights } from "@/lib/insights-query"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { parseFilters } from "@/src/lib/filter-params"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const rows = await fetchFilteredInsights(supabase, parseFilters(request.nextUrl.searchParams))
    return Response.json(aggregateByName(rows, "source").slice(0, 20))
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to fetch source chart." },
      { status: 500 }
    )
  }
}
