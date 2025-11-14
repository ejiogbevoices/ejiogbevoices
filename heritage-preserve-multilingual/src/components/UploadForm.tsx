import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface UploadFormProps {
  onBack: () => void;
}

export const UploadForm: React.FC<UploadFormProps> = ({ onBack }) => {
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'transcribing' | 'complete'>('idle');
  const [progress, setProgress] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadState('uploading');
    
    // Simulate upload progress
    let prog = 0;
    const interval = setInterval(() => {
      prog += 10;
      setProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setUploadState('transcribing');
        setTimeout(() => setUploadState('complete'), 2000);
      }
    }, 300);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-6">
        ← Back
      </Button>

      <div className="bg-indigo-950/30 border border-silver/10 rounded-xl p-8">
        <h2 className="text-3xl font-serif font-bold text-white mb-6">Upload Recording</h2>

        {uploadState === 'idle' && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-2 border-dashed border-silver/20 rounded-xl p-12 text-center hover:border-cerulean/50 transition-colors cursor-pointer">
              <input type="file" accept="audio/*" className="hidden" id="audio-upload" />
              <label htmlFor="audio-upload" className="cursor-pointer">
                <div className="text-6xl mb-4">🎵</div>
                <p className="text-white mb-2">Drop audio file here or click to browse</p>
                <p className="text-sm text-silver/70">Supports MP3, WAV, M4A (max 500MB)</p>
              </label>
            </div>

            <Input label="Recording Title" placeholder="Enter title..." required />
            
            <div className="grid grid-cols-2 gap-4">
              <Input label="Language" placeholder="e.g., Yoruba" required />
              <Input label="Lineage" placeholder="e.g., Ejiogbe" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-silver mb-2">Select Elder</label>
              <select className="w-full px-4 py-2.5 bg-indigo-950/50 border border-silver/20 rounded-lg text-white">
                <option>Baba Ifayemi Ogunlade</option>
                <option>Elder 2</option>
              </select>
            </div>

            <Input label="Tags (comma-separated)" placeholder="wisdom, ritual, healing" />

            <Button type="submit" variant="gold" size="lg" className="w-full">
              Upload & Transcribe
            </Button>
          </form>
        )}

        {uploadState === 'uploading' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⏫</div>
            <h3 className="text-xl text-white mb-4">Uploading...</h3>
            <div className="w-full bg-indigo-900 rounded-full h-3 mb-2">
              <div className="bg-cerulean h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-silver">{progress}%</p>
          </div>
        )}

        {uploadState === 'transcribing' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4 animate-pulse">📝</div>
            <h3 className="text-xl text-white mb-2">Transcribing...</h3>
            <p className="text-silver">Generating time-aligned transcript segments</p>
          </div>
        )}

        {uploadState === 'complete' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl text-white mb-4">Upload Complete!</h3>
            <Button variant="primary" onClick={onBack}>View Recording</Button>
          </div>
        )}
      </div>
    </div>
  );
};
