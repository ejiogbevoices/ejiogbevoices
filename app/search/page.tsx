"use client"

import { useState, useEffect } from "react"
import { getBrowserClient } from "@/lib/supabase/browserClient"
import { Search, X, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface SearchResult {
  id: string
  type:
    | "recording"
    | "elder"
    | "tradition"
    | "translation"
    | "transcription"
    | "country"
    | "language"
    | "community"
    | "lineage"
  title: string
  snippet: string
  url: string
  metadata?: string
}

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string>("all")

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        performSearch(query)
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, activeFilter])

  const performSearch = async (searchQuery: string) => {
    setLoading(true)
    try {
      const supabase = getBrowserClient()
      if (!supabase) return

      const allResults: SearchResult[] = []

      // Search recordings
      if (activeFilter === "all" || activeFilter === "recordings") {
        const { data: recordings } = await supabase
          .from("recordings")
          .select("id, title, tags, language")
          .or(`title.ilike.%${searchQuery}%,tags.cs.{${searchQuery}}`)
          .limit(10)

        if (recordings) {
          allResults.push(
            ...recordings.map((r) => ({
              id: r.id,
              type: "recording" as const,
              title: r.title,
              snippet: r.language || "",
              url: `/recordings/${r.id}`,
              metadata: r.tags?.join(", ") || "",
            })),
          )
        }
      }

      // Search elders
      if (activeFilter === "all" || activeFilter === "elders") {
        const { data: elders } = await supabase
          .from("elders")
          .select("id, name, bio, village")
          .or(`name.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%`)
          .limit(10)

        if (elders) {
          allResults.push(
            ...elders.map((e) => ({
              id: e.id,
              type: "elder" as const,
              title: e.name,
              snippet: e.bio || "",
              url: `/elders/${e.id}`,
              metadata: e.village || "",
            })),
          )
        }
      }

      // Search traditions
      if (activeFilter === "all" || activeFilter === "traditions") {
        const { data: traditions } = await supabase
          .from("traditions")
          .select("id, name, description, region")
          .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
          .limit(10)

        if (traditions) {
          allResults.push(
            ...traditions.map((t) => ({
              id: t.id,
              type: "tradition" as const,
              title: t.name,
              snippet: t.description || "",
              url: `/traditions/${t.id}`,
              metadata: t.region || "",
            })),
          )
        }
      }

      // Search translations
      if (activeFilter === "all" || activeFilter === "translations") {
        const { data: translations } = await supabase
          .from("translations")
          .select(`
            id,
            translated_text,
            language_code,
            segment_id,
            transcript_segments!inner(recording_id, recordings(title))
          `)
          .ilike("translated_text", `%${searchQuery}%`)
          .limit(10)

        if (translations) {
          allResults.push(
            ...translations.map((t) => ({
              id: t.id,
              type: "translation" as const,
              title: t.transcript_segments?.recordings?.title || "Translation",
              snippet: t.translated_text.substring(0, 150),
              url: `/translations/${t.id}`,
              metadata: `${t.language_code}`,
            })),
          )
        }
      }

      // Search transcriptions
      if (activeFilter === "all" || activeFilter === "transcriptions") {
        const { data: transcripts } = await supabase
          .from("transcript_segments")
          .select(`
            id,
            text_original,
            recording_id,
            recordings(title)
          `)
          .ilike("text_original", `%${searchQuery}%`)
          .limit(10)

        if (transcripts) {
          allResults.push(
            ...transcripts.map((t) => ({
              id: t.id,
              type: "transcription" as const,
              title: t.recordings?.title || "Transcription",
              snippet: t.text_original?.substring(0, 150) || "",
              url: `/transcription/${t.recording_id}`,
              metadata: "",
            })),
          )
        }
      }

      // Search countries
      if (activeFilter === "all" || activeFilter === "countries") {
        const { data: countries } = await supabase
          .from("countries")
          .select("id, name, region, iso2")
          .ilike("name", `%${searchQuery}%`)
          .limit(10)

        if (countries) {
          allResults.push(
            ...countries.map((c) => ({
              id: c.id,
              type: "country" as const,
              title: c.name,
              snippet: c.region || "",
              url: `/recordings?country=${c.id}`,
              metadata: c.iso2 || "",
            })),
          )
        }
      }

      // Search languages
      if (activeFilter === "all" || activeFilter === "languages") {
        const { data: languages } = await supabase
          .from("languages")
          .select("id, name, native_name, code")
          .or(`name.ilike.%${searchQuery}%,native_name.ilike.%${searchQuery}%`)
          .limit(10)

        if (languages) {
          allResults.push(
            ...languages.map((l) => ({
              id: l.id,
              type: "language" as const,
              title: l.name,
              snippet: l.native_name || "",
              url: `/recordings?language=${l.code}`,
              metadata: l.code || "",
            })),
          )
        }
      }

      // Search communities
      if (activeFilter === "all" || activeFilter === "communities") {
        const { data: communities } = await supabase
          .from("communities")
          .select("id, name, notes")
          .ilike("name", `%${searchQuery}%`)
          .limit(10)

        if (communities) {
          allResults.push(
            ...communities.map((c) => ({
              id: c.id,
              type: "community" as const,
              title: c.name,
              snippet: c.notes || "",
              url: `/recordings?community=${c.id}`,
              metadata: "",
            })),
          )
        }
      }

      // Search lineages
      if (activeFilter === "all" || activeFilter === "lineages") {
        const { data: lineages } = await supabase
          .from("lineages")
          .select("id, name, notes")
          .ilike("name", `%${searchQuery}%`)
          .limit(10)

        if (lineages) {
          allResults.push(
            ...lineages.map((l) => ({
              id: l.id,
              type: "lineage" as const,
              title: l.name,
              snippet: l.notes || "",
              url: `/recordings?lineage=${l.id}`,
              metadata: "",
            })),
          )
        }
      }

      setResults(allResults)
    } catch (error) {
      console.error("[v0] Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      recording: "bg-cyan-500/20 text-cyan-400",
      elder: "bg-amber-500/20 text-amber-400",
      tradition: "bg-purple-500/20 text-purple-400",
      translation: "bg-green-500/20 text-green-400",
      transcription: "bg-blue-500/20 text-blue-400",
      country: "bg-red-500/20 text-red-400",
      language: "bg-yellow-500/20 text-yellow-400",
      community: "bg-pink-500/20 text-pink-400",
      lineage: "bg-indigo-500/20 text-indigo-400",
    }
    return colors[type] || "bg-muted text-muted-foreground"
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-4">
        <div className="flex items-center gap-4 max-w-7xl mx-auto">
          <Link href="/" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-semibold text-foreground">Search</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recordings, elders, traditions, translations..."
            className="w-full bg-muted text-foreground rounded-xl pl-12 pr-12 py-4 text-base focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            "all",
            "recordings",
            "elders",
            "traditions",
            "translations",
            "transcriptions",
            "countries",
            "languages",
            "communities",
            "lineages",
          ].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        {query && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {results.length} {results.length === 1 ? "Result" : "Results"}
            </h2>

            {loading ? (
              <div className="text-muted-foreground">Searching...</div>
            ) : results.length > 0 ? (
              <div className="space-y-4">
                {results.map((result) => (
                  <Link
                    key={`${result.type}-${result.id}`}
                    href={result.url}
                    className="block group bg-muted/50 hover:bg-muted rounded-lg p-4 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeBadgeColor(result.type)}`}
                          >
                            {result.type}
                          </span>
                          {result.metadata && <span className="text-xs text-muted-foreground">{result.metadata}</span>}
                        </div>
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary mb-2">
                          {result.title}
                        </h3>
                        {result.snippet && (
                          <p className="text-muted-foreground text-sm line-clamp-2">{result.snippet}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No results found for "{query}"</p>
              </div>
            )}
          </div>
        )}

        {!query && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">Enter a search term to find anything in the archive</p>
            <p className="text-sm text-muted-foreground mt-2">
              Search recordings, elders, traditions, translations, transcriptions, and more
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
