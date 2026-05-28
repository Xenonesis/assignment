"use client"

import { AlertTriangle, RefreshCcw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
        <div className="mx-auto flex max-w-md flex-col items-center gap-6 px-6 text-center">
          <div className="rounded-2xl bg-red-100 p-4 text-red-600">
            <AlertTriangle className="size-12" />
          </div>
          <h1 className="text-3xl font-bold tracking-tighter">Something went wrong</h1>
          <p className="text-gray-600">
            A critical error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            <RefreshCcw className="size-4" />
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
