"use server"

import { getServerClient } from "@/lib/supabase/serverClient"

export interface SearchResult {
  id: string
  type:
    | "recording"
    | "clip"
    | "elder"
    | "tradition"
    | "translation"
    | "transcription"
    | "country"
    | "language"
    | "community"
    | "lineage"
    | "tribe"
    | "category"
  title: string
  snippet: string
  url: string
  duration?: number
  metadata?: string
}

export async function searchEntities(
  query: string,
  filter: string = "all"
): Promise<SearchResult[]> {
  if (!query.trim()) return []

  const supabase = await getServerClient()
  const allResults: SearchResult[] = []

  const searches = []

  if (filter === "all" || filter === "recordings") {
    searches.push(
      (async () => {
        const { data } = await supabase
          .from("recordings")
          .select("id, title, provenance_notes, language, duration_seconds, tags")
          .or(`title.ilike.%${query}%,provenance_notes.ilike.%${query}%,tags.cs.{${query}}`)
          .limit(10)

        return (
          data?.map((r) => ({
            id: r.id,
            type: "recording" as const,
            title: r.title,
            snippet: r.provenance_notes || r.language || "",
            url: `/recordings/${r.id}`,
            duration: r.duration_seconds || undefined,
            metadata: r.tags?.join(", ") || "",
          })) || []
        )
      })()
    )
  }

  if (filter === "all" || filter === "clips") {
    searches.push(
      (async () => {
        const { data } = await supabase
          .from("clips")
          .select(`
            id,
            title,
            description,
            start_ms,
            end_ms,
            recording_id,
            recordings(title)
          `)
          .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
          .limit(10)

        return (
          data?.map((c) => ({
            id: c.id,
            type: "clip" as const,
            title: c.title,
            snippet: c.description || "",
            url: `/clips/${c.id}`,
            duration: c.end_ms && c.start_ms ? Math.round((c.end_ms - c.start_ms) / 1000) : undefined,
            metadata: (c.recordings as any)?.title || "",
          })) || []
        )
      })()
    )
  }

  if (filter === "all" || filter === "elders") {
    searches.push(
      (async () => {
        const { data } = await supabase
          .from("elders")
          .select("id, name, bio, village")
          .or(`name.ilike.%${query}%,bio.ilike.%${query}%`)
          .limit(10)

        return (
          data?.map((e) => ({
            id: e.id,
            type: "elder" as const,
            title: e.name,
            snippet: e.bio || "",
            url: `/elders/${e.id}`,
            metadata: e.village || "",
          })) || []
        )
      })()
    )
  }

  if (filter === "all" || filter === "traditions") {
    searches.push(
      (async () => {
        const { data } = await supabase
          .from("traditions")
          .select("id, name, description, region")
          .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
          .limit(10)

        return (
          data?.map((t) => ({
            id: t.id,
            type: "tradition" as const,
            title: t.name,
            snippet: t.description || "",
            url: `/traditions/${t.id}`,
            metadata: t.region || "",
          })) || []
        )
      })()
    )
  }

  if (filter === "all" || filter === "translations") {
    searches.push(
      (async () => {
        const { data } = await supabase
          .from("translations")
          .select(`
            id,
            translated_text,
            language_code,
            segment_id,
            transcript_segments!inner(recording_id, recordings(title))
          `)
          .ilike("translated_text", `%${query}%`)
          .limit(10)

        return (
          data?.map((t) => ({
            id: t.id,
            type: "translation" as const,
            title: (t.transcript_segments as any)?.recordings?.title || "Translation",
            snippet: t.translated_text.substring(0, 150),
            url: `/recordings/${(t.transcript_segments as any)?.recording_id}`,
            metadata: `${t.language_code}`,
          })) || []
        )
      })()
    )
  }

  if (filter === "all" || filter === "transcriptions") {
    searches.push(
      (async () => {
        const { data } = await supabase
          .from("transcript_segments")
          .select(`
            id,
            text,
            recording_id,
            recordings(title)
          `)
          .ilike("text", `%${query}%`)
          .limit(10)

        return (
          data?.map((t) => ({
            id: t.id,
            type: "transcription" as const,
            title: (t.recordings as any)?.title || "Transcription",
            snippet: t.text?.substring(0, 150) || "",
            url: `/recordings/${t.recording_id}`,
            metadata: "",
          })) || []
        )
      })()
    )
  }

  if (filter === "all" || filter === "countries") {
    searches.push(
      (async () => {
        const { data } = await supabase
          .from("countries")
          .select("id, name, region, iso2")
          .ilike("name", `%${query}%`)
          .limit(10)

        return (
          data?.map((c) => ({
            id: c.id,
            type: "country" as const,
            title: c.name,
            snippet: c.region || "",
            url: `/recordings?country=${c.id}`,
            metadata: c.iso2 || "",
          })) || []
        )
      })()
    )
  }

  if (filter === "all" || filter === "languages") {
    searches.push(
      (async () => {
        const { data } = await supabase
          .from("languages")
          .select("id, name, native_name, code")
          .or(`name.ilike.%${query}%,native_name.ilike.%${query}%`)
          .limit(10)

        return (
          data?.map((l) => ({
            id: l.id,
            type: "language" as const,
            title: l.name,
            snippet: l.native_name || "",
            url: `/recordings?language=${l.code}`,
            metadata: l.code || "",
          })) || []
        )
      })()
    )
  }

  if (filter === "all" || filter === "communities") {
    searches.push(
      (async () => {
        const { data } = await supabase
          .from("communities")
          .select("id, name, notes")
          .ilike("name", `%${query}%`)
          .limit(10)

        return (
          data?.map((c) => ({
            id: c.id,
            type: "community" as const,
            title: c.name,
            snippet: c.notes || "",
            url: `/recordings?community=${c.id}`,
            metadata: "",
          })) || []
        )
      })()
    )
  }

  if (filter === "all" || filter === "lineages") {
    searches.push(
      (async () => {
        const { data } = await supabase
          .from("lineages")
          .select("id, name, notes")
          .ilike("name", `%${query}%`)
          .limit(10)

        return (
          data?.map((l) => ({
            id: l.id,
            type: "lineage" as const,
            title: l.name,
            snippet: l.notes || "",
            url: `/recordings?lineage=${l.id}`,
            metadata: "",
          })) || []
        )
      })()
    )
  }

  if (filter === "all" || filter === "tribes") {
    searches.push(
      (async () => {
        const { data } = await supabase
          .from("tribes")
          .select("id, name, notes")
          .ilike("name", `%${query}%`)
          .limit(10)

        return (
          data?.map((t) => ({
            id: t.id,
            type: "tribe" as const,
            title: t.name,
            snippet: t.notes || "",
            url: `/recordings?tribe=${t.id}`,
            metadata: "",
          })) || []
        )
      })()
    )
  }

  if (filter === "all" || filter === "categories") {
    searches.push(
      (async () => {
        const { data } = await supabase
          .from("recording_categories")
          .select("id, name, description")
          .ilike("name", `%${query}%`)
          .limit(10)

        return (
          data?.map((c) => ({
            id: c.id,
            type: "category" as const,
            title: c.name,
            snippet: c.description || "",
            url: `/recordings?category=${c.id}`,
            metadata: "",
          })) || []
        )
      })()
    )
  }

  const results = await Promise.all(searches)
  results.forEach((arr) => allResults.push(...arr))

  return allResults
}
