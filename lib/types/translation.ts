import type { RecordingWithRelations } from "./recording"

export interface Translation {
  id: string
  segment_id: string
  language_code: string
  translated_text: string
  qc_status: "pending" | "approved" | "rejected" | "needs_review"
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface TranslationSegment {
  id: string
  segment_index: number
  start_ms: number
  end_ms: number
  original_text: string
  translation: Translation | null
}

export type RecordingWithTranslations = RecordingWithRelations

export interface AvailableLanguage {
  language_code: string
  segment_count: number
}

export type TranslationActionResult<T = any> = 
  | { success: true; data: T }
  | { success: false; error: string }
