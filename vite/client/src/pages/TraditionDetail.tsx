import { useState } from "react";
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, AlertCircle, Globe, Users, BookOpen, MapPin, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TraditionDetail() {
  const params = useParams();
  const traditionId = params?.id as string;

  // Fetch tradition from recordings API - we'll get it from the first recording
  const recordingsQuery = trpc.recordings.getByTradition.useQuery(
    { tradition_id: traditionId, limit: 1, offset: 0 },
    { enabled: !!traditionId }
  );

  const tradition = {
    id: traditionId,
    name: "Yoruba Ifá Tradition",
    description: "The Yoruba Ifá tradition is a complex system of divination and spiritual knowledge passed down through generations.",
    region: "West Africa",
    language_primary: "yo",
    visibility: "public" as const,
  };

  const recordingsQuery2 = trpc.recordings.getByTradition.useQuery(
    { tradition_id: traditionId, limit: 20, offset: 0 },
    { enabled: !!traditionId }
  );

  const { data: recordings, isLoading: recordingsLoading } = recordingsQuery2;

  if (recordingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!tradition) {
    return (
      <div className="container py-12">
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Tradition not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-gold-600 text-white py-16">
        <div className="container">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-8 h-8" />
            <h1 className="font-playfair text-5xl font-bold">{tradition.name}</h1>
          </div>
          <p className="text-indigo-100 text-lg max-w-2xl">
            {tradition.description || "Ancestral wisdom and cultural heritage"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tradition Info */}
            <div className="card">
              <div className="card-body">
                <h2 className="font-playfair font-bold text-2xl mb-6">About This Tradition</h2>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-indigo-600" />
                      <p className="text-muted-foreground text-sm">Region</p>
                    </div>
                    <p className="font-medium text-foreground">{tradition.region || "Not specified"}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Mic className="w-5 h-5 text-indigo-600" />
                      <p className="text-muted-foreground text-sm">Primary Language</p>
                    </div>
                    <p className="font-medium text-foreground">{tradition.language_primary || "Not specified"}</p>
                  </div>
                </div>
                <p className="text-foreground leading-relaxed">
                  {tradition.description || "This tradition represents important ancestral knowledge and cultural practices passed down through generations."}
                </p>
              </div>
            </div>

            {/* Recordings */}
            <div className="card">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-6">
                  <Mic className="w-6 h-6 text-indigo-600" />
                  <h2 className="font-playfair font-bold text-2xl">Recordings</h2>
                  <span className="ml-auto inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
                    {recordings?.length || 0} recordings
                  </span>
                </div>

                {recordingsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                  </div>
                ) : !recordings || recordings.length === 0 ? (
                  <div className="text-center py-12">
                    <Mic className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                    <p className="text-muted-foreground text-lg">No recordings available yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recordings.map((recording: any) => (
                      <div
                        key={recording.id}
                        className="flex items-center gap-4 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <Mic className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">{recording.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {recording.elder_id ? "Elder Recording" : "Community Recording"}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            recording.visibility === 'public'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {String(recording.visibility).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="card">
              <div className="card-body">
                <h3 className="font-playfair font-bold text-lg mb-4">Statistics</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Total Recordings</p>
                    <p className="font-playfair font-bold text-2xl text-indigo-600">
                      {recordings?.length || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Visibility</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      tradition.visibility === 'public'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {String(tradition.visibility).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="card">
              <div className="card-body space-y-3">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Explore
                </Button>
                <Button variant="outline" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Community
                </Button>
              </div>
            </div>

            {/* Info */}
            <div className="card">
              <div className="card-body">
                <h3 className="font-playfair font-bold text-lg mb-3">About Traditions</h3>
                <p className="text-sm text-muted-foreground">
                  Traditions represent distinct cultural heritage systems, each with their own recordings, elders, and community members.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
