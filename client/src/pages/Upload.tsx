import { useState } from "react";
import { useLocation } from "wouter";
import { AudioUploadForm } from "@/components/AudioUploadForm";
import { useAuth } from "@/_core/hooks/useAuth";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function Upload() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedTradition, setSelectedTradition] = useState("");
  const [selectedElder, setSelectedElder] = useState("");

  // Placeholder data - in a real app, these would come from tRPC queries
  const traditions = [
    { id: "trad-1", name: "Ejiogbe Tradition" },
    { id: "trad-2", name: "Ifa Divination" },
  ];

  const elders = [
    { id: "elder-1", name: "Elder Adeyemi", tradition_id: "trad-1" },
    { id: "elder-2", name: "Elder Okonkwo", tradition_id: "trad-1" },
    { id: "elder-3", name: "Elder Amara", tradition_id: "trad-2" },
  ];

  const filteredElders = selectedTradition
    ? elders.filter((e) => e.tradition_id === selectedTradition)
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto" />
          <h2 className="font-playfair text-2xl font-bold text-foreground">
            Sign In Required
          </h2>
          <p className="text-muted-foreground">
            You must be signed in to upload recordings.
          </p>
          <button
            onClick={() => setLocation("/")}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white py-12">
        <div className="container">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-indigo-100 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Browse
          </button>
          <h1 className="font-playfair text-4xl font-bold">Upload Recording</h1>
          <p className="text-indigo-100 text-lg mt-2">
            Share ancestral wisdom with the Ejiogbe Voices community
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          {!showUploadForm ? (
            <div className="space-y-8">
              {/* Info section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
                <h2 className="font-playfair text-xl font-bold text-foreground">
                  Before You Upload
                </h2>
                <ul className="space-y-3 text-sm text-foreground">
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold">1.</span>
                    <span>
                      Ensure you have proper consent from the speaker to record and share their voice
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold">2.</span>
                    <span>
                      Audio should be clear and in a supported format (MP3, WAV, OGG, M4A)
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold">3.</span>
                    <span>
                      Maximum file size is 500MB. Longer recordings will be transcribed automatically
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold">4.</span>
                    <span>
                      Transcription typically takes 2-5 minutes depending on audio length
                    </span>
                  </li>
                </ul>
              </div>

              {/* Selection form */}
              <div className="card space-y-6">
                <div>
                  <h3 className="font-playfair text-xl font-bold text-foreground mb-4">
                    Select Tradition & Elder
                  </h3>

                  {/* Tradition selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Tradition *
                    </label>
                    <select
                      value={selectedTradition}
                      onChange={(e) => {
                        setSelectedTradition(e.target.value);
                        setSelectedElder(""); // Reset elder selection
                      }}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    >
                      <option value="">Choose a tradition...</option>
                      {traditions.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-muted-foreground mt-2">
                      Select the cultural tradition this recording belongs to
                    </p>
                  </div>

                  {/* Elder selection */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Elder *
                    </label>
                    <select
                      value={selectedElder}
                      onChange={(e) => setSelectedElder(e.target.value)}
                      disabled={!selectedTradition}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {selectedTradition
                          ? "Choose an elder..."
                          : "Select a tradition first"}
                      </option>
                      {filteredElders.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-muted-foreground mt-2">
                      Select the elder whose voice is in this recording
                    </p>
                  </div>
                </div>

                {/* Continue button */}
                <button
                  onClick={() => setShowUploadForm(true)}
                  disabled={!selectedTradition || !selectedElder}
                  className="w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Continue to Upload
                </button>
              </div>
            </div>
          ) : (
            <AudioUploadForm
              traditionId={selectedTradition}
              elderId={selectedElder}
              onSuccess={(recordingId, jobId) => {
                // Show success message and redirect
                setLocation(`/recordings/${recordingId}`);
              }}
              onClose={() => setShowUploadForm(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
