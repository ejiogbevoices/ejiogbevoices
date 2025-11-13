import { UploadForm } from "@/components/upload-form" // Fixed import path

export const metadata = {
  title: "Upload Recording | Ejiogbe Voices",
  description: "Upload a new recording",
}

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-5xl font-serif font-bold text-amber-400 mb-4">Ejiogbe Voices</h1>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto">
            Upload audio recordings to transcribe, translate, and share ancestral wisdom with future generations. Each
            recording becomes part of a living archive.
          </p>
        </div>
      </div>

      {/* Upload Form */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <UploadForm />
      </div>
    </div>
  )
}
