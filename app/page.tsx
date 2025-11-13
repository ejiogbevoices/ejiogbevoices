import Link from "next/link"
import Image from "next/image"
import { getServerClient } from "@/lib/supabase/serverClient"

export default async function HomePage() {
  const supabase = await getServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: recordings } = await supabase
    .from("recordings")
    .select(`
      *,
      elders (id, name, photo_url),
      traditions (id, name)
    `)
    .eq("visibility", "public")
    .order("created_at", { ascending: false })
    .limit(8)

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <section className="relative overflow-hidden">
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "url(/placeholder.svg?height=1200&width=2000&query=circuit+board+pattern)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32">
          {!user && (
            <div className="flex gap-3 justify-center mb-8 md:hidden">
              <Link
                href="/login"
                className="px-6 py-2.5 text-base border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 rounded-md transition-colors font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2.5 text-base bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-md transition-colors font-medium shadow-lg shadow-orange-500/30"
              >
                Sign Up
              </Link>
            </div>
          )}

          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Image
                src="/images/gemini-generated-image-5ixdcy5ixdcy5ixd.png"
                alt="Ejiogbe Voices Logo"
                width={320}
                height={320}
                className="w-64 md:w-80 h-auto"
                priority
              />
            </div>

            {/* Hero Text */}
            <div className="flex-1 text-center md:text-left space-y-6">
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-amber-400 text-balance">Ejiogbe Voices</h1>
              <p className="text-2xl md:text-3xl text-cyan-400 text-balance font-medium">
                Preserving Ancestral Wisdom Through Sacred Sound
              </p>
              <p className="text-base md:text-lg text-slate-300 text-balance max-w-2xl leading-relaxed">
                A human-curated digital archive to record, transcribe, translate, and oral traditions with reverence and
                authenticity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                <Link
                  href="/recordings"
                  className="px-8 py-3 text-lg bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-semibold rounded-md shadow-lg shadow-cyan-500/30 transition-all text-center"
                >
                  Explore Recordings
                </Link>
                <Link
                  href="/upload"
                  className="px-8 py-3 text-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-md shadow-lg shadow-orange-500/30 transition-all text-center"
                >
                  Upload Recording
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gradient-to-b from-[#0D1117] to-slate-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-12 text-center">
            Featured Recordings
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recordings?.map((recording) => (
              <Link key={recording.id} href={`/recordings/${recording.id}`}>
                <div className="group relative overflow-hidden rounded-xl bg-slate-800/50 backdrop-blur border border-slate-700/50 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
                  {/* Elder Portrait */}
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={
                        recording.elders?.photo_url ||
                        `/placeholder.svg?height=400&width=300&query=Elder+portrait` ||
                        "/placeholder.svg" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg" ||
                        "/placeholder.svg"
                      }
                      alt={recording.title}
                      width={300}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />

                    <span className="absolute top-3 right-3 px-2 py-1 text-xs rounded-md bg-emerald-500/90 backdrop-blur text-white font-medium shadow-lg">
                      public
                    </span>

                    {/* Duration Badge */}
                    {recording.duration_ms && (
                      <span className="absolute bottom-3 right-3 px-2 py-1 text-xs rounded-md bg-amber-400/90 backdrop-blur text-slate-900 font-medium shadow-lg">
                        {formatDuration(recording.duration_ms)}
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-3">
                    <h3 className="font-serif text-lg font-bold text-white line-clamp-2 text-balance group-hover:text-cyan-400 transition-colors">
                      {recording.title || "Untitled Recording"}
                    </h3>
                    <p className="text-sm text-slate-400">{recording.elders?.name || "Unknown Elder"}</p>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      {recording.language?.name && <span>{recording.language.name}</span>}
                      {recording.language?.name && recording.duration_ms && <span>•</span>}
                      {recording.duration_ms && <span>{formatDuration(recording.duration_ms)}</span>}
                    </div>

                    {/* Topic Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {recording.recording_categories && (
                        <span className="px-2 py-1 text-xs rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium">
                          {recording.recording_categories.name}
                        </span>
                      )}
                      {recording.traditions && (
                        <span className="px-2 py-1 text-xs rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium">
                          {recording.traditions.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/recordings"
              className="inline-block px-8 py-3 text-lg border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-colors bg-transparent rounded-md"
            >
              View All Recordings
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

const formatDuration = (ms: number) => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  if (hours > 0) {
    return `${hours}:${String(minutes % 60).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`
  }
  return `${minutes}:${String(seconds % 60).padStart(2, "0")}`
}
