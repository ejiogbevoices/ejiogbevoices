"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClient } from "@/lib/supabase/client"
import { FileText, Lock, ChevronRight } from "lucide-react"
import Link from "next/link"

export function UploadForm() {
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [title, setTitle] = useState("")
  const [elderId, setElderId] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [languageCode, setLanguageCode] = useState("")
  const [tags, setTags] = useState("")
  const [contextNotes, setContextNotes] = useState("")
  const [consentStatus, setConsentStatus] = useState("")
  const [visibility, setVisibility] = useState("")
  const [consentDocument, setConsentDocument] = useState<File | null>(null)
  const [restrictionTerms, setRestrictionTerms] = useState("")
  const [provenanceNotes, setProvenanceNotes] = useState("")

  const [elders, setElders] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient()

      const { data: eldersData } = await supabase.from("elders").select("id, name").order("name")
      const { data: categoriesData } = await supabase.from("recording_categories").select("id, name").order("name")

      if (eldersData) setElders(eldersData)
      if (categoriesData) setCategories(categoriesData)
    }
    fetchData()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: Implement file upload to storage and database insertion
      alert("Upload functionality will save to Supabase")
    } catch (error) {
      console.error("Upload error:", error)
      alert("Upload failed. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Audio File Section */}
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
        <div>
          <Label htmlFor="audio" className="sr-only">
            Select Audio Recording
          </Label>
          <div className="relative">
            <Input
              id="audio"
              type="file"
              accept=".mp3,.wav,.m4a,.flac"
              onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
              className="hidden"
              required
            />
            <label
              htmlFor="audio"
              className="flex items-center justify-center w-full px-6 py-16 bg-slate-900/50 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:bg-slate-900 hover:border-cyan-500/50 transition-all"
            >
              <div className="text-center">
                <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-slate-800 flex items-center justify-center">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <p className="text-slate-300 font-medium mb-1">
                  {audioFile ? audioFile.name : "Click to upload audio file"}
                </p>
                <p className="text-xs text-slate-500">MP3, WAV, M4A, FLAC up to 500MB</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Recording Details Section */}
      <div className="space-y-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Recording Title"
          className="h-14 bg-slate-800/30 border-slate-700 text-white placeholder:text-slate-500 rounded-xl"
          required
        />

        <Select value={elderId} onValueChange={setElderId} required>
          <SelectTrigger className="h-14 bg-slate-800/30 border-slate-700 text-white rounded-xl">
            <SelectValue placeholder="Select Elder" />
          </SelectTrigger>
          <SelectContent>
            {elders.map((elder) => (
              <SelectItem key={elder.id} value={elder.id}>
                {elder.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={categoryId} onValueChange={setCategoryId} required>
          <SelectTrigger className="h-14 bg-slate-800/30 border-slate-700 text-white rounded-xl">
            <SelectValue placeholder="Category (e.g., Oriki)" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={visibility} onValueChange={setVisibility} required>
          <SelectTrigger className="h-14 bg-slate-800/30 border-slate-700 text-white rounded-xl">
            <SelectValue placeholder="Visibility" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="private">Private</SelectItem>
            <SelectItem value="community">Community Only</SelectItem>
          </SelectContent>
        </Select>

        <Input
          id="language"
          value={languageCode}
          onChange={(e) => setLanguageCode(e.target.value)}
          placeholder="e.g., yo (Yoruba), ig (Igbo)"
          className="h-14 bg-slate-800/30 border-slate-700 text-white placeholder:text-slate-500 rounded-xl"
          required
        />

        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="ceremony, wisdom, history (comma-separated)"
          className="h-14 bg-slate-800/30 border-slate-700 text-white placeholder:text-slate-500 rounded-xl"
        />

        <Textarea
          id="context"
          value={contextNotes}
          onChange={(e) => setContextNotes(e.target.value)}
          placeholder="Provide context about this recording, its significance, and any important details..."
          rows={4}
          className="bg-slate-800/30 border-slate-700 text-white rounded-xl"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-serif font-bold text-white">Consent & Restrictions</h2>

        {/* Consent Document - Now clickable */}
        <Link
          href="/upload/consent"
          className="flex items-center gap-4 p-5 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 rounded-xl transition-colors"
        >
          <div className="flex-shrink-0 w-14 h-14 bg-slate-700/50 rounded-lg flex items-center justify-center">
            <FileText className="w-7 h-7 text-slate-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white">Consent Document</h3>
            <p className="text-sm text-slate-400">
              {consentDocument ? consentDocument.name : "Consent document attached"}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </Link>

        {/* Restrictions - Now clickable */}
        <Link
          href="/upload/restrictions"
          className="flex items-center gap-4 p-5 bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 rounded-xl transition-colors"
        >
          <div className="flex-shrink-0 w-14 h-14 bg-slate-700/50 rounded-lg flex items-center justify-center">
            <Lock className="w-7 h-7 text-slate-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white">Restrictions</h3>
            <p className="text-sm text-slate-400">{restrictionTerms || "No restrictions"}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </Link>
      </div>

      {/* Action Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-lg font-semibold rounded-xl shadow-lg shadow-blue-500/20"
      >
        {isSubmitting ? "Uploading..." : "Upload"}
      </Button>
    </form>
  )
}
