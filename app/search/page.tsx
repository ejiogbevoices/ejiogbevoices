"use client"

import { useState, useEffect, useRef } from "react"
import { searchEntities, type SearchResult } from "@/lib/actions/search"
import { formatDuration } from "@/lib/utils/format"
import { Search, X, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const requestIdRef = useRef(0)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim()) {
        performSearch(query)
      } else {
        setResults([])
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query])

  const performSearch = async (searchQuery: string) => {
    const requestId = ++requestIdRef.current
    setLoading(true)
    
    try {
      const searchResults = await searchEntities(searchQuery)
      
      if (requestId === requestIdRef.current) {
        setResults(searchResults)
        setLoading(false)
      }
    } catch (error) {
      console.error("Search error:", error)
      if (requestId === requestIdRef.current) {
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0D1117] flex flex-col">
      <div className="sticky top-0 z-10 bg-slate-900/50 backdrop-blur border-b border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-semibold text-white">Search</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 flex-1">
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search recordings, elders, traditions..."
            className="w-full bg-slate-800 text-white rounded-xl pl-12 pr-12 py-4 text-base focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-slate-700"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {query && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-6">Results</h2>

            {loading ? (
              <div className="text-slate-400">Searching...</div>
            ) : results.length > 0 ? (
              <div className="space-y-6">
                {results.map((result) => (
                  <Link
                    key={`${result.type}-${result.id}`}
                    href={result.url}
                    className="block group"
                  >
                    <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors mb-2">
                      {result.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-2 line-clamp-2">{result.snippet}</p>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      {result.duration && <span>{formatDuration(result.duration)}</span>}
                      {result.metadata && <span>{result.metadata}</span>}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400">No results found for "{query}"</p>
              </div>
            )}
          </div>
        )}

        {!query && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-slate-600 mx-auto mb-4 opacity-50" />
            <p className="text-slate-400">Search across all content</p>
            <p className="text-sm text-slate-500 mt-2">
              Recordings • Clips • Elders • Translations • Transcripts • Categories
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
