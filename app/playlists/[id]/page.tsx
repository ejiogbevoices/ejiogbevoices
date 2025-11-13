import { Suspense } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getServerClient } from "@/lib/supabase/serverClient"
import { ArrowLeft, Play, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

async function PlaylistDetail({ id }: { id: string }) {
  const supabase = await getServerClient()

  const { data: playlist, error } = await supabase
    .from("playlists")
    .select(`
      *,
      playlist_items (
        id,
        recording_id,
        clip_id,
        position,
        recordings (
          id,
          title,
          duration_ms
        ),
        clips (
          id,
          title,
          start_ms,
          end_ms
        )
      )
    `)
    .eq("id", id)
    .single()

  if (error || !playlist) {
    notFound()
  }

  const recordingItems = playlist.playlist_items?.filter((item: any) => item.recording_id && item.recordings) || []
  const clipItems = playlist.playlist_items?.filter((item: any) => item.clip_id && item.clips) || []

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border px-4 py-4 flex items-center">
        <Link href="/playlists">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Playlist</h1>
      </div>

      <div className="container max-w-2xl mx-auto px-4 py-6 space-y-8">
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-100 to-teal-100 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl">🎵</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold">{playlist.title}</h2>
          <p className="text-sm text-muted-foreground">
            {recordingItems.length} recordings · {clipItems.length} clips
          </p>
        </div>

        {recordingItems.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Recordings</h3>
            <div className="space-y-2">
              {recordingItems.map((item: any) => (
                <Link
                  key={item.id}
                  href={`/recordings/${item.recordings.id}`}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <Play className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.recordings.title}</h4>
                    <p className="text-sm text-muted-foreground">Full recording</p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {clipItems.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Clips</h3>
            <div className="space-y-2">
              {clipItems.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <Play className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.clips.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      Clip · {formatTime(item.clips.start_ms)} - {formatTime(item.clips.end_ms)}
                    </p>
                  </div>
                  <ExternalLink className="w-5 h-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        )}

        {recordingItems.length === 0 && clipItems.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            This playlist is empty. Add recordings or clips to get started.
          </div>
        )}
      </div>
    </div>
  )
}

export default function PlaylistPage({ params }: { params: { id: string } }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      }
    >
      <PlaylistDetail id={params.id} />
    </Suspense>
  )
}
