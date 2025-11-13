import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getServerClient } from "@/lib/supabase/serverClient"
import { RecordingPlayer } from "@/components/recording-player"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

async function RecordingDetail({ id }: { id: string }) {
  const supabase = await getServerClient()

  const { data: recording, error } = await supabase
    .from("recordings")
    .select(`
      *,
      elders (id, name, photo_url, bio),
      traditions (id, name, description)
    `)
    .eq("id", id)
    .single()

  if (error || !recording) {
    notFound()
  }

  const { data: transcriptSegments } = await supabase
    .from("transcript_segments")
    .select("*")
    .eq("recording_id", id)
    .order("segment_index")

  return (
    <div className="min-h-screen bg-[#0D1117] flex flex-col">
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/recordings" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-semibold text-white">Recording</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="container mx-auto px-4 py-6">
          <RecordingPlayer recording={recording} segments={transcriptSegments || []} />
        </div>
      </div>
    </div>
  )
}

export default async function RecordingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0D1117] flex items-center justify-center"><p className="text-slate-400">Loading recording...</p></div>}>
      <RecordingDetail id={id} />
    </Suspense>
  )
}
