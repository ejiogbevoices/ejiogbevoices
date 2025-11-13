import Link from "next/link"

interface RecordingCardProps {
  recording: any
}

export function RecordingCard({ recording }: RecordingCardProps) {
  const elder = recording.elders
  const tradition = recording.traditions
  const language = recording.primary_language
  const category = recording.recording_categories

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
    <Link href={`/recordings/${recording.id}`}>
      <div className="bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer h-full rounded-lg border border-slate-700 overflow-hidden">
        <div className="p-4 pb-3">
          <div className="flex items-start gap-3">
            {elder && elder.photo_url && (
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-slate-700">
                <img
                  src={elder.photo_url || "/placeholder.svg"}
                  alt={elder.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {elder && !elder.photo_url && (
              <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                <span className="text-slate-400 text-xs">👤</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold line-clamp-2 text-balance text-white">
                {recording.title || "Untitled Recording"}
              </h3>
              {elder && <p className="text-sm text-slate-400 mt-1">{elder.name}</p>}
            </div>
          </div>
        </div>
        <div className="px-4 pb-4 space-y-3">
          {recording.summary && <p className="text-sm text-slate-400 line-clamp-2">{recording.summary}</p>}
          <div className="flex flex-wrap gap-2">
            {category && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500 text-slate-900">
                {category.name}
              </span>
            )}
            {tradition && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-200">
                {tradition.name}
              </span>
            )}
            {language && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-slate-600 text-slate-300">
                {language.name}
              </span>
            )}
          </div>
          {recording.duration_ms && (
            <div className="flex items-center gap-1.5 text-sm text-slate-400">
              <span>🕐</span>
              <span>{formatDuration(recording.duration_ms)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
