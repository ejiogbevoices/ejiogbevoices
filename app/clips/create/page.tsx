"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getBrowserClient } from "@/lib/supabase/browserClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, Play } from "lucide-react"

export default function CreateClipPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const recordingId = searchParams.get("recording_id")

  const [recording, setRecording] = useState<any>(null)
  const [title, setTitle] = useState("")
  const [summary, setSummary] = useState("")
  const [tags, setTags] = useState("")
  const [startMs, setStartMs] = useState(0)
  const [endMs, setEndMs] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadRecording() {
      if (!recordingId) return

      const supabase = getBrowserClient()
      const { data } = await supabase.from("recordings").select("*").eq("id", recordingId).single()

      if (data) {
        setRecording(data)
        setEndMs(data.duration_ms || 0)
      }
    }
    loadRecording()
  }, [recordingId])

  async function handleSave() {
    if (!recordingId) return

    setLoading(true)
    const supabase = getBrowserClient()

    const { error } = await supabase.from("clips").insert({
      recording_id: recordingId,
      title,
      summary,
      start_ms: startMs,
      end_ms: endMs,
      created_by: null, // Anonymous clips allowed
    })

    if (error) {
      alert(`Error: ${error.message}`)
      setLoading(false)
      return
    }

    router.push("/playlists")
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!recording) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  const duration = recording.duration_ms || 0

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border px-4 py-4 flex items-center">
        <button onClick={() => router.back()} className="mr-4">
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">New Clip</h1>
      </div>

      <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="bg-muted rounded-lg p-4 flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-orange-200 to-teal-300 flex items-center justify-center">
            <span className="text-2xl">🎵</span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{recording.title || "Recording"}</h3>
            <p className="text-sm text-muted-foreground">
              {formatTime(0)} / {formatTime(duration)}
            </p>
          </div>
          <Button size="icon" variant="default" className="rounded-full w-12 h-12">
            <Play className="w-5 h-5" />
          </Button>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Clip duration</h3>
          <div className="relative">
            <input
              type="range"
              min={0}
              max={duration}
              value={startMs}
              onChange={(e) => setStartMs(Number(e.target.value))}
              className="absolute w-full h-2 bg-muted rounded-full appearance-none"
              style={{ zIndex: 2 }}
            />
            <input
              type="range"
              min={0}
              max={duration}
              value={endMs}
              onChange={(e) => setEndMs(Number(e.target.value))}
              className="absolute w-full h-2 bg-primary rounded-full appearance-none"
              style={{ zIndex: 1 }}
            />
            <div className="h-2 mb-8"></div>
            <div className="flex justify-between text-sm font-medium">
              <span>{formatTime(startMs)}</span>
              <span>{formatTime(endMs)}</span>
            </div>
          </div>
        </div>

        <Input
          placeholder="Clip title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-muted border-0"
        />

        <Textarea
          placeholder="Clip description"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={6}
          className="bg-muted border-0 resize-none"
        />

        <Input
          placeholder="Add tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="bg-muted border-0"
        />

        <Button onClick={handleSave} disabled={loading || !title} className="w-full h-14 text-lg font-semibold">
          {loading ? "Saving..." : "Save Clip"}
        </Button>
      </div>
    </div>
  )
}
