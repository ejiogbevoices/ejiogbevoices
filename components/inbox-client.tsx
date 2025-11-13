"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ReviewTask = {
  id: string
  task_type: string
  status: string
  created_at: string
  recordings?: {
    id: string
    title: string
    created_at: string
  }
}

export function InboxClient({ tasks }: { tasks: ReviewTask[] }) {
  const [activeTab, setActiveTab] = useState("transcription")

  const transcriptionTasks = tasks.filter((t) => t.task_type === "transcription_qc")
  const translationTasks = tasks.filter((t) => t.task_type === "translation_qc")
  const signoffTasks = tasks.filter((t) => t.task_type === "signoff")

  const renderTaskList = (taskList: ReviewTask[]) => {
    if (taskList.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-slate-400">No tasks to review</p>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {taskList.map((task, index) => (
          <Link
            key={task.id}
            href={`/inbox/${task.id}`}
            className="flex items-center gap-4 p-4 bg-slate-800/30 hover:bg-slate-800/50 rounded-lg border border-slate-700/50 transition-colors"
          >
            {/* Document Icon */}
            <div className="flex-shrink-0 w-16 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-md flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>

            {/* Task Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white truncate">
                {task.recordings?.title || `Document ${index + 1}`}
              </h3>
              <p className="text-sm text-slate-400">
                {new Date(task.created_at).toLocaleDateString("en-US", {
                  month: "2-digit",
                  day: "2-digit",
                  year: "numeric",
                })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D1117] pb-20 md:pb-0">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-slate-400 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-serif font-bold text-white">Inbox</h1>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-transparent border-b border-slate-800 rounded-none h-auto p-0">
            <TabsTrigger
              value="transcription"
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-400 data-[state=active]:bg-transparent data-[state=active]:text-cyan-400 text-slate-400 py-4 px-6"
            >
              <span className="text-base font-medium">Transcription QC</span>
            </TabsTrigger>
            <TabsTrigger
              value="translation"
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-400 data-[state=active]:bg-transparent data-[state=active]:text-cyan-400 text-slate-400 py-4 px-6"
            >
              <span className="text-base font-medium">Translation QC</span>
            </TabsTrigger>
            <TabsTrigger
              value="signoff"
              className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-cyan-400 data-[state=active]:bg-transparent data-[state=active]:text-cyan-400 text-slate-400 py-4 px-6"
            >
              <span className="text-base font-medium">Sign-off</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="transcription" className="mt-0">
              {renderTaskList(transcriptionTasks)}
            </TabsContent>

            <TabsContent value="translation" className="mt-0">
              {renderTaskList(translationTasks)}
            </TabsContent>

            <TabsContent value="signoff" className="mt-0">
              {renderTaskList(signoffTasks)}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
