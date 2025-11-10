import { useEffect, useRef, useState } from "react";
import type { TranscriptSegment } from "../../../drizzle/schema";
import { ChevronDown, ChevronUp } from "lucide-react";

interface TranscriptViewerProps {
  segments: TranscriptSegment[];
  currentTime: number;
  onSegmentClick: (startMs: number) => void;
  language?: string;
}

export function TranscriptViewer({
  segments,
  currentTime,
  onSegmentClick,
  language = "en",
}: TranscriptViewerProps) {
  const [expandedSegment, setExpandedSegment] = useState<string | null>(null);
  const activeSegmentRef = useRef<HTMLDivElement>(null);

  // Find the currently playing segment
  const activeSegmentIndex = segments.findIndex(
    (seg) => currentTime >= seg.start_ms && currentTime < seg.end_ms
  );

  // Auto-scroll to active segment
  useEffect(() => {
    if (activeSegmentRef.current) {
      activeSegmentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeSegmentIndex]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {segments.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>No transcript available</p>
        </div>
      ) : (
        segments.map((segment, index) => {
          const isActive = index === activeSegmentIndex;
          const isExpanded = expandedSegment === segment.id;

          return (
            <div
              key={segment.id}
              ref={isActive ? activeSegmentRef : null}
              onClick={() => onSegmentClick(segment.start_ms)}
              className={`p-3 rounded-lg cursor-pointer transition-all ${
                isActive
                  ? "bg-indigo-100 border-l-4 border-indigo-600"
                  : "bg-muted hover:bg-muted/80 border-l-4 border-transparent"
              }`}
            >
              {/* Header with timestamp and expand button */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    {formatTime(segment.start_ms)} - {formatTime(segment.end_ms)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedSegment(isExpanded ? null : segment.id);
                  }}
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Transcript text */}
              <p
                className={`mt-2 text-sm text-foreground leading-relaxed ${
                  isExpanded ? "" : "line-clamp-2"
                }`}
              >
                {segment.text_original}
              </p>

              {/* QC Status badge */}
              {segment.qc_status && (
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      segment.qc_status === "approved"
                        ? "bg-green-100 text-green-700"
                        : segment.qc_status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {segment.qc_status}
                  </span>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
