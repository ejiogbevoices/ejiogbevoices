"use server"

import { createServerClient } from "@/lib/supabase/serverClient"
import { assertCanEditContent } from "@/lib/permissions"
import { revalidatePath } from "next/cache"
import type { TranslationActionResult, Translation, AvailableLanguage } from "@/lib/types/translation"

export async function updateTranslation(
  translationId: string,
  translatedText: string
): Promise<TranslationActionResult<Translation>> {
  try {
    await assertCanEditContent()
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("translations")
      .update({ 
        translated_text: translatedText,
        updated_at: new Date().toISOString()
      })
      .eq("id", translationId)
      .select()
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error updating translation:", error)
    return { 
      success: false,
      error: error instanceof Error ? error.message : "Failed to update translation"
    }
  }
}

export async function createTranslation(
  segmentId: string,
  languageCode: string,
  translatedText: string
): Promise<TranslationActionResult<Translation>> {
  try {
    await assertCanEditContent()
    const supabase = await createServerClient()
    
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from("translations")
      .insert({
        segment_id: segmentId,
        language_code: languageCode,
        translated_text: translatedText,
        qc_status: "pending",
        created_by: user?.id
      })
      .select()
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error creating translation:", error)
    return { 
      success: false,
      error: error instanceof Error ? error.message : "Failed to create translation"
    }
  }
}

export async function updateTranslationQCStatus(
  translationId: string,
  status: "pending" | "approved" | "rejected" | "needs_review"
): Promise<TranslationActionResult<Translation>> {
  try {
    await assertCanEditContent()
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("translations")
      .update({ 
        qc_status: status,
        updated_at: new Date().toISOString()
      })
      .eq("id", translationId)
      .select()
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error updating translation QC status:", error)
    return { 
      success: false,
      error: error instanceof Error ? error.message : "Failed to update QC status" 
    }
  }
}

export async function deleteTranslation(translationId: string): Promise<TranslationActionResult<Translation>> {
  try {
    await assertCanEditContent()
    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("translations")
      .delete()
      .eq("id", translationId)
      .select()
      .single()

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error("Error deleting translation:", error)
    return { 
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete translation" 
    }
  }
}

export async function getAvailableTranslationLanguages(recordingId: string): Promise<TranslationActionResult<AvailableLanguage[]>> {
  try {
    const supabase = await createServerClient()

    // First get all segment IDs for this recording
    const { data: segments, error: segmentsError } = await supabase
      .from("transcript_segments")
      .select("id")
      .eq("recording_id", recordingId)

    if (segmentsError) throw segmentsError

    const segmentIds = segments?.map(s => s.id) || []
    
    if (segmentIds.length === 0) {
      return { success: true, data: [] }
    }

    // Then get translations for those segments
    const { data, error } = await supabase
      .from("translations")
      .select("language_code, segment_id")
      .in("segment_id", segmentIds)

    if (error) throw error

    // Count segments per language
    const languageCounts = (data || []).reduce((acc, curr) => {
      acc[curr.language_code] = (acc[curr.language_code] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const languages = Object.entries(languageCounts).map(([code, count]) => ({
      language_code: code,
      segment_count: count
    }))

    return { success: true, data: languages }
  } catch (error) {
    console.error("Error getting available languages:", error)
    return { 
      success: false,
      error: error instanceof Error ? error.message : "Failed to get languages"
    }
  }
}
