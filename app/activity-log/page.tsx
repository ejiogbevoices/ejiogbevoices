import { getServerClient } from "@/lib/supabase/serverClient"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Eye, Edit, Book } from "lucide-react"

export const metadata = {
  title: "Activity Log | Ejiogbe Voices",
  description: "System activity and audit log",
}

export default async function ActivityLogPage() {
  const supabase = await getServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch activity events
  const { data: events } = await supabase
    .from("events")
    .select(
      `
      *,
      users (name)
    `,
    )
    .order("created_at", { ascending: false })
    .limit(50)

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "published":
        return <Book className="w-6 h-6" />
      case "edited":
        return <Edit className="w-6 h-6" />
      case "visibility_changed":
        return <Eye className="w-6 h-6" />
      default:
        return <Book className="w-6 h-6" />
    }
  }

  const getEventDescription = (event: any) => {
    switch (event.event_type) {
      case "published":
        return "Published"
      case "edited":
        return "Edited"
      case "visibility_changed":
        return `Visibility changed to ${event.details?.visibility || "Unknown"}`
      default:
        return event.event_type
    }
  }

  // Group events by date
  const groupedEvents = events?.reduce(
    (acc, event) => {
      const date = new Date(event.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      const isToday = new Date(event.created_at).toDateString() === new Date().toDateString()
      const isYesterday = new Date(event.created_at).toDateString() === new Date(Date.now() - 86400000).toDateString()

      const label = isToday ? "Today" : isYesterday ? "Yesterday" : date

      if (!acc[label]) {
        acc[label] = []
      }
      acc[label].push(event)
      return acc
    },
    {} as Record<string, typeof events>,
  )

  return (
    <div className="min-h-screen bg-[#0D1117] pb-20 md:pb-0">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-serif font-bold text-white">Activity Log</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {groupedEvents &&
          Object.entries(groupedEvents).map(([date, dateEvents]) => (
            <div key={date} className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">{date}</h2>
              <div className="space-y-3">
                {dateEvents.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-4 p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg"
                  >
                    <div className="flex-shrink-0 w-14 h-14 bg-slate-700/50 rounded-lg flex items-center justify-center text-slate-400">
                      {getEventIcon(event.event_type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-white">
                        {event.details?.title || "Story of the Great Flood"}
                      </h3>
                      <p className="text-sm text-slate-400 mt-1">{getEventDescription(event)}</p>
                    </div>
                    <div className="flex-shrink-0 text-sm text-slate-500">
                      {new Date(event.created_at).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
