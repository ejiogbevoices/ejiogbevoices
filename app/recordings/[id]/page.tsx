import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getServerClient } from "@/lib/supabase/serverClient"
import { AudioPlayer } from "@/components/audio-player"
import { TranscriptViewer } from "@/components/transcript-viewer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

async function RecordingDetail({ id }: { id: string }) {
  const supabase = await getServerClient()

  const { data: recording, error } = await supabase
    .from("recordings")
    .select(`
      *,
      elders (id, name, photo_url, bio),
      traditions (id, name, description)
    `)
    .eq("id", id)
    .single()

  if (error || !recording) {
    notFound()
  }

  const { data: transcriptSegments } = await supabase
    .from("transcript_segments")
    .select("*")
    .eq("recording_id", id)
    .order("segment_index")

  const { data: translations } = await supabase
    .from("translations")
    .select("*, segment_id")
    .in("segment_id", transcriptSegments?.map((s) => s.id) || [])

  return (
    <div className="space-y-8">
      <AudioPlayer recordingId={recording.id} audioUrl={recording.storage_url} title={recording.title} />

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{recording.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{recording.provenance_notes}</p>
              <div className="flex flex-wrap gap-2">
                {recording.language && <Badge variant="secondary">{recording.language}</Badge>}
                {recording.traditions && <Badge variant="outline">{recording.traditions.name}</Badge>}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="transcripts">
            <TabsList>
              <TabsTrigger value="transcripts">Transcripts</TabsTrigger>
              <TabsTrigger value="translations">Translations</TabsTrigger>
            </TabsList>
            <TabsContent value="transcripts">
              <TranscriptViewer transcripts={transcriptSegments || []} />
            </TabsContent>
            <TabsContent value="translations">
              <div className="space-y-4">
                {translations?.map((translation: any) => (
                  <Card key={translation.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{translation.language_code}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap">{translation.translated_text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          {recording.elders && (
            <Card>
              <CardHeader>
                <CardTitle>Elder</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-3">
                  {recording.elders.photo_url && (
                    <img
                      src={recording.elders.photo_url || "/placeholder.svg"}
                      alt={recording.elders.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-semibold">{recording.elders.name}</p>
                  </div>
                </div>
                {recording.elders.bio && <p className="text-sm text-muted-foreground">{recording.elders.bio}</p>}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default function RecordingPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading recording...</div>}>
        <RecordingDetail id={params.id} />
      </Suspense>
    </div>
  )
}
