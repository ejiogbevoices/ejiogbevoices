import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  onTimeUpdate: (currentTime: number) => void;
  onDurationChange: (duration: number) => void;
}

export function AudioPlayer({
  audioUrl,
  title,
  onTimeUpdate,
  onDurationChange,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Handle play/pause
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle time update
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const newTime = audio.currentTime * 1000; // Convert to milliseconds
      setCurrentTime(newTime);
      onTimeUpdate(newTime);
    };

    const handleDurationChange = () => {
      const newDuration = audio.duration * 1000; // Convert to milliseconds
      setDuration(newDuration);
      onDurationChange(newDuration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [onTimeUpdate, onDurationChange]);

  // Handle volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${String(secs).padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-4 p-4 bg-card border border-border rounded-lg">
      {/* Hidden audio element */}
      <audio ref={audioRef} src={audioUrl} crossOrigin="anonymous" />

      {/* Title */}
      <h3 className="font-playfair font-bold text-lg text-foreground truncate">
        {title}
      </h3>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="relative h-2 bg-muted rounded-full overflow-hidden cursor-pointer group">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={(e) => {
              const newTime = parseFloat(e.target.value);
              setCurrentTime(newTime);
              if (audioRef.current) {
                audioRef.current.currentTime = newTime / 1000;
              }
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Time display */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Play/Pause button */}
        <button
          onClick={togglePlayPause}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-current" />
          ) : (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          )}
        </button>

        {/* Volume control */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-muted-foreground" />
            ) : (
              <Volume2 className="w-5 h-5 text-muted-foreground" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              setIsMuted(false);
            }}
            className="w-20 h-1 bg-muted rounded-full appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
