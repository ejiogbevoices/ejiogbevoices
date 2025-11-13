import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getServerClient } from "@/lib/supabase/serverClient"
import { RecordingCard } from "@/components/recording-card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

async function ElderDetail({ id }: { id: string }) {
  const supabase = await getServerClient()

  const { data: elder, error } = await supabase
    .from("elders")
    .select(`
      *,
      recordings (
        *,
        traditions (id, name),
        primary_language:languages!recordings_primary_language_id_fkey (id, name)
      )
    `)
    .eq("id", id)
    .single()

  if (error || !elder) {
    notFound()
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={elder.photo_url || ""} alt={elder.name} />
              <AvatarFallback className="text-2xl">{elder.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-serif font-bold mb-2">{elder.name}</h1>
              {elder.bio && <p className="text-muted-foreground">{elder.bio}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-serif font-bold mb-4">Recordings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {elder.recordings?.map((recording: any) => (
            <RecordingCard key={recording.id} recording={{ ...recording, elders: elder }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ElderPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div>Loading elder...</div>}>
        <ElderDetail id={params.id} />
      </Suspense>
    </div>
  )
}
