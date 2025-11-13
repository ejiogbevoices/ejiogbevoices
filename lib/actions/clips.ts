"use server"

import { getServerClient } from "@/lib/supabase/serverClient"
import { revalidatePath } from "next/cache"

export async function createClip(data: {
  recordingId: string
  title: string
  summary?: string
  startMs: number
  endMs: number
}) {
  const supabase = await getServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Unauthorized" }
  }

  const { data: clip, error } = await supabase
    .from("clips")
    .insert({
      recording_id: data.recordingId,
      title: data.title,
      summary: data.summary,
      start_ms: data.startMs,
      end_ms: data.endMs,
      created_by: user.id
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  await logEvent("clip_created", "clip", clip.id, user.id, { title: data.title })
  
  revalidatePath(`/recordings/${data.recordingId}`)
  revalidatePath("/playlists")
  
  return { data: clip }
}

export async function updateClip(id: string, updates: {
  title?: string
  summary?: string
  startMs?: number
  endMs?: number
}) {
  const supabase = await getServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Unauthorized" }
  }

  const { data, error } = await supabase
    .from("clips")
    .update({
      title: updates.title,
      summary: updates.summary,
      start_ms: updates.startMs,
      end_ms: updates.endMs,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("created_by", user.id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/playlists")
  
  return { data }
}

export async function deleteClip(id: string) {
  const supabase = await getServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Unauthorized" }
  }

  const { error } = await supabase
    .from("clips")
    .delete()
    .eq("id", id)
    .eq("created_by", user.id)

  if (error) {
    return { error: error.message }
  }

  await logEvent("clip_deleted", "clip", id, user.id, {})
  
  revalidatePath("/playlists")
  
  return { success: true }
}

async function logEvent(
  eventType: string,
  entityType: string,
  entityId: string,
  userId: string,
  details: any
) {
  const supabase = await getServerClient()
  
  await supabase.from("events").insert({
    event_type: eventType,
    entity_type: entityType,
    entity_id: entityId,
    user_id: userId,
    details
  })
}
