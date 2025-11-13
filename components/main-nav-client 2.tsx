"use client"

import Link from "next/link"
import { useState } from "react"
import Image from "next/image"
import type { User } from "@supabase/supabase-js"

interface MainNavClientProps {
  user: User | null
}

export function MainNavClient({ user }: MainNavClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-700/50 bg-[#0D1117]/95 backdrop-blur-lg shadow-lg">
      <div className="container flex h-16 items-center px-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gemini_Generated_Image_5ixdcy5ixdcy5ixd-ufdRhB3L6T7Xd9ZXzSlKWDN1armz2I.png"
            alt="Logo"
            width={40}
            height={40}
            className="w-10 h-10"
          />
          <span className="font-serif text-xl text-amber-400 font-bold">Ejiogbe Voices</span>
        </Link>

        <nav className="hidden md:flex ml-8 gap-1">
          <Link
            href="/recordings"
            className="px-4 py-2 text-sm font-medium rounded-md text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 transition-colors"
          >
            Recordings
          </Link>
          <Link
            href="/collections"
            className="px-4 py-2 text-sm font-medium rounded-md text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            Collections
          </Link>
          <Link
            href="/categories"
            className="px-4 py-2 text-sm font-medium rounded-md text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            Categories
          </Link>
          <Link
            href="/transcription"
            className="px-4 py-2 text-sm font-medium rounded-md text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            Transcription
          </Link>
          <Link
            href="/translations"
            className="px-4 py-2 text-sm font-medium rounded-md text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            Translations
          </Link>
          <Link
            href="/elders"
            className="px-4 py-2 text-sm font-medium rounded-md text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            Elders
          </Link>
          <Link
            href="/playlists"
            className="px-4 py-2 text-sm font-medium rounded-md text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            Playlists
          </Link>
          <Link
            href="/admin"
            className="px-4 py-2 text-sm font-medium rounded-md text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
          >
            Admin
          </Link>
        </nav>

        <button
          className="md:hidden ml-auto mr-3"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <div className="hidden md:flex ml-auto gap-3 items-center">
          {user && (
            <>
              <Link
                href="/account"
                className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-md transition-colors"
              >
                Account
              </Link>
              <Link
                href="/upload"
                className="px-4 py-2 text-sm bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold shadow-lg shadow-amber-500/30 rounded-md transition-colors"
              >
                Upload
              </Link>
            </>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-700 bg-slate-900">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            <Link
              href="/recordings"
              className="block px-4 py-2 text-sm text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Recordings
            </Link>
            <Link
              href="/collections"
              className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Collections
            </Link>
            <Link
              href="/categories"
              className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              href="/transcription"
              className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Transcription
            </Link>
            <Link
              href="/translations"
              className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Translations
            </Link>
            <Link
              href="/elders"
              className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Elders
            </Link>
            <Link
              href="/playlists"
              className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Playlists
            </Link>
            <Link
              href="/admin"
              className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Admin
            </Link>
            {user && (
              <>
                <Link
                  href="/account"
                  className="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Account
                </Link>
                <Link
                  href="/upload"
                  className="block px-4 py-2 text-sm bg-amber-500 text-slate-900 font-semibold rounded-md text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Upload Recording
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
