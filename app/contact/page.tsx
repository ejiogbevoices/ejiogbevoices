export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-4xl font-serif font-bold text-amber-400 mb-6">Contact Us</h1>
      <div className="prose prose-invert max-w-none">
        <p className="text-lg text-slate-300 mb-8">
          We welcome inquiries about the archive, collaboration opportunities, and technical support.
        </p>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-amber-400 mb-2">General Inquiries</h2>
            <p className="text-slate-300">info@ejiogbevoices.org</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-amber-400 mb-2">Technical Support</h2>
            <p className="text-slate-300">support@ejiogbevoices.org</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-amber-400 mb-2">Partnership Opportunities</h2>
            <p className="text-slate-300">partnerships@ejiogbevoices.org</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-amber-400 mb-2">Mailing Address</h2>
            <p className="text-slate-300">
              Ejiogbe Voices Archive
              <br />
              [Address Line 1]
              <br />
              [Address Line 2]
              <br />
              [City, State ZIP]
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
