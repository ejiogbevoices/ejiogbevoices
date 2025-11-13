import { createServerClient } from "@/lib/supabase/serverClient"
import { notFound } from "next/navigation"
import { TranscriptionEditor } from "@/components/transcription-editor"
import { assertCanEditContent } from "@/lib/permissions"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function TranscriptionPage({ params }: PageProps) {
  await assertCanEditContent()
  
  const { id } = await params
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
      transcript_segments(
        id,
        segment_index,
        start_ms,
        end_ms,
        text,
        language_code,
        qc_status
      )
    `)
    .eq("id", id)
    .single()

  if (error || !recording) {
    notFound()
  }

  const traditionId = recording.tradition_id || (recording.traditions as any)?.id
  
  const { data: glossaryTerms } = await supabase
    .from("glossary_terms")
    .select("id, term, preferred_translation, definition")
    .eq("tradition_id", traditionId)
    .order("term")

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <TranscriptionEditor 
        recording={recording} 
        glossaryTerms={glossaryTerms || []}
      />
    </div>
  )
}
