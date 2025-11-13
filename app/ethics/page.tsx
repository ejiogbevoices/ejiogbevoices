export default function EthicsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-serif font-bold text-amber-400 mb-6">Ethics & Consent</h1>
      <div className="prose prose-invert max-w-none">
        <h2 className="text-2xl font-semibold text-amber-400 mt-8 mb-4">Our Ethical Framework</h2>
        <p className="text-slate-300 mb-4">
          We are committed to the highest standards of ethical practice in preserving indigenous knowledge. All
          recordings are made with explicit informed consent from elders and knowledge keepers.
        </p>

        <h2 className="text-2xl font-semibold text-amber-400 mt-8 mb-4">Consent Requirements</h2>
        <ul className="list-disc list-inside text-slate-300 space-y-2 mb-4">
          <li>Written or recorded consent obtained before each recording session</li>
          <li>Clear explanation of how recordings will be used and shared</li>
          <li>Option to restrict access (public, members-only, institutional, or restricted)</li>
          <li>Right to withdraw consent and remove recordings at any time</li>
          <li>Embargo periods honored when requested by speakers</li>
        </ul>

        <h2 className="text-2xl font-semibold text-amber-400 mt-8 mb-4">Cultural Sensitivity</h2>
        <p className="text-slate-300 mb-4">
          We respect traditional knowledge protocols and work closely with communities to ensure culturally appropriate
          handling of sacred or sensitive information.
        </p>

        <h2 className="text-2xl font-semibold text-amber-400 mt-8 mb-4">Access Levels</h2>
        <ul className="list-disc list-inside text-slate-300 space-y-2 mb-4">
          <li>
            <strong>Public:</strong> Available to all visitors
          </li>
          <li>
            <strong>Members:</strong> Registered users only
          </li>
          <li>
            <strong>Institution:</strong> Affiliated organization members
          </li>
          <li>
            <strong>Restricted:</strong> Administrative access only
          </li>
        </ul>
      </div>
    </div>
  )
}
