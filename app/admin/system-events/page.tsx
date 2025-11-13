import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SystemEventsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-serif font-bold mb-8">System Events</h1>

      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No recent system events</p>
        </CardContent>
      </Card>
    </div>
  )
}
