import React, { useState } from 'react';
import { Recording, Elder, Language } from '../types';
import { AudioPlayer } from './AudioPlayer';
import { TranscriptViewer } from './TranscriptViewer';
import { transcripts } from '../data/transcripts';
import { formatDate } from '../utils/formatters';

interface RecordingDetailProps {
  recording: Recording;
  elder: Elder;
  onClose: () => void;
}

export const RecordingDetail: React.FC<RecordingDetailProps> = ({ recording, elder, onClose }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [language, setLanguage] = useState<Language>('original');
  const [isGeneratingNarration, setIsGeneratingNarration] = useState(false);

  const segments = transcripts[recording.id] || [];

  const handleGenerateNarration = async () => {
    setIsGeneratingNarration(true);
    // Stub for ElevenLabs TTS API call
    setTimeout(() => {
      alert('Narrated overview generated! (This is a stub - integrate with ElevenLabs API)');
      setIsGeneratingNarration(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{recording.title}</h2>
            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <img src={elder.photo_url} alt={elder.name} className="w-8 h-8 rounded-full" />
                <span>{elder.name}</span>
              </div>
              <span>•</span>
              <span>{recording.lineage}</span>
              <span>•</span>
              <span>{formatDate(recording.published_at)}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <AudioPlayer
            audioUrl={recording.storage_url}
            onTimeUpdate={setCurrentTime}
            duration={recording.duration_ms}
          />

          <div className="flex gap-3">
            <button
              onClick={handleGenerateNarration}
              disabled={isGeneratingNarration}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white rounded-lg transition-colors"
            >
              {isGeneratingNarration ? 'Generating...' : '🎙️ Generate Narrated Overview'}
            </button>
            <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors">
              ❤️ Add to Playlist
            </button>
          </div>

          {segments.length > 0 && (
            <TranscriptViewer
              segments={segments}
              currentTime={currentTime}
              language={language}
              onLanguageChange={setLanguage}
            />
          )}

          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Topics</h4>
            <div className="flex flex-wrap gap-2">
              {recording.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
