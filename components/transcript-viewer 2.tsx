import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Transcript {
  id: string
  content: string
  language_id: string
  status: string
  languages: {
    name: string
  }
}

interface TranscriptViewerProps {
  transcripts: Transcript[]
}

export function TranscriptViewer({ transcripts }: TranscriptViewerProps) {
  if (!transcripts || transcripts.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">No transcripts available</CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {transcripts.map((transcript) => (
        <Card key={transcript.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{transcript.languages.name}</CardTitle>
              <Badge variant={transcript.status === "approved" ? "default" : "secondary"}>{transcript.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{transcript.content}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
