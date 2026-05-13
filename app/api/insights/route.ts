import { NextRequest } from "next/server"

import { fetchInsightsPage } from "@/lib/insights-query"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { parseFilters } from "@/src/lib/filter-params"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const filters = parseFilters(request.nextUrl.searchParams)
    const payload = await fetchInsightsPage(supabase, filters)
    return Response.json(payload)
  } catch (error) {
    return Response.json({ error: getErrorMessage(error) }, { status: 500 })
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unable to fetch insights."
}
