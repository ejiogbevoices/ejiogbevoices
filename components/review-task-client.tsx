"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

type ReviewTask = {
  id: string
  task_type: string
  status: string
  recordings?: {
    id: string
    title: string
    audio_url: string
    transcription?: string
    translation?: string
    elders?: {
      name: string
    }
  }
}

export function ReviewTaskClient({ task }: { task: ReviewTask }) {
  const router = useRouter()
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const taskTypeLabels: Record<string, string> = {
    transcription_qc: "Transcription QC",
    translation_qc: "Translation QC",
    signoff: "Sign-off",
  }

  async function handleApprove() {
    setIsSubmitting(true)
    try {
      const supabase = createClient()

      await supabase
        .from("review_tasks")
        .update({
          status: "approved",
          reviewer_notes: feedback || null,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", task.id)

      alert("Review approved successfully!")
      router.push("/inbox")
      router.refresh()
    } catch (error) {
      console.error("Error approving review:", error)
      alert("Failed to approve. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleReject() {
    if (!feedback.trim()) {
      alert("Please provide feedback for rejection.")
      return
    }

    setIsSubmitting(true)
    try {
      const supabase = createClient()

      await supabase
        .from("review_tasks")
        .update({
          status: "rejected",
          reviewer_notes: feedback,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", task.id)

      alert("Review rejected successfully!")
      router.push("/inbox")
      router.refresh()
    } catch (error) {
      console.error("Error rejecting review:", error)
      alert("Failed to reject. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0D1117] pb-6">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/inbox" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <p className="text-sm text-cyan-400 mb-1">{taskTypeLabels[task.task_type]}</p>
              <h1 className="text-2xl font-serif font-bold text-white">{task.recordings?.title}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Elder Info */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
          <p className="text-sm text-slate-400 mb-1">Elder</p>
          <p className="text-lg text-white font-medium">{task.recordings?.elders?.name}</p>
        </div>

        {/* Audio Player */}
        {task.recordings?.audio_url && (
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
            <Label className="text-sm text-slate-400 mb-3 block">Audio Recording</Label>
            <audio controls className="w-full" src={task.recordings.audio_url}>
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {/* Content to Review */}
        {task.task_type === "transcription_qc" && task.recordings?.transcription && (
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
            <Label className="text-sm text-slate-400 mb-3 block">Transcription</Label>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="text-white leading-relaxed whitespace-pre-wrap">{task.recordings.transcription}</p>
            </div>
          </div>
        )}

        {task.task_type === "translation_qc" && task.recordings?.translation && (
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
            <Label className="text-sm text-slate-400 mb-3 block">Translation</Label>
            <div className="bg-slate-900/50 rounded-lg p-4">
              <p className="text-white leading-relaxed whitespace-pre-wrap">{task.recordings.translation}</p>
            </div>
          </div>
        )}

        {task.task_type === "signoff" && (
          <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-5">
            <Label className="text-sm text-slate-400 mb-3 block">Review Summary</Label>
            <div className="space-y-4">
              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-sm text-slate-400 mb-2">Transcription</p>
                <p className="text-white leading-relaxed">{task.recordings?.transcription || "Not available"}</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4">
                <p className="text-sm text-slate-400 mb-2">Translation</p>
                <p className="text-white leading-relaxed">{task.recordings?.translation || "Not available"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Feedback */}
        <div>
          <Label htmlFor="feedback" className="text-white text-base mb-3 block">
            Reviewer Feedback {task.task_type === "signoff" && "(Optional)"}
          </Label>
          <Textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter any feedback, corrections, or comments..."
            rows={5}
            className="bg-slate-800/30 border-slate-700 text-white rounded-xl"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={handleReject}
            disabled={isSubmitting}
            variant="outline"
            className="h-14 border-2 border-red-600/50 text-red-400 hover:bg-red-600 hover:text-white hover:border-red-600 rounded-xl bg-transparent"
          >
            <X className="w-5 h-5 mr-2" />
            Reject
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isSubmitting}
            className="h-14 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white rounded-xl shadow-lg shadow-green-500/20"
          >
            <Check className="w-5 h-5 mr-2" />
            Approve
          </Button>
        </div>
      </div>
    </div>
  )
}
