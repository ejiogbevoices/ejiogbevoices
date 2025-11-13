"use server"

import { getServerClient } from "@/lib/supabase/serverClient"
import { revalidatePath } from "next/cache"

export async function createTranslation(data: {
  segmentId: string
  languageCode: string
  translatedText: string
}) {
  const supabase = await getServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Unauthorized" }
  }

  const { data: translation, error } = await supabase
    .from("translations")
    .insert({
      segment_id: data.segmentId,
      language_code: data.languageCode,
      translated_text: data.translatedText,
      qc_status: "pending",
      created_by: user.id
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  const { data: segment } = await supabase
    .from("transcript_segments")
    .select("recording_id")
    .eq("id", data.segmentId)
    .single()

  if (segment) {
    revalidatePath(`/recordings/${segment.recording_id}`)
    revalidatePath(`/translations/${segment.recording_id}`)
  }
  
  return { data: translation }
}

export async function updateTranslation(id: string, updates: {
  translatedText?: string
  qcStatus?: string
}) {
  const supabase = await getServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Unauthorized" }
  }

  const { data, error } = await supabase
    .from("translations")
    .update({
      translated_text: updates.translatedText,
      qc_status: updates.qcStatus,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  const { data: translation } = await supabase
    .from("translations")
    .select(`
      segment_id,
      transcript_segments!inner(recording_id)
    `)
    .eq("id", id)
    .single()

  if (translation?.transcript_segments) {
    const recordingId = (translation.transcript_segments as any).recording_id
    revalidatePath(`/recordings/${recordingId}`)
    revalidatePath(`/translations/${recordingId}`)
  }
  
  return { data }
}

export async function approveTranslation(id: string) {
  return updateTranslation(id, { qcStatus: "approved" })
}

export async function rejectTranslation(id: string) {
  return updateTranslation(id, { qcStatus: "rejected" })
}
