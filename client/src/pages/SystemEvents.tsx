import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Loader2, AlertCircle, Activity, Filter, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SystemEvents() {
  const [dateRange, setDateRange] = useState<"today" | "week" | "month">("week");
  const [eventType, setEventType] = useState<string | undefined>(undefined);

  const eventsQuery = trpc.events.getEvents.useQuery({
    event_type: eventType,
    limit: 100,
    offset: 0,
  });

  const { data: events, isLoading, error } = eventsQuery;

  const eventTypeOptions = [
    { value: undefined, label: "All Events" },
    { value: "recording_created", label: "Recording Created" },
    { value: "recording_updated", label: "Recording Updated" },
    { value: "transcript_created", label: "Transcript Created" },
    { value: "translation_created", label: "Translation Created" },
    { value: "dubbing_created", label: "Dubbing Created" },
    { value: "user_signup", label: "User Sign Up" },
    { value: "user_login", label: "User Login" },
    { value: "consent_updated", label: "Consent Updated" },
    { value: "review_task_created", label: "Review Task Created" },
  ];

  const getEventIcon = (eventType: string) => {
    const iconMap: Record<string, string> = {
      recording_created: "🎙️",
      recording_updated: "✏️",
      transcript_created: "📝",
      translation_created: "🌐",
      dubbing_created: "🔊",
      user_signup: "👤",
      user_login: "🔑",
      consent_updated: "🛡️",
      review_task_created: "✅",
    };
    return iconMap[eventType] || "📌";
  };

  const getEventColor = (eventType: string) => {
    const colorMap: Record<string, string> = {
      recording_created: "bg-blue-50 border-blue-200",
      recording_updated: "bg-yellow-50 border-yellow-200",
      transcript_created: "bg-green-50 border-green-200",
      translation_created: "bg-purple-50 border-purple-200",
      dubbing_created: "bg-pink-50 border-pink-200",
      user_signup: "bg-indigo-50 border-indigo-200",
      user_login: "bg-cyan-50 border-cyan-200",
      consent_updated: "bg-orange-50 border-orange-200",
      review_task_created: "bg-emerald-50 border-emerald-200",
    };
    return colorMap[eventType] || "bg-gray-50 border-gray-200";
  };

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
            <p className="font-medium">Error loading system events</p>
            <p className="text-sm">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white py-12">
        <div className="container">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-8 h-8" />
            <h1 className="font-playfair text-4xl font-bold">System Events & Audit Log</h1>
          </div>
          <p className="text-indigo-100 text-lg">
            Track all system activity, user actions, and content changes in real-time
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        {/* Filters */}
        <div className="bg-white border border-border rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Filter className="w-5 h-5 text-indigo-600" />
            <h2 className="font-playfair font-bold text-xl">Filters</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Event Type Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Event Type</label>
              <select
                value={eventType || ""}
                onChange={(e) => setEventType(e.target.value || undefined)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                {eventTypeOptions.map((option) => (
                  <option key={option.value || "all"} value={option.value || ""}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as any)}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Timeline */}
        <div className="space-y-4">
          <h2 className="font-playfair font-bold text-2xl mb-6">Recent Activity</h2>

          {!events || events.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-muted-foreground text-lg">No events found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event: any, idx: number) => (
                <div
                  key={idx}
                  className={`border rounded-lg p-4 transition-all hover:shadow-md ${getEventColor(
                    event.event_type
                  )}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl flex-shrink-0">
                      {getEventIcon(event.event_type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-playfair font-bold text-lg">
                          {event.event_type
                            .split("_")
                            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(" ")}
                        </h3>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                          {event.target_type || "System"}
                        </span>
                      </div>

                      {event.meta && (
                        <div className="bg-white bg-opacity-50 p-3 rounded mb-3 text-sm text-foreground">
                          <pre className="font-mono text-xs overflow-auto max-h-32">
                            {JSON.stringify(event.meta, null, 2)}
                          </pre>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {event.target_id && (
                          <div className="flex items-center gap-1">
                            <span className="font-medium">ID:</span>
                            <code className="bg-white bg-opacity-50 px-2 py-1 rounded">
                              {event.target_id}
                            </code>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(event.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card">
            <div className="card-body">
              <p className="text-muted-foreground text-sm mb-2">Total Events</p>
              <p className="font-playfair font-bold text-3xl text-indigo-600">
                {events?.length || 0}
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <p className="text-muted-foreground text-sm mb-2">Event Types</p>
              <p className="font-playfair font-bold text-3xl text-indigo-600">
                {new Set(events?.map((e: any) => e.event_type)).size || 0}
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <p className="text-muted-foreground text-sm mb-2">Last 24 Hours</p>
              <p className="font-playfair font-bold text-3xl text-indigo-600">
                {events?.filter((e: any) => {
                  const eventDate = new Date(e.created_at);
                  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                  return eventDate > oneDayAgo;
                }).length || 0}
              </p>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <p className="text-muted-foreground text-sm mb-2">System Health</p>
              <p className="font-playfair font-bold text-3xl text-green-600">Healthy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
