import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

interface Recording {
  id: string
  title: string
  description?: string
  duration_ms?: number
  visibility: string
  elders?: { name: string; photo_url?: string }
  traditions?: { name: string }
  language?: { name: string }
  recording_categories?: { name: string }
}

interface RecordingGridProps {
  recordings: Recording[]
}

export function RecordingGrid({ recordings }: RecordingGridProps) {
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    if (hours > 0) {
      return `${hours}:${String(minutes % 60).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`
    }
    return `${minutes}:${String(seconds % 60).padStart(2, "0")}`
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recordings.map((recording) => (
        <Link key={recording.id} href={`/recordings/${recording.id}`}>
          <div className="group relative overflow-hidden rounded-xl bg-slate-800/50 backdrop-blur border border-slate-700/50 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={
                  recording.elders?.photo_url ||
                  `/placeholder.svg?height=400&width=300&query=Elder+portrait` ||
                  "/placeholder.svg"
                }
                alt={recording.title}
                width={300}
                height={400}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />

              <Badge className="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur text-white border-0 font-medium shadow-lg">
                {recording.visibility}
              </Badge>

              {recording.duration_ms && (
                <Badge className="absolute bottom-3 right-3 bg-amber-400/90 backdrop-blur text-slate-900 border-0 font-medium shadow-lg">
                  {formatDuration(recording.duration_ms)}
                </Badge>
              )}
            </div>

            <div className="p-4 space-y-3">
              <h3 className="font-serif text-lg font-bold text-white line-clamp-2 text-balance group-hover:text-cyan-400 transition-colors">
                {recording.title || "Untitled Recording"}
              </h3>
              <p className="text-sm text-slate-400">{recording.elders?.name || "Unknown Elder"}</p>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                {recording.language?.name && <span>{recording.language.name}</span>}
                {recording.language?.name && recording.duration_ms && <span>•</span>}
                {recording.duration_ms && <span>{formatDuration(recording.duration_ms)}</span>}
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {recording.recording_categories && (
                  <Badge className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                    {recording.recording_categories.name}
                  </Badge>
                )}
                {recording.traditions && (
                  <Badge className="text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium">
                    {recording.traditions.name}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
