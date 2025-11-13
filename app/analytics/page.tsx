import { getServerClient } from "@/lib/supabase/serverClient"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata = {
  title: "Analytics | Ejiogbe Voices",
  description: "View platform analytics",
}

export default async function AnalyticsPage() {
  const supabase = await getServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Mock analytics data - would come from actual analytics tracking
  const analytics = {
    searches: 1234,
    plays: 5678,
    clipCreations: 89,
    playlistViews: 456,
  }

  return (
    <div className="min-h-screen bg-[#0D1117] pb-20 md:pb-0">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-serif font-bold text-white">Analytics</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
            <p className="text-sm text-slate-400 mb-2">Searches</p>
            <p className="text-4xl font-bold text-white">{analytics.searches.toLocaleString()}</p>
          </div>
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
            <p className="text-sm text-slate-400 mb-2">Plays</p>
            <p className="text-4xl font-bold text-white">{analytics.plays.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
            <p className="text-sm text-slate-400 mb-2">Clip Creations</p>
            <p className="text-4xl font-bold text-white">{analytics.clipCreations}</p>
          </div>
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
            <p className="text-sm text-slate-400 mb-2">Most-Used Playlists</p>
            <p className="text-4xl font-bold text-white">{analytics.playlistViews}</p>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Activity Over Time</h2>
          <div className="h-64 flex items-center justify-center bg-slate-900/50 rounded-lg">
            <p className="text-slate-500">Chart visualization would go here</p>
          </div>
        </div>
      </div>
    </div>
  )
}
