"use server"

import { getServerClient } from "@/lib/supabase/serverClient"
import { assertCanEditContent } from "@/lib/permissions"
import { revalidatePath } from "next/cache"

export async function createRecording(formData: FormData) {
  const user = await assertCanEditContent()
  const supabase = await getServerClient()

  const title = formData.get("title") as string
  const traditionId = formData.get("tradition_id") as string
  const elderId = formData.get("elder_id") as string
  const language = formData.get("language") as string
  const storageUrl = formData.get("storage_url") as string
  const durationMs = parseInt(formData.get("duration_ms") as string)

  const { data, error } = await supabase
    .from("recordings")
    .insert({
      title,
      tradition_id: traditionId,
      elder_id: elderId,
      language,
      storage_url: storageUrl,
      duration_ms: durationMs,
      created_by: user.id,
      visibility: "private",
      consent_status: "pending"
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  await logEvent("recording_created", "recording", data.id, user.id, { title })
  
  revalidatePath("/recordings")
  revalidatePath("/admin")
  
  return { data }
}

export async function updateRecording(id: string, updates: any) {
  const user = await assertCanEditContent()
  const supabase = await getServerClient()

  const { data, error } = await supabase
    .from("recordings")
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  await logEvent("recording_updated", "recording", id, user.id, updates)
  
  revalidatePath(`/recordings/${id}`)
  revalidatePath("/recordings")
  
  return { data }
}

export async function deleteRecording(id: string) {
  const user = await assertCanEditContent()
  const supabase = await getServerClient()

  const { error } = await supabase
    .from("recordings")
    .delete()
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  await logEvent("recording_deleted", "recording", id, user.id, {})
  
  revalidatePath("/recordings")
  
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
