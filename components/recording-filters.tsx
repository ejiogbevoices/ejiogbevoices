"use client"

import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface RecordingFiltersProps {
  languages: Array<{ code: string; name: string }>
  traditions: Array<{ id: string; name: string }>
  categories: Array<{ id: string; name: string }>
  currentFilters: {
    query: string
    language: string
    tradition: string
    category: string
  }
}

export function RecordingFilters({ languages, traditions, categories, currentFilters }: RecordingFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get("query") as string
    const params = new URLSearchParams(searchParams.toString())

    if (query) {
      params.set("q", query)
    } else {
      params.delete("q")
    }

    router.push(`/search?${params.toString()}`)
  }

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value && value !== "all") {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/search?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/search")
  }

  const hasActiveFilters =
    currentFilters.query || currentFilters.language || currentFilters.tradition || currentFilters.category

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            name="query"
            placeholder="Search recordings..."
            defaultValue={currentFilters.query}
            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400"
          />
        </div>
        <Button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white">
          Search
        </Button>
      </form>

      <div className="flex flex-wrap gap-4">
        <Select
          value={currentFilters.language || "all"}
          onValueChange={(value) => handleFilterChange("language", value)}
        >
          <SelectTrigger className="w-[200px] bg-slate-800/50 border-slate-700 text-white">
            <SelectValue placeholder="All Languages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={currentFilters.tradition || "all"}
          onValueChange={(value) => handleFilterChange("tradition", value)}
        >
          <SelectTrigger className="w-[200px] bg-slate-800/50 border-slate-700 text-white">
            <SelectValue placeholder="All Traditions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Traditions</SelectItem>
            {traditions.map((tradition) => (
              <SelectItem key={tradition.id} value={tradition.id}>
                {tradition.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={currentFilters.category || "all"}
          onValueChange={(value) => handleFilterChange("category", value)}
        >
          <SelectTrigger className="w-[200px] bg-slate-800/50 border-slate-700 text-white">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            onClick={clearFilters}
            className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
          >
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  )
}
