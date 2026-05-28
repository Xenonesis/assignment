"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCcw } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center gap-6">
        <div className="rounded-2xl bg-destructive/10 p-4 text-destructive">
          <AlertTriangle className="size-12" />
        </div>
        <h1 className="text-3xl font-bold tracking-tighter">Something went wrong</h1>
        <p className="text-muted-foreground">
          An unexpected error occurred while loading this page. Please try again.
        </p>
        {error.message ? (
          <p className="max-w-sm rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2 text-sm text-destructive">
            {error.message}
          </p>
        ) : null}
        <Button variant="outline" onClick={reset}>
          <RefreshCcw className="size-4" />
          Try again
        </Button>
      </div>
    </main>
  )
}
