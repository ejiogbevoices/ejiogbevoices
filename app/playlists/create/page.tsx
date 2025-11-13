"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { getBrowserClient } from "@/lib/supabase/browserClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X } from "lucide-react"

export default function CreatePlaylistPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [recordings, setRecordings] = useState<any[]>([])
  const [clips, setClips] = useState<any[]>([])
  const [selectedRecordings, setSelectedRecordings] = useState<string[]>([])
  const [selectedClips, setSelectedClips] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function loadData() {
      const supabase = getBrowserClient()

      const { data: recordingsData } = await supabase.from("recordings").select("id, title, duration_ms").limit(10)

      const { data: clipsData } = await supabase.from("clips").select("id, title, start_ms, end_ms").limit(10)

      if (recordingsData) setRecordings(recordingsData)
      if (clipsData) setClips(clipsData)
    }
    loadData()
  }, [])

  function toggleRecording(id: string) {
    setSelectedRecordings((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]))
  }

  function toggleClip(id: string) {
    setSelectedClips((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  async function handleCreate() {
    setLoading(true)
    const supabase = getBrowserClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      alert("You must be logged in")
      setLoading(false)
      return
    }

    const { data: playlist, error: playlistError } = await supabase
      .from("playlists")
      .insert({
        title,
        description,
        visibility: "private",
        owner: user.id,
      })
      .select()
      .single()

    if (playlistError || !playlist) {
      alert(`Error: ${playlistError?.message}`)
      setLoading(false)
      return
    }

    const recordingItems = selectedRecordings.map((recordingId, index) => ({
      playlist_id: playlist.id,
      recording_id: recordingId,
      clip_id: null,
      position: index,
    }))

    const clipItems = selectedClips.map((clipId, index) => ({
      playlist_id: playlist.id,
      recording_id: null,
      clip_id: clipId,
      position: selectedRecordings.length + index,
    }))

    if (recordingItems.length > 0 || clipItems.length > 0) {
      await supabase.from("playlist_items").insert([...recordingItems, ...clipItems])
    }

    router.push(`/playlists/${playlist.id}`)
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const mins = Math.floor(seconds / 60)
    return `${mins} min`
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border px-4 py-4 flex items-center">
        <button onClick={() => router.back()} className="mr-4">
          <X className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold">New playlist</h1>
      </div>

      <div className="container max-w-2xl mx-auto px-4 py-6 space-y-6">
        <Input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-muted border-0"
        />

        <Textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          className="bg-muted border-0 resize-none"
        />

        <div>
          <h3 className="text-lg font-semibold mb-3">Add recordings</h3>
          <div className="space-y-2">
            {recordings.map((recording) => (
              <button
                key={recording.id}
                onClick={() => toggleRecording(recording.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  selectedRecordings.includes(recording.id)
                    ? "bg-primary/10 border-2 border-primary"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-teal-200 to-orange-200 flex-shrink-0"></div>
                <div className="text-left flex-1">
                  <h4 className="font-semibold">{recording.title}</h4>
                  <p className="text-sm text-muted-foreground">Recording · {formatTime(recording.duration_ms)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Add clips</h3>
          <div className="space-y-2">
            {clips.map((clip) => (
              <button
                key={clip.id}
                onClick={() => toggleClip(clip.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  selectedClips.includes(clip.id)
                    ? "bg-primary/10 border-2 border-primary"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-orange-200 to-teal-200 flex-shrink-0"></div>
                <div className="text-left flex-1">
                  <h4 className="font-semibold">{clip.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    Clip · {Math.floor((clip.end_ms - clip.start_ms) / 60000)} min
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <Button onClick={handleCreate} disabled={loading || !title} className="w-full h-14 text-lg font-semibold">
          {loading ? "Creating..." : "Create"}
        </Button>
      </div>
    </div>
  )
}
