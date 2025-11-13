"use client"

import { useState } from "react"
import { AlertTriangle } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export function RestrictionsManager() {
  const [restrictions, setRestrictions] = useState({
    noCommercialUse: false,
    communityOnly: false,
    noScreenshots: false,
    noDownloads: false,
    elderApprovalRequired: false,
    seasonalRestrictions: false,
    ceremonyOnly: false,
  })

  const [customRestrictions, setCustomRestrictions] = useState("")
  const [embargoDate, setEmbargoDate] = useState("")

  const toggleRestriction = (key: keyof typeof restrictions) => {
    setRestrictions((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-6">
      {/* Common Restrictions */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Common Restrictions</h2>
        <div className="space-y-3">
          <label className="flex items-start gap-3 p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-colors">
            <Checkbox
              checked={restrictions.noCommercialUse}
              onCheckedChange={() => toggleRestriction("noCommercialUse")}
              className="mt-0.5"
            />
            <div className="flex-1">
              <p className="text-white font-medium">No Commercial Use</p>
              <p className="text-sm text-slate-400 mt-1">
                This content cannot be used for profit or commercial purposes
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-colors">
            <Checkbox
              checked={restrictions.communityOnly}
              onCheckedChange={() => toggleRestriction("communityOnly")}
              className="mt-0.5"
            />
            <div className="flex-1">
              <p className="text-white font-medium">Community Members Only</p>
              <p className="text-sm text-slate-400 mt-1">Only verified community members can access this content</p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-colors">
            <Checkbox
              checked={restrictions.noScreenshots}
              onCheckedChange={() => toggleRestriction("noScreenshots")}
              className="mt-0.5"
            />
            <div className="flex-1">
              <p className="text-white font-medium">No Screenshots or Recording</p>
              <p className="text-sm text-slate-400 mt-1">
                Users should not capture, record, or screenshot this content
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-colors">
            <Checkbox
              checked={restrictions.noDownloads}
              onCheckedChange={() => toggleRestriction("noDownloads")}
              className="mt-0.5"
            />
            <div className="flex-1">
              <p className="text-white font-medium">No Downloads</p>
              <p className="text-sm text-slate-400 mt-1">Content can only be streamed, not downloaded</p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-colors">
            <Checkbox
              checked={restrictions.elderApprovalRequired}
              onCheckedChange={() => toggleRestriction("elderApprovalRequired")}
              className="mt-0.5"
            />
            <div className="flex-1">
              <p className="text-white font-medium">Elder Approval Required</p>
              <p className="text-sm text-slate-400 mt-1">Access requires approval from community elders</p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-colors">
            <Checkbox
              checked={restrictions.seasonalRestrictions}
              onCheckedChange={() => toggleRestriction("seasonalRestrictions")}
              className="mt-0.5"
            />
            <div className="flex-1">
              <p className="text-white font-medium">Seasonal Restrictions</p>
              <p className="text-sm text-slate-400 mt-1">Content can only be accessed during specific times of year</p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-colors">
            <Checkbox
              checked={restrictions.ceremonyOnly}
              onCheckedChange={() => toggleRestriction("ceremonyOnly")}
              className="mt-0.5"
            />
            <div className="flex-1">
              <p className="text-white font-medium">Ceremony Context Only</p>
              <p className="text-sm text-slate-400 mt-1">This content should only be shared in ceremonial contexts</p>
            </div>
          </label>
        </div>
      </div>

      {/* Embargo Period */}
      <div>
        <Label htmlFor="embargo" className="text-white text-base mb-3 block">
          Embargo Period (Optional)
        </Label>
        <input
          id="embargo"
          type="date"
          value={embargoDate}
          onChange={(e) => setEmbargoDate(e.target.value)}
          className="w-full h-14 px-4 bg-slate-800/30 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        />
        <p className="text-sm text-slate-400 mt-2">Content will be private until this date</p>
      </div>

      {/* Custom Restrictions */}
      <div>
        <Label htmlFor="custom" className="text-white text-base mb-3 block">
          Additional Restrictions or Notes
        </Label>
        <Textarea
          id="custom"
          value={customRestrictions}
          onChange={(e) => setCustomRestrictions(e.target.value)}
          placeholder="Enter any additional restrictions, protocols, or usage guidelines..."
          rows={5}
          className="bg-slate-800/30 border-slate-700 text-white rounded-xl"
        />
      </div>

      {/* Warning */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
        <div className="flex gap-3">
          <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-2">Important</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              These restrictions help protect sacred knowledge and cultural protocols. They are visible to all users
              before accessing the content. Please consult with community elders if you're unsure about appropriate
              restrictions.
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <Button className="w-full h-14 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white text-lg font-semibold rounded-xl shadow-lg shadow-amber-500/20">
        Save Restrictions
      </Button>
    </div>
  )
}
