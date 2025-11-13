import { Suspense } from "react"
import Link from "next/link"
import { getServerClient } from "@/lib/supabase/serverClient"
import { Search } from "lucide-react"

async function FeaturedPlaylists() {
  const supabase = await getServerClient()

  const { data: playlists } = await supabase
    .from("playlists")
    .select("*")
    .eq("visibility", "public")
    .limit(2)
    .order("created_at", { ascending: false })

  if (!playlists || playlists.length === 0) return null

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-white">Featured Playlists</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {playlists.map((playlist) => (
          <Link key={playlist.id} href={`/playlists/${playlist.id}`} className="block">
            <div className="aspect-[3/2] bg-gradient-to-br from-[#E8D5C4] to-[#D4C4B0] rounded-2xl overflow-hidden flex items-center justify-center">
              <img
                src={`/.jpg?key=ywlyf&height=400&width=600&query=${encodeURIComponent(playlist.title)}`}
                alt={playlist.title}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mt-4 text-white">{playlist.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  )
}

async function CategoriesList() {
  const supabase = await getServerClient()

  const { data: categories, error } = await supabase
    .from("recording_categories")
    .select("*")
    .eq("visibility", "public")
    .order("name")

  if (error || !categories) {
    return <div className="text-center py-12 text-slate-400">No categories found.</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-white">Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.slice(0, 4).map((category) => (
          <div key={category.id} className="block">
            <div className="aspect-[3/2] bg-gradient-to-br from-[#E8D5C4] to-[#D4C4B0] rounded-2xl overflow-hidden flex items-center justify-center">
              <img
                src={`/.jpg?key=2oxov&height=400&width=600&query=${encodeURIComponent(category.name + " illustration")}`}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mt-4 text-white">{category.name}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex items-center justify-between px-4 py-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold">Wisdom Archive</h1>
        <Search className="w-6 h-6 text-slate-400" />
      </header>

      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<div className="text-slate-400">Loading featured content...</div>}>
          <FeaturedPlaylists />
        </Suspense>

        <Suspense fallback={<div className="text-slate-400">Loading categories...</div>}>
          <CategoriesList />
        </Suspense>
      </div>
    </div>
  )
}
