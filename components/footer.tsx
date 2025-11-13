import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div>
            <h3 className="font-serif text-lg font-semibold text-amber-400 mb-4">Ejiogbe Voices</h3>
            <p className="text-sm text-slate-400">Preserving indigenous knowledge through audio archives.</p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-300 mb-4">Browse</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-slate-400 hover:text-amber-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/recordings" className="text-slate-400 hover:text-amber-400">
                  Recordings
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-slate-400 hover:text-amber-400">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-slate-400 hover:text-amber-400">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/elders" className="text-slate-400 hover:text-amber-400">
                  Elders
                </Link>
              </li>
              <li>
                <Link href="/traditions" className="text-slate-400 hover:text-amber-400">
                  Traditions
                </Link>
              </li>
              <li>
                <Link href="/playlists" className="text-slate-400 hover:text-amber-400">
                  Playlists
                </Link>
              </li>
              <li>
                <Link href="/playlists/create" className="text-slate-400 hover:text-amber-400">
                  Create Playlist
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-slate-400 hover:text-amber-400">
                  Search
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-300 mb-4">Content</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/transcription" className="text-slate-400 hover:text-amber-400">
                  Transcriptions
                </Link>
              </li>
              <li>
                <Link href="/translations" className="text-slate-400 hover:text-amber-400">
                  Translations
                </Link>
              </li>
              <li>
                <Link href="/clips/create" className="text-slate-400 hover:text-amber-400">
                  Create Clip
                </Link>
              </li>
              <li>
                <Link href="/upload" className="text-slate-400 hover:text-amber-400">
                  Upload
                </Link>
              </li>
              <li>
                <Link href="/upload/consent" className="text-slate-400 hover:text-amber-400">
                  Consent Documents
                </Link>
              </li>
              <li>
                <Link href="/upload/restrictions" className="text-slate-400 hover:text-amber-400">
                  Restrictions
                </Link>
              </li>
              <li>
                <Link href="/dubs" className="text-slate-400 hover:text-amber-400">
                  Synthetic Dubs
                </Link>
              </li>
              <li>
                <Link href="/glossary" className="text-slate-400 hover:text-amber-400">
                  Glossary
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-300 mb-4">Admin & Tools</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/admin" className="text-slate-400 hover:text-amber-400">
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/review-tasks" className="text-slate-400 hover:text-amber-400">
                  Admin Review Tasks
                </Link>
              </li>
              <li>
                <Link href="/admin/org-management" className="text-slate-400 hover:text-amber-400">
                  Admin Org Management
                </Link>
              </li>
              <li>
                <Link href="/admin/analytics" className="text-slate-400 hover:text-amber-400">
                  Admin Analytics
                </Link>
              </li>
              <li>
                <Link href="/admin/system-events" className="text-slate-400 hover:text-amber-400">
                  System Events
                </Link>
              </li>
              <li>
                <Link href="/inbox" className="text-slate-400 hover:text-amber-400">
                  Review Tasks Inbox
                </Link>
              </li>
              <li>
                <Link href="/organization" className="text-slate-400 hover:text-amber-400">
                  Organization
                </Link>
              </li>
              <li>
                <Link href="/analytics" className="text-slate-400 hover:text-amber-400">
                  Analytics
                </Link>
              </li>
              <li>
                <Link href="/activity-log" className="text-slate-400 hover:text-amber-400">
                  Activity Log
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-slate-400 hover:text-amber-400">
                  Account Settings
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="text-slate-400 hover:text-amber-400">
                  API Documentation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-300 mb-4">About & Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-slate-400 hover:text-amber-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/ethics" className="text-slate-400 hover:text-amber-400">
                  Ethics & Consent
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-amber-400">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-amber-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-slate-400 hover:text-amber-400">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-slate-400 hover:text-amber-400">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-slate-400 hover:text-amber-400">
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} Ejiogbe Voices. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
