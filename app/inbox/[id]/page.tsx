import { Suspense } from "react"
import { createServerClient } from "@/lib/supabase/serverClient"
import { ReviewTaskClient } from "@/components/review-task-client"
import { redirect } from "next/navigation"

export default async function ReviewTaskPage({ params }: { params: { id: string } }) {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: task } = await supabase
    .from("review_tasks")
    .select(
      `
      *,
      recordings (
        id,
        title,
        audio_url,
        elder_id,
        elders (name),
        transcription,
        translation
      )
    `,
    )
    .eq("id", params.id)
    .single()

  if (!task) {
    redirect("/inbox")
  }

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0D1117]" />}>
      <ReviewTaskClient task={task} />
    </Suspense>
  )
}
