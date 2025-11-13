"use server"

import { getServerClient } from "@/lib/supabase/serverClient"
import { revalidatePath } from "next/cache"

export async function createTranscriptSegment(data: {
  recordingId: string
  segmentIndex: number
  startMs: number
  endMs: number
  textOriginal: string
}) {
  const supabase = await getServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Unauthorized" }
  }

  const { data: segment, error } = await supabase
    .from("transcript_segments")
    .insert({
      recording_id: data.recordingId,
      segment_index: data.segmentIndex,
      start_ms: data.startMs,
      end_ms: data.endMs,
      text_original: data.textOriginal,
      qc_status: "pending"
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/recordings/${data.recordingId}`)
  revalidatePath(`/transcription/${data.recordingId}`)
  
  return { data: segment }
}

export async function updateTranscriptSegment(id: string, updates: {
  textOriginal?: string
  qcStatus?: string
}) {
  const supabase = await getServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Unauthorized" }
  }

  const { data, error } = await supabase
    .from("transcript_segments")
    .update({
      text_original: updates.textOriginal,
      qc_status: updates.qcStatus,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  const { data: segment } = await supabase
    .from("transcript_segments")
    .select("recording_id")
    .eq("id", id)
    .single()

  if (segment) {
    revalidatePath(`/recordings/${segment.recording_id}`)
    revalidatePath(`/transcription/${segment.recording_id}`)
  }
  
  return { data }
}

export async function bulkCreateTranscriptSegments(
  recordingId: string,
  segments: Array<{
    segmentIndex: number
    startMs: number
    endMs: number
    textOriginal: string
  }>
) {
  const supabase = await getServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Unauthorized" }
  }

  const insertData = segments.map(seg => ({
    recording_id: recordingId,
    segment_index: seg.segmentIndex,
    start_ms: seg.startMs,
    end_ms: seg.endMs,
    text_original: seg.textOriginal,
    qc_status: "pending"
  }))

  const { data, error } = await supabase
    .from("transcript_segments")
    .insert(insertData)
    .select()

  if (error) {
    return { error: error.message }
  }

  revalidatePath(`/recordings/${recordingId}`)
  revalidatePath(`/transcription/${recordingId}`)
  
  return { data }
}

export async function approveTranscriptSegment(id: string) {
  return updateTranscriptSegment(id, { qcStatus: "approved" })
}

export async function rejectTranscriptSegment(id: string) {
  return updateTranscriptSegment(id, { qcStatus: "rejected" })
}
