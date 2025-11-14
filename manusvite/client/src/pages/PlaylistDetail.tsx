import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, AlertCircle, Play, Share2, BookmarkPlus, Music, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShareButton } from "@/components/ShareButton";

export default function PlaylistDetail() {
  const params = useParams();
  const playlistId = params?.id as string;
  const [, setLocation] = useLocation();

  const playlistQuery = trpc.playlists.getById.useQuery(
    { id: playlistId },
    { enabled: !!playlistId }
  );

  const { data: playlist, isLoading, error } = playlistQuery;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="container py-12">
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Playlist not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white py-16">
        <div className="container">
          <div className="flex items-center gap-3 mb-4">
            <Music className="w-8 h-8" />
            <h1 className="font-playfair text-5xl font-bold">{playlist.title}</h1>
          </div>
          <p className="text-indigo-100 text-lg max-w-2xl mb-6">
            {playlist.description || "A curated collection of ancestral wisdom"}
          </p>
          <div className="flex items-center gap-4">
            <Button className="bg-white text-indigo-600 hover:bg-indigo-50">
              <Play className="w-4 h-4 mr-2" />
              Play All
            </Button>
            <ShareButton 
              recordingId={playlistId}
              recordingTitle={playlist.title}
              recordingUrl={`${window.location.origin}/playlists/${playlistId}`}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Playlist Info */}
            <div className="card mb-8">
              <div className="card-body">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Recordings</p>
                    <p className="font-playfair font-bold text-2xl text-indigo-600">
                      {playlist.items?.length || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Visibility</p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      playlist.visibility === 'public'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {String(playlist.visibility).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">Created</p>
                    <p className="font-medium text-foreground">
                      {playlist.created_at ? new Date(playlist.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recordings List */}
            <div className="card">
              <div className="card-body">
                <h2 className="font-playfair font-bold text-2xl mb-6">Recordings in this Playlist</h2>
                
                {!playlist.items || playlist.items.length === 0 ? (
                  <div className="text-center py-12">
                    <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
                    <p className="text-muted-foreground text-lg">No recordings in this playlist yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {playlist.items?.map((item: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer"
                      >
                        <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                          <Play className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground">Recording {idx + 1}</p>
                          <p className="text-sm text-muted-foreground">Elder Name • Tradition</p>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground text-sm">
                          <Clock className="w-4 h-4" />
                          <span>5:32</span>
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
            {/* Curator Info */}
            <div className="card">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-4">
                  <User className="w-6 h-6 text-indigo-600" />
                  <h3 className="font-playfair font-bold text-lg">Curator</h3>
                </div>
                <p className="text-foreground font-medium mb-2">Curated by Community</p>
                <p className="text-sm text-muted-foreground">
                  This collection has been carefully curated by cultural experts and community members.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="card">
              <div className="card-body space-y-3">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                  <BookmarkPlus className="w-4 h-4 mr-2" />
                  Save Playlist
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* About */}
            <div className="card">
              <div className="card-body">
                <h3 className="font-playfair font-bold text-lg mb-3">About</h3>
                <p className="text-sm text-muted-foreground">
                  Playlists are curated collections of recordings organized by theme, tradition, or cultural significance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
