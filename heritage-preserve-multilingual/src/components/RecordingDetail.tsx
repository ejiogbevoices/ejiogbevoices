import React, { useState } from 'react';
import { Recording } from '../data/mockData';
import { AudioPlayer } from './AudioPlayer';
import { TranscriptView } from './TranscriptView';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface RecordingDetailProps {
  recording: Recording;
  onBack: () => void;
}

const mockSegments = [
  { id: '1', start_ms: 0, end_ms: 15000, text: 'Ìbà se Olódùmarè, Ìbà se Ọ̀rúnmìlà...', translation: 'Homage to the Almighty, homage to Orunmila...' },
  { id: '2', start_ms: 15000, end_ms: 32000, text: 'Ejiogbe ni baba odu mẹ́rìndínlógún...', translation: 'Ejiogbe is the father of the sixteen principal Odu...' },
  { id: '3', start_ms: 32000, end_ms: 48000, text: 'Ó ní àse láti dá ohun gbogbo...', translation: 'It has the power to create all things...' }
];

export const RecordingDetail: React.FC<RecordingDetailProps> = ({ recording, onBack }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [showClipBuilder, setShowClipBuilder] = useState(false);

  return (
    <div className="max-w-6xl mx-auto">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-6">
        ← Back to Recordings
      </Button>

      <div className="bg-indigo-950/30 border border-silver/10 rounded-xl p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={recording.elder.photo}
            alt={recording.elder.name}
            className="w-48 h-48 rounded-xl object-cover"
          />
          <div className="flex-1">
            <h1 className="text-4xl font-serif font-bold text-white mb-4">{recording.title}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="gold">{recording.language}</Badge>
              <Badge variant="cerulean">{recording.lineage}</Badge>
              <Badge variant={recording.consent_status === 'public' ? 'success' : 'warning'}>
                {recording.consent_status}
              </Badge>
            </div>
            <p className="text-lg text-silver mb-2">Elder: {recording.elder.name}</p>
            <p className="text-silver/70">{recording.elder.village} • {recording.elder.lineage}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <AudioPlayer
          title={recording.title}
          duration_ms={recording.duration_ms}
          onSeek={setCurrentTime}
        />
      </div>

      <div className="mb-8">
        <TranscriptView
          segments={mockSegments}
          currentTime={currentTime}
          onSeek={setCurrentTime}
        />
      </div>

      <div className="flex gap-4">
        <Button variant="primary" onClick={() => setShowClipBuilder(!showClipBuilder)}>
          Create Clip
        </Button>
        <Button variant="ghost">Add to Playlist</Button>
        <Button variant="ghost">Share</Button>
      </div>
    </div>
  );
};
