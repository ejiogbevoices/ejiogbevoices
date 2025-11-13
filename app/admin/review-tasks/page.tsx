import { getServerClient } from "@/lib/supabase/serverClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function ReviewTasksPage() {
  const supabase = await getServerClient()

  const { data: tasks } = await supabase
    .from("review_tasks")
    .select(`
      id,
      task_type,
      status,
      created_at,
      target_id,
      notes,
      assigned_to
    `)
    .eq("status", "pending")
    .order("created_at", { ascending: false })

  const recordingIds = tasks?.map((t) => t.target_id) || []
  const { data: recordings } = await supabase
    .from("recordings")
    .select(`
      id,
      title,
      elders (name),
      traditions (name)
    `)
    .in("id", recordingIds)

  const recordingsMap = new Map(recordings?.map((r) => [r.id, r]) || [])

  const transcriptionTasks = tasks?.filter((t) => t.task_type === "transcription_qc") || []
  const translationTasks = tasks?.filter((t) => t.task_type === "translation_qc") || []
  const sacredTasks = tasks?.filter((t) => t.task_type === "sacred_sign_off") || []

  const getTaskBadgeColor = (taskType: string) => {
    switch (taskType) {
      case "transcription_qc":
        return "default"
      case "translation_qc":
        return "secondary"
      case "sacred_sign_off":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getTaskLink = (task: any) => {
    if (task.task_type === "transcription_qc") {
      return `/transcription/${task.target_id}`
    } else if (task.task_type === "translation_qc") {
      return `/translations/${task.target_id}`
    } else {
      return `/recordings/${task.target_id}`
    }
  }

  const renderTaskGroup = (title: string, tasks: any[], emptyMessage: string) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <Badge variant="outline">{tasks.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">{emptyMessage}</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const recording = recordingsMap.get(task.target_id)
              return (
                <Link
                  key={task.id}
                  href={getTaskLink(task)}
                  className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{recording?.title || "Unknown Recording"}</h3>
                      <p className="text-sm text-muted-foreground">
                        {recording?.elders?.name} • {recording?.traditions?.name}
                      </p>
                    </div>
                    <Badge variant={getTaskBadgeColor(task.task_type)}>{task.task_type.replace("_", " ")}</Badge>
                  </div>
                  {task.notes && <p className="text-sm text-muted-foreground mt-2">{task.notes}</p>}
                  <p className="text-xs text-muted-foreground mt-2">
                    Created: {new Date(task.created_at).toLocaleDateString()}
                  </p>
                </Link>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-serif font-bold mb-8">Review Tasks</h1>

      <div className="space-y-6">
        {renderTaskGroup("Transcription QC", transcriptionTasks, "No pending transcription reviews")}

        {renderTaskGroup("Translation QC", translationTasks, "No pending translation reviews")}

        {renderTaskGroup("Sacred Content Sign-Off", sacredTasks, "No pending sacred content reviews")}
      </div>
    </div>
  )
}
