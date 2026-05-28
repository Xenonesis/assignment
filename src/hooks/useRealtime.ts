"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { createClient, type RealtimeChannel } from "@supabase/supabase-js"
import { usePreferencesStore } from "@/src/store/preferences"

type ConnectionState = "connecting" | "connected" | "disconnected" | "error"

const RECONNECT_BASE_DELAY = 1000
const RECONNECT_MAX_DELAY = 30000
const DEBOUNCE_MS = 300

function createBrowserSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}

export function useRealtimeInsights() {
  const queryClient = useQueryClient()
  const realtimeEnabled = usePreferencesStore((s) => s.realtime.enabled)
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected")
  const channelRef = useRef<RealtimeChannel | null>(null)
  const retryCountRef = useRef(0)
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>(null)
  const mountedRef = useRef(true)

  const invalidateAll = useCallback(() => {
    if (!mountedRef.current) return
    queryClient.invalidateQueries({ queryKey: ["insights"] })
    queryClient.invalidateQueries({ queryKey: ["stats"] })
    queryClient.invalidateQueries({ queryKey: ["chart"] })
    queryClient.invalidateQueries({ queryKey: ["filters"] })
  }, [queryClient])

  const debouncedInvalidate = useCallback(() => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    debounceTimerRef.current = setTimeout(invalidateAll, DEBOUNCE_MS)
  }, [invalidateAll])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (!realtimeEnabled) {
      if (channelRef.current) {
        channelRef.current.unsubscribe()
        channelRef.current = null
      }
      setConnectionState("disconnected")
      return
    }

    const supabase = createBrowserSupabase()
    if (!supabase) {
      setConnectionState("error")
      return
    }

    function connect() {
      if (!mountedRef.current) return
      if (channelRef.current) {
        channelRef.current.unsubscribe()
        channelRef.current = null
      }

      setConnectionState("connecting")

      const channel = supabase!
        .channel("insights-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "insights",
          },
          () => {
            retryCountRef.current = 0
            debouncedInvalidate()
          }
        )
        .subscribe((status) => {
          if (!mountedRef.current) return
          if (status === "SUBSCRIBED") {
            setConnectionState("connected")
            retryCountRef.current = 0
          } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            setConnectionState("error")
            scheduleReconnect()
          } else if (status === "CLOSED") {
            setConnectionState("disconnected")
            scheduleReconnect()
          }
        })

      channelRef.current = channel
    }

    function scheduleReconnect() {
      if (!mountedRef.current || !realtimeEnabled) return
      const delay = Math.min(
        RECONNECT_BASE_DELAY * Math.pow(2, retryCountRef.current),
        RECONNECT_MAX_DELAY
      )
      retryCountRef.current++
      setTimeout(() => {
        if (mountedRef.current && realtimeEnabled) connect()
      }, delay)
    }

    connect()

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
      if (channelRef.current) {
        channelRef.current.unsubscribe()
        channelRef.current = null
      }
    }
  }, [realtimeEnabled, debouncedInvalidate])

  return { connectionState, realtimeEnabled }
}
