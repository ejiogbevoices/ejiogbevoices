import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getServerClient } from "@/lib/supabase/serverClient"
import { RecordingCard } from "@/components/recording-card"
import { Card, CardContent } from "@/components/ui/card"

async function TraditionDetail({ id }: { id: string }) {
  const supabase = await getServerClient()

  const { data: tradition, error } = await supabase
    .from("traditions")
    .select(`
      *,
      recordings (
        *,
        elders (id, name, photo_url),
        primary_language:languages!recordings_primary_language_id_fkey (id, name)
      )
    `)
    .eq("id", id)
    .single()

  if (error || !tradition) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <h1 className="text-3xl font-serif font-bold mb-2">{tradition.name}</h1>
          {tradition.description && <p className="text-muted-foreground">{tradition.description}</p>}
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-serif font-bold mb-4">Recordings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tradition.recordings?.map((recording: any) => (
            <RecordingCard key={recording.id} recording={recording} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function TraditionPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading tradition...</div>}>
        <TraditionDetail id={params.id} />
      </Suspense>
    </div>
  )
}
