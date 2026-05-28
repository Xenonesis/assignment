export default function Loading() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-border bg-sidebar/80 p-6 backdrop-blur-xl lg:sticky lg:top-0 lg:h-screen lg:w-80 lg:overflow-y-auto lg:border-b-0 lg:border-r lg:shadow-xl z-10">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div className="h-3 w-24 animate-pulse rounded bg-muted" />
              <div className="h-7 w-40 animate-pulse rounded bg-muted" />
            </div>
            <div className="size-9 animate-pulse rounded-lg bg-muted" />
          </div>
          <div className="mb-4 rounded-lg border border-border bg-background/50 p-3">
            <div className="mb-2 h-4 w-24 animate-pulse rounded bg-muted" />
            <div className="h-3 w-36 animate-pulse rounded bg-muted" />
          </div>
          <div className="space-y-2">
            {Array.from({ length: 9 }, (_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="h-9 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
          <div className="mt-4 h-9 animate-pulse rounded-lg bg-muted" />
        </aside>
        <section className="flex-1 p-4 sm:p-8 lg:p-10">
          <header className="mb-8">
            <div className="mb-2 h-8 w-80 animate-pulse rounded bg-muted" />
            <div className="h-4 w-64 animate-pulse rounded bg-muted" />
          </header>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-lg border border-border bg-card" />
            ))}
          </div>
          <div className="mt-4 grid gap-4 xl:grid-cols-12">
            <div className="h-[380px] animate-pulse rounded-lg border border-border bg-card xl:col-span-7" />
            <div className="h-[380px] animate-pulse rounded-lg border border-border bg-card xl:col-span-5" />
            <div className="h-[380px] animate-pulse rounded-lg border border-border bg-card xl:col-span-6" />
            <div className="h-[380px] animate-pulse rounded-lg border border-border bg-card xl:col-span-6" />
          </div>
        </section>
      </div>
    </main>
  )
}
