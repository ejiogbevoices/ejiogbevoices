// Shared recording types for the application

export interface Elder {
  id: string
  name: string
}

export interface Tradition {
  id: string
  name: string
}

export interface TranscriptSegment {
  id: string
  segment_index: number
  start_ms: number
  end_ms: number
  text: string
  language_code: string
  qc_status: "pending" | "approved" | "rejected" | "needs_review"
}

export type SourceType = 
  | "elder_teaching"
  | "community_prayer"
  | "religious_text"
  | "traditional_song"
  | "oral_history"
  | "ceremony"

export interface Recording {
  id: string
  title: string
  language: string
  duration_ms: number
  storage_url: string
  visibility: "public" | "members" | "institution" | "private"
  consent_status: string
  embargo_until: string | null
  published_at: string | null
  tags: string[] | null
  source_type: SourceType
  tradition_id: string
  elder_id: string | null
}

export interface RecordingWithRelations extends Recording {
  elders: Elder | null
  traditions: Tradition | null
  transcript_segments: TranscriptSegment[] | null
}
