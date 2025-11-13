import { getServerClient } from "@/lib/supabase/serverClient"
import { TranscriptionEditor } from "@/components/transcription-editor"

export default async function TranscriptionEditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await getServerClient()

  const { data: recording } = await supabase
    .from("recordings")
    .select(`
      id,
      title,
      storage_url,
      duration_ms,
      language,
      elders (id, name),
      traditions (id, name)
    `)
    .eq("id", id)
    .single()

  const { data: segments } = await supabase
    .from("transcript_segments")
    .select(`
      id,
      segment_index,
      start_ms,
      end_ms,
      text_original,
      qc_status
    `)
    .eq("recording_id", id)
    .order("segment_index")

  return <TranscriptionEditor recording={recording || null} segments={segments || []} />
}
