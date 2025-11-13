"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Segment {
  id: string
  segment_index: number
  start_ms: number
  end_ms: number
  text_original: string
  qc_status: string
}

interface Language {
  id: string
  name: string
  code: string
}

interface TranslationEditorProps {
  recording: {
    id: string
    title: string
    storage_url: string
    duration_ms: number
    language: string
    elders: { id: string; name: string }
    traditions: { id: string; name: string }
  } | null
  segments: Segment[]
  languages: Language[]
}

export function TranslationEditor({ recording, segments, languages }: TranslationEditorProps) {
  const [targetLanguage, setTargetLanguage] = useState<string>("")
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [approvedSegments, setApprovedSegments] = useState<Set<string>>(new Set())

  if (!recording) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Recording not found</p>
      </div>
    )
  }

  const handleTranslationChange = (segmentId: string, text: string) => {
    setTranslations((prev) => ({ ...prev, [segmentId]: text }))
  }

  const handleApproveSegment = (segmentId: string) => {
    setApprovedSegments((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(segmentId)) {
        newSet.delete(segmentId)
      } else {
        newSet.add(segmentId)
      }
      return newSet
    })
  }

  const handleSaveAll = async () => {
    console.log("[v0] Saving all translations", { targetLanguage, translations, approvedSegments })
    // TODO: Save to database
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold mb-2">{recording.title}</h1>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Elder: {recording.elders.name}</span>
          <span>Tradition: {recording.traditions.name}</span>
          <span>Source Language: {recording.language}</span>
        </div>
      </div>

      {/* Target Language Selection */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Translation Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Target Language</label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="">Select target language...</option>
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.code}>
                    {lang.name} ({lang.code})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveAll} disabled={!targetLanguage}>
                Save All Translations
              </Button>
              <Button variant="outline" onClick={() => setApprovedSegments(new Set(segments.map((s) => s.id)))}>
                Approve All
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Translation Segments */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Translation Segments ({segments.length})</h2>

        {segments.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No transcript segments available for translation
            </CardContent>
          </Card>
        ) : (
          segments.map((segment) => (
            <Card key={segment.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">Segment #{segment.segment_index}</span>
                    <span className="text-sm text-muted-foreground">
                      {formatTime(segment.start_ms)} - {formatTime(segment.end_ms)}
                    </span>
                    {approvedSegments.has(segment.id) && <Badge variant="default">Approved</Badge>}
                  </div>
                  <Button
                    size="sm"
                    variant={approvedSegments.has(segment.id) ? "default" : "outline"}
                    onClick={() => handleApproveSegment(segment.id)}
                  >
                    {approvedSegments.has(segment.id) ? "Approved ✓" : "Approve"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Original Text */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-muted-foreground">
                    Original ({recording.language})
                  </label>
                  <div className="p-3 bg-muted rounded-md">{segment.text_original}</div>
                </div>

                {/* Translation Input */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Translation {targetLanguage && `(${targetLanguage})`}
                  </label>
                  <textarea
                    value={translations[segment.id] || ""}
                    onChange={(e) => handleTranslationChange(segment.id, e.target.value)}
                    className="w-full px-3 py-2 border rounded-md bg-background min-h-[100px]"
                    placeholder={
                      targetLanguage ? `Enter translation in ${targetLanguage}...` : "Select a target language first"
                    }
                    disabled={!targetLanguage}
                  />
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
