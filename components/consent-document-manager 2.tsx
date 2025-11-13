"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileText, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ConsentDocumentManager() {
  const [consentFile, setConsentFile] = useState<File | null>(null)
  const [consentType, setConsentType] = useState("")
  const [consentDate, setConsentDate] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setConsentFile(file)
    }
  }

  const removeFile = () => {
    setConsentFile(null)
  }

  return (
    <div className="space-y-6">
      {/* Consent Type */}
      <div>
        <Label htmlFor="consentType" className="text-white text-base mb-3 block">
          Consent Type
        </Label>
        <Select value={consentType} onValueChange={setConsentType}>
          <SelectTrigger className="h-14 bg-slate-800/30 border-slate-700 text-white rounded-xl">
            <SelectValue placeholder="Select consent type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="full">Full Consent - Public use allowed</SelectItem>
            <SelectItem value="restricted">Restricted - Community only</SelectItem>
            <SelectItem value="private">Private - No public distribution</SelectItem>
            <SelectItem value="sacred">Sacred - Requires elder approval</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Consent Date */}
      <div>
        <Label htmlFor="consentDate" className="text-white text-base mb-3 block">
          Consent Date
        </Label>
        <Input
          id="consentDate"
          type="date"
          value={consentDate}
          onChange={(e) => setConsentDate(e.target.value)}
          className="h-14 bg-slate-800/30 border-slate-700 text-white rounded-xl"
        />
      </div>

      {/* File Upload */}
      <div>
        <Label className="text-white text-base mb-3 block">Upload Consent Document</Label>

        {!consentFile ? (
          <div className="relative">
            <Input
              id="consent-file"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="consent-file"
              className="flex flex-col items-center justify-center w-full px-6 py-12 bg-slate-800/30 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800/50 hover:border-cyan-500/50 transition-all"
            >
              <Upload className="w-12 h-12 text-slate-400 mb-4" />
              <p className="text-slate-300 font-medium mb-1">Click to upload consent document</p>
              <p className="text-xs text-slate-500">PDF, DOC, DOCX, JPG, PNG up to 10MB</p>
            </label>
          </div>
        ) : (
          <div className="flex items-center gap-4 p-5 bg-slate-800/30 border border-slate-700/50 rounded-xl">
            <div className="flex-shrink-0 w-14 h-14 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <FileText className="w-7 h-7 text-cyan-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white truncate">{consentFile.name}</h3>
              <p className="text-sm text-slate-400">{(consentFile.size / 1024).toFixed(2)} KB</p>
            </div>
            <button
              onClick={removeFile}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-red-400" />
            </button>
          </div>
        )}
      </div>

      {/* Information */}
      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-5">
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center mt-0.5">
            <Check className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-2">Why is consent important?</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Consent documents protect both the elder and the community. They ensure that the knowledge shared is used
              respectfully and according to the elder's wishes. This helps preserve cultural integrity and respects
              sacred protocols.
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <Button className="w-full h-14 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white text-lg font-semibold rounded-xl shadow-lg shadow-cyan-500/20">
        Save Consent Document
      </Button>
    </div>
  )
}
