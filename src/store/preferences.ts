import { create } from "zustand"
import {
  defaultPreferences,
  migratePreferences,
  type UserPreferences,
} from "@/src/lib/preferences-schema"

const STORAGE_KEY = "giv-user-preferences"

function loadFromStorage(): UserPreferences {
  if (typeof window === "undefined") return defaultPreferences()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultPreferences()
    const parsed = JSON.parse(raw)
    return migratePreferences(parsed)
  } catch {
    return defaultPreferences()
  }
}

function saveToStorage(prefs: UserPreferences) {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...prefs, updatedAt: new Date().toISOString() })
    )
  } catch {
    // storage full or unavailable — silently ignore
  }
}

interface PreferencesState extends UserPreferences {
  setTheme: (theme: UserPreferences["theme"]) => void
  setLayout: (patch: Partial<UserPreferences["layout"]>) => void
  setDisplay: (patch: Partial<UserPreferences["display"]>) => void
  setChartDisplay: (patch: Partial<UserPreferences["display"]["chartDisplay"]>) => void
  setRealtime: (patch: Partial<UserPreferences["realtime"]>) => void
  replaceAll: (prefs: UserPreferences) => void
  hydrate: () => void
}

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  ...defaultPreferences(),

  hydrate: () => set(loadFromStorage()),

  setTheme: (theme) => {
    set({ theme })
    saveToStorage(get() as UserPreferences)
  },

  setLayout: (patch) => {
    const current = get().layout
    set({ layout: { ...current, ...patch } })
    saveToStorage(get() as UserPreferences)
  },

  setDisplay: (patch) => {
    const current = get().display
    set({ display: { ...current, ...patch } })
    saveToStorage(get() as UserPreferences)
  },

  setChartDisplay: (patch) => {
    const current = get().display
    set({
      display: {
        ...current,
        chartDisplay: { ...current.chartDisplay, ...patch },
      },
    })
    saveToStorage(get() as UserPreferences)
  },

  setRealtime: (patch) => {
    const current = get().realtime
    set({ realtime: { ...current, ...patch } })
    saveToStorage(get() as UserPreferences)
  },

  replaceAll: (prefs) => {
    set(prefs)
    saveToStorage(prefs)
  },
}))
