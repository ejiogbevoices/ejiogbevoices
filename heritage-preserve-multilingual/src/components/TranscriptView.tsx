import React, { useState } from 'react';
import { Button } from './ui/Button';

interface TranscriptSegment {
  id: string;
  start_ms: number;
  end_ms: number;
  text: string;
  translation?: string;
}

interface TranscriptViewProps {
  segments: TranscriptSegment[];
  currentTime: number;
  onSeek: (time_ms: number) => void;
}

export const TranscriptView: React.FC<TranscriptViewProps> = ({ 
  segments, 
  currentTime, 
  onSeek 
}) => {
  const [showTranslation, setShowTranslation] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-indigo-950/30 border border-silver/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-serif text-white">Transcript</h3>
        <div className="flex gap-2">
          <Button
            variant={showTranslation ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => setShowTranslation(!showTranslation)}
          >
            Translation
          </Button>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-3 py-1.5 bg-indigo-950/50 border border-silver/20 rounded-lg text-white text-sm"
          >
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="pt">Portuguese</option>
          </select>
        </div>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {segments.map((segment) => {
          const isActive = currentTime >= segment.start_ms && currentTime < segment.end_ms;
          
          return (
            <div
              key={segment.id}
              onClick={() => onSeek(segment.start_ms)}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                isActive 
                  ? 'bg-cerulean/20 border-l-4 border-cerulean' 
                  : 'bg-indigo-950/30 hover:bg-indigo-950/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-xs text-gold font-mono">
                  {formatTime(segment.start_ms)}
                </span>
                <div className="flex-1">
                  <p className="text-white leading-relaxed">{segment.text}</p>
                  {showTranslation && segment.translation && (
                    <p className="text-silver/70 mt-2 italic">{segment.translation}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
