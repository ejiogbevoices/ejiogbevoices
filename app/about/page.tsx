export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-serif font-bold text-amber-400 mb-6">About Ejiogbe Voices</h1>
      <div className="prose prose-invert max-w-none">
        <p className="text-lg text-slate-300 mb-4">
          Ejiogbe Voices is a digital archive preserving and sharing indigenous knowledge through audio recordings,
          transcriptions, and translations of oral traditions from Yoruba and Igbo elders.
        </p>
        <h2 className="text-2xl font-semibold text-amber-400 mt-8 mb-4">Our Mission</h2>
        <p className="text-slate-300 mb-4">
          We are committed to preserving the wisdom, stories, and cultural heritage of indigenous communities by
          creating a comprehensive digital archive that honors the voices of elders and knowledge keepers.
        </p>
        <h2 className="text-2xl font-semibold text-amber-400 mt-8 mb-4">What We Do</h2>
        <ul className="list-disc list-inside text-slate-300 space-y-2 mb-4">
          <li>Record and preserve oral traditions from elders and cultural knowledge keepers</li>
          <li>Create accurate transcriptions in original languages</li>
          <li>Provide translations to make knowledge accessible across languages</li>
          <li>Organize content by traditions, lineages, and topics</li>
          <li>Maintain ethical standards for consent and cultural sensitivity</li>
        </ul>
      </div>
    </div>
  )
}
