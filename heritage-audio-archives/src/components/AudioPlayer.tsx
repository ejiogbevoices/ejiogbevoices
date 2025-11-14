import React, { useState, useRef, useEffect } from 'react';
import { formatDuration } from '../utils/formatters';

interface AudioPlayerProps {
  audioUrl: string;
  onTimeUpdate: (currentTime: number) => void;
  duration: number;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, onTimeUpdate, duration }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const time = audio.currentTime * 1000;
      setCurrentTime(time);
      onTimeUpdate(time);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => audio.removeEventListener('timeupdate', handleTimeUpdate);
  }, [onTimeUpdate]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime += seconds;
  };

  const handleSpeedChange = () => {
    const rates = [0.75, 1, 1.25, 1.5];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = parseFloat(e.target.value);
    audio.currentTime = time / 1000;
    setCurrentTime(time);
  };

  return (
    <div className="bg-slate-900 text-white rounded-lg p-6">
      <audio ref={audioRef} src={audioUrl} />
      
      <div className="mb-4">
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-sm text-slate-400 mt-2">
          <span>{formatDuration(currentTime)}</span>
          <span>{formatDuration(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => handleSkip(-10)}
          className="p-2 hover:bg-slate-800 rounded-full transition-colors"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8zm-1.1 11h-.85v-3.26l-1.01.31v-.69l1.77-.63h.09V16z"/>
          </svg>
        </button>
        
        <button
          onClick={togglePlay}
          className="p-4 bg-amber-500 hover:bg-amber-600 rounded-full transition-colors"
        >
          {isPlaying ? (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          )}
        </button>

        <button
          onClick={() => handleSkip(10)}
          className="p-2 hover:bg-slate-800 rounded-full transition-colors"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8zm1.1 11h-.85v-3.26l-1.01.31v-.69l1.77-.63h.09V16z"/>
          </svg>
        </button>

        <button
          onClick={handleSpeedChange}
          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-sm transition-colors"
        >
          {playbackRate}x
        </button>
      </div>
    </div>
  );
};
