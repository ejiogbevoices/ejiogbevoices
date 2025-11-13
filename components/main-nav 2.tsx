import { getServerClient } from "@/lib/supabase/serverClient"
import { MainNavClient } from "./main-nav-client"

export async function MainNav() {
  const supabase = await getServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <MainNavClient user={user} />
}
