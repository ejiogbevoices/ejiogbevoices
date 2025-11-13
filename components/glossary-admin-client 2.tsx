"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pencil, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

type Term = {
  id: string
  term: string
  definition: string
  preferred_translation?: string
  language_code?: string
  tradition_id?: string
  sensitive?: boolean
}

export default function GlossaryAdminClient({
  terms,
  traditions,
  languages,
}: {
  terms: Term[]
  traditions: { id: string; name: string }[]
  languages: { code: string; name: string }[]
}) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [editingTerm, setEditingTerm] = useState<Term | null>(null)
  const [formData, setFormData] = useState({
    term: "",
    definition: "",
    preferred_translation: "",
    language_code: "",
    tradition_id: "",
    sensitive: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const url = editingTerm ? `/api/glossary/${editingTerm.id}` : "/api/glossary"
    const method = editingTerm ? "PUT" : "POST"

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (response.ok) {
      setIsOpen(false)
      setEditingTerm(null)
      setFormData({
        term: "",
        definition: "",
        preferred_translation: "",
        language_code: "",
        tradition_id: "",
        sensitive: false,
      })
      router.refresh()
    }
  }

  const handleEdit = (term: Term) => {
    setEditingTerm(term)
    setFormData({
      term: term.term,
      definition: term.definition,
      preferred_translation: term.preferred_translation || "",
      language_code: term.language_code || "",
      tradition_id: term.tradition_id || "",
      sensitive: term.sensitive || false,
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this term?")) return

    const response = await fetch(`/api/glossary/${id}`, {
      method: "DELETE",
    })

    if (response.ok) {
      router.refresh()
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="mb-6 bg-cyan-600 hover:bg-cyan-700">Add Term</Button>
        </DialogTrigger>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>{editingTerm ? "Edit Term" : "Add New Term"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="term">Term</Label>
              <Input
                id="term"
                value={formData.term}
                onChange={(e) => setFormData({ ...formData, term: e.target.value })}
                className="bg-slate-800 border-slate-700"
                required
              />
            </div>
            <div>
              <Label htmlFor="definition">Definition</Label>
              <Textarea
                id="definition"
                value={formData.definition}
                onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
                className="bg-slate-800 border-slate-700"
                rows={4}
                required
              />
            </div>
            <div>
              <Label htmlFor="translation">Preferred Translation</Label>
              <Input
                id="translation"
                value={formData.preferred_translation}
                onChange={(e) => setFormData({ ...formData, preferred_translation: e.target.value })}
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div>
              <Label htmlFor="language">Language</Label>
              <Select
                value={formData.language_code}
                onValueChange={(value) => setFormData({ ...formData, language_code: value })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tradition">Tradition</Label>
              <Select
                value={formData.tradition_id}
                onValueChange={(value) => setFormData({ ...formData, tradition_id: value })}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue placeholder="Select tradition" />
                </SelectTrigger>
                <SelectContent>
                  {traditions.map((trad) => (
                    <SelectItem key={trad.id} value={trad.id}>
                      {trad.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700">
              {editingTerm ? "Update Term" : "Add Term"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        {terms.map((term) => (
          <div key={term.id} className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">{term.term}</h3>
                <p className="text-slate-300 text-sm">{term.definition}</p>
                {term.preferred_translation && (
                  <p className="text-slate-400 text-sm mt-2">Translation: {term.preferred_translation}</p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(term)}
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(term.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
