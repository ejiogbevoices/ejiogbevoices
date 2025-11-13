"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getBrowserClient } from "@/lib/supabase/browserClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createGlossaryTerm } from "@/lib/actions/glossary"

export default function AddGlossaryTermPage() {
  const router = useRouter()
  const [term, setTerm] = useState("")
  const [definition, setDefinition] = useState("")
  const [relatedTerms, setRelatedTerms] = useState("")
  const [categories, setCategories] = useState("")
  const [tags, setTags] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [traditions, setTraditions] = useState<any[]>([])
  const [selectedTradition, setSelectedTradition] = useState("")

  useEffect(() => {
    async function loadTraditions() {
      const supabase = getBrowserClient()
      const { data } = await supabase
        .from("traditions")
        .select("id, name")
        .order("name")
      
      if (data) {
        setTraditions(data)
        if (data.length > 0) {
          setSelectedTradition(data[0].id)
        }
      }
    }
    loadTraditions()
  }, [])

  async function handleSave() {
    if (!term.trim() || !definition.trim()) {
      setError("Term and definition are required")
      return
    }

    if (!selectedTradition) {
      setError("Please select a tradition")
      return
    }

    setLoading(true)
    setError("")

    const result = await createGlossaryTerm({
      traditionId: selectedTradition,
      term: term.trim(),
      languageCode: "en",
      definition: definition.trim(),
      sensitive: false
    })

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    router.push(`/glossary/${result.data?.id}`)
  }

  return (
    <div className="min-h-screen bg-[#0D1117] pb-20 md:pb-0">
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/glossary" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-semibold text-white">Add New Term</h1>
          </div>
        </div>
      </div>

      <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div>
          <select
            value={selectedTradition}
            onChange={(e) => setSelectedTradition(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800 border-0 text-white rounded-lg focus:ring-2 focus:ring-cyan-500 outline-none"
          >
            {traditions.map((tradition) => (
              <option key={tradition.id} value={tradition.id}>
                {tradition.name}
              </option>
            ))}
          </select>
        </div>

        <Input
          placeholder="Glossary Term"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="bg-slate-800 border-0 text-white placeholder:text-slate-500 h-14 text-base"
        />

        <Textarea
          placeholder="Definition"
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
          rows={6}
          className="bg-slate-800 border-0 text-white placeholder:text-slate-500 resize-none text-base"
        />

        <Input
          placeholder="Related Terms (Optional)"
          value={relatedTerms}
          onChange={(e) => setRelatedTerms(e.target.value)}
          className="bg-slate-800 border-0 text-white placeholder:text-slate-500 h-14 text-base"
        />

        <Input
          placeholder="Categories (Optional)"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
          className="bg-slate-800 border-0 text-white placeholder:text-slate-500 h-14 text-base"
        />

        <Input
          placeholder="Tags (Optional)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="bg-slate-800 border-0 text-white placeholder:text-slate-500 h-14 text-base"
        />

        <Button
          onClick={handleSave}
          disabled={loading || !term.trim() || !definition.trim()}
          className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white"
        >
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  )
}
