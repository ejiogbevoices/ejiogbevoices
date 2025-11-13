import { getServerClient } from "@/lib/supabase/serverClient"
import { TranslationEditor } from "@/components/translation-editor"

export default async function TranslationEditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await getServerClient()

  // Fetch the recording
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

  // Fetch transcript segments
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

  // Fetch all languages for the target language picker
  const { data: languages } = await supabase.from("languages").select("id, name, code").order("name")

  return <TranslationEditor recording={recording || null} segments={segments || []} languages={languages || []} />
}
