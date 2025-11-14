import React from 'react';
import { Badge } from './ui/Badge';
import { Recording } from '../data/mockData';

interface RecordingCardProps {
  recording: Recording;
  onClick: () => void;
}

export const RecordingCard: React.FC<RecordingCardProps> = ({ recording, onClick }) => {
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      onClick={onClick}
      className="group bg-indigo-950/30 border border-silver/10 rounded-xl overflow-hidden hover:border-cerulean/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-cerulean/10 hover:-translate-y-1"
    >
      <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-indigo-900 to-indigo-950">
        <img
          src={recording.elder.photo}
          alt={recording.elder.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <Badge variant={recording.consent_status === 'public' ? 'success' : 'warning'}>
            {recording.consent_status}
          </Badge>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-serif font-semibold text-white mb-2 group-hover:text-cerulean transition-colors">
          {recording.title}
        </h3>
        <p className="text-sm text-silver mb-3">{recording.elder.name}</p>
        <div className="flex items-center justify-between text-xs text-silver/70">
          <span>{recording.language}</span>
          <span>{formatDuration(recording.duration_ms)}</span>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {recording.tags.slice(0, 3).map((tag, i) => (
            <Badge key={i} variant="default">{tag}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
