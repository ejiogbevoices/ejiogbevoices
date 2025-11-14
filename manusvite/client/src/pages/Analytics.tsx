import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2, AlertCircle, BarChart3, TrendingUp, Play, Search, Zap } from "lucide-react";

export default function Analytics() {
  const [dateRange, setDateRange] = useState<"week" | "month" | "year">("month");

  const eventsQuery = trpc.events.getEvents.useQuery({
    event_type: undefined,
    limit: 100,
    offset: 0,
  });

  const { data: events, isLoading, error } = eventsQuery;

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
            <p className="font-medium">Error loading analytics</p>
            <p className="text-sm">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const plays = events?.filter((e: any) => e.event_type === "playback").length || 0;
  const searches = events?.filter((e: any) => e.event_type === "search").length || 0;
  const clipCreations = events?.filter((e: any) => e.event_type === "clip_created").length || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white py-12">
        <div className="container">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-8 h-8" />
            <h1 className="font-playfair text-4xl font-bold">Analytics</h1>
          </div>
          <p className="text-indigo-100 text-lg">
            Track platform usage and engagement metrics
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12">
        {/* Date Range Filter */}
        <div className="flex gap-2 mb-8">
          {(["week", "month", "year"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                dateRange === range
                  ? "bg-indigo-600 text-white"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Plays */}
          <div className="card">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Total Plays</p>
                  <p className="font-playfair text-4xl font-bold text-indigo-600">{plays}</p>
                </div>
                <Play className="w-12 h-12 text-indigo-100" />
              </div>
              <p className="text-xs text-muted-foreground">
                Recordings played by users
              </p>
            </div>
          </div>

          {/* Searches */}
          <div className="card">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Total Searches</p>
                  <p className="font-playfair text-4xl font-bold text-gold-600">{searches}</p>
                </div>
                <Search className="w-12 h-12 text-gold-100" />
              </div>
              <p className="text-xs text-muted-foreground">
                Platform searches performed
              </p>
            </div>
          </div>

          {/* Clips Created */}
          <div className="card">
            <div className="card-body">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Clips Created</p>
                  <p className="font-playfair text-4xl font-bold text-green-600">{clipCreations}</p>
                </div>
                <Zap className="w-12 h-12 text-green-100" />
              </div>
              <p className="text-xs text-muted-foreground">
                User-created clips
              </p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
              <h2 className="font-playfair font-bold text-2xl">Recent Activity</h2>
            </div>

            {!events || events.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No activity recorded yet</p>
            ) : (
              <div className="space-y-3">
                {(events as any[]).slice(0, 20).map((event: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-foreground capitalize">
                        {String(event.event_type).replace(/_/g, " ")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {event.created_at
                          ? new Date(event.created_at).toLocaleString()
                          : "Unknown time"}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      event.event_type === "playback"
                        ? "bg-indigo-100 text-indigo-700"
                        : event.event_type === "search"
                        ? "bg-gold-100 text-gold-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {event.event_type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Insights */}
        <div className="mt-12 bg-indigo-50 rounded-lg p-8 border border-indigo-200">
          <h2 className="font-playfair text-2xl font-bold mb-4">Platform Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-foreground mb-2">Most Engaged Content</h3>
              <p className="text-muted-foreground text-sm">
                Track which recordings, playlists, and collections generate the most engagement through plays, searches, and clip creation.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-2">User Behavior</h3>
              <p className="text-muted-foreground text-sm">
                Understand how users discover and interact with ancestral wisdom through search patterns and content consumption.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
