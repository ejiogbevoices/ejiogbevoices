"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getBrowserClient } from "@/lib/supabase/browserClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Star } from "lucide-react"

export function SignInForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const supabase = getBrowserClient()
    if (!supabase) return

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    router.push("/")
    router.refresh()
  }

  return (
    <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 rounded-lg p-8">
      <h2 className="text-2xl font-serif font-bold text-amber-400 mb-2">Welcome Back</h2>
      <p className="text-sm text-slate-400 mb-6">Enter your credentials to access the archive</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm text-slate-200">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-600"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm text-slate-200">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-slate-950 border-slate-800 text-slate-200 placeholder:text-slate-600"
            required
          />
        </div>
        <Button
          type="submit"
          className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-medium"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Log In"}
        </Button>
      </form>

      <p className="text-center text-sm text-slate-400 mt-6">
        Don't have an account?{" "}
        <Link href="/signup" className="text-slate-200 hover:text-amber-400">
          Sign up
        </Link>
      </p>

      <div className="flex justify-center mt-6">
        <Star className="w-5 h-5 text-slate-700" />
      </div>
    </div>
  )
}
