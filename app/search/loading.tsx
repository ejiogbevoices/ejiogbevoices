export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-4">
        <div className="flex items-center gap-4 max-w-7xl mx-auto">
          <div className="w-6 h-6 bg-muted animate-pulse rounded" />
          <div className="w-20 h-6 bg-muted animate-pulse rounded" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="w-full h-14 bg-muted animate-pulse rounded-xl mb-8" />

        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <div className="w-48 h-6 bg-muted animate-pulse rounded" />
              <div className="w-full h-4 bg-muted animate-pulse rounded" />
              <div className="w-full h-4 bg-muted animate-pulse rounded" />
              <div className="w-16 h-4 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
