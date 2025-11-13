import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { RestrictionsManager } from "@/components/restrictions-manager"

export default function RestrictionsPage() {
  return (
    <div className="min-h-screen bg-[#0D1117] pb-20">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/upload" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-2xl font-serif font-bold text-white">Usage Restrictions</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <RestrictionsManager />
      </div>
    </div>
  )
}
