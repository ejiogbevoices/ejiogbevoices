import { createBrowserClient } from "@supabase/ssr"

const globalForSupa = globalThis as unknown as {
  __supa?: ReturnType<typeof createBrowserClient>
}

export function getBrowserClient() {
  if (typeof window === "undefined") return null

  if (!globalForSupa.__supa) {
    globalForSupa.__supa = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          storageKey: "sb-ejiogbe-auth",
          persistSession: true,
          autoRefreshToken: true,
        },
      },
    )
  }

  return globalForSupa.__supa
}
