import React, { useState, useRef } from 'react';
import { Button } from './ui/Button';

interface AudioPlayerProps {
  title: string;
  duration_ms: number;
  onSeek?: (time_ms: number) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ title, duration_ms, onSeek }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseInt(e.target.value);
    setCurrentTime(newTime);
    onSeek?.(newTime);
  };

  const handleSpeedChange = () => {
    const speeds = [1, 1.25, 1.5, 2];
    const currentIndex = speeds.indexOf(playbackRate);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackRate(nextSpeed);
  };

  return (
    <div className="bg-indigo-950/50 border border-silver/20 rounded-xl p-6">
      <h3 className="text-lg font-serif text-white mb-4">{title}</h3>
      
      <div className="flex items-center gap-4 mb-4">
        <Button variant="primary" size="sm" onClick={handlePlayPause}>
          {isPlaying ? '⏸' : '▶'}
        </Button>
        
        <div className="flex-1">
          <input
            type="range"
            min="0"
            max={duration_ms}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-indigo-900 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        <span className="text-sm text-silver">
          {formatTime(currentTime)} / {formatTime(duration_ms)}
        </span>
        
        <Button variant="ghost" size="sm" onClick={handleSpeedChange}>
          {playbackRate}x
        </Button>
      </div>
    </div>
  );
};
