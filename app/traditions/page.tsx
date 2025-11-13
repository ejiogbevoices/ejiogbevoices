import { Suspense } from "react"
import Link from "next/link"
import { getServerClient } from "@/lib/supabase/serverClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

async function TraditionsList() {
  const supabase = await getServerClient()

  const { data: traditions, error } = await supabase.from("traditions").select("*, recordings (count)").order("name")

  if (error || !traditions) {
    return <div className="text-center py-12">No traditions found.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {traditions.map((tradition) => (
        <Link key={tradition.id} href={`/traditions/${tradition.id}`}>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{tradition.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {tradition.description && (
                <p className="text-sm text-muted-foreground line-clamp-3 mb-2">{tradition.description}</p>
              )}
              <p className="text-xs text-muted-foreground">{tradition.recordings?.[0]?.count || 0} recordings</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

export default function TraditionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold mb-2">Traditions</h1>
        <p className="text-muted-foreground">Explore different cultural and spiritual traditions</p>
      </div>

      <Suspense fallback={<div>Loading traditions...</div>}>
        <TraditionsList />
      </Suspense>
    </div>
  )
}
