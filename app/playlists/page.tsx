"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PlaylistsPage() {
  const [visibility, setVisibility] = useState("all")
  const [createdBy, setCreatedBy] = useState("all")
  const [search, setSearch] = useState("")

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="bg-slate-800/50 border-b border-slate-700 px-6 py-4">
        <div className="flex gap-3">
          <Link href="/playlists/create">
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium">Create New Playlist</Button>
          </Link>
          <Link href="/recordings">
            <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-700 bg-transparent">
              Create Clip
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="bg-slate-800/30 border border-slate-700 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">Filter Playlists</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-2">Visibility</label>
              <Select value={visibility} onValueChange={setVisibility}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
                  <SelectValue placeholder="All Visibility Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Visibility Levels</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">Created By</label>
              <Select value={createdBy} onValueChange={setCreatedBy}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-slate-200">
                  <SelectValue placeholder="All Creators" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Creators</SelectItem>
                  <SelectItem value="me">Me</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-2">Search</label>
              <Input
                type="text"
                placeholder="Search by title or description"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-slate-700 border-slate-600 text-slate-200 placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        <h3 className="text-2xl font-serif font-semibold text-slate-100 mb-6">Your Collections</h3>

        {/* Playlists will be displayed here */}
        <div className="text-slate-400 text-center py-12">
          No playlists found. Create your first playlist to get started.
        </div>
      </div>
    </div>
  )
}
