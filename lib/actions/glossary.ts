"use server"

import { getServerClient } from "@/lib/supabase/serverClient"
import { revalidatePath } from "next/cache"

export async function createGlossaryTerm(data: {
  traditionId: string
  term: string
  languageCode: string
  preferredTranslation?: string
  definition?: string
  sensitive?: boolean
}) {
  const supabase = await getServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Unauthorized" }
  }

  const userRole = await getUserRole(user.id)
  if (userRole !== "admin" && userRole !== "editor") {
    return { error: "Only editors and admins can add glossary terms" }
  }

  const { data: glossaryTerm, error } = await supabase
    .from("glossary_terms")
    .insert({
      tradition_id: data.traditionId,
      term: data.term,
      language_code: data.languageCode,
      preferred_translation: data.preferredTranslation,
      definition: data.definition,
      sensitive: data.sensitive || false
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  await logEvent("glossary_term_created", "glossary_term", glossaryTerm.id, user.id, { term: data.term })
  
  revalidatePath("/glossary")
  revalidatePath("/admin/glossary")
  
  return { data: glossaryTerm }
}

export async function updateGlossaryTerm(id: string, updates: {
  term?: string
  preferredTranslation?: string
  definition?: string
  sensitive?: boolean
}) {
  const supabase = await getServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Unauthorized" }
  }

  const userRole = await getUserRole(user.id)
  if (userRole !== "admin" && userRole !== "editor") {
    return { error: "Only editors and admins can update glossary terms" }
  }

  const { data, error } = await supabase
    .from("glossary_terms")
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

  await logEvent("glossary_term_updated", "glossary_term", id, user.id, updates)
  
  revalidatePath("/glossary")
  revalidatePath(`/glossary/${id}`)
  revalidatePath("/admin/glossary")
  
  return { data }
}

export async function deleteGlossaryTerm(id: string) {
  const supabase = await getServerClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: "Unauthorized" }
  }

  const userRole = await getUserRole(user.id)
  if (userRole !== "admin") {
    return { error: "Only admins can delete glossary terms" }
  }

  const { error } = await supabase
    .from("glossary_terms")
    .delete()
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  await logEvent("glossary_term_deleted", "glossary_term", id, user.id, {})
  
  revalidatePath("/glossary")
  revalidatePath("/admin/glossary")
  
  return { success: true }
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
