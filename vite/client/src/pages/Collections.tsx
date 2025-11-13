import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2, AlertCircle, BookOpen, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function Collections() {
  const playlistsQuery = trpc.playlists.listPublic.useQuery({
    limit: 20,
    offset: 0,
  });

  const { data: playlists, isLoading, error } = playlistsQuery;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12">
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Error loading collections</p>
            <p className="text-sm">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-gold-600 text-white py-16">
        <div className="container">
          <div className="flex items-center gap-4 mb-4">
            <Sparkles className="w-8 h-8" />
            <h1 className="font-playfair text-5xl font-bold">Curated Collections</h1>
          </div>
          <p className="text-indigo-100 text-xl max-w-2xl">
            Explore carefully curated collections of ancestral wisdom, organized by theme, tradition, and cultural significance.
          </p>
        </div>
      </div>

      {/* Featured Collections */}
      <div className="container py-16">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            <h2 className="font-playfair text-3xl font-bold">Featured Collections</h2>
          </div>

          {!playlists || playlists.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-muted-foreground text-lg">No collections available yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.map((playlist: any) => (
                <Link
                  key={playlist.id}
                  href={`/playlists/${playlist.id}`}
                  className="group"
                >
                  <div className="card h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="card-body">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-playfair font-bold text-xl group-hover:text-indigo-600 transition-colors">
                          {playlist.title}
                        </h3>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                          Collection
                        </span>
                      </div>

                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {playlist.description || "A curated collection of ancestral wisdom"}
                      </p>

                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <span className="text-xs text-muted-foreground">
                          {playlist.item_count || 0} recordings
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          playlist.visibility === 'public'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {String(playlist.visibility).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Topics Grid */}
        <div className="mt-16">
          <h2 className="font-playfair text-3xl font-bold mb-8">Browse by Topic</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Spiritual Practices", icon: "🙏", count: 24 },
              { name: "Oral History", icon: "📖", count: 18 },
              { name: "Music & Chants", icon: "🎵", count: 15 },
              { name: "Healing Traditions", icon: "🌿", count: 12 },
              { name: "Coming of Age", icon: "👥", count: 10 },
              { name: "Ancestral Stories", icon: "📚", count: 22 },
              { name: "Language & Linguistics", icon: "🗣️", count: 8 },
              { name: "Ceremonies", icon: "✨", count: 14 },
            ].map((topic) => (
              <div
                key={topic.name}
                className="card hover:shadow-md transition-all hover:bg-indigo-50 cursor-pointer"
              >
                <div className="card-body text-center">
                  <div className="text-4xl mb-2">{topic.icon}</div>
                  <h3 className="font-playfair font-bold text-lg mb-1">{topic.name}</h3>
                  <p className="text-sm text-muted-foreground">{topic.count} recordings</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* About Section */}
        <div className="mt-16 bg-indigo-50 rounded-lg p-8 border border-indigo-200">
          <h2 className="font-playfair text-2xl font-bold mb-4">About Our Collections</h2>
          <p className="text-foreground mb-4">
            Each collection is carefully curated by cultural experts and community members to ensure authenticity, respect, and cultural accuracy. Collections are organized to help learners and researchers navigate ancestral wisdom in meaningful ways.
          </p>
          <p className="text-foreground">
            Whether you're exploring your own heritage or learning about other cultures, our collections provide a structured gateway into the rich traditions of the world's ancestral communities.
          </p>
        </div>
      </div>
    </div>
  );
}
