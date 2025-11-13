"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, PlusSquare, ListMusic, User } from "lucide-react"

export function MobileNav() {
  const pathname = usePathname()

  const links = [
    {
      href: "/",
      label: "Home",
      icon: Home,
    },
    {
      href: "/search",
      label: "Search",
      icon: Search,
    },
    {
      href: "/upload",
      label: "Upload",
      icon: PlusSquare,
    },
    {
      href: "/playlists",
      label: "Playlists",
      icon: ListMusic,
    },
    {
      href: "/account",
      label: "Account",
      icon: User,
    },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur border-t border-slate-800">
      <div className="flex justify-around items-center h-20">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors ${
              pathname === href ? "text-cyan-400" : "text-slate-400 hover:text-slate-300"
            }`}
          >
            <Icon className="w-6 h-6" strokeWidth={pathname === href ? 2.5 : 2} />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
