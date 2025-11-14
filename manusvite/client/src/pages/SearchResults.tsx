import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, AlertCircle, Search, Filter, Music, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SearchResults() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "recordings" | "elders" | "playlists">("all");

  // Extract search query from URL params if available
  const urlParams = new URLSearchParams(location.split("?")[1] || "");
  const initialQuery = urlParams.get("q") || "";

  const recordingsQuery = trpc.recordings.search.useQuery(
    { query: searchQuery || initialQuery, limit: 20, offset: 0 },
    { enabled: !!(searchQuery || initialQuery) }
  );

  const { data: searchResults, isLoading, error } = recordingsQuery;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the URL and trigger a new search
  };

  const filteredResults = searchResults?.filter((result: any) => {
    if (filterType === "all") return true;
    if (filterType === "recordings") return result.type === "recording";
    if (filterType === "elders") return result.type === "elder";
    if (filterType === "playlists") return result.type === "playlist";
    return true;
  }) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white py-12">
        <div className="container">
          <div className="flex items-center gap-3 mb-6">
            <Search className="w-8 h-8" />
            <h1 className="font-playfair text-4xl font-bold">Search Results</h1>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search recordings, elders, playlists..."
                value={searchQuery || initialQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
              <Button type="submit" className="bg-gold-600 hover:bg-gold-700 text-white">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Results */}
      <div className="container py-12">
        {/* Filters */}
        <div className="flex items-center gap-3 mb-8">
          <Filter className="w-5 h-5 text-indigo-600" />
          <div className="flex gap-2">
            {(["all", "recordings", "elders", "playlists"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === type
                    ? "bg-indigo-600 text-white"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <p className="text-muted-foreground">
            Found <span className="font-bold text-foreground">{filteredResults.length}</span> results
            {(searchQuery || initialQuery) && (
              <span> for "<span className="font-bold text-foreground">{searchQuery || initialQuery}</span>"</span>
            )}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-8">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="font-medium">Error loading results</p>
              <p className="text-sm">{error.message}</p>
            </div>
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && filteredResults.length === 0 ? (
          <div className="text-center py-16">
            <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
            <p className="text-muted-foreground text-lg mb-4">No results found</p>
            <p className="text-muted-foreground mb-6">Try adjusting your search terms or filters</p>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Search className="w-4 h-4 mr-2" />
              New Search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map((result: any, idx: number) => (
              <div key={idx} className="card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="card-body">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {result.type === "recording" && <Music className="w-5 h-5 text-indigo-600" />}
                      {result.type === "elder" && <Users className="w-5 h-5 text-indigo-600" />}
                      {result.type === "playlist" && <BookOpen className="w-5 h-5 text-indigo-600" />}
                      <h3 className="font-playfair font-bold text-lg">
                        {result.title || result.name}
                      </h3>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                      {result.type || "Item"}
                    </span>
                  </div>

                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {result.description || "No description available"}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      {result.tradition || result.region || "General"}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      result.visibility === 'public'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {String(result.visibility || 'public').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
