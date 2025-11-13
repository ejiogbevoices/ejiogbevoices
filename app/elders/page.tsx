import { getServerClient } from "@/lib/supabase/serverClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import Image from "next/image"

export default async function EldersPage() {
  const supabase = await getServerClient()

  const { data: elders, error } = await supabase.from("elders").select("*").order("name", { ascending: true })
  
  console.log('[Elders Page] Query result:', { eldersCount: elders?.length, error })

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold mb-2 text-amber-400">Elders</h1>
        <p className="text-slate-400">Meet the knowledge keepers preserving indigenous wisdom</p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Search & Filter Elders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <label className="block text-sm font-medium text-slate-300 mb-2">Lineage</label>
            <Select>
              <SelectTrigger className="bg-slate-900 border-slate-600">
                <SelectValue placeholder="All Lineages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Lineages</SelectItem>
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

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Recording Category</label>
            <Select>
              <SelectTrigger className="bg-slate-900 border-slate-600">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
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
        </div>

        <div className="mt-4 flex gap-3">
          <Input
            type="search"
            placeholder="Search elders by name..."
            className="flex-1 bg-slate-900 border-slate-600"
          />
          <Button variant="outline" className="border-slate-600 bg-transparent hover:bg-slate-700">
            Clear
          </Button>
          <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">Search</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {elders && elders.length > 0 ? (
          elders.map((elder: any) => (
            <Link key={elder.id} href={`/elders/${elder.id}`}>
              <div className="group bg-slate-800 border border-slate-700 rounded-lg overflow-hidden hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={elder.photo_url || `/placeholder.svg?height=300&width=400&query=Elder+portrait`}
                    alt={elder.name}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {elder.name}
                  </h3>
                  {elder.location && <p className="text-sm text-slate-400">{elder.location}</p>}
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-slate-800 border border-slate-700 rounded-lg">
            <p className="text-slate-400 text-lg mb-2">No elders to display</p>
            <p className="text-slate-500 text-sm">Elder profiles will appear here once data is loaded</p>
          </div>
        )}
      </div>
    </div>
  )
}
