import { useState, useRef } from "react";
import { Upload, AlertCircle, CheckCircle, Loader2, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface AudioUploadFormProps {
  traditionId: string;
  elderId: string;
  onSuccess?: (recordingId: string, jobId: string) => void;
  onClose?: () => void;
}

export function AudioUploadForm({
  traditionId,
  elderId,
  onSuccess,
  onClose,
}: AudioUploadFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    language: "en",
    tags: [] as string[],
    consent_status: "private" as const,
    visibility: "private" as const,
  });

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tagInput, setTagInput] = useState("");

  const createRecordingMutation = trpc.upload.createRecording.useMutation();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("audio/")) {
      toast.error("Please select an audio file");
      return;
    }

    // Validate file size (max 500MB)
    if (file.size > 500 * 1024 * 1024) {
      toast.error("File size must be less than 500MB");
      return;
    }

    setAudioFile(file);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!audioFile) {
      toast.error("Please select an audio file");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    setIsUploading(true);

    try {
      // Simulate file upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 30;
        });
      }, 500);

      // In a real app, you would upload to Firebase Storage or similar
      // For now, we'll use a placeholder URL
      const storageUrl = `https://storage.example.com/${audioFile.name}`;

      // Create the recording and queue transcription
      const result = await createRecordingMutation.mutateAsync({
        title: formData.title,
        tradition_id: traditionId,
        elder_id: elderId,
        language: formData.language,
        storage_url: storageUrl,
        consent_status: formData.consent_status,
        visibility: formData.visibility,
        tags: formData.tags,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      toast.success("Recording uploaded successfully! Transcription in progress...");

      // Reset form
      setAudioFile(null);
      setFormData({
        title: "",
        language: "en",
        tags: [],
        consent_status: "private",
        visibility: "private",
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      onSuccess?.(result.recording_id, result.transcription_job_id);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload recording"
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-6 flex items-center justify-between">
          <h2 className="font-playfair text-2xl font-bold">Upload Recording</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-indigo-700 rounded transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* File upload area */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Audio File *
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-indigo-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {audioFile ? (
                <div className="space-y-2">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                  <p className="font-medium text-foreground">{audioFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-12 h-12 text-indigo-400 mx-auto" />
                  <p className="font-medium text-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-muted-foreground">
                    MP3, WAV, OGG, M4A (max 500MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Recording Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="e.g., Morning Prayers - Part 1"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Language
            </label>
            <select
              value={formData.language}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, language: e.target.value }))
              }
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="en">English</option>
              <option value="yo">Yoruba</option>
              <option value="fr">French</option>
              <option value="es">Spanish</option>
              <option value="de">German</option>
              <option value="pt">Portuguese</option>
              <option value="zh">Chinese</option>
              <option value="ja">Japanese</option>
              <option value="ar">Arabic</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tags
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add a tag and press Enter"
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Add
              </button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-indigo-900"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Consent Status */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Consent Status *
            </label>
            <select
              value={formData.consent_status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  consent_status: e.target.value as any,
                }))
              }
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="pending">Pending Review</option>
              <option value="public">Public</option>
              <option value="members">Members Only</option>
              <option value="institution">Institution Only</option>
              <option value="private">Private</option>
              <option value="restricted">Restricted</option>
            </select>
            <p className="text-xs text-muted-foreground mt-2">
              Determines who can access this recording
            </p>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Visibility
            </label>
            <select
              value={formData.visibility}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  visibility: e.target.value as any,
                }))
              }
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              <option value="public">Public</option>
              <option value="members">Members Only</option>
              <option value="institution">Institution Only</option>
              <option value="private">Private</option>
            </select>
          </div>

          {/* Info box */}
          <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium">Transcription will start automatically</p>
              <p className="text-xs mt-1">
                Your audio will be transcribed using Google Speech-to-Text. This may take a few minutes depending on the length of the recording.
              </p>
            </div>
          </div>

          {/* Progress bar */}
          {isUploading && uploadProgress > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Uploading...</span>
                <span className="font-medium">{Math.round(uploadProgress)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || !audioFile || !formData.title}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Recording
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
