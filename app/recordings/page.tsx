import { getServerClient } from "@/lib/supabase/serverClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import Image from "next/image"
import { formatRecordingSource } from "@/lib/utils/recordings"

export default async function RecordingsPage() {
  const supabase = await getServerClient()

  const { data: recordings } = await supabase
    .from("recordings")
    .select(`
      *,
      elders (id, name, photo_url),
      traditions (id, name)
    `)
    .eq("visibility", "public")
    .order("created_at", { ascending: false })

  console.log("[v0] Recordings query result:", recordings)

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold mb-2 text-amber-400">All Recordings</h1>
        <p className="text-slate-400">Explore our complete collection of audio recordings</p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
            <Select>
              <SelectTrigger className="bg-slate-900 border-slate-600">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="oral-history">Oral History</SelectItem>
                <SelectItem value="ritual">Ritual & Ceremony</SelectItem>
                <SelectItem value="music">Music & Song</SelectItem>
                <SelectItem value="folklore">Folklore & Stories</SelectItem>
                <SelectItem value="crafts">Traditional Crafts</SelectItem>
                <SelectItem value="medicine">Traditional Medicine</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Elder</label>
            <Select>
              <SelectTrigger className="bg-slate-900 border-slate-600">
                <SelectValue placeholder="All Elders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Elders</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Language</label>
            <Select>
              <SelectTrigger className="bg-slate-900 border-slate-600">
                <SelectValue placeholder="All Languages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Tradition</label>
            <Select>
              <SelectTrigger className="bg-slate-900 border-slate-600">
                <SelectValue placeholder="All Traditions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Traditions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Country</label>
            <Select>
              <SelectTrigger className="bg-slate-900 border-slate-600">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Tribe</label>
            <Select>
              <SelectTrigger className="bg-slate-900 border-slate-600">
                <SelectValue placeholder="All Tribes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tribes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <Input
            type="search"
            placeholder="Search recordings by title, description, or tags..."
            className="flex-1 bg-slate-900 border-slate-600"
          />
          <Button variant="outline" className="border-slate-600 bg-transparent hover:bg-slate-700">
            Clear Filters
          </Button>
          <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">Apply Filters</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recordings && recordings.length > 0 ? (
          recordings.map((recording: any) => (
            <Link key={recording.id} href={`/recordings/${recording.id}`}>
              <div className="group relative overflow-hidden rounded-xl bg-slate-800/50 backdrop-blur border border-slate-700/50 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={recording.elders?.photo_url || `/placeholder.svg?height=400&width=300&query=Elder+portrait`}
                    alt={recording.title}
                    width={300}
                    height={400}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
                </div>
                <div className="p-4 space-y-3">
                  <h3 className="font-serif text-lg font-bold text-white line-clamp-2 group-hover:text-cyan-400 transition-colors">
                    {recording.title || "Untitled Recording"}
                  </h3>
                  <p className="text-sm text-slate-400">{formatRecordingSource(recording)}</p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {recording.recording_categories && (
                      <span className="px-2 py-1 text-xs rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                        {recording.recording_categories.name}
                      </span>
                    )}
                    {recording.traditions && (
                      <span className="px-2 py-1 text-xs rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium">
                        {recording.traditions.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-slate-800 border border-slate-700 rounded-lg">
            <p className="text-slate-400 text-lg mb-2">No recordings found</p>
            <p className="text-slate-500 text-sm">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
