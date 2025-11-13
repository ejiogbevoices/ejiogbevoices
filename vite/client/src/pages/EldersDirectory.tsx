import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Users, Search, Loader2 } from "lucide-react";

export default function EldersDirectory() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTradition, setSelectedTradition] = useState<string>();

  // Get elders
  const { data: elders, isLoading } = trpc.elders.list.useQuery({
    tradition_id: selectedTradition,
    limit: 100,
  });

  // Filter by search
  const filteredElders = elders?.filter(
    (elder) =>
      elder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      elder.bio?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-8 h-8" />
            <h1 className="font-playfair text-4xl font-bold">Elders Directory</h1>
          </div>
          <p className="text-indigo-100 text-lg">
            Meet the wisdom keepers and cultural bearers preserving ancestral traditions
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-3 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search elders by name or bio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : filteredElders && filteredElders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredElders.map((elder) => (
              <button
                key={elder.id}
                onClick={() => setLocation(`/elders/${elder.id}`)}
                className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden text-left"
              >
                {/* Photo */}
                {elder.photo_url && (
                  <div className="h-48 bg-gradient-to-br from-indigo-200 to-blue-200 overflow-hidden">
                    <img
                      src={elder.photo_url}
                      alt={elder.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                )}

                {/* Info */}
                <div className="p-6">
                  <h3 className="font-semibold text-lg text-foreground mb-2">
                    {elder.name}
                  </h3>

                  {elder.lineage && (
                    <p className="text-sm text-muted-foreground mb-3">
                      <span className="font-medium">Lineage:</span> {elder.lineage}
                    </p>
                  )}

                  {elder.bio && (
                    <p className="text-sm text-foreground line-clamp-3 mb-4">
                      {elder.bio}
                    </p>
                  )}

                  {Array.isArray(elder.languages) && elder.languages.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {(elder.languages as string[]).map((lang: string) => (
                        <span
                          key={lang}
                          className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                {/* CTA */}
                <div className="px-6 pb-6 border-t border-border">
                  <p className="text-sm text-indigo-600 font-medium group-hover:text-indigo-700">
                    View Profile →
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg">
              {searchQuery ? "No elders found matching your search" : "No elders available"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
