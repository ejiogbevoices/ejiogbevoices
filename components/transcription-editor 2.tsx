"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Segment {
  id: string
  segment_index: number
  start_ms: number
  end_ms: number
  text_original: string
  qc_status: string
}

interface TranscriptionEditorProps {
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
}

export function TranscriptionEditor({ recording, segments: initialSegments }: TranscriptionEditorProps) {
  const [segments, setSegments] = useState<Segment[]>(initialSegments)
  const [selectedSegments, setSelectedSegments] = useState<Set<string>>(new Set())
  const [editingSegment, setEditingSegment] = useState<string | null>(null)
  const [segmentTexts, setSegmentTexts] = useState<Record<string, string>>(
    Object.fromEntries(initialSegments.map((s) => [s.id, s.text_original])),
  )

  if (!recording) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Recording not found</p>
      </div>
    )
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleMergeSegments = () => {
    if (selectedSegments.size < 2) return

    const selectedIds = Array.from(selectedSegments)
    const selectedSegs = segments
      .filter((s) => selectedIds.includes(s.id))
      .sort((a, b) => a.segment_index - b.segment_index)

    // Create merged segment
    const mergedText = selectedSegs.map((s) => segmentTexts[s.id] || s.text_original).join(" ")
    const firstSeg = selectedSegs[0]
    const lastSeg = selectedSegs[selectedSegs.length - 1]

    console.log("[v0] Merging segments", selectedIds)

    // Update segments list
    const newSegments = segments.filter((s) => !selectedIds.includes(s.id))
    newSegments.push({
      ...firstSeg,
      end_ms: lastSeg.end_ms,
      text_original: mergedText,
    })
    newSegments.sort((a, b) => a.segment_index - b.segment_index)

    setSegments(newSegments)
    setSegmentTexts((prev) => ({ ...prev, [firstSeg.id]: mergedText }))
    setSelectedSegments(new Set())
  }

  const handleSplitSegment = (segmentId: string, splitPosition: number) => {
    const segment = segments.find((s) => s.id === segmentId)
    if (!segment) return

    const text = segmentTexts[segmentId] || segment.text_original
    const midPoint = Math.floor((segment.start_ms + segment.end_ms) / 2)

    console.log("[v0] Splitting segment at position", splitPosition)

    // Create two new segments
    const firstPart: Segment = {
      ...segment,
      id: `${segment.id}-1`,
      end_ms: midPoint,
      text_original: text.slice(0, splitPosition),
    }

    const secondPart: Segment = {
      ...segment,
      id: `${segment.id}-2`,
      segment_index: segment.segment_index + 1,
      start_ms: midPoint,
      text_original: text.slice(splitPosition),
    }

    const newSegments = segments.filter((s) => s.id !== segmentId)
    newSegments.push(firstPart, secondPart)
    newSegments.sort((a, b) => a.segment_index - b.segment_index)

    setSegments(newSegments)
    setSegmentTexts((prev) => ({
      ...prev,
      [firstPart.id]: firstPart.text_original,
      [secondPart.id]: secondPart.text_original,
    }))
  }

  const handleApproveSegment = (segmentId: string) => {
    console.log("[v0] Approving segment", segmentId)
    setSegments(segments.map((s) => (s.id === segmentId ? { ...s, qc_status: "approved" } : s)))
  }

  const handleSaveSegment = (segmentId: string) => {
    console.log("[v0] Saving segment", segmentId, segmentTexts[segmentId])
    setEditingSegment(null)
  }

  const toggleSegmentSelection = (segmentId: string) => {
    setSelectedSegments((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(segmentId)) {
        newSet.delete(segmentId)
      } else {
        newSet.add(segmentId)
      }
      return newSet
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif font-bold mb-1">Transcription Editor</h1>
              <p className="text-sm text-muted-foreground">Edit segments, merge/split, and approve status</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/admin/review-tasks">Review Tasks</Link>
              </Button>
              <Button>Save All Changes</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-7xl mx-auto px-4 py-6">
        {/* Recording Info */}
        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">{recording.title}</h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Elder: {recording.elders.name}</span>
                <span>Language: {recording.language}</span>
                <span>Duration: {formatTime(recording.duration_ms)}</span>
              </div>
            </div>
          </div>

          {/* Audio Player Placeholder */}
          <div className="bg-muted rounded-lg p-4 flex items-center justify-between">
            <span className="text-sm">Audio Player</span>
            <span className="text-sm">0:00 / {formatTime(recording.duration_ms)}</span>
          </div>
        </Card>

        {/* Merge/Split Controls */}
        {selectedSegments.size > 0 && (
          <Card className="p-4 mb-6 bg-muted">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{selectedSegments.size} segments selected</span>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleMergeSegments} disabled={selectedSegments.size < 2}>
                  Merge Selected
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedSegments(new Set())}>
                  Clear Selection
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Transcript Segments */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Transcript Segments ({segments.length})</h3>

          {segments.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">No transcript segments yet</Card>
          ) : (
            segments.map((segment) => (
              <Card key={segment.id} className={selectedSegments.has(segment.id) ? "border-primary" : ""}>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedSegments.has(segment.id)}
                        onChange={() => toggleSegmentSelection(segment.id)}
                        className="h-4 w-4"
                      />
                      <span className="font-mono text-sm text-muted-foreground">#{segment.segment_index}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatTime(segment.start_ms)} - {formatTime(segment.end_ms)}
                      </span>
                      <Badge variant={segment.qc_status === "approved" ? "default" : "secondary"}>
                        {segment.qc_status || "pending"}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleSplitSegment(
                            segment.id,
                            Math.floor((segmentTexts[segment.id] || segment.text_original).length / 2),
                          )
                        }
                      >
                        Split
                      </Button>
                      <Button
                        size="sm"
                        variant={segment.qc_status === "approved" ? "default" : "outline"}
                        onClick={() => handleApproveSegment(segment.id)}
                      >
                        {segment.qc_status === "approved" ? "Approved ✓" : "Approve"}
                      </Button>
                    </div>
                  </div>

                  {editingSegment === segment.id ? (
                    <div className="space-y-2">
                      <Textarea
                        value={segmentTexts[segment.id] || segment.text_original}
                        onChange={(e) => setSegmentTexts((prev) => ({ ...prev, [segment.id]: e.target.value }))}
                        className="min-h-[100px]"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSaveSegment(segment.id)}>
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditingSegment(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="p-3 bg-muted rounded cursor-pointer hover:bg-muted/80"
                      onClick={() => setEditingSegment(segment.id)}
                    >
                      <p className="whitespace-pre-wrap">{segmentTexts[segment.id] || segment.text_original}</p>
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
