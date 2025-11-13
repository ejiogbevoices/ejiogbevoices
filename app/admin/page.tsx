import { getServerClient } from "@/lib/supabase/serverClient"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Users, FileText, Activity, BarChart3, Mic } from "lucide-react"

export const metadata = {
  title: "Admin | Ejiogbe Voices",
  description: "Admin dashboard",
}

export default async function AdminPage() {
  const supabase = await getServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Check if user is admin
  const { data: userData } = await supabase.from("users").select("role").eq("id", user.id).single()

  if (userData?.role !== "admin") {
    redirect("/")
  }

  // Fetch stats
  const [
    { count: totalUploads },
    { count: pendingReviews },
    { count: activeUsers },
    { data: recentUploads },
    { data: pendingTasks },
  ] = await Promise.all([
    supabase.from("recordings").select("*", { count: "exact", head: true }),
    supabase.from("review_tasks").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase
      .from("recordings")
      .select(
        `
        id,
        title,
        created_by,
        created_at,
        users (name)
      `,
      )
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("review_tasks")
      .select(
        `
        id,
        task_type,
        created_at,
        target_id,
        recordings (title)
      `,
      )
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(2),
  ])

  const getTaskIcon = (taskType: string) => {
    switch (taskType) {
      case "transcription_qc":
        return "📝"
      case "translation_qc":
        return "🌐"
      case "signoff":
        return "✓"
      default:
        return "📄"
    }
  }

  return (
    <div className="min-h-screen bg-[#0D1117] pb-20 md:pb-0">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-serif font-bold text-white">Admin</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
            <p className="text-sm text-slate-400 mb-2">Total Uploads</p>
            <p className="text-4xl font-bold text-white">{totalUploads || 0}</p>
          </div>
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
            <p className="text-sm text-slate-400 mb-2">Pending Reviews</p>
            <p className="text-4xl font-bold text-white">{pendingReviews || 0}</p>
          </div>
        </div>

        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
          <p className="text-sm text-slate-400 mb-2">Active Users</p>
          <p className="text-4xl font-bold text-white">{activeUsers || 0}</p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Management</h2>
          <div className="grid grid-cols-1 gap-3">
            <Link
              href="/admin/review-tasks"
              className="flex items-center gap-4 p-4 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 rounded-xl transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">Review Tasks</h3>
                <p className="text-sm text-slate-400">Manage transcription & translation reviews</p>
              </div>
            </Link>

            <Link
              href="/admin/org-management"
              className="flex items-center gap-4 p-4 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 rounded-xl transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">Organization Management</h3>
                <p className="text-sm text-slate-400">Manage organizations, seats & SSO</p>
              </div>
            </Link>

            <Link
              href="/dubs"
              className="flex items-center gap-4 p-4 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 rounded-xl transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Mic className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">Dub Manager</h3>
                <p className="text-sm text-slate-400">Manage synthetic voice dubs</p>
              </div>
            </Link>

            <Link
              href="/admin/system-events"
              className="flex items-center gap-4 p-4 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 rounded-xl transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">Activity Log</h3>
                <p className="text-sm text-slate-400">View system events & audit trail</p>
              </div>
            </Link>

            <Link
              href="/admin/analytics"
              className="flex items-center gap-4 p-4 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 rounded-xl transition-colors"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">Analytics</h3>
                <p className="text-sm text-slate-400">View usage stats & insights</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Uploads */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Recent Uploads</h2>
          <div className="space-y-3">
            {recentUploads?.map((recording) => (
              <Link
                key={recording.id}
                href={`/recordings/${recording.id}`}
                className="flex items-center gap-4 p-4 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 rounded-lg transition-colors"
              >
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white truncate">{recording.title}</h3>
                  <p className="text-sm text-slate-400">Uploaded by {(recording.users as any)?.name || "Unknown"}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Pending Reviews */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Pending Reviews</h2>
          <div className="space-y-3">
            {pendingTasks?.map((task) => (
              <Link
                key={task.id}
                href={`/inbox/${task.id}`}
                className="flex items-center gap-4 p-4 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 rounded-lg transition-colors"
              >
                <div className="flex-shrink-0 w-16 h-16 bg-slate-700/50 rounded-lg flex items-center justify-center text-3xl">
                  {getTaskIcon(task.task_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white truncate">
                    {(task.recordings as any)?.title || "Untitled"}
                  </h3>
                  <p className="text-sm text-slate-400">Submitted by {(task as any).submitted_by || "Unknown"}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Content Visibility Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Content Visibility</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
              <div>
                <h3 className="text-lg font-semibold text-white">Public Visibility</h3>
                <p className="text-sm text-slate-400">Allow public access to content</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-14 h-8 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-cyan-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
              <div>
                <h3 className="text-lg font-semibold text-white">Embargo Period</h3>
                <p className="text-sm text-slate-400">Restrict access until date</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-14 h-8 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-cyan-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
