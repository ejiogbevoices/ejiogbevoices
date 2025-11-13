import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function OrgManagementPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-serif font-bold mb-8">Organization Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>Organizations</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Organization management tools will appear here</p>
        </CardContent>
      </Card>
    </div>
  )
}
