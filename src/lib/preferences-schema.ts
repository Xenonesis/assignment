import { z } from "zod"

export const PREFERENCES_SCHEMA_VERSION = 1

export const themeSchema = z.enum(["light", "dark", "system"])

export const chartDisplaySchema = z.object({
  showGrid: z.boolean().default(true),
  showTooltip: z.boolean().default(true),
  animationDuration: z.number().min(0).max(2000).default(300),
})

export const layoutPreferencesSchema = z.object({
  sidebarCollapsed: z.boolean().default(false),
  sidebarWidth: z.number().min(240).max(480).default(320),
  kpiColumns: z.enum(["2", "4"]).default("4"),
  chartGridColumns: z.enum(["1", "2"]).default("2"),
})

export const displayPreferencesSchema = z.object({
  pageSize: z.number().min(5).max(100).default(25),
  compactMode: z.boolean().default(false),
  showKpis: z.boolean().default(true),
  showCharts: z.boolean().default(true),
  showTable: z.boolean().default(true),
  chartDisplay: chartDisplaySchema.default({ showGrid: true, showTooltip: true, animationDuration: 300 }),
})

export const realtimePreferencesSchema = z.object({
  enabled: z.boolean().default(true),
  interval: z.number().min(1000).max(60000).default(5000),
  showNotifications: z.boolean().default(true),
})

export const defaultLayout = {
  sidebarCollapsed: false,
  sidebarWidth: 320,
  kpiColumns: "4" as const,
  chartGridColumns: "2" as const,
}

export const defaultDisplay = {
  pageSize: 25,
  compactMode: false,
  showKpis: true,
  showCharts: true,
  showTable: true,
  chartDisplay: { showGrid: true, showTooltip: true, animationDuration: 300 },
}

export const defaultRealtime = {
  enabled: true,
  interval: 5000,
  showNotifications: true,
}

export const preferencesSchemaV1 = z.object({
  version: z.literal(1).default(1),
  theme: themeSchema.default("system"),
  layout: layoutPreferencesSchema.default(defaultLayout),
  display: displayPreferencesSchema.default(defaultDisplay),
  realtime: realtimePreferencesSchema.default(defaultRealtime),
  updatedAt: z.string().datetime().default(() => new Date().toISOString()),
})

export type UserPreferences = z.infer<typeof preferencesSchemaV1>

export const CURRENT_VERSION = PREFERENCES_SCHEMA_VERSION

const migrationMap: Record<number, (data: unknown) => unknown> = {
  0: (data) => {
    const legacy = data as Record<string, unknown>
    return {
      ...legacy,
      version: 1,
      updatedAt: new Date().toISOString(),
    }
  },
}

export function migratePreferences(raw: unknown): UserPreferences {
  let data = raw as Record<string, unknown>
  const incomingVersion = (data?.version as number) ?? 0

  for (let v = incomingVersion; v < CURRENT_VERSION; v++) {
    const migrate = migrationMap[v]
    if (migrate) data = migrate(data) as Record<string, unknown>
  }

  return preferencesSchemaV1.parse(data)
}

export function defaultPreferences(): UserPreferences {
  return preferencesSchemaV1.parse({})
}
