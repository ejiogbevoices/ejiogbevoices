"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { formatDuration } from "@/lib/utils/format"
import { formatRecordingSource } from "@/lib/utils/recordings"
import { Check, X, Edit2 } from "lucide-react"
import { updateTranslation, updateTranslationQCStatus, createTranslation } from "@/lib/actions/translation"
import { toast } from "sonner"
import type { RecordingWithTranslations, TranslationSegment } from "@/lib/types/translation"

interface GlossaryTerm {
  id: string
  term: string
  preferred_translation: string
  definition: string
}

interface Props {
  recording: RecordingWithTranslations
  targetLanguage: string
  segments: TranslationSegment[]
  glossaryTerms: GlossaryTerm[]
}

export function TranslationEditor({ recording, targetLanguage, segments: initialSegments, glossaryTerms }: Props) {
  const [segments, setSegments] = useState<TranslationSegment[]>(initialSegments)
  const [editingSegmentId, setEditingSegmentId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState("")

  const handleEditSegment = (segment: TranslationSegment) => {
    setEditingSegmentId(segment.id)
    setEditingText(segment.translation?.translated_text || "")
  }

  const handleSaveSegment = async () => {
    if (!editingSegmentId) return

    const segment = segments.find(s => s.id === editingSegmentId)
    if (!segment) return

    const result = segment.translation
      ? await updateTranslation(segment.translation.id, editingText)
      : await createTranslation(editingSegmentId, targetLanguage, editingText)
    
    if (!result.success) {
      toast.error("Failed to save translation", { description: result.error })
      return
    }

    const updatedSegments = segments.map(seg => {
      if (seg.id === editingSegmentId) {
        if (seg.translation) {
          return {
            ...seg,
            translation: {
              ...seg.translation,
              translated_text: editingText
            }
          }
        } else {
          return {
            ...seg,
            translation: {
              id: result.data.id,
              segment_id: result.data.segment_id,
              language_code: result.data.language_code,
              translated_text: result.data.translated_text,
              qc_status: result.data.qc_status as "pending" | "approved" | "rejected" | "needs_review",
              created_by: result.data.created_by,
              created_at: result.data.created_at,
              updated_at: result.data.updated_at
            }
          }
        }
      }
      return seg
    })
    
    setSegments(updatedSegments)
    setEditingSegmentId(null)
    setEditingText("")
    toast.success("Translation saved successfully")
  }

  const handleCancelEdit = () => {
    setEditingSegmentId(null)
    setEditingText("")
  }

  const handleUpdateQCStatus = async (translationId: string, status: "pending" | "approved" | "rejected" | "needs_review") => {
    const result = await updateTranslationQCStatus(translationId, status)
    
    if (!result.success) {
      toast.error("Failed to update QC status", { description: result.error })
      return
    }

    const updatedSegments = segments.map(seg => {
      if (seg.translation?.id === translationId) {
        return {
          ...seg,
          translation: {
            ...seg.translation,
            qc_status: status
          }
        }
      }
      return seg
    })
    
    setSegments(updatedSegments)
    toast.success(`QC status updated to ${status}`)
  }

  const getQCBadgeColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-500/20 text-green-400 border-green-500/30"
      case "rejected": return "bg-red-500/20 text-red-400 border-red-500/30"
      case "needs_review": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default: return "bg-amber-500/20 text-amber-400 border-amber-500/30"
    }
  }

  const getLanguageName = (code: string) => {
    const languages: Record<string, string> = {
      en: "English",
      es: "Spanish",
      fr: "French",
      pt: "Portuguese",
      yo: "Yoruba",
      ht: "Haitian Kreyol",
      ig: "Igbo"
    }
    return languages[code] || code
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-slate-900/50 border-b border-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-amber-400">Transcription & Translation Editor</h1>
            <p className="text-sm text-slate-400 mt-1">Translate and approve segments into {getLanguageName(targetLanguage)}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              Review Tasks
            </Button>
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">
              Save Changes
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Recording Info */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-bold text-white">{recording.title}</h2>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                {getLanguageName(targetLanguage)}
              </Badge>
            </div>
            <div className="flex gap-6 text-sm text-slate-400">
              <span>{formatRecordingSource(recording)}</span>
              <span>Original: {getLanguageName(recording.language)}</span>
              <span>Duration: {formatDuration(recording.duration_ms)}</span>
            </div>

            {/* Audio Player Placeholder */}
            <div className="mt-4 bg-slate-950 rounded-lg p-4">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>0:00 / {formatDuration(recording.duration_ms)}</span>
                <span>1.0x</span>
              </div>
              <div className="mt-2 h-2 bg-slate-800 rounded-full">
                <div className="h-2 bg-amber-500 rounded-full w-0"></div>
              </div>
            </div>
          </div>

          {/* Translation Segments */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Translation Segments</h3>
              <div className="text-sm text-slate-400">
                Target Language: <span className="text-cyan-400 font-medium">{getLanguageName(targetLanguage)}</span>
              </div>
            </div>

            <div className="space-y-4">
              {segments.map((segment) => (
                <div
                  key={segment.id}
                  className="bg-slate-950 border border-slate-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <span>{formatDuration(segment.start_ms)}</span>
                      <span>→</span>
                      <span>{formatDuration(segment.end_ms)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {segment.translation && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-green-400"
                            onClick={() => handleUpdateQCStatus(segment.translation!.id, "approved")}
                            title="Approve translation"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-red-400"
                            onClick={() => handleUpdateQCStatus(segment.translation!.id, "rejected")}
                            title="Reject translation"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-white"
                        onClick={() => handleEditSegment(segment)}
                        title="Edit translation"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Original Text */}
                  <div className="mb-3 pb-3 border-b border-slate-700">
                    <div className="text-xs text-slate-500 mb-1">Original ({getLanguageName(recording.language)})</div>
                    <p className="text-slate-300 text-sm leading-relaxed italic">
                      {segment.original_text}
                    </p>
                  </div>

                  {/* Translation Text */}
                  {editingSegmentId === segment.id ? (
                    <div className="space-y-3">
                      <div className="text-xs text-slate-500 mb-1">Translation ({getLanguageName(targetLanguage)})</div>
                      <Textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="bg-slate-900 border-slate-700 text-white min-h-[100px]"
                        placeholder="Enter translation"
                      />
                      <div className="flex items-center justify-between">
                        {segment.translation && (
                          <Badge className={getQCBadgeColor(segment.translation.qc_status)}>
                            QC Status: {segment.translation.qc_status}
                          </Badge>
                        )}
                        <div className="flex gap-2 ml-auto">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCancelEdit}
                            className="text-slate-400"
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleSaveSegment}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-900"
                          >
                            Save Translation
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-xs text-slate-500 mb-1">Translation ({getLanguageName(targetLanguage)})</div>
                      <p className="text-white text-sm leading-relaxed mb-3">
                        {segment.translation?.translated_text || (
                          <span className="text-slate-500 italic">No translation yet - click edit to add</span>
                        )}
                      </p>
                      {segment.translation && (
                        <Badge className={getQCBadgeColor(segment.translation.qc_status)}>
                          QC Status: {segment.translation.qc_status}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-96 border-l border-slate-800 bg-slate-950 overflow-y-auto p-6 space-y-6">
          {/* Translation Info */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Translation Info</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Segments:</span>
                <span className="text-white font-medium">{segments.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Translated:</span>
                <span className="text-white font-medium">
                  {segments.filter(s => s.translation).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Approved:</span>
                <span className="text-green-400 font-medium">
                  {segments.filter(s => s.translation?.qc_status === "approved").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Pending:</span>
                <span className="text-amber-400 font-medium">
                  {segments.filter(s => s.translation?.qc_status === "pending" || !s.translation).length}
                </span>
              </div>
            </div>
          </div>

          {/* Glossary Terms */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Glossary Terms</h3>
              <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-slate-900">
                Add Term
              </Button>
            </div>

            <div className="space-y-2">
              {glossaryTerms && glossaryTerms.length > 0 ? (
                glossaryTerms.map((term) => (
                  <div
                    key={term.id}
                    className="bg-slate-950 border border-slate-700 rounded-lg p-3 group hover:border-slate-600 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-white font-medium">{term.term}</p>
                        <p className="text-sm text-slate-400">{term.preferred_translation}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-sm text-center py-4">No glossary terms yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
