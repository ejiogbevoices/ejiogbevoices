"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AccountPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [preferences, setPreferences] = useState({
    ui_locale: "English",
    transcript_locale: "English",
    theme: "System",
    preferred_voice: "Female",
  })

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient()

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      // Load user preferences from database
      const { data: userData } = await supabase
        .from("users")
        .select("ui_locale, transcript_locale, theme, preferred_voice")
        .eq("id", user.id)
        .single()

      if (userData) {
        setPreferences({
          ui_locale: userData.ui_locale || "English",
          transcript_locale: userData.transcript_locale || "English",
          theme: userData.theme || "System",
          preferred_voice: userData.preferred_voice || "Female",
        })
      }
      setLoading(false)
    }
    loadUser()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center pb-20 md:pb-0">
        <div className="text-slate-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-white pb-20 md:pb-0">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-serif font-bold text-white">Account</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Account Section */}
        <div className="mb-10">
          <h2 className="text-2xl font-serif font-bold text-white mb-6">Account</h2>

          <div className="space-y-1 bg-slate-900/30 rounded-xl border border-slate-800/50 overflow-hidden">
            <Link
              href="/account/profile"
              className="flex items-center justify-between px-6 py-5 hover:bg-slate-800/30 transition-colors border-b border-slate-800/50"
            >
              <span className="text-lg text-white">Account</span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </Link>

            <Link
              href="/account/notifications"
              className="flex items-center justify-between px-6 py-5 hover:bg-slate-800/30 transition-colors"
            >
              <span className="text-lg text-white">Notifications</span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </Link>
          </div>
        </div>

        {/* App Section */}
        <div>
          <h2 className="text-2xl font-serif font-bold text-white mb-6">App</h2>

          <div className="space-y-1 bg-slate-900/30 rounded-xl border border-slate-800/50 overflow-hidden">
            <Link
              href="/account/ui-locale"
              className="flex items-center justify-between px-6 py-5 hover:bg-slate-800/30 transition-colors border-b border-slate-800/50"
            >
              <div>
                <div className="text-lg text-white">UI Locale</div>
                <div className="text-sm text-slate-400 mt-1">{preferences.ui_locale}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </Link>

            <Link
              href="/account/transcript-language"
              className="flex items-center justify-between px-6 py-5 hover:bg-slate-800/30 transition-colors border-b border-slate-800/50"
            >
              <div>
                <div className="text-lg text-white">Transcript Language</div>
                <div className="text-sm text-slate-400 mt-1">{preferences.transcript_locale}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </Link>

            <Link
              href="/account/theme"
              className="flex items-center justify-between px-6 py-5 hover:bg-slate-800/30 transition-colors border-b border-slate-800/50"
            >
              <div>
                <div className="text-lg text-white">Theme</div>
                <div className="text-sm text-slate-400 mt-1">{preferences.theme}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </Link>

            <Link
              href="/account/preferred-voice"
              className="flex items-center justify-between px-6 py-5 hover:bg-slate-800/30 transition-colors"
            >
              <div>
                <div className="text-lg text-white">Preferred Voice</div>
                <div className="text-sm text-slate-400 mt-1">{preferences.preferred_voice}</div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
