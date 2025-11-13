import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2, Volume2, Download, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface DubManagerProps {
  recordingId: string;
  onDubComplete?: () => void;
}

export function DubManager({ recordingId, onDubComplete }: DubManagerProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedVoice, setSelectedVoice] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  // Get supported languages
  const { data: languages } = trpc.dubbing.getSupportedLanguages.useQuery();

  // Get voices for selected language
  const { data: voices } = trpc.dubbing.getVoices.useQuery(
    { language: selectedLanguage },
    { enabled: !!selectedLanguage }
  );

  // Get existing dubs
  const { data: dubs, refetch: refetchDubs } = trpc.dubbing.getDubs.useQuery({
    recording_id: recordingId,
  });

  // Get dubbing job status
  const { data: jobs, refetch: refetchJobs } = trpc.dubbing.getRecordingJobs.useQuery({
    recording_id: recordingId,
  });

  // Dub recording mutation
  const dubRecordingMutation = trpc.dubbing.dubRecording.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      setIsLoading(false);
      setTimeout(() => {
        refetchDubs();
        refetchJobs();
        onDubComplete?.();
      }, 2000);
    },
    onError: (error) => {
      toast.error(`Failed to queue dubbing: ${error.message}`);
      setIsLoading(false);
    },
  });

  const handleDubRecording = async () => {
    setIsLoading(true);
    try {
      await dubRecordingMutation.mutateAsync({
        recording_id: recordingId,
        language: selectedLanguage,
        voice_id: selectedVoice,
      });
    } catch (error) {
      console.error("Dubbing error:", error);
    }
  };

  // Auto-refresh job status
  useEffect(() => {
    const interval = setInterval(() => {
      refetchJobs();
    }, 3000);

    return () => clearInterval(interval);
  }, [refetchJobs]);

  const pendingJobs = jobs?.filter((j) => j.status === "queued" || j.status === "running") || [];
  const completedJobs = jobs?.filter((j) => j.status === "completed") || [];

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg border border-border">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-indigo-600" />
          Synthetic Dubbing Manager
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Create synthetic voice dubs of this recording in different languages
        </p>
      </div>

      {/* Existing Dubs */}
      {dubs && dubs.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Available Dubs</h4>
          <div className="grid gap-2">
            {dubs.map((dub) => (
              <div
                key={dub.id}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-foreground">
                      {dub.language_code.toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {dub.is_synthetic ? "Synthetic" : "Original"}
                    </p>
                  </div>
                </div>
                <a
                  href={dub.audio_url}
                  download
                  className="flex items-center gap-1 px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dubbing Form */}
      <div className="space-y-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
        <h4 className="font-medium text-foreground">Create New Dub</h4>

        {/* Language Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Language
          </label>
          <select
            value={selectedLanguage}
            onChange={(e) => {
              setSelectedLanguage(e.target.value);
              setSelectedVoice(undefined);
            }}
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            {languages?.map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Voice Selection */}
        {voices && voices.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Voice
            </label>
            <select
              value={selectedVoice || ""}
              onChange={(e) => setSelectedVoice(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="">Select a voice</option>
              {voices.map((voice) => (
                <option key={voice.id} value={voice.id}>
                  {voice.name} {voice.accent ? `(${voice.accent})` : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleDubRecording}
          disabled={isLoading || !selectedLanguage}
          className="w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating dubs...
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              Create Dubs
            </>
          )}
        </button>

        {/* Disclosure */}
        <div className="flex gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-900">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            Synthetic dubs will include a disclosure label indicating they were created using
            ElevenLabs voice technology.
          </p>
        </div>
      </div>

      {/* Job Status */}
      {pendingJobs.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Processing Jobs</h4>
          <div className="grid gap-2">
            {pendingJobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-sm text-blue-900">
                    {job.status === "running" ? "Processing..." : "Queued"}
                  </span>
                </div>
                <span className="text-xs text-blue-700 font-medium">
                  {new Date(job.updated_at || new Date()).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Jobs */}
      {completedJobs.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-foreground">Completed</h4>
          <div className="grid gap-2">
            {completedJobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-900">Dubbing complete</span>
                </div>
                <span className="text-xs text-green-700 font-medium">
                  {new Date(job.completed_at || job.updated_at || new Date()).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
