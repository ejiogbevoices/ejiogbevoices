"use client"

import { useState, useEffect } from "react"
import { getBrowserClient } from "@/lib/supabase/browserClient"
import { Search, X, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface SearchResult {
  id: string
  title: string
  snippet: string
  timestamp: string
  recording_id: string
}

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        performSearch(query)
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  const performSearch = async (searchQuery: string) => {
    setLoading(true)
    try {
      const supabase = getBrowserClient()
      if (!supabase) return

      // TODO: Replace with Meilisearch when integrated
      // For now, searching across transcript_segments and recordings
      const { data: segments } = await supabase
        .from("transcript_segments")
        .select(`
          id,
          content,
          start_time,
          recordings!inner(id, title)
        `)
        .ilike("content", `%${searchQuery}%`)
        .limit(20)

      if (segments) {
        const searchResults = segments.map((segment) => ({
          id: segment.id,
          title: segment.recordings.title,
          snippet: segment.content,
          timestamp: formatTimestamp(segment.start_time),
          recording_id: segment.recordings.id,
        }))
        setResults(searchResults)
      }
    } catch (error) {
      console.error("[v0] Search error:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
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
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recordings, transcripts..."
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

        {query && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Results</h2>

            {loading ? (
              <div className="text-muted-foreground">Searching...</div>
            ) : results.length > 0 ? (
              <div className="space-y-6">
                {results.map((result) => (
                  <Link
                    key={result.id}
                    href={`/recordings/${result.recording_id}?t=${result.timestamp}`}
                    className="block group"
                  >
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary mb-2">
                      {result.title}
                    </h3>
                    <p className="text-muted-foreground mb-2 line-clamp-2">{result.snippet}</p>
                    <p className="text-sm text-muted-foreground">{result.timestamp}</p>
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
            <p className="text-muted-foreground">Enter a search term to find recordings and transcripts</p>
          </div>
        )}
      </div>
    </div>
  )
}
