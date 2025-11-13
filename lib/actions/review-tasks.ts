"use server"

import { getServerClient } from "@/lib/supabase/serverClient"
import { assertCanEditContent, assertAuthenticated, assertIsAdmin, canUpdateReviewTask } from "@/lib/permissions"
import { revalidatePath } from "next/cache"

export async function createReviewTask(data: {
  targetId: string
  taskType: "consent_signoff" | "transcription_qc" | "translation_qc" | "dub_review"
  assignedTo?: string
}) {
  const user = await assertCanEditContent()
  const supabase = await getServerClient()

  const { data: task, error } = await supabase
    .from("review_tasks")
    .insert({
      target_id: data.targetId,
      task_type: data.taskType,
      assigned_to: data.assignedTo,
      status: "pending"
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/review-tasks")
  revalidatePath("/inbox")
  
  return { data: task }
}

export async function approveReviewTask(id: string, notes?: string) {
  const user = await assertAuthenticated()
  const canUpdate = await canUpdateReviewTask(id)
  
  if (!canUpdate) {
    return { error: "Forbidden: You can only update review tasks assigned to you" }
  }
  
  const supabase = await getServerClient()

  const { data, error } = await supabase
    .from("review_tasks")
    .update({
      status: "approved",
      completed_at: new Date().toISOString(),
      notes,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  await logEvent("review_task_approved", "review_task", id, user.id, { notes })
  
  revalidatePath("/admin/review-tasks")
  revalidatePath("/inbox")
  
  return { data }
}

export async function rejectReviewTask(id: string, notes?: string) {
  const user = await assertAuthenticated()
  const canUpdate = await canUpdateReviewTask(id)
  
  if (!canUpdate) {
    return { error: "Forbidden: You can only update review tasks assigned to you" }
  }
  
  const supabase = await getServerClient()

  const { data, error } = await supabase
    .from("review_tasks")
    .update({
      status: "rejected",
      completed_at: new Date().toISOString(),
      notes,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  await logEvent("review_task_rejected", "review_task", id, user.id, { notes })
  
  revalidatePath("/admin/review-tasks")
  revalidatePath("/inbox")
  
  return { data }
}

export async function assignReviewTask(id: string, assignedTo: string) {
  const user = await assertIsAdmin()
  const supabase = await getServerClient()

  const { data, error } = await supabase
    .from("review_tasks")
    .update({
      assigned_to: assignedTo,
      status: "in_progress",
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/review-tasks")
  revalidatePath("/inbox")
  
  return { data }
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
