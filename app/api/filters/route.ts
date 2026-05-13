import { fetchFilterOptions } from "@/lib/insights-query"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    return Response.json(await fetchFilterOptions(supabase))
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unable to fetch filters." },
      { status: 500 }
    )
  }
}
