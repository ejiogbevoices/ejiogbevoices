"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { formatDuration } from "@/lib/utils/format"
import { formatRecordingSource } from "@/lib/utils/recordings"
import { Check, X, Edit2, Upload } from "lucide-react"
import { updateTranscriptSegment, updateRecordingPermissions, updateSegmentQCStatus } from "@/lib/actions/transcription"
import { toast } from "sonner"
import type { RecordingWithRelations, TranscriptSegment } from "@/lib/types/recording"

interface GlossaryTerm {
  id: string
  term: string
  preferred_translation: string
  definition: string
}

interface Props {
  recording: RecordingWithRelations
  glossaryTerms: GlossaryTerm[]
}

export function TranscriptionEditor({ recording, glossaryTerms }: Props) {
  const [segments, setSegments] = useState<TranscriptSegment[]>(
    recording.transcript_segments?.sort((a, b) => a.segment_index - b.segment_index) || []
  )
  const [editingSegmentId, setEditingSegmentId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState("")
  const [consentStatus, setConsentStatus] = useState(recording.consent_status || "pending")
  const [visibility, setVisibility] = useState(recording.visibility || "private")
  const [embargoDate, setEmbargoDate] = useState(recording.embargo_until?.split("T")[0] || "")
  const [published, setPublished] = useState(!!recording.published_at)
  const [restrictionTerms, setRestrictionTerms] = useState("")
  const [provenanceNotes, setProvenanceNotes] = useState("")

  const handleEditSegment = (segment: TranscriptSegment) => {
    setEditingSegmentId(segment.id)
    setEditingText(segment.text)
  }

  const handleSaveSegment = async () => {
    if (!editingSegmentId) return

    const result = await updateTranscriptSegment(editingSegmentId, editingText)
    
    if (result.error) {
      toast.error("Failed to save segment", { description: result.error })
      return
    }

    const updatedSegments = segments.map(seg => 
      seg.id === editingSegmentId ? { ...seg, text: editingText } : seg
    )
    setSegments(updatedSegments)
    setEditingSegmentId(null)
    setEditingText("")
    toast.success("Segment saved successfully")
  }

  const handleCancelEdit = () => {
    setEditingSegmentId(null)
    setEditingText("")
  }

  const handleUpdateQCStatus = async (segmentId: string, status: "pending" | "approved" | "rejected" | "needs_review") => {
    const result = await updateSegmentQCStatus(segmentId, status)
    
    if (result.error) {
      toast.error("Failed to update QC status", { description: result.error })
      return
    }

    const updatedSegments = segments.map(seg => 
      seg.id === segmentId ? { ...seg, qc_status: status } : seg
    )
    setSegments(updatedSegments)
    toast.success(`QC status updated to ${status}`)
  }

  const handleUpdatePermissions = async () => {
    const result = await updateRecordingPermissions(recording.id, {
      visibility,
      consent_status: consentStatus,
      embargo_until: embargoDate || null,
      published_at: published ? new Date().toISOString() : null,
    })

    if (result.error) {
      toast.error("Failed to update permissions", { description: result.error })
      return
    }

    toast.success("Permissions updated successfully")
  }

  const getQCBadgeColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-500/20 text-green-400 border-green-500/30"
      case "rejected": return "bg-red-500/20 text-red-400 border-red-500/30"
      case "needs_review": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      default: return "bg-amber-500/20 text-amber-400 border-amber-500/30"
    }
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-slate-900/50 border-b border-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-amber-400">Transcription & Translation Editor</h1>
            <p className="text-sm text-slate-400 mt-1">Edit, merge, split, and approve transcript segments</p>
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
              <div className="flex gap-2">
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                  {consentStatus}
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {visibility}
                </Badge>
              </div>
            </div>
            <div className="flex gap-6 text-sm text-slate-400">
              <span>{formatRecordingSource(recording)}</span>
              <span>Language: {recording.language}</span>
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

          {/* Transcript Segments */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Transcript Segments</h3>
              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-400">View Language:</span>
                <Select defaultValue={recording.language}>
                  <SelectTrigger className="w-[180px] bg-slate-950 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={recording.language}>Select language</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="yo">Yoruba</SelectItem>
                    <SelectItem value="ig">Igbo</SelectItem>
                  </SelectContent>
                </Select>
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
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-green-400"
                        onClick={() => handleUpdateQCStatus(segment.id, "approved")}
                        title="Approve segment"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-red-400"
                        onClick={() => handleUpdateQCStatus(segment.id, "rejected")}
                        title="Reject segment"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-white"
                        onClick={() => handleEditSegment(segment)}
                        title="Edit segment"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {editingSegmentId === segment.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        className="bg-slate-900 border-slate-700 text-white min-h-[100px]"
                        placeholder="Enter segment text"
                      />
                      <div className="flex items-center justify-between">
                        <Badge className={getQCBadgeColor(segment.qc_status)}>
                          QC Status: {segment.qc_status}
                        </Badge>
                        <div className="flex gap-2">
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
                            Save Segment
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="text-white text-sm leading-relaxed mb-3">
                        {segment.text || (
                          <span className="text-slate-500 italic">Enter segment text</span>
                        )}
                      </p>
                      <Badge className={getQCBadgeColor(segment.qc_status)}>
                        QC Status: {segment.qc_status}
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-96 border-l border-slate-800 bg-slate-950 overflow-y-auto p-6 space-y-6">
          {/* Permissions & Visibility */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Permissions & Visibility</h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-slate-300">Consent Status</Label>
                <Select value={consentStatus} onValueChange={setConsentStatus}>
                  <SelectTrigger className="mt-1.5 bg-slate-950 border-slate-700">
                    <SelectValue placeholder="Select consent status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="members">Members</SelectItem>
                    <SelectItem value="restricted">Restricted</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-slate-300">Visibility</Label>
                <Select value={visibility} onValueChange={(value) => setVisibility(value as "public" | "members" | "institution" | "private")}>
                  <SelectTrigger className="mt-1.5 bg-slate-950 border-slate-700">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="members">Members</SelectItem>
                    <SelectItem value="institution">Institution</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-slate-300">Embargo Until</Label>
                <Input
                  type="date"
                  value={embargoDate}
                  onChange={(e) => setEmbargoDate(e.target.value)}
                  className="mt-1.5 bg-slate-950 border-slate-700 text-white"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="published"
                  checked={published}
                  onCheckedChange={(checked) => setPublished(checked as boolean)}
                />
                <Label htmlFor="published" className="text-slate-300 cursor-pointer">
                  Published
                </Label>
              </div>

              <Button onClick={handleUpdatePermissions} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900">
                Update Permissions
              </Button>
            </div>
          </div>

          {/* Consent & Provenance */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Consent & Provenance</h3>
            
            <div className="space-y-4">
              <div>
                <Label className="text-slate-300">Consent Document</Label>
                <div className="mt-1.5 border-2 border-dashed border-slate-700 rounded-lg p-8 text-center hover:border-slate-600 cursor-pointer transition-colors">
                  <Upload className="w-8 h-8 mx-auto text-slate-500 mb-2" />
                  <p className="text-sm text-slate-400">Click to upload a file</p>
                </div>
              </div>

              <div>
                <Label className="text-slate-300">Restriction Terms</Label>
                <Textarea
                  value={restrictionTerms}
                  onChange={(e) => setRestrictionTerms(e.target.value)}
                  placeholder="Enter restriction terms"
                  className="mt-1.5 bg-slate-950 border-slate-700 text-white min-h-[80px]"
                />
              </div>

              <div>
                <Label className="text-slate-300">Provenance Notes</Label>
                <Textarea
                  value={provenanceNotes}
                  onChange={(e) => setProvenanceNotes(e.target.value)}
                  placeholder="Enter provenance notes"
                  className="mt-1.5 bg-slate-950 border-slate-700 text-white min-h-[80px]"
                />
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Save Documents
              </Button>
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
