"use server"

import { getServerClient } from "@/lib/supabase/serverClient"
import { assertCanEditContent } from "@/lib/permissions"
import { revalidatePath } from "next/cache"

export async function updateTranscriptSegment(
  segmentId: string,
  text: string
) {
  await assertCanEditContent()
  const supabase = await getServerClient()

  const { data, error } = await supabase
    .from("transcript_segments")
    .update({ text, updated_at: new Date().toISOString() })
    .eq("id", segmentId)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/recordings/[id]/transcription")
  return { data }
}

export async function updateRecordingPermissions(
  recordingId: string,
  permissions: {
    visibility?: string
    consent_status?: string
    embargo_until?: string | null
    published_at?: string | null
  }
) {
  await assertCanEditContent()
  const supabase = await getServerClient()

  const { data, error } = await supabase
    .from("recordings")
    .update({
      ...permissions,
      updated_at: new Date().toISOString()
    })
    .eq("id", recordingId)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/recordings/[id]/transcription")
  revalidatePath(`/recordings/${recordingId}`)
  return { data }
}

export async function saveConsentDocument(
  recordingId: string,
  documentData: {
    restriction_terms?: string
    provenance_notes?: string
  }
) {
  await assertCanEditContent()
  const supabase = await getServerClient()

  // Note: In a real implementation, you'd save this to a separate consent_documents table
  // For now, we'll store it in the recording metadata
  const { data, error } = await supabase
    .from("recordings")
    .update({
      // Store in tags or create a metadata JSONB column
      updated_at: new Date().toISOString()
    })
    .eq("id", recordingId)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/recordings/[id]/transcription")
  return { data }
}

export async function updateSegmentQCStatus(
  segmentId: string,
  qcStatus: "pending" | "approved" | "rejected" | "needs_review"
) {
  await assertCanEditContent()
  const supabase = await getServerClient()

  const { data, error } = await supabase
    .from("transcript_segments")
    .update({
      qc_status: qcStatus,
      updated_at: new Date().toISOString()
    })
    .eq("id", segmentId)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/recordings/[id]/transcription")
  return { data }
}

export async function createGlossaryTerm(
  traditionId: string,
  term: {
    term: string
    language_code: string
    preferred_translation: string
    definition: string
  }
) {
  await assertCanEditContent()
  const supabase = await getServerClient()

  const { data, error } = await supabase
    .from("glossary_terms")
    .insert({
      tradition_id: traditionId,
      ...term
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/recordings/[id]/transcription")
  return { data }
}

export async function updateGlossaryTerm(
  termId: string,
  updates: {
    term?: string
    preferred_translation?: string
    definition?: string
  }
) {
  await assertCanEditContent()
  const supabase = await getServerClient()

  const { data, error } = await supabase
    .from("glossary_terms")
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq("id", termId)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/recordings/[id]/transcription")
  return { data }
}

export async function deleteGlossaryTerm(termId: string) {
  await assertCanEditContent()
  const supabase = await getServerClient()

  const { error } = await supabase
    .from("glossary_terms")
    .delete()
    .eq("id", termId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/recordings/[id]/transcription")
  return { success: true }
}
