export default function APIDocsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-serif font-bold text-amber-400 mb-6">API Documentation</h1>
      <div className="prose prose-invert max-w-none">
        <p className="text-lg text-slate-300 mb-6">Access Ejiogbe Voices data programmatically through our REST API.</p>

        <h2 className="text-2xl font-semibold text-amber-400 mt-8 mb-4">Authentication</h2>
        <p className="text-slate-300 mb-4">
          API requests require authentication using an API key. Contact us to request access.
        </p>

        <h2 className="text-2xl font-semibold text-amber-400 mt-8 mb-4">Endpoints</h2>

        <h3 className="text-xl font-semibold text-slate-200 mt-6 mb-3">GET /api/recordings</h3>
        <p className="text-slate-300 mb-2">List all public recordings with optional filters.</p>
        <pre className="bg-slate-800 p-4 rounded-lg text-sm overflow-x-auto mb-4">
          {`GET /api/recordings?language=yoruba&tradition=ifa&limit=10`}
        </pre>

        <h3 className="text-xl font-semibold text-slate-200 mt-6 mb-3">GET /api/recordings/:id</h3>
        <p className="text-slate-300 mb-2">Get detailed information about a specific recording.</p>

        <h3 className="text-xl font-semibold text-slate-200 mt-6 mb-3">GET /api/elders</h3>
        <p className="text-slate-300 mb-2">List all elders in the archive.</p>

        <h3 className="text-xl font-semibold text-slate-200 mt-6 mb-3">GET /api/traditions</h3>
        <p className="text-slate-300 mb-2">List all traditions represented in the archive.</p>

        <h2 className="text-2xl font-semibold text-amber-400 mt-8 mb-4">Rate Limits</h2>
        <p className="text-slate-300 mb-4">API requests are limited to 100 requests per hour per API key.</p>
      </div>
    </div>
  )
}
