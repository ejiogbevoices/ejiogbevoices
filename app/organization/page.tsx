import { getServerClient } from "@/lib/supabase/serverClient"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ChevronRight } from "lucide-react"

export const metadata = {
  title: "Organization | Ejiogbe Voices",
  description: "Manage organization settings",
}

export default async function OrganizationPage() {
  const supabase = await getServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch user's organization
  const { data: userData } = await supabase.from("users").select("org_id").eq("id", user.id).single()

  const { data: org } = await supabase
    .from("organizations")
    .select("*")
    .eq("id", userData?.org_id || "")
    .single()

  const seatsUsed = org?.seats_used || 1
  const seatsTotal = org?.seats_total || 10
  const seatsAvailable = seatsTotal - seatsUsed

  return (
    <div className="min-h-screen bg-[#0D1117] pb-20 md:pb-0">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/settings" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-serif font-bold text-white">Organization</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Seats Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Seats</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-5 bg-slate-800/30 border border-slate-700/50 rounded-xl">
              <div>
                <p className="text-base text-slate-400">Total seats</p>
                <p className="text-sm text-slate-500">{seatsTotal} seats available</p>
              </div>
              <p className="text-3xl font-bold text-white">{seatsTotal}</p>
            </div>

            <div className="flex items-center justify-between p-5 bg-slate-800/30 border border-slate-700/50 rounded-xl">
              <div>
                <p className="text-base text-slate-400">Used seats</p>
                <p className="text-sm text-slate-500">{seatsUsed} seat used</p>
              </div>
              <p className="text-3xl font-bold text-white">{seatsUsed}</p>
            </div>

            <div className="flex items-center justify-between p-5 bg-slate-800/30 border border-slate-700/50 rounded-xl">
              <div>
                <p className="text-base text-slate-400">Available seats</p>
                <p className="text-sm text-slate-500">{seatsAvailable} seats available</p>
              </div>
              <p className="text-3xl font-bold text-white">{seatsAvailable}</p>
            </div>
          </div>
        </div>

        {/* Members Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Members</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-5 bg-slate-800/30 border border-slate-700/50 rounded-xl">
              <div>
                <p className="text-base text-slate-400">Total members</p>
                <p className="text-sm text-slate-500">{seatsUsed} member</p>
              </div>
              <p className="text-3xl font-bold text-white">{seatsUsed}</p>
            </div>

            <Link
              href="/organization/members"
              className="flex items-center justify-between p-5 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 rounded-xl transition-colors"
            >
              <p className="text-base text-white">Manage members</p>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Security Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Security</h2>
          <div className="flex items-center justify-between p-5 bg-slate-800/30 border border-slate-700/50 rounded-xl">
            <div>
              <h3 className="text-base text-white font-semibold">SSO</h3>
              <p className="text-sm text-slate-400 mt-1">Enable Single Sign-On (SSO) for your organization</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked={org?.sso_enabled} />
              <div className="w-14 h-8 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-cyan-600"></div>
            </label>
          </div>
        </div>

        {/* Institution Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Institution</h2>
          <Link
            href="/organization/institution"
            className="flex items-center justify-between p-5 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 rounded-xl transition-colors"
          >
            <div>
              <h3 className="text-base text-white font-semibold">Check institution</h3>
              <p className="text-sm text-slate-400 mt-1">Check if your institution is already registered</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </Link>
        </div>
      </div>
    </div>
  )
}
