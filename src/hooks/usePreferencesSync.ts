"use client"

import { useCallback, useEffect, useRef } from "react"
import { usePreferencesStore } from "@/src/store/preferences"
import type { UserPreferences } from "@/src/lib/preferences-schema"

const SYNC_DEBOUNCE_MS = 2000

function getUserId(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem("giv-user-id")
}

export function setUserId(id: string) {
  if (typeof window !== "undefined") window.localStorage.setItem("giv-user-id", id)
}

export function clearUserId() {
  if (typeof window !== "undefined") window.localStorage.removeItem("giv-user-id")
}

export function usePreferencesSync() {
  const store = usePreferencesStore()
  const syncTimerRef = useRef<ReturnType<typeof setTimeout>>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    store.hydrate()
  }, [])

  const pullFromServer = useCallback(async () => {
    const userId = getUserId()
    if (!userId) return

    try {
      const res = await fetch("/api/preferences", {
        headers: { "x-user-id": userId },
      })
      if (!res.ok) return
      const { preferences } = (await res.json()) as { preferences: UserPreferences }

      if (!mountedRef.current) return

      const localUpdatedAt = new Date(store.updatedAt).getTime()
      const serverUpdatedAt = new Date(preferences.updatedAt).getTime()

      if (serverUpdatedAt > localUpdatedAt) {
        store.replaceAll(preferences)
      }
    } catch {
      // offline or network error — local data remains intact
    }
  }, [store])

  const pushToServer = useCallback(async (prefs: UserPreferences) => {
    const userId = getUserId()
    if (!userId) return

    try {
      await fetch("/api/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": userId,
        },
        body: JSON.stringify({ preferences: prefs }),
      })
    } catch {
      // offline — will retry on next change or page load
    }
  }, [])

  useEffect(() => {
    const userId = getUserId()
    if (userId) pullFromServer()
  }, [pullFromServer])

  useEffect(() => {
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
    syncTimerRef.current = setTimeout(() => {
      const currentPrefs = usePreferencesStore.getState()
      pushToServer(currentPrefs as UserPreferences)
    }, SYNC_DEBOUNCE_MS)

    return () => {
      if (syncTimerRef.current) clearTimeout(syncTimerRef.current)
    }
  }, [store.theme, store.layout, store.display, store.realtime, pushToServer])
}
