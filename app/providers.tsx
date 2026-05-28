"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRealtimeInsights } from "@/src/hooks/useRealtime"
import { usePreferencesSync } from "@/src/hooks/usePreferencesSync"

const RealtimeContext = createContext<{ connectionState: string }>({
  connectionState: "disconnected",
})

export function useRealtimeState() {
  return useContext(RealtimeContext)
}

function RealtimeProvider({ children }: { children: ReactNode }) {
  const { connectionState } = useRealtimeInsights()
  usePreferencesSync()

  return (
    <RealtimeContext.Provider value={{ connectionState }}>
      {children}
    </RealtimeContext.Provider>
  )
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 10_000,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <RealtimeProvider>{children}</RealtimeProvider>
    </QueryClientProvider>
  )
}
