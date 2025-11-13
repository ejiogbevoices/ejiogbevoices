"use client"

import { useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

type Term = {
  id: string
  term: string
  definition: string
}

export default function GlossaryClient({
  initialTerms,
  initialQuery,
}: {
  initialTerms: Record<string, Term[]>
  initialQuery: string
}) {
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const router = useRouter()

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    const params = new URLSearchParams()
    if (value) {
      params.set("q", value)
    }
    router.push(`/glossary?${params.toString()}`)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <Input
            type="search"
            placeholder="Search glossary"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="h-14 pl-12 bg-slate-800/30 border-slate-700 text-white placeholder:text-slate-500 rounded-xl"
          />
        </div>
      </div>

      {/* Terms List */}
      <div className="space-y-8">
        {Object.entries(initialTerms).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No terms found</p>
          </div>
        ) : (
          Object.entries(initialTerms)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([letter, letterTerms]) => (
              <div key={letter}>
                <h2 className="text-2xl font-bold text-white mb-4">{letter}</h2>
                <div className="space-y-3">
                  {letterTerms.map((term) => (
                    <Link
                      key={term.id}
                      href={`/glossary/${term.id}`}
                      className="block p-4 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 rounded-lg transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                          {term.term}
                        </h3>
                        <svg
                          className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  )
}
