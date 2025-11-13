import { getServerClient } from "@/lib/supabase/serverClient"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

export default async function GlossaryTermPage({ params }: { params: { id: string } }) {
  const supabase = await getServerClient()

  const { data: term } = await supabase.from("glossary_terms").select("*").eq("id", params.id).single()

  if (!term) {
    notFound()
  }

  const { data: relatedTerms } = await supabase
    .from("glossary_terms")
    .select("id, term")
    .neq("id", params.id)
    .or(
      `tradition_id.eq.${term.tradition_id || "00000000-0000-0000-0000-000000000000"},language_code.eq.${term.language_code}`,
    )
    .limit(5)

  return (
    <div className="min-h-screen bg-[#0D1117] pb-20 md:pb-0">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/glossary" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-serif font-bold text-white">Glossary</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-serif font-bold text-white mb-6">{term.term}</h2>

          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 mb-6">
            <p className="text-lg text-slate-300 leading-relaxed">{term.definition}</p>
          </div>

          {term.preferred_translation && (
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6 mb-6">
              <p className="text-sm text-slate-400 mb-2">Preferred Translation</p>
              <p className="text-lg text-white">{term.preferred_translation}</p>
            </div>
          )}

          {relatedTerms && relatedTerms.length > 0 && (
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Related Terms</h3>
              <div className="flex flex-wrap gap-2">
                {relatedTerms.map((related) => (
                  <Link
                    key={related.id}
                    href={`/glossary/${related.id}`}
                    className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg text-sm transition-colors"
                  >
                    # {related.term}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
