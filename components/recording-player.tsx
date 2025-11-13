"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Languages, Scissors } from "lucide-react"
import Link from "next/link"

interface TranscriptSegment {
  id: string
  segment_index: number
  start_ms: number
  end_ms: number
  text: string
  language_code: string
  qc_status: string
}

interface RecordingPlayerProps {
  recording: any
  segments: TranscriptSegment[]
}

export function RecordingPlayer({ recording, segments }: RecordingPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [])

  const togglePlay = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const skip = (seconds: number) => {
    if (!audioRef.current) return
    audioRef.current.currentTime += seconds
  }

  const seekTo = (timeMs: number) => {
    if (!audioRef.current) return
    const timeInSeconds = timeMs / 1000
    audioRef.current.currentTime = timeInSeconds
    setCurrentTime(timeInSeconds)
  }

  const handleSeek = (value: number[]) => {
    if (!audioRef.current) return
    const timeInSeconds = value[0]
    audioRef.current.currentTime = timeInSeconds
    setCurrentTime(timeInSeconds)
  }

  const handleVolumeChange = (value: number[]) => {
    if (!audioRef.current) return
    const newVolume = value[0]
    audioRef.current.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    if (!audioRef.current) return
    if (isMuted) {
      audioRef.current.volume = volume || 0.5
      setIsMuted(false)
    } else {
      audioRef.current.volume = 0
      setIsMuted(true)
    }
  }

  const formatTime = (time: number) => {
    if (!isFinite(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const currentTimeMs = currentTime * 1000
  const currentSegment = segments.find(
    (seg) => currentTimeMs >= seg.start_ms && currentTimeMs < seg.end_ms
  )

  return (
    <div className="h-full flex flex-col">
      <audio ref={audioRef} src={recording.storage_url} />

      {/* Title */}
      <div className="px-4 py-6">
        <h2 className="text-2xl font-bold text-white mb-2">{recording.title}</h2>
        {recording.elders && (
          <p className="text-slate-400">{recording.elders.name}</p>
        )}
      </div>

      {/* Scrollable Transcript */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {segments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No transcript available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {segments.map((segment) => {
              const isActive = currentSegment?.id === segment.id
              
              return (
                <p
                  key={segment.id}
                  onClick={() => seekTo(segment.start_ms)}
                  className={`text-base leading-relaxed cursor-pointer transition-colors ${
                    isActive ? "text-white" : "text-slate-400"
                  }`}
                >
                  {segment.text}
                </p>
              )
            })}
          </div>
        )}
      </div>

      {/* Bottom Action Buttons */}
      <div className="sticky bottom-0 bg-[#0D1117] border-t border-slate-800 p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button
            variant="outline"
            className="h-14 bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
          >
            <Languages className="w-5 h-5 mr-2" />
            Language
          </Button>
          <Link href={`/clips/create?recording_id=${recording.id}`}>
            <Button
              variant="outline"
              className="w-full h-14 bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
            >
              <Scissors className="w-5 h-5 mr-2" />
              Clip
            </Button>
          </Link>
        </div>

        {/* Mini Player Controls */}
        <div className="space-y-3">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => skip(-10)}
                className="text-slate-400 hover:text-white"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                onClick={togglePlay}
                className="bg-amber-500 hover:bg-amber-600 text-slate-900"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => skip(10)}
                className="text-slate-400 hover:text-white"
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
              <Button size="icon" variant="ghost" onClick={toggleMute} className="text-slate-400">
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
