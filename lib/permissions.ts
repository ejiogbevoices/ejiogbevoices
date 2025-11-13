import { createServerClient } from "@/lib/supabase/serverClient"

export type UserRole = "admin" | "editor" | "member" | "reviewer" | "guest"

export interface UserWithRole {
  id: string
  email: string | null
  name: string | null
  role: UserRole
  org_id: string | null
}

export async function getCurrentUser(): Promise<UserWithRole | null> {
  const supabase = await createServerClient()
  
  const { data: { user: authUser } } = await supabase.auth.getUser()
  
  if (!authUser) {
    return null
  }

  const { data: user } = await supabase
    .from("users")
    .select("id, email, name, role, org_id")
    .eq("id", authUser.id)
    .single()

  return user
}

export async function assertAuthenticated() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("Unauthorized: You must be logged in")
  }
  return user
}

export async function assertCanEditContent() {
  const user = await assertAuthenticated()
  if (!["admin", "editor"].includes(user.role)) {
    throw new Error("Forbidden: Only editors and admins can edit content")
  }
  return user
}

export async function assertIsAdmin() {
  const user = await assertAuthenticated()
  if (user.role !== "admin") {
    throw new Error("Forbidden: Only admins can perform this action")
  }
  return user
}

export async function canEditRecording(recordingId: string): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false
  
  if (["admin", "editor"].includes(user.role)) {
    return true
  }
  
  const supabase = await createServerClient()
  const { data: recording } = await supabase
    .from("recordings")
    .select("created_by")
    .eq("id", recordingId)
    .single()
  
  return recording?.created_by === user.id
}

export async function canUpdateReviewTask(taskId: string): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false
  
  if (["admin", "editor"].includes(user.role)) {
    return true
  }
  
  const supabase = await createServerClient()
  const { data: task } = await supabase
    .from("review_tasks")
    .select("assigned_to")
    .eq("id", taskId)
    .single()
  
  return task?.assigned_to === user.id
}

export async function applyVisibilityFilter<T>(
  query: any,
  user: UserWithRole | null
) {
  if (!user) {
    return query.eq("visibility", "public").or("embargo_until.is.null,embargo_until.lt.now()")
  }

  if (["admin", "editor"].includes(user.role)) {
    return query
  }

  if (user.org_id) {
    return query.in("visibility", ["public", "members", "institution"])
  }

  return query.in("visibility", ["public", "members"])
}
