import { Link } from "wouter";
import { Play, Clock, Globe } from "lucide-react";
import type { Recording } from "../../../drizzle/schema";

interface RecordingCardProps {
  recording: Recording;
  elder?: { name: string };
}

export function RecordingCard({ recording, elder }: RecordingCardProps) {
  const durationMinutes = recording.duration_ms ? Math.floor(recording.duration_ms / 60000) : 0;
  const durationSeconds = recording.duration_ms ? Math.floor((recording.duration_ms % 60000) / 1000) : 0;

  return (
    <Link href={`/recordings/${recording.id}`}>
      <a className="group block h-full">
        <div className="card h-full overflow-hidden hover:shadow-lg transition-shadow">
          {/* Header with gradient background */}
          <div className="relative h-32 bg-gradient-to-br from-indigo-600 to-indigo-800 overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-pattern" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                <Play className="w-6 h-6 text-white fill-white" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="card-body">
            {/* Title */}
            <h3 className="font-playfair font-bold text-lg text-foreground group-hover:text-indigo-600 transition-colors line-clamp-2">
              {recording.title}
            </h3>

            {/* Elder name */}
            {elder && elder.name && (
              <p className="text-sm text-muted-foreground mt-1">
                by <span className="font-medium text-foreground">{String(elder.name)}</span>
              </p>
            )}

            {/* Language and duration */}
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <span>{String(recording.language).toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>
                  {durationMinutes}:{String(durationSeconds).padStart(2, "0")}
                </span>
              </div>
            </div>

            {/* Tags */}
            {Array.isArray(recording.tags) && recording.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {recording.tags.slice(0, 2).map((tag: any) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700"
                  >
                    {tag}
                  </span>
                ))}
                {recording.tags.length > 2 && (
                  <span className="text-xs text-muted-foreground">
                    +{recording.tags.length - 2} more
                  </span>
                )}
              </div>
            )}

            {/* Consent status badge */}
            <div className="mt-4 pt-3 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {recording.consent_status === "public" ? "Public" : "Restricted"}
                </span>
                <div
                  className={`w-2 h-2 rounded-full ${
                    recording.consent_status === "public" ? "bg-green-500" : "bg-yellow-500"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </a>
    </Link>
  );
}
