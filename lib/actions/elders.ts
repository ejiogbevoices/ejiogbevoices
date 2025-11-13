"use server"

import { getServerClient } from "@/lib/supabase/serverClient"
import { revalidatePath } from "next/cache"

export async function createElder(data: {
  traditionId: string
  name: string
  village?: string
  lineage?: string
  bio?: string
  photoUrl?: string
  languages?: string[]
}) {
  const supabase = await getServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Unauthorized" }
  }

  const userRole = await getUserRole(user.id)
  if (userRole !== "admin" && userRole !== "editor") {
    return { error: "Only editors and admins can add elders" }
  }

  const { data: elder, error } = await supabase
    .from("elders")
    .insert({
      tradition_id: data.traditionId,
      name: data.name,
      village: data.village,
      lineage: data.lineage,
      bio: data.bio,
      photo_url: data.photoUrl,
      languages: data.languages || []
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  await logEvent("elder_created", "elder", elder.id, user.id, { name: data.name })
  
  revalidatePath("/elders")
  revalidatePath("/upload")
  
  return { data: elder }
}

export async function updateElder(id: string, updates: {
  name?: string
  village?: string
  lineage?: string
  bio?: string
  photoUrl?: string
  languages?: string[]
}) {
  const supabase = await getServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Unauthorized" }
  }

  const userRole = await getUserRole(user.id)
  if (userRole !== "admin" && userRole !== "editor") {
    return { error: "Only editors and admins can update elders" }
  }

  const { data, error } = await supabase
    .from("elders")
    .update({
      name: updates.name,
      village: updates.village,
      lineage: updates.lineage,
      bio: updates.bio,
      photo_url: updates.photoUrl,
      languages: updates.languages,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  await logEvent("elder_updated", "elder", id, user.id, updates)
  
  revalidatePath("/elders")
  revalidatePath(`/elders/${id}`)
  
  return { data }
}

async function getUserRole(userId: string): Promise<string | null> {
  const supabase = await getServerClient()
  
  const { data } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .single()

  return data?.role || null
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
