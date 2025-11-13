import type { SourceType, RecordingWithRelations } from "@/lib/types/recording"

// Source type labels for display
export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  elder_teaching: "Elder Teaching",
  community_prayer: "Community Prayer",
  religious_text: "Religious Text",
  traditional_song: "Traditional Song",
  oral_history: "Oral History",
  ceremony: "Ceremony",
}

// Source type options for dropdowns
export const SOURCE_TYPE_OPTIONS: Array<{ value: SourceType; label: string }> = [
  { value: "elder_teaching", label: "Elder Teaching" },
  { value: "community_prayer", label: "Community Prayer" },
  { value: "religious_text", label: "Religious Text" },
  { value: "traditional_song", label: "Traditional Song" },
  { value: "oral_history", label: "Oral History" },
  { value: "ceremony", label: "Ceremony" },
]

/**
 * Get the display label for a source type
 */
export function getSourceTypeLabel(sourceType: SourceType): string {
  return SOURCE_TYPE_LABELS[sourceType] || sourceType
}

/**
 * Format the recording source for display
 * Returns one of:
 * - "Elder: [Name]" when elder exists
 * - "[Tradition] • [Source Type]" when no elder but has tradition
 * - "[Source Type]" when neither exists
 */
export function formatRecordingSource(recording: RecordingWithRelations): string {
  if (recording.elders) {
    return `Elder: ${recording.elders.name}`
  }
  
  const sourceLabel = getSourceTypeLabel(recording.source_type)
  
  if (recording.traditions) {
    return `${recording.traditions.name} • ${sourceLabel}`
  }
  
  return sourceLabel
}
