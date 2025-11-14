import React, { useEffect, useRef } from 'react';
import { Transcript, Language } from '../types';
import { getLanguageLabel } from '../utils/formatters';

interface TranscriptViewerProps {
  segments: Transcript[];
  currentTime: number;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
  segments,
  currentTime,
  language,
  onLanguageChange
}) => {
  const activeRef = useRef<HTMLDivElement>(null);

  const getCurrentSegment = () => {
    return segments.find(
      (seg) => currentTime >= seg.start_ms && currentTime <= seg.end_ms
    );
  };

  const activeSegment = getCurrentSegment();

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeSegment?.id]);

  const getText = (segment: Transcript) => {
    switch (language) {
      case 'en':
        return segment.text_en;
      case 'pt':
        return segment.text_pt;
      case 'fr':
        return segment.text_fr;
      default:
        return segment.text_original;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Transcript</h3>
        <div className="flex gap-2">
          {(['original', 'en', 'pt', 'fr'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => onLanguageChange(lang)}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                language === lang
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {getLanguageLabel(lang)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {segments.map((segment) => {
          const isActive = activeSegment?.id === segment.id;
          return (
            <div
              key={segment.id}
              ref={isActive ? activeRef : null}
              className={`p-4 rounded transition-all ${
                isActive
                  ? 'bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500'
                  : 'bg-slate-50 dark:bg-slate-700/50'
              }`}
            >
              <p className="text-slate-900 dark:text-white leading-relaxed">
                {getText(segment)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
