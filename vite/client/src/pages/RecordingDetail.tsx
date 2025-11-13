import { useParams } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { AudioPlayer } from "@/components/AudioPlayer";
import { TranscriptViewer } from "@/components/TranscriptViewer";
import { Loader2, AlertCircle, Globe, Clock, Share2 } from "lucide-react";
import { ShareButton } from "@/components/ShareButton";

export default function RecordingDetail() {
  const params = useParams();
  const recordingId = params?.id as string;
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Fetch recording
  const recordingQuery = trpc.recordings.getById.useQuery(
    { id: recordingId },
    { enabled: !!recordingId }
  );

  // Fetch transcript segments
  const transcriptQuery = trpc.transcript.getByRecording.useQuery(
    { recording_id: recordingId },
    { enabled: !!recordingId }
  );

  const { data: recording, isLoading: recordingLoading, error: recordingError } = recordingQuery;
  const { data: segments, isLoading: transcriptLoading } = transcriptQuery;

  if (recordingLoading || transcriptLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (recordingError || !recording) {
    return (
      <div className="container py-12">
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Recording not found</p>
            <p className="text-sm">This recording may have been deleted or you don't have access to it.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero section */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white py-12">
        <div className="container">
          <h1 className="font-playfair text-4xl font-bold mb-4">{recording.title}</h1>
          <p className="text-indigo-100 text-lg">
            A recording from the Ejiogbe Voices archive
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Player and metadata */}
          <div className="lg:col-span-2 space-y-6">
            {/* Audio player */}
            <AudioPlayer
              audioUrl={recording.storage_url}
              title={recording.title}
              onTimeUpdate={setCurrentTime}
              onDurationChange={setDuration}
            />

            {/* Share button */}
            <div className="flex gap-2">
              <ShareButton
                recordingId={recording.id}
                recordingTitle={recording.title}
              />
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card-body">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Language</p>
                <div className="flex items-center gap-2 mt-2">
                  <Globe className="w-5 h-5 text-indigo-600" />
                  <p className="font-medium text-foreground">
                    {String(recording.language).toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="card-body">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Duration</p>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="w-5 h-5 text-indigo-600" />
                  <p className="font-medium text-foreground">
                    {Math.floor(duration / 60000)}:{String(Math.floor((duration % 60000) / 1000)).padStart(2, "0")}
                  </p>
                </div>
              </div>
            </div>

            {/* Consent and visibility info */}
            {recording.consent_status && (
              <div className="card">
                <div className="card-body">
                  <h3 className="font-playfair font-bold text-lg mb-3">Consent & Access</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Consent Status:</span>
                      <span className="font-medium text-foreground capitalize">
                        {recording.consent_status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Visibility:</span>
                      <span className="font-medium text-foreground capitalize">
                        {recording.visibility}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Share button */}
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gold-500 text-gray-900 font-medium rounded-lg hover:bg-gold-600 transition-colors">
              <Share2 className="w-5 h-5" />
              Share Recording
            </button>
          </div>

          {/* Right column: Transcript */}
          <div className="space-y-6">
            <div className="card">
              <div className="card-header">
                <h3 className="font-playfair font-bold text-lg">Transcript</h3>
              </div>
              <div className="card-body">
                {segments && segments.length > 0 ? (
                  <TranscriptViewer
                    segments={segments}
                    currentTime={currentTime}
                    onSegmentClick={(startMs) => {
                      // This would be connected to the audio player
                      // For now, just log it
                      console.log("Seek to", startMs);
                    }}
                    language={recording.language}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No transcript available yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
