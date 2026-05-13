import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { createClient } from "@supabase/supabase-js"

const datasetPath = resolve(process.cwd(), "data", "jsondata.json")
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!url || !key) {
  console.error("Missing Supabase URL/key environment variables.")
  process.exit(1)
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY.")
  console.error("The import writes to the insights table and will usually be blocked by RLS with a publishable/anon key.")
  process.exit(1)
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const raw = await readFile(datasetPath, "utf8").catch((error) => {
  console.error(`Unable to read ${datasetPath}: ${error.message}`)
  process.exit(1)
})

const parsed = JSON.parse(raw)
if (!Array.isArray(parsed)) {
  console.error("data/jsondata.json must contain a JSON array.")
  process.exit(1)
}

const { error: tableError } = await supabase.from("insights").select("id").limit(1)
if (tableError) {
  console.error("Unable to access insights table.")
  console.error("Run the SQL in supabase/schema.sql in Supabase first.")
  console.error(tableError.message)
  process.exit(1)
}

const { data: existingRows, error: existingError } = await supabase
  .from("insights")
  .select("url,title")
  .limit(10000)

if (existingError) {
  console.error(existingError.message)
  process.exit(1)
}

const existingKeys = new Set((existingRows || []).map((row) => dedupeKey(row)))
const cleaned = []
const seen = new Set()

for (const row of parsed) {
  const normalized = normalizeRow(row)
  const keyValue = dedupeKey(normalized)
  if (seen.has(keyValue) || existingKeys.has(keyValue)) continue
  seen.add(keyValue)
  cleaned.push(normalized)
}

for (let index = 0; index < cleaned.length; index += 500) {
  const chunk = cleaned.slice(index, index + 500)
  const { error } = await supabase.from("insights").insert(chunk)
  if (error) {
    console.error(`Import failed at row ${index + 1}: ${error.message}`)
    process.exit(1)
  }
}

console.log(`Imported ${cleaned.length} new records. Skipped ${parsed.length - cleaned.length} duplicates or existing records.`)

function normalizeRow(row) {
  return {
    end_year: numberOrNull(row.end_year),
    intensity: numberOrNull(row.intensity),
    sector: textOrNull(row.sector),
    topic: textOrNull(row.topic),
    insight: textOrNull(row.insight),
    url: textOrNull(row.url),
    region: normalizeRegion(row.region),
    start_year: numberOrNull(row.start_year),
    impact: textOrNull(row.impact),
    added: timestampOrNull(row.added),
    published: timestampOrNull(row.published),
    country: normalizeCountry(row.country),
    relevance: numberOrNull(row.relevance),
    pestle: textOrNull(row.pestle),
    source: textOrNull(row.source),
    title: textOrNull(row.title),
    likelihood: numberOrNull(row.likelihood),
    city: textOrNull(row.city),
    swot: textOrNull(row.swot),
  }
}

function numberOrNull(value) {
  if (value === "" || value === null || value === undefined) return null
  const parsedValue = Number(value)
  return Number.isFinite(parsedValue) ? parsedValue : null
}

function textOrNull(value) {
  if (value === "" || value === null || value === undefined) return null
  const trimmed = String(value).trim()
  return trimmed.length > 0 ? trimmed : null
}

function timestampOrNull(value) {
  const text = textOrNull(value)
  if (!text) return null
  const parsedValue = Date.parse(text)
  if (Number.isNaN(parsedValue)) return null
  return new Date(parsedValue).toISOString()
}

function normalizeCountry(value) {
  const text = textOrNull(value)
  if (!text) return null
  const aliases = new Map([
    ["United States of America", "United States"],
    ["USA", "United States"],
    ["US", "United States"],
    ["UK", "United Kingdom"],
  ])
  return aliases.get(text) || text
}

function normalizeRegion(value) {
  const text = textOrNull(value)
  if (!text) return null
  return text.replace(/\s+/g, " ")
}

function dedupeKey(row) {
  return `${row.url || ""}::${row.title || ""}`.toLowerCase()
}
