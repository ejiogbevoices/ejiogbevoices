import { getServerClient } from "@/lib/supabase/serverClient"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import GlossaryAdminClient from "@/components/glossary-admin-client"

export default async function AdminGlossaryPage() {
  const supabase = await getServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user?.id || "")
    .single()

  if (!user || userData?.role !== "admin") {
    redirect("/")
  }

  const { data: terms } = await supabase.from("glossary_terms").select("*").order("term")
  const { data: traditions } = await supabase.from("traditions").select("id, name").order("name")
  const { data: languages } = await supabase.from("languages").select("code, name").order("name")

  return (
    <div className="min-h-screen bg-[#0D1117] pb-20 md:pb-0">
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-3xl font-serif font-bold text-white">Manage Glossary</h1>
            </div>
            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
              <Plus className="w-5 h-5 mr-2" />
              Add Term
            </Button>
          </div>
        </div>
      </div>

      <GlossaryAdminClient terms={terms || []} traditions={traditions || []} languages={languages || []} />
    </div>
  )
}
