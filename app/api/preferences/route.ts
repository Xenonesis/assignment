import { NextRequest } from "next/server"

import { createServerSupabaseClient } from "@/lib/supabase-server"
import { migratePreferences, defaultPreferences } from "@/src/lib/preferences-schema"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return Response.json({ preferences: defaultPreferences() })
    }

    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from("user_preferences")
      .select("preferences")
      .eq("user_id", userId)
      .single()

    if (error || !data) {
      return Response.json({ preferences: defaultPreferences() })
    }

    return Response.json({ preferences: migratePreferences(data.preferences) })
  } catch {
    return Response.json({ preferences: defaultPreferences() })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return Response.json({ error: "Missing user ID" }, { status: 400 })
    }

    const body = await request.json()
    const prefs = migratePreferences(body.preferences)

    const supabase = createServerSupabaseClient()
    const { error } = await supabase
      .from("user_preferences")
      .upsert(
        {
          user_id: userId,
          preferences: prefs,
          schema_version: prefs.version,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch {
    return Response.json({ error: "Failed to save preferences" }, { status: 500 })
  }
}
