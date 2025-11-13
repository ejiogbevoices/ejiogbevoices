import { getServerClient } from "@/lib/supabase/serverClient"
import { redirect } from "next/navigation"
import { InboxClient } from "@/components/inbox-client"

export const metadata = {
  title: "Review Tasks | Ejiogbe Voices",
  description: "Review transcription and translation tasks",
}

export default async function InboxPage() {
  const supabase = await getServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch review tasks from the database
  const { data: tasks } = await supabase
    .from("review_tasks")
    .select(
      `
      *,
      recordings (
        id,
        title,
        created_at
      )
    `,
    )
    .order("created_at", { ascending: false })

  return <InboxClient tasks={tasks || []} />
}
