export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-serif font-bold text-amber-400 mb-6">Terms of Use</h1>
      <div className="prose prose-invert max-w-none text-slate-300">
        <p className="text-sm mb-6">Last updated: {new Date().toLocaleDateString()}</p>

        <h2 className="text-2xl font-semibold text-amber-400 mt-8 mb-4">Acceptance of Terms</h2>
        <p className="mb-4">By accessing and using Ejiogbe Voices, you agree to be bound by these Terms of Use.</p>

        <h2 className="text-2xl font-semibold text-amber-400 mt-8 mb-4">User Accounts</h2>
        <p className="mb-4">
          You are responsible for maintaining the confidentiality of your account credentials and for all activities
          that occur under your account.
        </p>

        <h2 className="text-2xl font-semibold text-amber-400 mt-8 mb-4">Content Upload</h2>
        <p className="mb-4">When uploading recordings, you must:</p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Have explicit consent from all speakers</li>
          <li>Provide accurate metadata and provenance information</li>
          <li>Respect cultural protocols and sensitivities</li>
          <li>Not upload copyrighted material without permission</li>
        </ul>

        <h2 className="text-2xl font-semibold text-amber-400 mt-8 mb-4">Intellectual Property</h2>
        <p className="mb-4">
          Recordings and content remain the property of their original creators and speakers. The platform facilitates
          access and preservation but does not claim ownership.
        </p>

        <h2 className="text-2xl font-semibold text-amber-400 mt-8 mb-4">Prohibited Uses</h2>
        <p className="mb-4">You may not use the platform to:</p>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>Violate any laws or regulations</li>
          <li>Infringe on intellectual property rights</li>
          <li>Upload malicious code or spam</li>
          <li>Harass or harm other users</li>
        </ul>

        <h2 className="text-2xl font-semibold text-amber-400 mt-8 mb-4">Termination</h2>
        <p className="mb-4">We reserve the right to suspend or terminate accounts that violate these terms.</p>
      </div>
    </div>
  )
}
