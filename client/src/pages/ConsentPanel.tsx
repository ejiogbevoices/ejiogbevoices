import { useState } from "react";
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, AlertCircle, FileText, Shield } from "lucide-react";

export default function ConsentPanel() {
  const params = useParams();
  const recordingId = params?.id as string;
  const [showForm, setShowForm] = useState(false);

  const recordingQuery = trpc.recordings.getById.useQuery(
    { id: recordingId },
    { enabled: !!recordingId }
  );

  const { data: recording, isLoading, error } = recordingQuery;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !recording) {
    return (
      <div className="container py-12">
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Recording not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white py-12">
        <div className="container">
          <h1 className="font-playfair text-4xl font-bold mb-4">Consent & Provenance</h1>
          <p className="text-indigo-100 text-lg">
            Recording: {recording.title}
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Consent Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Consent Status */}
            <div className="card">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-indigo-600" />
                  <h2 className="font-playfair font-bold text-2xl">Consent Status</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-foreground font-medium">Current Status</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      recording.consent_status === 'public'
                        ? 'bg-green-100 text-green-700'
                        : recording.consent_status === 'members'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {String(recording.consent_status).toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-foreground font-medium">Visibility</span>
                    <span className="text-foreground font-medium">
                      {String(recording.visibility).toUpperCase()}
                    </span>
                  </div>

                  {recording.embargo_until && (
                    <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <span className="text-foreground font-medium">Embargo Until</span>
                      <span className="text-yellow-700 font-medium">
                        {new Date(recording.embargo_until).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Provenance Information */}
            <div className="card">
              <div className="card-body">
                <h2 className="font-playfair font-bold text-2xl mb-4">Provenance</h2>
                {recording.provenance_notes ? (
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-foreground whitespace-pre-wrap">
                      {recording.provenance_notes}
                    </p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No provenance notes available</p>
                )}
              </div>
            </div>

            {/* Consent Documents */}
            <div className="card">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-6 h-6 text-indigo-600" />
                  <h2 className="font-playfair font-bold text-2xl">Consent Documents</h2>
                </div>
                {recording.consent_documents ? (
                  <div className="space-y-3">
                    {Array.isArray(recording.consent_documents) ? (
                      (recording.consent_documents as any[]).map((doc: any, idx: number) => (
                        <a
                          key={idx}
                          href={String(doc.url || doc)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          <FileText className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="font-medium text-indigo-600">
                              {typeof doc === 'string' ? `Document ${idx + 1}` : doc.name || `Document ${idx + 1}`}
                            </p>
                          </div>
                        </a>
                      ))
                    ) : (
                      <a
                        href={String(recording.consent_documents)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        <FileText className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                        <p className="font-medium text-indigo-600">View Consent Document</p>
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No consent documents attached</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card">
              <div className="card-body">
                <h3 className="font-playfair font-bold text-lg mb-4">About Consent</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Consent is fundamental to ethical cultural preservation. This recording has been obtained with proper consent from the speaker and their community.
                </p>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-foreground mb-1">Public</p>
                    <p className="text-muted-foreground">Available to all users</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Members</p>
                    <p className="text-muted-foreground">Available to registered members only</p>
                  </div>
                  <div>
                    <p className="font-medium text-foreground mb-1">Restricted</p>
                    <p className="text-muted-foreground">Limited access based on permissions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
