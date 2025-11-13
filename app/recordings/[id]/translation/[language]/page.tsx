import { createServerClient } from "@/lib/supabase/serverClient"
import { notFound } from "next/navigation"
import { TranslationEditor } from "@/components/translation-editor"
import { assertCanEditContent } from "@/lib/permissions"
import type { TranslationSegment } from "@/lib/types/translation"

interface PageProps {
  params: { id: string; language: string }
}

export default async function TranslationPage({ params }: PageProps) {
  await assertCanEditContent()
  
  const { id, language } = params
  const supabase = await createServerClient()

  const { data: recording, error } = await supabase
    .from("recordings")
    .select(`
      id,
      title,
      language,
      duration_ms,
      storage_url,
      visibility,
      consent_status,
      embargo_until,
      published_at,
      tags,
      tradition_id,
      elder_id,
      source_type,
      elders(id, name),
      traditions(id, name),
      transcript_segments(id)
    `)
    .eq("id", id)
    .single()

  if (error || !recording) {
    notFound()
  }

  // Get transcript segments with their translations
  const { data: transcriptSegments } = await supabase
    .from("transcript_segments")
    .select(`
      id,
      segment_index,
      start_ms,
      end_ms,
      text
    `)
    .eq("recording_id", id)
    .order("segment_index")

  if (!transcriptSegments) {
    notFound()
  }

  // Get existing translations for this language
  const segmentIds = transcriptSegments.map(s => s.id)
  const { data: translations } = await supabase
    .from("translations")
    .select("*")
    .in("segment_id", segmentIds)
    .eq("language_code", language)

  // Map translations to segments
  const segments: TranslationSegment[] = transcriptSegments.map(segment => {
    const translation = translations?.find(t => t.segment_id === segment.id) || null
    return {
      id: segment.id,
      segment_index: segment.segment_index,
      start_ms: segment.start_ms,
      end_ms: segment.end_ms,
      original_text: segment.text,
      translation
    }
  })

  const traditionId = recording.tradition_id || (recording.traditions as any)?.id
  
  const { data: glossaryTerms } = await supabase
    .from("glossary_terms")
    .select("id, term, preferred_translation, definition")
    .eq("tradition_id", traditionId)
    .order("term")

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <TranslationEditor 
        recording={recording} 
        targetLanguage={language}
        segments={segments}
        glossaryTerms={glossaryTerms || []}
      />
    </div>
  )
}
