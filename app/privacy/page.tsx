export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-serif font-bold text-amber-400 mb-6">Privacy Policy</h1>
      <div className="prose prose-invert max-w-none text-slate-300">
        <p className="text-sm mb-6">Last updated: {new Date().toLocaleDateString()}</p>

        <h2 className="text-2xl font-semibold text-amber-400 mt-8 mb-4">Information We Collect</h2>
        <p className="mb-4">
          We collect information you provide when creating an account, uploading recordings, or interacting with the
          platform.
        </p>

        <h2 className="text-2xl font-semibold text-amber-400 mt-8 mb-4">How We Use Your Information</h2>
        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>To provide and improve our services</li>
          <li>To manage user accounts and authentication</li>
          <li>To facilitate recording uploads and access</li>
          <li>To communicate with users about the platform</li>
        </ul>

        <h2 className="text-2xl font-semibold text-amber-400 mt-8 mb-4">Data Security</h2>
        <p className="mb-4">
          We implement industry-standard security measures to protect your data, including encryption and secure
          storage.
        </p>

        <h2 className="text-2xl font-semibold text-amber-400 mt-8 mb-4">Third-Party Services</h2>
        <p className="mb-4">
          We use third-party services for authentication (Supabase), file storage (Firebase), and AI processing
          (ElevenLabs, Google Cloud). These services have their own privacy policies.
        </p>

        <h2 className="text-2xl font-semibold text-amber-400 mt-8 mb-4">Your Rights</h2>
        <p className="mb-4">You have the right to access, correct, or delete your personal information at any time.</p>
      </div>
    </div>
  )
}
