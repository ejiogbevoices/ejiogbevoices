import { getServerClient } from "@/lib/supabase/serverClient"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatRecordingSource } from "@/lib/utils/recordings"

export default async function TranscriptionPage() {
  const supabase = await getServerClient()

  const { data: recordings } = await supabase
    .from("recordings")
    .select(`
      *,
      elders (id, name),
      traditions (id, name)
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="border-b border-slate-700 bg-slate-900">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-amber-400 mb-2">Transcription & Translation Editor</h1>
              <p className="text-slate-400">Edit, merge, split, and approve transcript segments</p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/review-tasks">
                <Button variant="outline" className="border-slate-600 bg-transparent hover:bg-slate-700">
                  Review Tasks
                </Button>
              </Link>
              <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">Save Changes</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-6">
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Filter Recordings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
              <Select>
                <SelectTrigger className="bg-slate-900 border-slate-600">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="no_transcript">No Transcript</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="review">In Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
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
              <label className="block text-sm font-medium text-slate-300 mb-2">Sort By</label>
              <Select>
                <SelectTrigger className="bg-slate-900 border-slate-600">
                  <SelectValue placeholder="Newest First" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="duration">Duration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <Input
              type="search"
              placeholder="Search by title or elder name..."
              className="flex-1 bg-slate-900 border-slate-600"
            />
            <Button variant="outline" className="border-slate-600 bg-transparent hover:bg-slate-700">
              Clear
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          {recordings && recordings.length > 0 ? (
            recordings.map((recording: any) => (
              <Link key={recording.id} href={`/transcription/${recording.id}`}>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all">
                  <h3 className="font-serif text-lg font-bold text-white mb-2">{recording.title}</h3>
                  <p className="text-sm text-slate-400">{formatRecordingSource(recording)}</p>
                </div>
              </Link>
            ))
          ) : (
            <div className="text-center py-12 bg-slate-800 border border-slate-700 rounded-lg">
              <p className="text-slate-400 text-lg">No recordings found</p>
              <p className="text-slate-500 text-sm mt-2">Recordings needing transcription will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
