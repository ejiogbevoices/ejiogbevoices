"use client"

import Link from "next/link"
import { useState } from "react"
import Image from "next/image"
import type { User } from "@supabase/supabase-js"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

interface MainNavClientProps {
  user: User | null
}

export function MainNavClient({ user }: MainNavClientProps) {
  const [open, setOpen] = useState(false)

  const navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/recordings", label: "Recordings" },
    { href: "/collections", label: "Collections" },
    { href: "/categories", label: "Categories" },
    { href: "/transcription", label: "Transcription" },
    { href: "/translations", label: "Translations" },
    { href: "/elders", label: "Elders" },
    { href: "/playlists", label: "Playlists" },
    { href: "/admin", label: "Admin" },
  ]

  const userLinks = user
    ? [
        { href: "/account", label: "Account" },
        { href: "/upload", label: "Upload Recording", primary: true },
        { href: "/api/auth/signout", label: "Sign Out" },
      ]
    : [
        { href: "/login", label: "Sign In" },
        { href: "/signup", label: "Sign Up" },
      ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-700/50 bg-[#0D1117]/95 backdrop-blur-lg">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/icon.png"
            alt="Ejiogbe Voices"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="font-serif text-lg text-amber-400 font-bold">Ejiogbe Voices</span>
        </Link>

        <div className="ml-auto">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-300 hover:text-white hover:bg-slate-800/50"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px] bg-slate-900 border-slate-700">
              <nav className="flex flex-col gap-6 mt-8">
                <div className="space-y-1">
                  <h3 className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Navigation
                  </h3>
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-md transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className="border-t border-slate-700 pt-4 space-y-1">
                  <h3 className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {user ? "Account" : "Get Started"}
                  </h3>
                  {userLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={
                        link.primary
                          ? "block mx-3 px-4 py-2.5 text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-md text-center transition-colors"
                          : "block px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-md transition-colors"
                      }
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
