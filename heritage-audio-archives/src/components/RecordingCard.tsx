import React from 'react';
import { Recording, Elder } from '../types';
import { formatDuration } from '../utils/formatters';

interface RecordingCardProps {
  recording: Recording;
  elder?: Elder;
  onClick: () => void;
}

export const RecordingCard: React.FC<RecordingCardProps> = ({ recording, elder, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={recording.thumbnail}
          alt={recording.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-amber-500 text-white px-2 py-1 rounded text-sm font-medium">
          {formatDuration(recording.duration_ms)}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2">
          {recording.title}
        </h3>
        {elder && (
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            {elder.name} • {recording.lineage}
          </p>
        )}
        <div className="flex flex-wrap gap-2 mt-3">
          {recording.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
