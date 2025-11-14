import { useState } from "react";
import { RecordingList } from "@/components/RecordingList";
import { Search } from "lucide-react";

export default function Browse() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero section */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white py-16">
        <div className="container">
          <h1 className="font-playfair text-5xl font-bold mb-4">
            Ejiogbe Voices
          </h1>
          <p className="text-indigo-100 text-xl max-w-2xl">
            Discover and preserve ancestral wisdom through time-aligned audio, transcripts, and translations.
          </p>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="mt-8 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search recordings by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Content section */}
      <div className="container py-16">
        {/* Header with filters */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-playfair text-3xl font-bold text-foreground">
                {isSearching ? "Search Results" : "Browse Recordings"}
              </h2>
              {isSearching && (
                <p className="text-muted-foreground mt-2">
                  Results for "{searchQuery}"
                </p>
              )}
            </div>
            {isSearching && (
              <button
                onClick={handleClearSearch}
                className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        </div>

        {/* Recording grid */}
        <RecordingList searchQuery={isSearching ? searchQuery : undefined} />
      </div>

      {/* Featured section */}
      {!isSearching && (
        <div className="bg-indigo-50 border-t border-indigo-200 py-16">
          <div className="container">
            <h3 className="font-playfair text-2xl font-bold text-foreground mb-8">
              About Ejiogbe Voices
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                  🎙️
                </div>
                <h4 className="font-playfair font-bold text-lg">Authentic Recordings</h4>
                <p className="text-muted-foreground">
                  High-quality audio recordings of ancestral wisdom, stories, and cultural knowledge.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-gold-500 text-white flex items-center justify-center font-bold text-lg">
                  📝
                </div>
                <h4 className="font-playfair font-bold text-lg">Time-Aligned Transcripts</h4>
                <p className="text-muted-foreground">
                  Precise transcripts synchronized with audio, enabling deep engagement with content.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-indigo-400 text-white flex items-center justify-center font-bold text-lg">
                  🌍
                </div>
                <h4 className="font-playfair font-bold text-lg">Multilingual</h4>
                <p className="text-muted-foreground">
                  Translations and dubbing in multiple languages to reach global audiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
