import { getServerClient } from "@/lib/supabase/serverClient"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import GlossaryClient from "@/components/glossary-client"

export const metadata = {
  title: "Glossary | Ejiogbe Voices",
  description: "Browse cultural and linguistic terms",
}

export default async function GlossaryPage({ searchParams }: { searchParams: { q?: string } }) {
  const supabase = await getServerClient()
  const searchQuery = searchParams.q?.toLowerCase() || ""

  let query = supabase.from("glossary_terms").select("*").order("term")

  if (searchQuery) {
    query = query.or(`term.ilike.%${searchQuery}%,definition.ilike.%${searchQuery}%`)
  }

  const { data: terms } = await query

  // Group terms by first letter
  const groupedTerms = terms?.reduce(
    (acc, term) => {
      const firstLetter = term.term[0].toUpperCase()
      if (!acc[firstLetter]) {
        acc[firstLetter] = []
      }
      acc[firstLetter].push(term)
      return acc
    },
    {} as Record<string, typeof terms>,
  )

  return (
    <div className="min-h-screen bg-[#0D1117] pb-20 md:pb-0">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-serif font-bold text-white">Glossary</h1>
          </div>
        </div>
      </div>

      <GlossaryClient initialTerms={groupedTerms || {}} initialQuery={searchQuery} />
    </div>
  )
}
