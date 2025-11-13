import { getServerClient } from "@/lib/supabase/serverClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default async function TranslationsPage() {
  const supabase = await getServerClient()

  const { data: translations } = await supabase
    .from("translations")
    .select(`
      *,
      segment_id,
      transcript_segments (
        id,
        text_original,
        recording_id,
        recordings (
          id,
          title,
          elders (id, name)
        )
      )
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold mb-2 text-amber-400">Translations</h1>
        <p className="text-slate-400">Browse all translated content</p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Language</label>
            <Select>
              <SelectTrigger className="bg-slate-900 border-slate-600">
                <SelectValue placeholder="All Languages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Languages</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">QC Status</label>
            <Select>
              <SelectTrigger className="bg-slate-900 border-slate-600">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="needs_review">Needs Review</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Recording</label>
            <Input type="search" placeholder="Search by recording..." className="bg-slate-900 border-slate-600" />
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <Input type="search" placeholder="Search translations..." className="flex-1 bg-slate-900 border-slate-600" />
          <Button variant="outline" className="border-slate-600 bg-transparent hover:bg-slate-700">
            Clear Filters
          </Button>
          <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">Apply Filters</Button>
        </div>
      </div>

      <div className="space-y-4">
        {translations && translations.length > 0 ? (
          translations.map((translation: any) => (
            <Link key={translation.id} href={`/translations/${translation.id}`}>
              <div className="group bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-lg p-6 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-serif text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      {translation.transcript_segments?.recordings?.title || "Untitled Recording"}
                    </h3>
                    <p className="text-sm text-slate-400 mb-3">
                      {translation.transcript_segments?.recordings?.elders?.name || "Unknown Elder"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 text-xs rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-medium">
                      {translation.language_code?.toUpperCase() || "N/A"}
                    </span>
                    {translation.qc_status && (
                      <span
                        className={`px-3 py-1 text-xs rounded-md font-medium ${
                          translation.qc_status === "approved"
                            ? "bg-green-500/20 text-green-300 border border-green-500/30"
                            : translation.qc_status === "needs_review"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-slate-500/20 text-slate-300 border border-slate-500/30"
                        }`}
                      >
                        {translation.qc_status.replace("_", " ")}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Original</p>
                    <p className="text-slate-300 line-clamp-2">
                      {translation.transcript_segments?.text_original || "No original text"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Translation</p>
                    <p className="text-white line-clamp-2">
                      {translation.translated_text || "No translation available"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between text-xs text-slate-500">
                  <span>Updated {new Date(translation.updated_at).toLocaleDateString()}</span>
                  <span className="text-cyan-400 group-hover:text-cyan-300">View details →</span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-12 bg-slate-800 border border-slate-700 rounded-lg">
            <p className="text-slate-400 text-lg mb-2">No translations found</p>
            <p className="text-slate-500 text-sm">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
