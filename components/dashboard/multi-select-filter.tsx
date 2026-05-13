"use client"

import { useMemo, useState } from "react"
import { Check, ChevronDown, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface MultiSelectFilterProps {
  label: string
  values: string[]
  selected: string[]
  onChange: (values: string[]) => void
}

export function MultiSelectFilter({
  label,
  values,
  selected,
  onChange,
}: MultiSelectFilterProps) {
  const [query, setQuery] = useState("")
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return values.slice(0, 80)
    return values.filter((value) => value.toLowerCase().includes(normalized)).slice(0, 80)
  }, [query, values])

  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value))
    } else {
      onChange([...selected, value])
    }
  }

  return (
    <details className="group rounded-lg border border-border bg-background/50">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 text-sm font-medium">
        <span className="truncate">{label}</span>
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          {selected.length > 0 ? selected.length : "All"}
          <ChevronDown className="size-4 transition group-open:rotate-180" />
        </span>
      </summary>
      <div className="border-t border-border p-2">
        <div className="relative mb-2">
          <Search className="pointer-events-none absolute left-2 top-2.5 size-3.5 text-muted-foreground" />
          <Input
            aria-label={`Search ${label}`}
            className="h-8 pl-7"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
          />
        </div>
        <div className="max-h-52 space-y-1 overflow-y-auto pr-1">
          {filtered.map((value) => {
            const checked = selected.includes(value)
            return (
              <button
                type="button"
                key={value}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted",
                  checked && "bg-muted text-foreground"
                )}
                onClick={() => toggle(value)}
              >
                <span className="truncate">{value}</span>
                {checked ? <Check className="size-3.5" /> : null}
              </button>
            )
          })}
          {filtered.length === 0 ? (
            <p className="px-2 py-3 text-xs text-muted-foreground">No options</p>
          ) : null}
        </div>
        {selected.length > 0 ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="mt-2 w-full"
            onClick={() => onChange([])}
          >
            Clear {label}
          </Button>
        ) : null}
      </div>
    </details>
  )
}
