"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { getBrowserClient } from "@/lib/supabase/browserClient"
import { Search } from "lucide-react"

export default function CollectionsPage() {
  const [collections, setCollections] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "new" | "popular">("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCollections()
  }, [filter])

  async function loadCollections() {
    setLoading(true)
    const supabase = getBrowserClient()
    if (!supabase) return

    let query = supabase
      .from("collections")
      .select(`
        *,
        collection_items (
          id
        )
      `)
      .eq("visibility", "public")

    if (filter === "new") {
      query = query.order("created_at", { ascending: false })
    } else if (filter === "popular") {
      query = query.order("created_at", { ascending: false })
    } else {
      query = query.order("created_at", { ascending: false })
    }

    const { data, error } = await query

    if (!error && data) {
      // Add recording count to each collection
      const collectionsWithCount = data.map((collection: any) => ({
        ...collection,
        recording_count: collection.collection_items?.length || 0,
      }))
      setCollections(collectionsWithCount)
    }
    setLoading(false)
  }

  const filteredCollections = collections.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const featuredCollections = filteredCollections.slice(0, 2)
  const allBundles = filteredCollections

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0D1117] border-b border-slate-800">
        <div className="flex items-center gap-4 px-4 py-4">
          <Link href="/" className="text-slate-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold flex-1 text-center mr-10">Bundles</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search bundles"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800/50 rounded-xl pl-12 pr-4 py-3.5 text-slate-300 placeholder-slate-500 border border-slate-700 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex gap-3">
          <button
            onClick={() => setFilter("all")}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              filter === "all" ? "bg-slate-700 text-white" : "bg-slate-800/50 text-slate-400 hover:text-white"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("new")}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              filter === "new" ? "bg-slate-700 text-white" : "bg-slate-800/50 text-slate-400 hover:text-white"
            }`}
          >
            New
          </button>
          <button
            onClick={() => setFilter("popular")}
            className={`px-6 py-2 rounded-full font-medium transition-colors ${
              filter === "popular" ? "bg-slate-700 text-white" : "bg-slate-800/50 text-slate-400 hover:text-white"
            }`}
          >
            Popular
          </button>
        </div>

        {/* Featured Section */}
        {featuredCollections.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Featured</h2>
            <div className="grid grid-cols-2 gap-4">
              {featuredCollections.map((collection) => (
                <Link key={collection.id} href={`/collections/${collection.id}`}>
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden group">
                    <Image
                      src={
                        collection.thumbnail_url ||
                        `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(collection.title) || "/placeholder.svg"}`
                      }
                      alt={collection.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <h3 className="absolute bottom-3 left-3 right-3 font-bold text-white text-sm line-clamp-2">
                      {collection.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* All Bundles Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">All Bundles</h2>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-12 text-slate-400">Loading collections...</div>
            ) : allBundles.length === 0 ? (
              <div className="text-center py-12 text-slate-400">No collections found</div>
            ) : (
              allBundles.map((collection) => (
                <Link key={collection.id} href={`/collections/${collection.id}`}>
                  <div className="flex gap-3 p-3 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={
                          collection.thumbnail_url ||
                          `/placeholder.svg?height=80&width=80&query=${encodeURIComponent(collection.title) || "/placeholder.svg"}`
                        }
                        alt={collection.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white mb-1 line-clamp-1">{collection.title}</h3>
                      <p className="text-sm text-slate-400">{collection.recording_count} recordings</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
