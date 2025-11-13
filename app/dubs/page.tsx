import { getServerClient } from "@/lib/supabase/serverClient"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Mic, Tag, ChevronRight } from "lucide-react"

export const metadata = {
  title: "Synthetic Dubs | Ejiogbe Voices",
  description: "Manage synthetic voice dubs",
}

export default async function DubsPage() {
  const supabase = await getServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-[#0D1117] pb-20 md:pb-0">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/settings" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-serif font-bold text-white">Synthetic Dubs</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Optional Synthetic Dub Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Optional Synthetic Dub</h2>
          <Link
            href="/dubs/manage"
            className="flex items-center gap-4 p-5 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 rounded-xl transition-colors"
          >
            <div className="flex-shrink-0 w-14 h-14 bg-slate-700/50 rounded-lg flex items-center justify-center">
              <Mic className="w-7 h-7 text-slate-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">Synthetic Dub</h3>
              <p className="text-sm text-slate-400">Attach or replace optional synthetic dub</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </Link>
        </div>

        {/* Disclosure Labels Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Disclosure Labels</h2>
          <Link
            href="/dubs/labels"
            className="flex items-center gap-4 p-5 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 rounded-xl transition-colors"
          >
            <div className="flex-shrink-0 w-14 h-14 bg-slate-700/50 rounded-lg flex items-center justify-center">
              <Tag className="w-7 h-7 text-slate-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">Disclosure Label</h3>
              <p className="text-sm text-slate-400">Add a disclosure label to this content</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </Link>
        </div>
      </div>
    </div>
  )
}
